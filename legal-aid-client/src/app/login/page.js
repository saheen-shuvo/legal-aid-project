"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FiEye,
  FiEyeOff,
  FiLock,
  FiLogIn,
  FiMail,
  FiShield,
} from "react-icons/fi";
import bgImg from "../../assets/bannerImg/banner.png";

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    if (isSuccess) return;

    const formData = new FormData(event.currentTarget);
    const identifier = String(formData.get("identifier") || "")
      .trim()
      .toLowerCase();
    const password = String(formData.get("password") || "");

    if (identifier === "dlao@gmail.com" && password === "12345678") {
      setIsSuccess(true);
      setMessage("লগইন সফল হয়েছে! ড্যাশবোর্ডে নিয়ে যাওয়া হচ্ছে...");
    } else {
      setIsSuccess(false);
      setMessage("ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।");
    }
  }

  useEffect(() => {
    if (!isSuccess) return;

    const timer = setTimeout(() => {
      router.replace("/dashboard/dlao");
    }, 1000);

    return () => clearTimeout(timer);
  }, [isSuccess, router]);

  return (
    <main
      className="flex min-h-screen items-center justify-center bg-cover bg-center px-4 py-12"
      style={{
        backgroundImage: `linear-gradient(
    rgba(0, 58, 47, 0.78),
    rgba(0, 48, 40, 0.82)
  ), url("${bgImg.src}")`,
      }}
    >
      <div className="w-full max-w-xl">
        <div className="overflow-hidden rounded-3xl bg-white shadow-2xl">
          <div className="flex items-center gap-4 bg-linear-to-r from-emerald-900 to-emerald-700 px-6 py-8 text-white sm:px-10">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20">
              <FiShield size={29} aria-hidden="true" />
            </div>

            <div>
              <h1 className="text-xl font-bold sm:text-2xl">
                আপনার অ্যাকাউন্টে লগ ইন করুন
              </h1>
              <p className="mt-1 text-sm text-emerald-100">
                আইনগত সহায়তা পোর্টালে প্রবেশ করুন
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5 px-6 py-8 sm:px-10"
          >
            <div>
              <label
                htmlFor="identifier"
                className="mb-2 block font-semibold text-slate-700"
              >
                মোবাইল নম্বর বা ইমেইল
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-slate-300 px-4 focus-within:border-emerald-700">
                <FiMail
                  className="shrink-0 text-slate-500"
                  aria-hidden="true"
                />
                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  autoComplete="username"
                  required
                  placeholder="মোবাইল নম্বর বা ইমেইল টাইপ করুন"
                  className="w-full bg-transparent py-4 outline-none"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block font-semibold text-slate-700"
              >
                পাসওয়ার্ড
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-slate-300 px-4 focus-within:border-emerald-700">
                <FiLock
                  className="shrink-0 text-slate-500"
                  aria-hidden="true"
                />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="পাসওয়ার্ড লিখুন"
                  className="w-full bg-transparent py-4 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={
                    showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"
                  }
                  className="p-2 text-slate-500 hover:text-emerald-800"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
              <label className="flex cursor-pointer items-center gap-2 text-slate-600">
                <input
                  type="checkbox"
                  name="remember"
                  className="checkbox checkbox-sm checkbox-success"
                />
                মনে রাখুন
              </label>

              <Link
                href="/forgot-password"
                className="font-semibold text-emerald-800 hover:underline"
              >
                পাসওয়ার্ড ভুলে গেছেন?
              </Link>
            </div>

            {message && (
              <p
                role={isSuccess ? "status" : "alert"}
                className={`rounded-lg p-3 text-sm ${
                  isSuccess
                    ? "bg-emerald-50 text-emerald-800"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={isSuccess}
              className="btn w-full border-0 bg-emerald-800 text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              <FiLogIn aria-hidden="true" />
              {isSuccess ? "ড্যাশবোর্ডে যাচ্ছেন..." : "প্রবেশ করুন"}
            </button>
          </form>

          <div className="border-t border-slate-200 px-6 py-6 text-center text-slate-600 sm:px-10">
            নতুন ব্যবহারকারী?{" "}
            <Link
              href="/register?role=applicant"
              className="font-bold text-emerald-800 hover:underline"
            >
              রেজিস্ট্রেশন করুন
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-white/80">
          আপনার তথ্য সুরক্ষিত রাখতে পাসওয়ার্ড কারও সঙ্গে শেয়ার করবেন না।
        </p>
      </div>
    </main>
  );
}
