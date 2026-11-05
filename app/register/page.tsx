"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/Header";

function validateEmail(email: string) {
  if (!email) return "Email is required";
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) return "Please enter a valid email address";
  return "";
}

function validatePassword(password: string) {
  if (!password) return "Password is required";
  if (password.length < 6) return "Password must be at least 6 characters";
  return "";
}

function validateConfirmPassword(password: string, confirm: string) {
  if (!confirm) return "Confirm password is required";
  if (confirm !== password) return "Passwords do not match";
  return "";
}

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    auth: "",
  });
  const [success, setSuccess] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setSuccess("");

    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);
    const confirmErr = validateConfirmPassword(password, confirmPassword);

    setErrors({ email: emailErr, password: passwordErr, confirmPassword: confirmErr, auth: "" });

    if (emailErr || passwordErr || confirmErr) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors((prev) => ({ ...prev, auth: data.error || "Registration failed" }));
      } else {
        setSuccess("Registration successful");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setSubmitted(false);
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
            <CardTitle className="text-2xl text-center">Create Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              data-testid="register-form"
              onSubmit={handleSubmit}
              noValidate
              className="space-y-4"
            >
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  data-testid="register-email"
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
                  data-testid="register-password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (submitted) {
                      setErrors((prev) => ({
                        ...prev,
                        password: validatePassword(e.target.value),
                        confirmPassword: validateConfirmPassword(e.target.value, confirmPassword),
                      }));
                    }
                  }}
                  placeholder="At least 6 characters"
                />
                {submitted && errors.password && (
                  <p data-testid="error-password" className="text-sm text-red-500">
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  data-testid="register-confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (submitted) {
                      setErrors((prev) => ({
                        ...prev,
                        confirmPassword: validateConfirmPassword(password, e.target.value),
                      }));
                    }
                  }}
                  placeholder="Repeat your password"
                />
                {submitted && errors.confirmPassword && (
                  <p data-testid="error-confirm-password" className="text-sm text-red-500">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {errors.auth && (
                <p data-testid="error-auth" className="text-sm text-red-500 text-center">
                  {errors.auth}
                </p>
              )}

              {success && (
                <p data-testid="form-success" className="text-sm text-green-600 text-center font-medium">
                  {success}
                </p>
              )}

              <Button
                data-testid="register-submit"
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Register"}
              </Button>

              <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-600 hover:underline">
                  Login
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

