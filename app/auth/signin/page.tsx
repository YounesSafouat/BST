"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import Image from "next/image";

export default function SignInPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Clear any URL parameters that might contain credentials
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (url.searchParams.has('email') || url.searchParams.has('password')) {
        // Remove sensitive parameters from URL
        url.searchParams.delete('email');
        url.searchParams.delete('password');
        window.history.replaceState({}, '', url.toString());
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    let email = formData.get("email") as string;
    let password = formData.get("password") as string;

    // Clear form data from memory after extraction
    formData.delete("email");
    formData.delete("password");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        // Clear sensitive data from memory
        email = "";
        password = "";
        // Use router.push instead of window.location for security
        router.push("/dashboard");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[var(--color-main)]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[var(--color-secondary)]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-32 h-32 mb-6">
            <Image
              src="https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/BST_favIcone_big-removebg-preview.png"
              alt="BlackSwan Technology Logo"
              width={300}
              height={300}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <h1 className="text-3xl font-bold text-[var(--color-secondary)] mb-2">
            Welcome Back
          </h1>
          <p className="text-slate-600">
            Sign in to access your dashboard
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6" method="post" autoComplete="off">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                {error}
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-[var(--color-secondary)]">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  type="email"
                  id="email"
                  name="email"
                  required
                  autoComplete="username"
                  placeholder="Enter your email"
                  className="pl-10 h-12 border-slate-200 focus:border-[var(--color-main)] focus:ring-[var(--color-main)]/20 rounded-xl"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-[var(--color-secondary)]">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="pl-10 pr-10 h-12 border-slate-200 focus:border-[var(--color-main)] focus:ring-[var(--color-main)]/20 rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[var(--color-main)] hover:bg-[var(--color-main)]/90 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Sign In
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
              <Image
                src="https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/BST_favIcone_big-removebg-preview.png"
                alt="BlackSwan Technology"
                width={16}
                height={16}
                className="w-4 h-4 object-contain"
              />
              <span>Secure authentication powered by NextAuth.js</span>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
}