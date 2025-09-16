import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { setCredentials } from "../store/authSlice";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";
import { useLoginMutation } from "@/services/authApi";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const response = await login({ username, password }).unwrap();

      dispatch(
        setCredentials({
          accessToken: response.accessToken,
          user: response.user,
        })
      );
      navigate('/');
    } catch (err) {
      console.log(err);
      setError(true);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 font-sans">
      <div className="w-full max-w-md space-y-8 p-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white">
            <span className="material-symbols-outlined text-3xl">lock</span>
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Admin Panel Login
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Welcome back! Please enter your details.
          </p>
        </div>

        {/* Form */}
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Label htmlFor="email">Username or Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter Email"
                autoComplete="email"
                className="mt-1 h-12"
                name="username"
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                required
              />
              {error && (
                <p className="text-red-500 text-xs ml-2 mt-2">
                  Invalid username
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="Enter Password"
                autoComplete="current-password"
                className="mt-1 h-12"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                required
              />
              {error && (
                <p className="text-red-500 text-xs ml-2 mt-2">
                  Invalid password
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Checkbox id="remember-me" />
                <Label htmlFor="remember-me" className="ml-2">
                  Remember me
                </Label>
              </div>
              <a
                href="#"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Forgot your password?
              </a>
            </div>

            <Button type="submit" className="w-full py-3" disabled={isLoading}>
              Log In
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
