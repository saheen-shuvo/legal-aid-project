"use client";

import { useState } from "react";

const tabs = ["সারসংক্ষেপ", "নথি", "আইনজীবী", "মধ্যস্থতা", "রেফারেল", "অডিট"];

export default function CaseRecordDetails({ record, onBack }) {
  const [activeTab, setActiveTab] = useState("সারসংক্ষেপ");

  return (
    <section className="space-y-5 text-slate-800">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="mb-3 font-semibold text-emerald-800 hover:underline"
          >
            ← কেস তালিকায় ফিরুন
          </button>
          <h1 className="text-2xl font-bold sm:text-3xl">
            কেস রেকর্ড — {record.id}
          </h1>
          <p className="mt-1 text-slate-500">
            অনুমোদিত ব্যবহারকারীদের জন্য একটি সমন্বিত কেস রেকর্ড
          </p>
        </div>
        <span className="rounded-lg bg-emerald-100 px-4 py-2 font-semibold text-emerald-900">
          মানবিক পর্যালোচনা
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        {["আবেদন", "মানবিক পর্যালোচনা", record.status, "সেবা", "ফলো-আপ", "সমাপ্তি"].map(
          (step, index) => (
            <span key={`${step}-${index}`} className="flex items-center gap-2">
              {index > 0 && <span className="text-slate-400">→</span>}
              <span className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium">
                {step}
              </span>
            </span>
          ),
        )}
      </div>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="কেসের তথ্য">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-lg px-4 py-2 font-medium ${
              activeTab === tab
                ? "bg-emerald-900 text-white"
                : "bg-slate-100 hover:bg-slate-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "সারসংক্ষেপ" ? (
        <>
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-xl font-bold">ব্যক্তি ও প্রতিনিধিত্ব</h2>
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <dt className="font-semibold">আবেদনকারী</dt>
                <dd>{record.name}</dd>
                <dt className="font-semibold">রিপোর্ট করেছেন</dt>
                <dd>আবেদনকারী নিজে</dd>
                <dt className="font-semibold">প্রতিনিধিত্ব</dt>
                <dd>নথিভুক্ত</dd>
                <dt className="font-semibold">নিরাপদ যোগাযোগ</dt>
                <dd>ফোনে যোগাযোগ</dd>
                <dt className="font-semibold">পরিচয়</dt>
                <dd>যাচাইয়ের অপেক্ষায়</dd>
              </dl>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-xl font-bold">মানবিক তত্ত্বাবধান</h2>
              <p className="rounded-xl bg-blue-50 p-4 text-sm">
                <strong>সিস্টেমের নির্দেশনা:</strong> গুরুত্বপূর্ণ সিদ্ধান্তের আগে
                দায়িত্বপ্রাপ্ত কর্মকর্তার পর্যালোচনা প্রয়োজন।
              </p>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                প্রযুক্তি তথ্য সাজাতে সহায়তা করতে পারে। কেসের সিদ্ধান্ত নেবেন
                অনুমোদিত কর্মকর্তা।
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-bold">কেসের বর্তমান তথ্য</h2>
            <div className="grid gap-5 text-sm sm:grid-cols-2 lg:grid-cols-3">
              <p><strong>বিবরণ:</strong><br />{record.reason}</p>
              <p><strong>দায়িত্বপ্রাপ্ত:</strong><br />{record.owner}</p>
              <p><strong>কাজ:</strong><br />৭টি চলমান</p>
              <p><strong>নথি:</strong><br />৩টি পাওয়া গেছে</p>
              <p><strong>রেফারেল:</strong><br />এখনও নেই</p>
              <p><strong>আইনজীবী:</strong><br />এখনও নিয়োগ দেওয়া হয়নি</p>
            </div>
          </div>
        </>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">{activeTab}</h2>
          <p className="mt-3 text-slate-600">
            {record.id} কেসের {activeTab} সংক্রান্ত ডেমো তথ্য এখানে দেখানো হবে।
          </p>
        </div>
      )}
    </section>
  );
}