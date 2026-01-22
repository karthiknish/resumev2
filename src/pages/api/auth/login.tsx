import Head from "next/head";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Check, Circle, TriangleAlert as AlertTriangle, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import PageContainer from "@/components/PageContainer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";

import {
  FORM_ERRORS,
} from "@/lib/formErrors";

const loginSchema = z.object({
  email: z.string().email(FORM_ERRORS.INVALID_EMAIL),
  password: z.string().min(6, FORM_ERRORS.PASSWORD_TOO_SHORT),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    setError("");

    if (!values.email || !values.password) {
      setError(FORM_ERRORS.VALIDATION_REQUIRED);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // Add auth token
        document.cookie = "authToken=" + data.token + "; path=/; SameSite=Lax;";

        // Dispatch event to store token
        window.dispatchEvent(
          new CustomEvent("tokenStored", {
            detail: {
              token: data.token,
              username: values.email
            }
          })
        );
        
        toast.success("Login successful!");
        window.location.href = "/dashboard";
      } else {
        throw new Error(data.message || FORM_ERRORS.LOGIN_FAILED);
      }
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage = err instanceof Error ? err.message : FORM_ERRORS.NETWORK_ERROR;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login - Karthik Nishanth</title>
        <meta name="description" content="Login to your account" />
      </Head>
      <PageContainer>
        <div className="min-h-screen overflow-hidden flex items-center justify-center bg-slate-50">
          {/* Animated background elements */}
          <div className="absolute inset-0 -z-10">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.25),_transparent_65%)]" />
            <div className="pointer-events-none absolute inset-0 -z-0 bg-[radial-gradient(circle_at_bottom,_rgba(23,98,208,0.13),_transparent_65%)]" />
          </div>

          <Card className="w-full max-w-md mx-4 bg-white/80 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex items-center justify-center mb-8">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                      >
                        {loading ? (
                          <Loader2 className="w-12 h-12 text-slate-400 animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                        )}
                      </motion.div>
                    </div>
                  </motion.div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      {...register("password")}
                    />
                    {errors.password && (
                      <p className="text-sm text-red-500">{errors.password.message}</p>
                    )}
                  </div>

                  {error && (
                    <div className="flex items-center gap-3 p-3 text-red-700 bg-red-50 rounded-xl border border-red-100">
                      <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                      <p className="text-sm font-medium">{error}</p>
                    </div>
                  )}

                  <Button type="submit" className="w-full h-12 rounded-xl" disabled={loading}>
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    ) : (
                      <ArrowRight className="w-5 h-5 mr-2" />
                    )}
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </>
  );
}
