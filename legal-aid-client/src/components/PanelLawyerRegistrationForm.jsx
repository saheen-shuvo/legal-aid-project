"use client";

import { useState } from "react";
import Link from "next/link";
import bgImg from "../assets/bannerImg/banner.png";
import Navbar from "./shared/Navbar";
import Footer from "./shared/Footer";

const inputClass =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15";

const practiceAreas = [
  { value: "family", label: "পারিবারিক আইন" },
  { value: "criminal", label: "ফৌজদারি আইন" },
  { value: "civil", label: "দেওয়ানি আইন" },
  { value: "labour", label: "শ্রম আইন" },
  { value: "women-children", label: "নারী ও শিশু আইন" },
  { value: "other", label: "অন্যান্য" },
];

export default function PanelLawyerRegistrationForm() {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    const formData = new FormData(event.currentTarget);

    if (formData.get("password") !== formData.get("confirmPassword")) {
      setError("পাসওয়ার্ড এবং নিশ্চিত করা পাসওয়ার্ড মিলছে না।");
      return;
    }

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

        <section className="relative z-10 w-full max-w-3xl rounded-3xl bg-white p-6 shadow-2xl sm:p-10">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-emerald-950 sm:text-3xl">
              প্যানেল আইনজীবী নিবন্ধন
            </h1>
            <p className="mt-2 text-slate-600">
              নিবন্ধনের জন্য প্রয়োজনীয় তথ্য প্রদান করুন
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="lawyer-name"
                  className="mb-2 block font-semibold"
                >
                  নাম <span className="text-red-600">*</span>
                </label>
                <input
                  id="lawyer-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  placeholder="আপনার পূর্ণ নাম"
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="bar-enrollment"
                  className="mb-2 block font-semibold"
                >
                  Bar Council Enrollment Number{" "}
                  <span className="text-red-600">*</span>
                </label>
                <input
                  id="bar-enrollment"
                  name="barCouncilEnrollmentNumber"
                  type="text"
                  required
                  placeholder="এনরোলমেন্ট নম্বর"
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="lawyer-mobile"
                  className="mb-2 block font-semibold"
                >
                  মোবাইল নম্বর <span className="text-red-600">*</span>
                </label>
                <input
                  id="lawyer-mobile"
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
                <label
                  htmlFor="lawyer-email"
                  className="mb-2 block font-semibold"
                >
                  অফিশিয়াল/ব্যক্তিগত ই-মেইল{" "}
                  <span className="text-red-600">*</span>
                </label>
                <input
                  id="lawyer-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="name@example.com"
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="experience-years"
                  className="mb-2 block font-semibold"
                >
                  আইনজীবী হিসেবে অভিজ্ঞতা (বছর){" "}
                  <span className="text-red-600">*</span>
                </label>
                <input
                  id="experience-years"
                  name="experienceYears"
                  type="number"
                  min="0"
                  step="1"
                  required
                  placeholder="যেমন: ৫"
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="chamber-address"
                  className="mb-2 block font-semibold"
                >
                  বর্তমান কর্মস্থল/চেম্বারের ঠিকানা{" "}
                  <span className="text-red-600">*</span>
                </label>
                <textarea
                  id="chamber-address"
                  name="chamberAddress"
                  rows={3}
                  required
                  placeholder="সম্পূর্ণ ঠিকানা লিখুন"
                  className={inputClass}
                />
              </div>
            </div>

            <fieldset className="rounded-xl border border-slate-200 p-5">
              <legend className="px-2 font-semibold text-slate-800">
                বিশেষায়িত আইনক্ষেত্র
              </legend>
              <p className="mb-4 text-sm text-slate-600">
                প্রযোজ্য ক্ষেত্রগুলো নির্বাচন করুন
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                {practiceAreas.map((area) => (
                  <label
                    key={area.value}
                    className="flex cursor-pointer items-center gap-3"
                  >
                    <input
                      type="checkbox"
                      name="practiceAreas"
                      value={area.value}
                      className="checkbox checkbox-sm checkbox-success"
                    />
                    <span>{area.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="lawyer-password"
                  className="mb-2 block font-semibold"
                >
                  পাসওয়ার্ড <span className="text-red-600">*</span>
                </label>
                <input
                  id="lawyer-password"
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
                  htmlFor="lawyer-confirm-password"
                  className="mb-2 block font-semibold"
                >
                  পাসওয়ার্ড নিশ্চিত করুন <span className="text-red-600">*</span>
                </label>
                <input
                  id="lawyer-confirm-password"
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
