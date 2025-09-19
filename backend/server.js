const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const app = express();
const PORT = 5000;
const JWT_SECRET = "supersecret";
const JWT_REFRESH_SECRET = "refreshsecret";

// Dummy user database
const users = [
  {
    id: "1",
    email: "admin@example.com",
    password: "123456",
  },
];

// Setup multer for file uploads
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});
const upload = multer({ storage });

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use("/uploads", express.static(uploadDir));

// Load products from JSON
const productsFilePath = path.join(__dirname, "products.json");
let productsData = JSON.parse(fs.readFileSync(productsFilePath, "utf-8"));

// Generate tokens
const generateAccessToken = (user) =>
  jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "15m" });

const generateRefreshToken = (user) =>
  jwt.sign({ id: user.id, email: user.email }, JWT_REFRESH_SECRET, { expiresIn: "7d" });

// 🔹 LOGIN
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.email === username && u.password === password);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: false,
  });

  res.json({ accessToken, user: { id: user.id, email: user.email } });
});

// 🔹 REFRESH
app.post("/api/refresh", (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ message: "No refresh token" });

  jwt.verify(refreshToken, JWT_REFRESH_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid refresh token" });
    const accessToken = generateAccessToken(user);
    res.json({ accessToken });
  });
});

// 🔹 LOGOUT
app.post("/api/logout", (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out" });
});

// 🔹 AUTH MIDDLEWARE
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Forbidden" });
    req.user = user;
    next();
  });
};


// 🔹 PRODUCTS - GET with pagination (protected)
app.get("/api/products", authenticateToken, (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const paginatedProducts = productsData.products.slice(startIndex, endIndex);
  const totalProducts = productsData.products.length;
  const totalPages = Math.ceil(totalProducts / limit);

  res.json({
    products: paginatedProducts,
    total: totalProducts,
    totalPages,
  });
});


// 🔹 ADD PRODUCT - POST (with images)
app.post(
  "/api/products",
  authenticateToken,
  upload.array("images", 5), // max 5 images
  (req, res) => {
    const newProduct = {
      id: Date.now(),
      title: req.body.title,
      category: req.body.category,
      description: req.body.description,
      price: req.body.price,
      images: req.files.map((f) => "http://localhost:5000/uploads/" + f.filename),
    };

    // Add new product at the start
    productsData.products.unshift(newProduct);
    fs.writeFileSync(productsFilePath, JSON.stringify(productsData, null, 2));

    res.status(201).json(newProduct);
  }
);

// 🔹 DELETE PRODUCT - DELETE
app.delete("/api/products/:id", authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  const index = productsData.products.findIndex((p) => p.id === id);
  if (index === -1) return res.status(404).json({ message: "Product not found" });

  const deleted = productsData.products.splice(index, 1);
  fs.writeFileSync(productsFilePath, JSON.stringify(productsData, null, 2));
  res.json(deleted[0]);
});

// 🔹 UPDATE PRODUCT - PUT (with images)
app.put(
  "/api/products/:id",
  authenticateToken,
  upload.array("images", 5),
  (req, res) => {
    const id = parseInt(req.params.id);
    const index = productsData.products.findIndex((p) => p.id === id);

    if (index === -1) {
      return res.status(404).json({ message: "Product not found" });
    }

    const existingProduct = productsData.products[index];

    // Images that are URLs coming in request body
    let bodyImages = [];
    if (req.body.images) {
      if (Array.isArray(req.body.images)) {
        bodyImages = req.body.images.filter((img) =>
          typeof img === "string" && img.startsWith("http")
        );
      } else if (typeof req.body.images === "string") {
        bodyImages = [req.body.images];
      }
    }

    // Handle uploaded files → convert to URLs
    let uploadedImages = [];
    if (req.files && req.files.length > 0) {
      uploadedImages = req.files.map(
        (f) => `http://localhost:5000/uploads/${f.filename}`
      );
    }

    // Final list = keep body URLs + add new uploads
    const finalImages = [...bodyImages, ...uploadedImages];

    // Remove old files that are not in finalImages
    existingProduct.images.forEach((img) => {
      if (
        img.startsWith("http://localhost:5000/uploads/") &&
        !finalImages.includes(img)
      ) {
        const filePath = path.join(__dirname, "uploads", path.basename(img));
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    });

    // Update product fields
    const updatedProduct = {
      ...existingProduct,
      title: req.body.title || existingProduct.title,
      category: req.body.category || existingProduct.category,
      description: req.body.description || existingProduct.description,
      price: req.body.price || existingProduct.price,
      images: finalImages,
    };

    productsData.products[index] = updatedProduct;
    fs.writeFileSync(productsFilePath, JSON.stringify(productsData, null, 2));

    res.json(updatedProduct);
  }
);

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
