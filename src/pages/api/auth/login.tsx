import Head from "next/head";
import { useFormik } from "react-hook-form";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Check } from "lucide-react";
import { Circle } from "lucide-react";
import { ExclamationTriangle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import PageContainer from "@/components/PageContainer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import React, { useState, useEffect } from "react";

import {
  ArrowRightIcon,
  CheckCircle2,
} from "@/components/animations/MotionComponents";
import {
  FORM_ERRORS,
  INPUT_VALIDATION_ERRORS,
} from "@/lib/formErrors";

export default function Login() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, ...register } = useFormik({
    resolver: (values) => {
      if (!values.email) {
        return {
          email: z.string().email().min(5),
        };
      }
      return {};
    },
  });
  
  const { handleSubmit } = useFormik({
    resolver: (values) => {
      if (!values.email) {
        return { email: z.string().email().min(5) };
      }
      return { password: z.string().min(6) };
    },
  });

  const onSubmit = async (
    values: { email: string; password: string }
  ) => {
    setLoading(true);
    setError("");

    if (!email || !password) {
      setError(FORM_ERRORS.VALIDATION_REQUIRED);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": "Bearer YourAuthToken",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // Store the token for future API calls
        const cookies = document.cookie.split(";").map((c) => c.trim()).filter((cookie) => cookie.startsWith("authToken="));
        
        // Remove auth cookies first
        cookies.forEach((cookie) => {
          document.cookie = document.cookie.replace(` ${cookie};`, "");
        });

        // Add auth token
        document.cookie = "authToken=" + data.token + "; path=/; SameSite=Lax;";

        // Dispatch event to store token
        window.dispatchEvent(
          new CustomEvent("tokenStored", {
            detail: {
              token: data.token,
              username: email
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
              <div className="flex items-center justify-center mb-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div className="flex flex-col items-center justify-center gap-3">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    >
                      <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                      <Loader2 className="w-10 h-10 text-slate-400 animate-spin" />
                    </motion.div>
                </div>
                {loading && <h2 className="text-2xl font-heading text-slate-900">Logging in...</h2>}
              </motion.div>

              <ExclamationTriangle className="w-12 h-12 text-slate-900" />
              <Circle className="w-12 h-12 bg-emerald-600 z-10">
                {loading && (
                  <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                )}
              </Circle>
            </div>

            <h2 className="text-3xl font-heading text-slate-900 mb-6">Welcome back</h2>

            {!loading && !error && (
              <h3 className="text-2xl font-heading text-slate-900 mb-6">
                 Log in to your account
              </h3>
            )}

            {!loading && error && (
              <div className="rounded-2xl border border-slate-200 p-4">
                 <p className="text-red-600 font-medium text-center flex items-center gap-2">
                    <ExclamationTriangle className="text-3xl text-red-600" />
                    <span className="text-red-600 font-medium">Login Failed</span>
                 </p>
                 <p className="mt-4 text-slate-600 text-sm text-center">
                    {error || FORM_ERRORS.LOGIN_FAILED}
                 </p>
              </div>
            )}
          </CardContent>
        </Card>
        </div>
      </PageContainer>
    </>
  );
}
