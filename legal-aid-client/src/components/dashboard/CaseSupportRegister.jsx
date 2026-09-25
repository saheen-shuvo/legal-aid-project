"use client";

import { useState } from "react";
import { FiPlus, FiX } from "react-icons/fi";

const fieldClass =
  "mt-2 w-full rounded-xl border border-[#d6e0f2] bg-white px-4 py-3 outline-none focus:border-emerald-700";

export default function CaseSupportRegister({ cases, onOpen, onCreate }) {
  const [showCreate, setShowCreate] = useState(false);

  function handleCreate(event) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const nextNumber =
      Math.max(
        124,
        ...cases.map((item) => Number(item.id.split("-").at(-1)) || 0),
      ) + 1;

    const date = new Date().toLocaleDateString("bn-BD", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    onCreate({
      id: `LA-2026-${String(nextNumber).padStart(5, "0")}`,
      applicant: String(form.get("applicant")).trim(),
      type: String(form.get("type")).trim(),
      priority: String(form.get("priority")),
      status: "যাচাইয়ের অপেক্ষায়",
      source: String(form.get("source")),
      updated: date,
    });

    setShowCreate(false);
  }

  return (
    <div className="space-y-6 text-[#202b3e]">
      <div>
        <p className="text-sm font-bold text-emerald-800">
          ডিএলও / প্রশাসন ও কেস সাপোর্ট
        </p>
        <h1 className="mt-2 text-3xl font-extrabold">ডিজিটাল কেস রেজিস্টার</h1>
        <p className="mt-2 text-slate-600">
          প্রশাসনিক তত্ত্বাবধানে থাকা সব কেসের সমন্বিত তালিকা।
        </p>
      </div>

      <section className="overflow-hidden rounded-2xl border border-[#d6e0f2] bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#d6e0f2] p-5">
          <div>
            <h2 className="text-xl font-bold">কেস রেজিস্টার</h2>
            <p className="mt-1 text-sm text-slate-500">
              মোট {cases.length}টি কেস রেকর্ড
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0d392e] px-4 py-3 text-sm font-bold text-white hover:bg-[#175341]"
          >
            <FiPlus aria-hidden="true" />
            নতুন কেস তৈরি
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-5 py-3">কেস</th>
                <th className="px-4 py-3">আবেদনকারী</th>
                <th className="px-4 py-3">অগ্রাধিকার</th>
                <th className="px-4 py-3">অবস্থা</th>
                <th className="px-4 py-3">সর্বশেষ আপডেট</th>
                <th className="px-5 py-3">পদক্ষেপ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d6e0f2]">
              {cases.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <strong>{item.id}</strong>
                    <span className="mt-1 block text-xs text-slate-500">
                      {item.type}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <strong>{item.applicant}</strong>
                    <span className="mt-1 block text-xs text-slate-500">
                      {item.source}
                    </span>
                  </td>
                  <td className="px-4 py-4">{item.priority}</td>
                  <td className="px-4 py-4">{item.status}</td>
                  <td className="px-4 py-4">{item.updated}</td>
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => onOpen(item)}
                      className="font-bold text-emerald-800 hover:underline"
                    >
                      খুলুন
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {showCreate && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-slate-950/55 p-4">
          <form
            onSubmit={handleCreate}
            role="dialog"
            aria-modal="true"
            aria-labelledby="new-case-title"
            className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-emerald-800">
                  নতুন কেস রেকর্ড
                </p>
                <h2 id="new-case-title" className="mt-1 text-xl font-bold">
                  প্রশাসনিক কেস তৈরি
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  একই বিষয়ে আগে কেস থাকলে নতুন রেকর্ড তৈরির আগে সেটি অনুসন্ধান করুন।
                </p>
              </div>
              <button
                type="button"
                aria-label="বন্ধ করুন"
                onClick={() => setShowCreate(false)}
                className="rounded-lg border border-[#d6e0f2] p-2"
              >
                <FiX aria-hidden="true" />
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold">
                আবেদনকারীর নাম *
                <input required name="applicant" className={fieldClass} />
              </label>

              <label className="text-sm font-semibold">
                কেসের বিষয় *
                <input
                  required
                  name="type"
                  placeholder="যেমন: ভরণপোষণ"
                  className={fieldClass}
                />
              </label>

              <label className="text-sm font-semibold">
                অগ্রাধিকার
                <select name="priority" className={fieldClass}>
                  <option>মাঝারি</option>
                  <option>উচ্চ</option>
                  <option>জরুরি</option>
                  <option>নিম্ন</option>
                </select>
              </label>

              <label className="text-sm font-semibold">
                আবেদনের উৎস
                <select name="source" className={fieldClass}>
                  <option>প্রশাসনিক আবেদন</option>
                  <option>১৬৬৯৯ হেল্পলাইন</option>
                  <option>ইউডিসি</option>
                  <option>রেফারেল</option>
                </select>
              </label>
            </div>

            <div className="mt-7 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="rounded-xl border border-[#d6e0f2] px-5 py-3 font-semibold"
              >
                বাতিল
              </button>
              <button className="rounded-xl bg-[#0d392e] px-5 py-3 font-semibold text-white">
                কেস তৈরি করুন
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}