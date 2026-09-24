"use client";

import { useState } from "react";
import Link from "next/link";
import bgImg from "../assets/bannerImg/banner.png";
import Navbar from "./shared/Navbar";
import Footer from "./shared/Footer";

const inputClass =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15";

export default function UdcRegistrationForm() {
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    setMessage(
      "ফর্মের তথ্য যাচাই হয়েছে। নিবন্ধন সম্পন্ন করতে backend API সংযোগ প্রয়োজন।",
    );
  }

  return (
    <>
      <Navbar />
      <main
        className="relative flex min-h-screen items-center justify-center bg-cover bg-center px-4 py-12"
        style={{ backgroundImage: `url("${bgImg.src}")` }}
      >
        <div className="absolute inset-0 bg-emerald-950/75" />

        <section className="relative z-10 w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl sm:p-10">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-emerald-950 sm:text-3xl">
              ইউডিসি অন্ট্রোপ্রেনার নিবন্ধন
            </h1>
            <p className="mt-2 text-slate-600">
              নিবন্ধনের জন্য প্রয়োজনীয় তথ্য প্রদান করুন
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="udc-name" className="mb-2 block font-semibold">
                  নাম <span className="text-red-600">*</span>
                </label>
                <input
                  id="udc-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  placeholder="আপনার পূর্ণ নাম"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="union" className="mb-2 block font-semibold">
                  ইউনিয়ন নাম <span className="text-red-600">*</span>
                </label>
                <input
                  id="union"
                  name="union"
                  type="text"
                  required
                  placeholder="ইউনিয়নের নাম"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="location" className="mb-2 block font-semibold">
                  উপজেলা, জেলা <span className="text-red-600">*</span>
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  required
                  placeholder="উপজেলা ও জেলার নাম"
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="entrepreneur-id"
                  className="mb-2 block font-semibold"
                >
                  অন্ট্রোপ্রেনার আইডি <span className="text-red-600">*</span>
                </label>
                <input
                  id="entrepreneur-id"
                  name="entrepreneurId"
                  type="text"
                  required
                  placeholder="আপনার অন্ট্রোপ্রেনার আইডি"
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="official-email"
                  className="mb-2 block font-semibold"
                >
                  অফিশিয়াল ই-মেইল <span className="text-red-600">*</span>
                </label>
                <input
                  id="official-email"
                  name="officialEmail"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="name@example.com"
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="udc-password"
                  className="mb-2 block font-semibold"
                >
                  পাসওয়ার্ড <span className="text-red-600">*</span>
                </label>
                <input
                  id="udc-password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  placeholder="কমপক্ষে ৮ অক্ষর"
                  className={inputClass}
                />
              </div>
            </div>

            <p className="text-sm text-slate-600">
              <span className="text-red-600">*</span> চিহ্নিত তথ্যগুলো আবশ্যিক।
            </p>

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
            <Link
              href="/login"
              className="font-semibold text-emerald-800 hover:underline"
            >
              লগ ইন করুন
            </Link>
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
