"use client";

import { useEffect, useRef, useState } from "react";

const tabs = [
  "সারসংক্ষেপ",
  "নথিপত্র",
  "আইনজীবী",
  "মধ্যস্থতা",
  "রেফারেল",
  "অডিট",
];

const otherTabContent = {
  আইনজীবী: {
    description: "এই কেসে আইনজীবী নিয়োগ ও যোগাযোগের তথ্য।",
    items: [
      ["নিয়োগের অবস্থা", "আইনজীবী এখনও নিয়োগ দেওয়া হয়নি"],
      ["পছন্দের আইনক্ষেত্র", "পারিবারিক আইন"],
      ["পরবর্তী পদক্ষেপ", "উপযুক্ত প্যানেল আইনজীবী নির্বাচন"],
    ],
  },
  মধ্যস্থতা: {
    description: "মধ্যস্থতার সম্ভাবনা ও সেশনের তথ্য।",
    items: [
      ["অবস্থা", "এখনও মূল্যায়ন করা হয়নি"],
      ["মধ্যস্থতাকারী", "নিয়োগ দেওয়া হয়নি"],
      ["পরবর্তী পদক্ষেপ", "উভয় পক্ষের সম্মতি যাচাই"],
    ],
  },
  রেফারেল: {
    description: "অন্য দপ্তরে পাঠানো এবং প্রাপ্তি স্বীকারের তথ্য।",
    items: [
      ["বর্তমান অবস্থা", "কোনো রেফারেল নেই"],
      ["গন্তব্য দপ্তর", "নির্ধারিত হয়নি"],
      ["পরবর্তী পদক্ষেপ", "প্রয়োজন হলে দায়িত্বপ্রাপ্ত কর্মকর্তা রেফার করবেন"],
    ],
  },
  অডিট: {
    description: "কেসে সম্পন্ন হওয়া কাজের নমুনা ইতিহাস।",
    items: [
      ["আবেদন গ্রহণ", "আবেদনের তথ্য রেকর্ডে যুক্ত হয়েছে"],
      ["নথি যাচাই", "পরিচয়পত্র পাওয়া যায়নি বলে চিহ্নিত হয়েছে"],
      ["মানবিক পর্যালোচনা", "দায়িত্বপ্রাপ্ত কর্মকর্তার পর্যালোচনা প্রয়োজন"],
    ],
  },
};

export default function CaseRecordDetails({ record, onBack }) {
  const [activeTab, setActiveTab] = useState("সারসংক্ষেপ");
  const [briefGenerated, setBriefGenerated] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewSaved, setReviewSaved] = useState(false);
  const [review, setReview] = useState({
    decision: "",
    reviewer: "",
    notes: "",
    confirmed: false,
  });
  const decisionRef = useRef(null);

  const caseId = record?.id || "CASE-2026-00127";

  useEffect(() => {
    if (!reviewOpen) return;

    decisionRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") setReviewOpen(false);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [reviewOpen]);

  function handleReviewSubmit(event) {
    event.preventDefault();
    setReviewSaved(true);
    setReviewOpen(false);
  }

  return (
    <div className="space-y-4 bg-[#f8fbff] text-[#253449]">
      {/* Heading */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">
            কেস রেকর্ড — {caseId}
          </h1>
          <p className="mt-1 text-sm text-[#64748b]">
            অনুমোদিত ব্যবহারকারীদের জন্য একটি সমন্বিত কেস রেকর্ড
          </p>
        </div>

        <button
          type="button"
          onClick={() => setReviewOpen(true)}
          className="rounded-xl bg-[#23814d] px-4 py-3 font-medium text-white hover:bg-[#1b693e]"
        >
          {reviewSaved ? "পর্যালোচনা দেখুন" : "মানবিক পর্যালোচনা"}
        </button>
      </div>

      {/* Case progress */}
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-[#e0e7ef] bg-white p-5 shadow-sm">
        {[
          ["আবেদন NY-2026-00041", "bg-[#dff7ea]"],
          ["মানবিক পর্যালোচনা", "bg-[#dff7ea]"],
          ["কেস অপেক্ষমাণ", "bg-[#dcecff] font-semibold"],
          ["সেবা", "bg-[#eef2f6]"],
          ["ফলো-আপ", "bg-[#eef2f6]"],
          ["সমাপ্তি", "bg-[#eef2f6]"],
        ].map(([label, color], index) => (
          <div key={label} className="flex items-center gap-2">
            {index > 0 && <span className="text-lg">→</span>}
            <span className={`rounded-lg px-3 py-2 text-sm ${color}`}>
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div
        className="flex flex-wrap gap-2"
        role="tablist"
        aria-label="কেসের বিভাগ"
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-xl px-4 py-3 text-sm font-medium ${
              activeTab === tab
                ? "bg-[#193b57] text-white"
                : "bg-[#eef3fa] text-[#253449] hover:bg-[#e2eaf5]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "সারসংক্ষেপ" ? (
        <>
          {/* Top two cards */}
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-2xl border border-[#e0e7ef] bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-xl font-bold">ব্যক্তি ও প্রতিনিধিত্ব</h2>

              <dl className="grid grid-cols-[minmax(120px,1fr)_2fr] items-center gap-x-4 gap-y-3 text-sm">
                <dt className="font-semibold">আবেদনকারী</dt>
                <dd>ময়ূরী আক্তার</dd>

                <dt className="font-semibold">রিপোর্ট করেছেন</dt>
                <dd>রিপন (ভাই)</dd>

                <dt className="font-semibold">প্রতিনিধিত্ব</dt>
                <dd>
                  <span className="rounded-full bg-purple-100 px-3 py-1 font-semibold text-purple-800">
                    সীমিত ও নথিভুক্ত
                  </span>
                </dd>

                <dt className="font-semibold">নিরাপদ যোগাযোগ</dt>
                <dd>
                  <span className="rounded-full bg-rose-100 px-3 py-1 font-semibold text-rose-800">
                    শুধু ভয়েস; সীমিত
                  </span>
                </dd>

                <dt className="font-semibold">পরিচয়</dt>
                <dd>
                  <span className="rounded-full bg-amber-100 px-3 py-1 font-semibold text-amber-900">
                    অসম্পূর্ণ — আবেদন বাতিল নয়
                  </span>
                </dd>
              </dl>
            </div>

            <div className="rounded-2xl border border-[#e0e7ef] bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-xl font-bold">
                মানবিক তত্ত্বাবধানের অবস্থা
              </h2>

              <div className="rounded-xl border border-blue-200 bg-[#edf6ff] p-4 text-sm">
                <strong>সিস্টেম ফ্ল্যাগ:</strong> জরুরি / সেবা গ্রহণে বাধা —{" "}
                <strong>মানবিক পর্যালোচনা প্রয়োজন</strong>
              </div>

              <p className="mt-4 text-sm leading-6">
                তথ্য সংগ্রহ, সারসংক্ষেপ, চেকলিস্ট, সম্ভাব্য সদৃশ রেকর্ড এবং
                প্রাথমিক অগ্রাধিকার নির্ধারণে AI সহায়তা করতে পারে। গুরুত্বপূর্ণ
                সিদ্ধান্ত অনুমোদিত কর্মকর্তাই নেবেন।
              </p>

              <a
                href="#ai-assistance"
                className="mt-4 inline-block rounded-xl bg-[#e9eff6] px-4 py-3 text-sm hover:bg-[#dce7f2]"
              >
                AI সহায়তা খুলুন
              </a>

              {reviewSaved && (
                <p role="status" className="mt-3 text-sm text-[#17654d]">
                  ডেমো পর্যালোচনা সংরক্ষিত: {review.decision}
                </p>
              )}
            </div>
          </div>

          {/* Bottom card */}
          <div className="rounded-2xl border border-[#e0e7ef] bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-bold">কেসের তথ্য কাঠামো</h2>

            <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ["কাজ", "৭টি চলমান / ২টির সময় পেরিয়েছে"],
                ["নথিপত্র", "৩টি পাওয়া গেছে / ২টি অনিশ্চিত"],
                ["অডিট", "১৮টি ঘটনা"],
                ["রেফারেল", "নেই"],
                ["আইনজীবী", "এখনও নিয়োগ দেওয়া হয়নি"],
                ["মধ্যস্থতা", "প্রযোজ্য নয়"],
              ].map(([label, value]) => (
                <div key={label}>
                  <h3 className="font-bold">{label}</h3>
                  <p className="mt-3 text-sm text-[#64748b]">{value}</p>
                </div>
              ))}
            </div>
          </div>
          {/* AI assistance / multi-agent triage */}
          <div className="mt-5 space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-[#253449]">
                এআই সহায়তা / একাধিক এজেন্টের প্রাথমিক মূল্যায়ন
              </h2>
              <p className="mt-1 text-sm text-[#64748b]">
                তিনটি বিশেষায়িত অংশের বিশ্লেষণ, যুক্তিসহ সুপারিশ এবং মানবিক
                নিয়ন্ত্রণ
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {[
                {
                  title: "বিষয় নির্ধারণকারী এজেন্ট",
                  badge: "পারিবারিক / ভরণপোষণ",
                  detail: "আবেদনের বিষয় ও প্রাপ্ত তথ্য বিশ্লেষণ",
                },
                {
                  title: "প্রক্রিয়া যাচাইকারী এজেন্ট",
                  badge: "পরিচয় নিশ্চিতকরণ বাকি",
                  detail: "প্রয়োজনীয় তথ্যের চেকলিস্ট",
                },
                {
                  title: "ঝুঁকি ও প্রবেশাধিকার যাচাইকারী এজেন্ট",
                  badge: "মানবিক পর্যালোচনা প্রয়োজন",
                  detail: "সেবা গ্রহণে বাধা ও নিরাপদ যোগাযোগের সীমাবদ্ধতা",
                },
              ].map((agent) => (
                <div
                  key={agent.title}
                  className="rounded-2xl border border-[#e0e7ef] bg-white p-5 shadow-sm"
                >
                  <h3 className="text-lg font-bold">{agent.title}</h3>
                  <span className="mt-4 inline-block rounded-full bg-[#e6f2ff] px-3 py-1 text-xs font-semibold text-[#245478]">
                    {agent.badge}
                  </span>
                  <p className="mt-4 text-sm text-[#64748b]">{agent.detail}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-[#e0e7ef] bg-white p-5 shadow-sm">
              <h3 className="text-lg font-bold">সমন্বিত সুপারিশ</h3>

              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-950">
                সিস্টেমের সুপারিশ: অগ্রাধিকারভিত্তিক মানবিক পর্যালোচনা প্রয়োজন
              </div>

              <div className="mt-3 overflow-x-auto">
                <table className="w-full min-w-[600px] text-left text-sm">
                  <thead className="bg-[#f8faff]">
                    <tr>
                      <th className="px-3 py-3">কারণ</th>
                      <th className="px-3 py-3">প্রমাণ / উৎস</th>
                      <th className="px-3 py-3">কর্মকর্তার পদক্ষেপ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      [
                        "সেবা গ্রহণে বাধা",
                        "আবেদনের তথ্য ও নিরাপদ যোগাযোগের বিবরণ",
                        "কর্মকর্তা অগ্রাধিকার নির্ধারণ করবেন",
                      ],
                      [
                        "পরিচয়সংক্রান্ত নথি অনুপস্থিত",
                        "নথির চেকলিস্ট",
                        "কর্মকর্তা পরবর্তী পদক্ষেপ নির্ধারণ করবেন",
                      ],
                      [
                        "নিরাপদ যোগাযোগে সীমাবদ্ধতা",
                        "আবেদনকারী ও প্রতিনিধির রেকর্ড",
                        "নিরাপদ যোগাযোগের নিয়ম অনুসরণ করবেন",
                      ],
                    ].map(([reason, source, action]) => (
                      <tr key={reason} className="border-t border-[#e0e7ef]">
                        <td className="px-3 py-3">{reason}</td>
                        <td className="px-3 py-3">{source}</td>
                        <td className="px-3 py-3">{action}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setReview((current) => ({
                      ...current,
                      decision: "সুপারিশ নিশ্চিত করুন",
                    }));
                    setReviewOpen(true);
                  }}
                  className="rounded-xl bg-[#23814d] px-4 py-3 text-sm font-medium text-white hover:bg-[#1b693e]"
                >
                  মানবিকভাবে সুপারিশ নিশ্চিত করুন
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setReview((current) => ({
                      ...current,
                      decision: "সুপারিশ পরিবর্তন করুন",
                    }));
                    setReviewOpen(true);
                  }}
                  className="rounded-xl bg-[#e9eff6] px-4 py-3 text-sm hover:bg-[#dce7f2]"
                >
                  বিকল্প সিদ্ধান্ত দিন
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-[#e0e7ef] bg-white p-5 shadow-sm">
              <h3 className="text-lg font-bold">মতভিন্নতা যাচাই</h3>
              <p className="mt-4 text-sm">
                বিষয়: পারিবারিক · প্রক্রিয়া: পরিচয়ের তথ্য অনুপস্থিত · ঝুঁকি:
                সেবা গ্রহণে উল্লেখযোগ্য বাধা
              </p>
              <p className="mt-3 text-sm text-[#64748b]">
                বিশ্লেষণে মতভিন্নতা থাকলে তা মানবিক পর্যালোচনার জন্য দেখানো হয়।
              </p>
            </div>
          </div>
        </>
      ) : activeTab === "নথিপত্র" ? (
        <div className="space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-[#253449]">
                নথিপত্র বিশ্লেষণ
              </h2>
              <p className="mt-1 text-sm text-[#64748b]">
                নথির সারসংক্ষেপ ও চেকলিস্ট — উৎসের তথ্যের ভিত্তিতে
              </p>
            </div>

            <button
              type="button"
              onClick={() => setBriefGenerated(true)}
              className="rounded-xl bg-[#23689a] px-4 py-3 text-sm font-medium text-white hover:bg-[#1b567f]"
            >
              এআই সারসংক্ষেপ তৈরি করুন
            </button>
          </div>

          {briefGenerated && (
            <p role="status" className="text-sm text-[#17654d]">
              নমুনা নথির তথ্য থেকে ডেমো সারসংক্ষেপ দেখানো হচ্ছে।
            </p>
          )}

          <div className="grid gap-4 lg:grid-cols-2">
            {/* Document checklist */}
            <div className="rounded-2xl border border-[#e0e7ef] bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-xl font-bold text-[#253449]">
                নথির চেকলিস্ট
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] text-left text-sm">
                  <thead className="bg-[#f8faff]">
                    <tr>
                      <th className="px-3 py-3 font-semibold">নথি</th>
                      <th className="px-3 py-3 font-semibold">অবস্থা</th>
                      <th className="px-3 py-3 font-semibold">উৎস</th>
                    </tr>
                  </thead>

                  <tbody>
                    {[
                      {
                        name: "বিবাহের নথি",
                        status: "পাওয়া গেছে",
                        source: "প্রতিনিধি আপলোড করেছেন",
                        color: "bg-emerald-100 text-emerald-900",
                      },
                      {
                        name: "আয়ের নথি",
                        status: "পাওয়া গেছে",
                        source: "আবেদনকারী নিশ্চিত করেছেন",
                        color: "bg-emerald-100 text-emerald-900",
                      },
                      {
                        name: "পূর্ববর্তী নোটিশ",
                        status: "পাওয়া গেছে",
                        source: "কর্মী তথ্য দিয়েছেন",
                        color: "bg-emerald-100 text-emerald-900",
                      },
                      {
                        name: "পরিচয়পত্র",
                        status: "পাওয়া যায়নি",
                        source: "জমা দেওয়া হয়নি",
                        color: "bg-rose-100 text-rose-800",
                      },
                      {
                        name: "সহায়ক প্রমাণ",
                        status: "অনিশ্চিত",
                        source: "ছবির কিছু অংশ পড়া যাচ্ছে না",
                        color: "bg-amber-100 text-amber-900",
                      },
                    ].map((document) => (
                      <tr
                        key={document.name}
                        className="border-t border-[#e0e7ef]"
                      >
                        <td className="px-3 py-4">{document.name}</td>
                        <td className="px-3 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${document.color}`}
                          >
                            {document.status}
                          </span>
                        </td>
                        <td className="px-3 py-4">{document.source}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* AI brief */}
            <div className="rounded-2xl border border-[#e0e7ef] bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-xl font-bold text-[#253449]">
                এআই সারসংক্ষেপ
              </h3>

              <p className="rounded-xl border border-blue-200 bg-[#edf6ff] p-4 text-sm leading-6">
                পাওয়া যাওয়া নথির ভিত্তিতে সারসংক্ষেপ দেখানো হয়েছে। পড়া যায় না বা
                অনিশ্চিত এমন কোনো তথ্য অনুমান করে যোগ করা হয়নি।
              </p>

              <div className="mt-5 space-y-4 text-sm leading-6">
                <p>
                  <strong>কেসের প্রেক্ষাপট:</strong> পারিবারিক ও ভরণপোষণ
                  সংক্রান্ত আইনগত সহায়তার আবেদন।
                </p>

                <p>
                  <strong>সম্ভাব্য অনুপস্থিত তথ্য:</strong> পরিচয় নিশ্চিতকরণ।
                </p>

                <p>
                  <strong>অনিশ্চয়তা:</strong> সহায়ক প্রমাণের ছবির কিছু অংশ পড়া
                  যাচ্ছে না।
                </p>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2 text-xs">
                <span>
                  তথ্যের উৎস: নথির তালিকা এবং আপলোড করা রেকর্ডের বিবরণ।
                </span>
                <span className="rounded-full bg-purple-100 px-3 py-1 font-semibold text-purple-800">
                  এআই সহায়তাপ্রাপ্ত
                </span>
                <span className="rounded-full bg-amber-100 px-3 py-1 font-semibold text-amber-900">
                  মানবিক পর্যালোচনা
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-[#e0e7ef] bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">{activeTab}</h2>
          <p className="mt-2 text-sm text-[#64748b]">
            {otherTabContent[activeTab].description}
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {otherTabContent[activeTab].items.map(([label, value]) => (
              <div
                key={label}
                className="rounded-xl border border-[#e0e7ef] bg-[#f8fbff] p-4"
              >
                <h3 className="font-semibold">{label}</h3>
                <p className="mt-3 text-sm leading-6 text-[#64748b]">{value}</p>
              </div>
            ))}
          </div>

          <p className="mt-6 text-xs text-[#64748b]">
            ডেমো তথ্য — কোনো বাস্তব কেসের সিদ্ধান্ত বা কার্যক্রম নয়।
          </p>
        </div>
      )}

      {/* Human review modal */}
      {reviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/60"
            onClick={() => setReviewOpen(false)}
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="review-title"
            className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="review-title" className="text-xl font-bold">
                  মানবিক পর্যালোচনা
                </h2>
                <p className="mt-1 text-sm text-slate-500">{caseId}</p>
              </div>

              <button
                type="button"
                onClick={() => setReviewOpen(false)}
                aria-label="বন্ধ করুন"
                className="rounded-lg px-2 py-1 text-xl hover:bg-slate-100"
              >
                ×
              </button>
            </div>

            <p className="mt-5 rounded-xl bg-blue-50 p-4 text-sm">
              পরিচয় অসম্পূর্ণ এবং নিরাপদ যোগাযোগ সীমিত। রেকর্ড যাচাই করে পরবর্তী
              পদক্ষেপ নির্বাচন করুন।
            </p>

            <form onSubmit={handleReviewSubmit} className="mt-5 space-y-4">
              <div>
                <label
                  htmlFor="review-decision"
                  className="mb-2 block text-sm font-semibold"
                >
                  পরবর্তী পদক্ষেপ *
                </label>
                <select
                  ref={decisionRef}
                  id="review-decision"
                  required
                  value={review.decision}
                  onChange={(event) =>
                    setReview({ ...review, decision: event.target.value })
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white p-3"
                >
                  <option value="">পদক্ষেপ নির্বাচন করুন</option>
                  <option>নিরাপদ উপায়ে যোগাযোগ করুন</option>
                  <option>অতিরিক্ত তথ্য সংগ্রহ করুন</option>
                  <option>সংশ্লিষ্ট কর্মকর্তার কাছে পাঠান</option>
                  <option>পর্যালোচনার জন্য অপেক্ষায় রাখুন</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="reviewer"
                  className="mb-2 block text-sm font-semibold"
                >
                  পর্যালোচনাকারীর নাম *
                </label>
                <input
                  id="reviewer"
                  type="text"
                  required
                  value={review.reviewer}
                  onChange={(event) =>
                    setReview({ ...review, reviewer: event.target.value })
                  }
                  placeholder="আপনার নাম লিখুন"
                  className="w-full rounded-xl border border-slate-300 p-3"
                />
              </div>

              <div>
                <label
                  htmlFor="review-notes"
                  className="mb-2 block text-sm font-semibold"
                >
                  পর্যালোচনার নোট *
                </label>
                <textarea
                  id="review-notes"
                  required
                  rows={4}
                  value={review.notes}
                  onChange={(event) =>
                    setReview({ ...review, notes: event.target.value })
                  }
                  placeholder="পদক্ষেপ নির্বাচনের কারণ লিখুন"
                  className="w-full resize-y rounded-xl border border-slate-300 p-3"
                />
              </div>

              <label className="flex items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  required
                  checked={review.confirmed}
                  onChange={(event) =>
                    setReview({ ...review, confirmed: event.target.checked })
                  }
                  className="mt-1"
                />
                <span>
                  আমি কেসের তথ্য পর্যালোচনা করে এই পদক্ষেপ নির্বাচন করেছি।
                </span>
              </label>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewOpen(false)}
                  className="rounded-xl border border-slate-300 px-4 py-3"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#23814d] px-4 py-3 font-semibold text-white hover:bg-[#1b693e]"
                >
                  ডেমো পর্যালোচনা সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
