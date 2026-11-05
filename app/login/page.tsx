"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { useExpenseContext } from "@/context/ExpenseContext";

function validateEmail(email: string) {
  if (!email) return "Email is required";
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) return "Please enter a valid email address";
  return "";
}

function validatePassword(password: string) {
  if (!password) return "Password is required";
  return "";
}

export default function LoginPage() {
  const { setUser, loadExpenses } = useExpenseContext();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "", auth: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);
    setErrors({ email: emailErr, password: passwordErr, auth: "" });

    if (emailErr || passwordErr) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors((prev) => ({ ...prev, auth: data.error || "Login failed" }));
      } else {
        setUser({ id: data.id, email: data.email });
        await loadExpenses();
        router.push("/expenses");
      }
    } catch {
      setErrors((prev) => ({ ...prev, auth: "Network error" }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              data-testid="login-form"
              onSubmit={handleSubmit}
              noValidate
              className="space-y-4"
            >
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  data-testid="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (submitted) {
                      setErrors((prev) => ({
                        ...prev,
                        email: validateEmail(e.target.value),
                      }));
                    }
                  }}
                  placeholder="you@example.com"
                />
                {submitted && errors.email && (
                  <p data-testid="error-email" className="text-sm text-red-500">
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  data-testid="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (submitted) {
                      setErrors((prev) => ({
                        ...prev,
                        password: validatePassword(e.target.value),
                      }));
                    }
                  }}
                  placeholder="Your password"
                />
                {submitted && errors.password && (
                  <p data-testid="error-password" className="text-sm text-red-500">
                    {errors.password}
                  </p>
                )}
              </div>

              {errors.auth && (
                <p data-testid="error-auth" className="text-sm text-red-500 text-center">
                  {errors.auth}
                </p>
              )}

              <Button
                data-testid="login-submit"
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>

              <p className="text-center text-sm text-gray-600">
                No account?{" "}
                <Link href="/register" className="text-blue-600 hover:underline">
                  Register
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

