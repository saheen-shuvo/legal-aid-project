"use client";

import { useState } from "react";
import Link from "next/link";
import bgImg from "../assets/bannerImg/banner.png";

const inputClass =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15";

export default function CitizenRegistrationForm() {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (password !== confirmPassword) {
      setError("পাসওয়ার্ড এবং নিশ্চিত করা পাসওয়ার্ড মিলছে না।");
      return;
    }

    setMessage(
      "ফর্মের তথ্য যাচাই হয়েছে। নিবন্ধন সম্পন্ন করতে backend API সংযোগ প্রয়োজন।"
    );
  }

  return (
    <main
      className="relative flex min-h-screen items-center justify-center bg-cover bg-center px-4 py-12"
      style={{ backgroundImage: `url("${bgImg.src}")` }}
    >
      <div className="absolute inset-0 bg-emerald-950/75" />

      <section className="relative z-10 w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl sm:p-10">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-emerald-950 sm:text-3xl">
            নাগরিক নিবন্ধন
          </h1>
          <p className="mt-2 text-slate-600">
            নিবন্ধনের জন্য প্রয়োজনীয় তথ্য প্রদান করুন
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="mb-2 block font-semibold">
                নাম <span className="text-red-600">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                placeholder="আপনার পূর্ণ নাম"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="nid" className="mb-2 block font-semibold">
                NID নম্বর
              </label>
              <input
                id="nid"
                name="nid"
                type="text"
                inputMode="numeric"
                placeholder="জাতীয় পরিচয়পত্র নম্বর"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="mobile" className="mb-2 block font-semibold">
                মোবাইল নম্বর <span className="text-red-600">*</span>
              </label>
              <input
                id="mobile"
                name="mobile"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                required
                pattern="01[3-9][0-9]{8}"
                title="ইংরেজি সংখ্যায় ১১ সংখ্যার বাংলাদেশি মোবাইল নম্বর লিখুন"
                placeholder="01XXXXXXXXX"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block font-semibold">
                ই-মেইল
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="example@email.com"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block font-semibold">
                পাসওয়ার্ড <span className="text-red-600">*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                placeholder="কমপক্ষে ৮ অক্ষর"
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block font-semibold"
              >
                পাসওয়ার্ড নিশ্চিত করুন <span className="text-red-600">*</span>
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                placeholder="পাসওয়ার্ড আবার লিখুন"
                className={inputClass}
              />
            </div>
          </div>

          <p className="text-sm text-slate-600">
            <span className="text-red-600">*</span> চিহ্নিত তথ্যগুলো আবশ্যিক।
          </p>

          {error && (
            <p role="alert" className="rounded-lg bg-red-50 p-3 text-red-700">
              {error}
            </p>
          )}

          {message && (
            <p
              role="status"
              className="rounded-lg bg-amber-50 p-3 text-amber-900"
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            className="btn w-full border-0 bg-emerald-800 text-white hover:bg-emerald-700"
          >
            নিবন্ধন করুন
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          ইতোমধ্যে অ্যাকাউন্ট আছে?{" "}
          <Link href="/login" className="font-semibold text-emerald-800 hover:underline">
            লগ ইন করুন
          </Link>
        </p>
      </section>
    </main>
  );
}