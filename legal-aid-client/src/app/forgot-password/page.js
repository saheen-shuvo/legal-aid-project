"use client";

import { useState } from "react";
import Link from "next/link";
import { FiArrowLeft, FiMail, FiShield } from "react-icons/fi";

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <main
      className="flex min-h-screen items-center justify-center bg-cover bg-center px-4 py-12"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 58, 47, 0.78), rgba(0, 48, 40, 0.82)), url('/legal-bg.jpg')",
      }}
    >
      <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center gap-4 bg-linear-to-r from-emerald-900 to-emerald-700 px-6 py-8 text-white sm:px-10">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20">
            <FiShield size={29} aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-xl font-bold sm:text-2xl">
              পাসওয়ার্ড পুনরুদ্ধার
            </h1>
            <p className="mt-1 text-sm text-emerald-100">
              আপনার অ্যাকাউন্টের ইমেইল লিখুন
            </p>
          </div>
        </div>

        <div className="px-6 py-8 sm:px-10">
          <p className="mb-6 leading-7 text-slate-600">
            আপনার নিবন্ধিত ইমেইল ঠিকানা দিন। পাসওয়ার্ড রিসেটের ব্যবস্থা চালু হলে
            এই ঠিকানায় নির্দেশনা পাঠানো যাবে।
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block font-semibold text-slate-700"
              >
                ইমেইল ঠিকানা
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-slate-300 px-4 focus-within:border-emerald-700">
                <FiMail
                  className="shrink-0 text-slate-500"
                  aria-hidden="true"
                />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="আপনার ইমেইল লিখুন"
                  className="w-full bg-transparent py-4 outline-none"
                  onChange={() => setSubmitted(false)}
                />
              </div>
            </div>

            {submitted && (
              <p
                role="status"
                className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900"
              >
                পাসওয়ার্ড রিসেট নির্দেশাবলী আপনার ইমেইলে পাঠানো হয়েছে!
              </p>
            )}

            <button
              type="submit"
              className="btn w-full border-0 bg-emerald-800 text-white hover:bg-emerald-700"
            >
              রিসেটের অনুরোধ করুন
            </button>
          </form>

          <Link
            href="/login"
            className="mt-6 flex items-center justify-center gap-2 font-semibold text-emerald-800 hover:underline"
          >
            <FiArrowLeft aria-hidden="true" />
            লগ ইন পেজে ফিরে যান
          </Link>
        </div>
      </div>
    </main>
  );
}
