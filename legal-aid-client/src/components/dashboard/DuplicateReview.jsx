"use client";

import { useState } from "react";

const applications = [
  {
    id: "APP-2026-00041",
    name: "ময়ূরী আক্তার",
    candidates: [
      {
        id: "CASE-2026-00127",
        similarity: 87,
        evidence: "নাম, এলাকা ও সমস্যার ধরন কাছাকাছি",
      },
      {
        id: "CASE-2026-00154",
        similarity: 61,
        evidence: "নাম কাছাকাছি; এলাকা ও যোগাযোগের তথ্য আলাদা",
      },
    ],
  },
  {
    id: "APP-2026-00052",
    name: "রিনা বেগম",
    candidates: [
      {
        id: "CASE-2026-00188",
        similarity: 79,
        evidence: "যোগাযোগের নম্বর ও সমস্যার ধরন কাছাকাছি",
      },
      {
        id: "CASE-2026-00203",
        similarity: 48,
        evidence: "নাম কাছাকাছি; পরিচয় ও ঠিকানা আলাদা",
      },
    ],
  },
  {
    id: "APP-2026-00063",
    name: "আবদুল মালেক",
    candidates: [
      {
        id: "CASE-2026-00216",
        similarity: 72,
        evidence: "একই এলাকা ও অনুরূপ আবেদন; ব্যক্তির তথ্য যাচাই প্রয়োজন",
      },
    ],
  },
];

export default function DuplicateReview() {
  const [selected, setSelected] = useState(null);
  const [decision, setDecision] = useState("");
  const [reason, setReason] = useState("");
  const [reviews, setReviews] = useState({});

  function saveReview(event) {
    event.preventDefault();

    setReviews((current) => ({
      ...current,
      [`${selected.applicationId}-${selected.id}`]: {
        decision,
        reason: reason.trim(),
      },
    }));

    setSelected(null);
    setDecision("");
    setReason("");
  }

  function closeReview() {
    setSelected(null);
    setDecision("");
    setReason("");
  }

  return (
    <section id="duplicate" className="space-y-6 text-[#253449]">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">
          DLAO / ডেমো রেকর্ড
        </p>
        <h1 className="mt-2 text-3xl font-bold">
          সম্ভাব্য ডুপ্লিকেট — মানবিক পর্যালোচনা
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          মিলের সম্ভাবনা ও তথ্যের ভিত্তি দেখে কর্মকর্তা প্রতিটি রেকর্ড যাচাই করবেন।
        </p>
      </div>

      {applications.map((application) => (
        <div
          key={application.id}
          className="rounded-2xl border border-[#d6e0f2] bg-white p-5 shadow-sm"
        >
          <h2 className="mb-4 text-xl font-bold">
            নতুন আবেদন: {application.name}
            <span className="ml-2 text-sm font-normal text-slate-500">
              ({application.id})
            </span>
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3">সম্ভাব্য মিল থাকা কেস</th>
                  <th className="px-4 py-3">মিলের হার</th>
                  <th className="px-4 py-3">মিল বা অমিলের ভিত্তি</th>
                  <th className="px-4 py-3">পদক্ষেপ</th>
                </tr>
              </thead>

              <tbody>
                {application.candidates.map((candidate) => {
                  const saved =
                    reviews[`${application.id}-${candidate.id}`];

                  return (
                    <tr
                      key={candidate.id}
                      className="border-t border-slate-200"
                    >
                      <td className="px-4 py-4 font-semibold">
                        {candidate.id}
                      </td>
                      <td className="px-4 py-4">
                        <span className="rounded-full bg-amber-100 px-3 py-1 font-bold text-amber-900">
                          {candidate.similarity}%
                        </span>
                      </td>
                      <td className="px-4 py-4">{candidate.evidence}</td>
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => {
                            setSelected({
                              ...candidate,
                              applicationId: application.id,
                              applicant: application.name,
                            });
                            setDecision(saved?.decision || "");
                            setReason(saved?.reason || "");
                          }}
                          className="rounded-lg bg-slate-100 px-4 py-2 font-semibold hover:bg-slate-200"
                        >
                          {saved ? "সিদ্ধান্ত দেখুন" : "পর্যালোচনা"}
                        </button>
                        {saved && (
                          <p className="mt-2 text-xs text-emerald-800">
                            {saved.decision}
                          </p>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
        মিলের হার দেখে কোনো আবেদন স্বয়ংক্রিয়ভাবে বাতিল বা একীভূত করা হয় না।
        চূড়ান্ত সিদ্ধান্ত অনুমোদিত কর্মকর্তা নেবেন।
      </p>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="duplicate-review-title"
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="duplicate-review-title" className="text-xl font-bold">
                  সম্ভাব্য মিল পর্যালোচনা
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  {selected.applicant} · {selected.applicationId}
                  <br />
                  সম্ভাব্য কেস: {selected.id} · মিল {selected.similarity}%
                </p>
              </div>
              <button
                type="button"
                onClick={closeReview}
                aria-label="বন্ধ করুন"
                className="text-xl"
              >
                ×
              </button>
            </div>

            <p className="mt-5 rounded-xl bg-blue-50 p-4 text-sm">
              <strong>তথ্যের ভিত্তি:</strong> {selected.evidence}
            </p>

            <form onSubmit={saveReview} className="mt-5 space-y-4">
              <label className="block text-sm font-semibold">
                কর্মকর্তার সিদ্ধান্ত *
                <select
                  required
                  value={decision}
                  onChange={(event) => setDecision(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white p-3"
                >
                  <option value="">সিদ্ধান্ত নির্বাচন করুন</option>
                  <option>আলাদা ব্যক্তি বা কেস</option>
                  <option>একই কেস হতে পারে — আরও যাচাই প্রয়োজন</option>
                  <option>বিদ্যমান কেসের সঙ্গে সম্পর্কিত</option>
                </select>
              </label>

              <label className="block text-sm font-semibold">
                সিদ্ধান্তের কারণ *
                <textarea
                  required
                  rows={4}
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  placeholder="যাচাই করা তথ্য ও সিদ্ধান্তের কারণ লিখুন"
                  className="mt-2 w-full rounded-xl border border-slate-300 p-3"
                />
              </label>

              <button
                type="submit"
                className="w-full rounded-xl bg-[#0d392e] px-5 py-3 font-semibold text-white"
              >
                ডেমো সিদ্ধান্ত সংরক্ষণ করুন
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}