"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import bgImg from "../assets/bannerImg/banner.png";

const inputClass =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15";

export default function StaffRegistrationForm({ title }) {
  const router = useRouter();

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setMessage("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (password !== confirmPassword) {
      setError("পাসওয়ার্ড এবং নিশ্চিত করা পাসওয়ার্ড মিলছে না।");
      setIsSubmitting(false);
      return;
    }

    // Registration successful
    setMessage(
      "নিবন্ধন সফলভাবে সম্পন্ন হয়েছে। আপনাকে লগইন পেজে নিয়ে যাওয়া হচ্ছে..."
    );

    // Redirect to login page after 2 seconds
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  }

  return (
    <main
      className="relative flex min-h-screen items-center justify-center bg-cover bg-center px-4 py-12"
      style={{ backgroundImage: `url("${bgImg.src}")` }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-emerald-950/75" />

      <section className="relative z-10 w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl sm:p-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-emerald-950 sm:text-3xl">
            {title} নিবন্ধন
          </h1>

          <p className="mt-2 text-slate-600">
            নিবন্ধনের জন্য প্রয়োজনীয় তথ্য প্রদান করুন
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-5 sm:grid-cols-2">
            {/* Name */}
            <div>
              <label htmlFor="staff-name" className="mb-2 block font-semibold">
                নাম <span className="text-red-600">*</span>
              </label>

              <input
                id="staff-name"
                name="name"
                type="text"
                autoComplete="name"
                required
                placeholder="আপনার পূর্ণ নাম"
                className={inputClass}
              />
            </div>

            {/* Designation */}
            <div>
              <label
                htmlFor="designation"
                className="mb-2 block font-semibold"
              >
                পদবী <span className="text-red-600">*</span>
              </label>

              <input
                id="designation"
                name="designation"
                type="text"
                required
                placeholder="আপনার পদবী"
                className={inputClass}
              />
            </div>

            {/* Employee ID */}
            <div>
              <label
                htmlFor="employee-id"
                className="mb-2 block font-semibold"
              >
                Employee ID <span className="text-red-600">*</span>
              </label>

              <input
                id="employee-id"
                name="employeeId"
                type="text"
                required
                placeholder="আপনার Employee ID"
                className={inputClass}
              />
            </div>

            {/* Workplace */}
            <div>
              <label htmlFor="workplace" className="mb-2 block font-semibold">
                বর্তমান কর্মস্থল <span className="text-red-600">*</span>
              </label>

              <input
                id="workplace"
                name="workplace"
                type="text"
                required
                placeholder="বর্তমান কর্মস্থলের নাম"
                className={inputClass}
              />
            </div>

            {/* Official Email */}
            <div className="sm:col-span-2">
              <label
                htmlFor="staff-email"
                className="mb-2 block font-semibold"
              >
                অফিশিয়াল ই-মেইল <span className="text-red-600">*</span>
              </label>

              <input
                id="staff-email"
                name="officialEmail"
                type="email"
                autoComplete="email"
                required
                placeholder="name@example.com"
                className={inputClass}
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="staff-password"
                className="mb-2 block font-semibold"
              >
                পাসওয়ার্ড <span className="text-red-600">*</span>
              </label>

              <input
                id="staff-password"
                name="password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                placeholder="কমপক্ষে ৮ অক্ষর"
                className={inputClass}
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="staff-confirm-password"
                className="mb-2 block font-semibold"
              >
                পাসওয়ার্ড নিশ্চিত করুন{" "}
                <span className="text-red-600">*</span>
              </label>

              <input
                id="staff-confirm-password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                placeholder="পাসওয়ার্ড আবার লিখুন"
                className={inputClass}
              />
            </div>
          </div>

          {/* Required Information */}
          <p className="text-sm text-slate-600">
            <span className="text-red-600">*</span> চিহ্নিত তথ্যগুলো আবশ্যিক।
          </p>

          {/* Error Message */}
          {error && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          {/* Success Message */}
          {message && (
            <p
              role="status"
              className="rounded-lg bg-green-50 p-3 text-sm text-green-700"
            >
              {message}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn w-full border-0 bg-emerald-800 text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "নিবন্ধন হচ্ছে..." : "নিবন্ধন করুন"}
          </button>
        </form>

        {/* Login Link */}
        <p className="mt-6 text-center text-sm text-slate-600">
          ইতোমধ্যে অ্যাকাউন্ট আছে?{" "}
          <Link
            href="/login"
            className="font-semibold text-emerald-800 hover:underline"
          >
            লগ ইন করুন
          </Link>
        </p>
      </section>
    </main>
  );
}
