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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[#bce3fe] via-[#f7d5e4] to-[#fbcfe8]">
      {/* Background ambient orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-pink-300/40 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-sky-200/50 rounded-full blur-3xl pointer-events-none -z-0" />

      <Header />

      <div className="flex items-center justify-center min-h-[calc(100vh-100px)] px-4 py-12 relative z-10">
        <Card className="w-full max-w-md glass-panel rounded-3xl p-4 sm:p-6 border-white/80 shadow-2xl">
          <CardHeader className="text-center pb-3">
            <div className="w-12 h-12 rounded-2xl bg-white/70 backdrop-blur-md flex items-center justify-center text-2xl mx-auto mb-3 shadow-xs border border-white">
              ✨
            </div>
            <CardTitle className="text-2xl font-light tracking-tight text-slate-900 uppercase">
              Register
            </CardTitle>
            <p className="text-xs text-slate-600">
              Create an account to track your reading sessions
            </p>
          </CardHeader>

          <CardContent className="pt-2">
            <form
              data-testid="register-form"
              onSubmit={handleSubmit}
              noValidate
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-slate-800 text-xs font-semibold uppercase tracking-wider pl-1">
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
                  placeholder="name@domain.com"
                  className="glass-input rounded-full px-4 py-2.5 text-sm"
                />
                {submitted && errors.email ? (
                  <p data-testid="error-email" className="text-xs text-rose-500 font-medium pl-2">
                    {errors.email}
                  </p>
                ) : null}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-slate-800 text-xs font-semibold uppercase tracking-wider pl-1">
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
                  className="glass-input rounded-full px-4 py-2.5 text-sm"
                />
                {submitted && errors.password ? (
                  <p data-testid="error-password" className="text-xs text-rose-500 font-medium pl-2">
                    {errors.password}
                  </p>
                ) : null}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-slate-800 text-xs font-semibold uppercase tracking-wider pl-1">
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
                  className="glass-input rounded-full px-4 py-2.5 text-sm"
                />
                {submitted && errors.confirmPassword ? (
                  <p data-testid="error-confirm-password" className="text-xs text-rose-500 font-medium pl-2">
                    {errors.confirmPassword}
                  </p>
                ) : null}
              </div>

              {errors.auth ? (
                <div className="p-2.5 rounded-2xl bg-rose-50/80 border border-rose-200 backdrop-blur-xs">
                  <p data-testid="error-auth" className="text-xs text-rose-600 text-center font-medium">
                    {errors.auth}
                  </p>
                </div>
              ) : null}

              {success ? (
                <div className="p-2.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 backdrop-blur-xs">
                  <p data-testid="form-success" className="text-xs text-emerald-700 text-center font-semibold">
                    {success}
                  </p>
                </div>
              ) : null}

              <Button
                data-testid="register-submit"
                type="submit"
                className="pill-btn w-full rounded-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
                disabled={loading}
              >
                {loading ? "Creating..." : "Register"}
              </Button>

              <p className="text-center text-xs text-slate-600 pt-3">
                Already registered?{" "}
                <Link href="/login" className="text-pink-600 font-semibold hover:underline">
                  Sign in
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
