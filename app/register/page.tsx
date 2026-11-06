"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/Header";

function validateEmail(email: string) {
  if (!email || !email.trim()) return "Email is required";
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email.trim())) return "Please enter a valid email address";
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

    setErrors({
      email: emailErr,
      password: passwordErr,
      confirmPassword: confirmErr,
      auth: "",
    });

    if (emailErr || passwordErr || confirmErr) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password, confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors((prev) => ({
          ...prev,
          auth: data.error || "Registration failed",
        }));
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/50 via-white to-pink-50/30">
      <Header />
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-12">
        <Card className="w-full max-w-md border-indigo-100/70 bg-white/80 backdrop-blur-md shadow-lg shadow-indigo-100/40">
          <CardHeader className="text-center pb-2">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl mx-auto mb-2 border border-indigo-100">
              ✨
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900">
              Create an Account
            </CardTitle>
            <p className="text-sm text-slate-500">
              Start tracking your reading logs today
            </p>
          </CardHeader>
          <CardContent className="pt-4">
            <form
              data-testid="register-form"
              onSubmit={handleSubmit}
              noValidate
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-slate-700 font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  data-testid="register-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    const val = e.target.value;
                    setEmail(val);
                    if (submitted) {
                      setErrors((prev) => ({
                        ...prev,
                        email: validateEmail(val),
                      }));
                    }
                  }}
                  placeholder="you@example.com"
                  className="bg-white/90 border-slate-200 focus-visible:border-indigo-500"
                />
                {submitted && errors.email ? (
                  <p data-testid="error-email" className="text-xs text-rose-500 font-medium">
                    {errors.email}
                  </p>
                ) : null}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-slate-700 font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  data-testid="register-password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    const val = e.target.value;
                    setPassword(val);
                    if (submitted) {
                      setErrors((prev) => ({
                        ...prev,
                        password: validatePassword(val),
                        confirmPassword: validateConfirmPassword(val, confirmPassword),
                      }));
                    }
                  }}
                  placeholder="At least 6 characters"
                  className="bg-white/90 border-slate-200 focus-visible:border-indigo-500"
                />
                {submitted && errors.password ? (
                  <p data-testid="error-password" className="text-xs text-rose-500 font-medium">
                    {errors.password}
                  </p>
                ) : null}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-slate-700 font-medium">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  data-testid="register-confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    const val = e.target.value;
                    setConfirmPassword(val);
                    if (submitted) {
                      setErrors((prev) => ({
                        ...prev,
                        confirmPassword: validateConfirmPassword(password, val),
                      }));
                    }
                  }}
                  placeholder="Repeat your password"
                  className="bg-white/90 border-slate-200 focus-visible:border-indigo-500"
                />
                {submitted && errors.confirmPassword ? (
                  <p data-testid="error-confirm-password" className="text-xs text-rose-500 font-medium">
                    {errors.confirmPassword}
                  </p>
                ) : null}
              </div>

              {errors.auth ? (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-100">
                  <p data-testid="error-auth" className="text-xs text-rose-600 text-center font-medium">
                    {errors.auth}
                  </p>
                </div>
              ) : null}

              {success ? (
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-100">
                  <p data-testid="form-success" className="text-xs text-emerald-600 text-center font-semibold">
                    {success}
                  </p>
                </div>
              ) : null}

              <Button
                data-testid="register-submit"
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-xl shadow-xs transition-colors"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Register"}
              </Button>

              <p className="text-center text-sm text-slate-500 pt-2">
                Already have an account?{" "}
                <Link href="/login" className="text-indigo-600 font-semibold hover:underline">
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
