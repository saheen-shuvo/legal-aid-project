"use client";

import { useEffect, useState } from "react";
import CaseSupportDetails from "./CaseSupportDetails";
import CaseSupportRegister from "./CaseSupportRegister";
import CaseSupportTasks from "./CaseSupportTasks";
import CaseSupportReports from "./CaseSupportReports";
import CaseSupportAudit from "./CaseSupportAudit";

const sections = {
  overview: "সারসংক্ষেপ",
  "case-search": "কেস অনুসন্ধান",
  "case-register": "কেস রেজিস্টার",
  "task-queue": "কাজের তালিকা",
  reports: "প্রতিবেদন",
  "audit-trail": "অডিট ইতিহাস",
};

const initialCases = [
  {
    id: "LA-2026-00125",
    applicant: "ময়ূরী আক্তার",
    type: "ভরণপোষণ",
    priority: "উচ্চ",
    status: "আইনজীবী নিয়োগ হয়েছে",
    source: "১৬৬৯৯ হেল্পলাইন",
    updated: "২৪ সেপ্টেম্বর ২০২৬",
  },
  {
    id: "LA-2026-00126",
    applicant: "করিম মিয়া",
    type: "পারিবারিক বিরোধ",
    priority: "মাঝারি",
    status: "যাচাইয়ের অপেক্ষায়",
    source: "ইউডিসি",
    updated: "২৩ সেপ্টেম্বর ২০২৬",
  },
  {
    id: "LA-2026-00127",
    applicant: "নুচিং মারমা",
    type: "ভরণপোষণ",
    priority: "উচ্চ",
    status: "মধ্যস্থতা",
    source: "ইউডিসি",
    updated: "২৪ সেপ্টেম্বর ২০২৬",
  },
  {
    id: "LA-2026-00128",
    applicant: "রিনা বেগম",
    type: "পারিবারিক সহিংসতা",
    priority: "জরুরি",
    status: "রেফারেল",
    source: "১৬৬৯৯ হেল্পলাইন",
    updated: "২৪ সেপ্টেম্বর ২০২৬",
  },
];

export default function CaseSupportDashboard() {
  const [active, setActive] = useState("overview");
  const [selectedCase, setSelectedCase] = useState(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("সব");
  const [priorityFilter, setPriorityFilter] = useState("সব");
  const [typeFilter, setTypeFilter] = useState("সব");
  const [cases, setCases] = useState(initialCases);

  useEffect(() => {
    function updateSection() {
      const section = window.location.hash.slice(1);
      setActive(section in sections ? section : "overview");
    }

    updateSection();
    window.addEventListener("hashchange", updateSection);
    return () => window.removeEventListener("hashchange", updateSection);
  }, []);

  const filteredCases = cases.filter((item) => {
    const searchableText = [
      item.id,
      item.applicant,
      item.type,
      item.source,
      item.status,
    ]
      .join(" ")
      .toLocaleLowerCase();

    return (
      searchableText.includes(query.trim().toLocaleLowerCase()) &&
      (statusFilter === "সব" || item.status === statusFilter) &&
      (priorityFilter === "সব" || item.priority === priorityFilter) &&
      (typeFilter === "সব" || item.type === typeFilter)
    );
  });

  return (
    <div className="space-y-6 text-[#202b3e]">
      {active === "overview" ? (
        <>
          <div>
            <p className="text-sm font-bold text-emerald-800">
              ডিএলও / প্রশাসন ও কেস সাপোর্ট
            </p>
            <h1 className="mt-2 text-3xl font-extrabold">
              কেস ব্যবস্থাপনার সারসংক্ষেপ
            </h1>
            <p className="mt-2 text-slate-600">
              একই কেস রেকর্ডে আবেদন, কাজ ও সাম্প্রতিক কার্যক্রম দেখুন।
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ["সক্রিয় কেস", "৪"],
              ["যাচাইয়ের অপেক্ষায়", "১"],
              ["মেয়াদ পেরোনো কাজ", "১"],
              ["বন্ধ কেস", "০"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-2xl border border-[#d6e0f2] bg-white p-5 shadow-sm"
              >
                <p className="text-sm font-semibold text-slate-500">{label}</p>
                <p className="mt-3 text-4xl font-extrabold">{value}</p>
              </div>
            ))}
          </div>

          <section className="overflow-hidden rounded-2xl border border-[#d6e0f2] bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#d6e0f2] p-5">
              <div>
                <h2 className="text-xl font-bold">সাম্প্রতিক কেস কার্যক্রম</h2>
                <p className="mt-1 text-sm text-slate-500">
                  সংযুক্ত কেস রেকর্ডগুলোর সর্বশেষ অবস্থা।
                </p>
              </div>
              <a
                href="#case-search"
                className="rounded-xl border border-[#d6e0f2] px-4 py-2 text-sm font-bold text-emerald-900 hover:bg-emerald-50"
              >
                কেস অনুসন্ধান
              </a>
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
                          onClick={() => setSelectedCase(item)}
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

          <section className="rounded-2xl bg-[#0d392e] p-6 text-white">
            <h2 className="text-xl font-bold">একটি কেস, একটি সমন্বিত রেকর্ড</h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-emerald-50">
              হেল্পলাইন, ইউডিসি, মধ্যস্থতাকারী, আইনজীবী ও ডিএলওর কার্যক্রম একই
              কেস আইডির অধীনে দেখা যাবে।
            </p>
          </section>
        </>
      ) : active === "case-search" ? (
        <div className="space-y-6">
          <div>
            <p className="text-sm font-bold text-emerald-800">
              ডিএলও / প্রশাসন ও কেস সাপোর্ট
            </p>
            <h1 className="mt-2 text-3xl font-extrabold">কেস অনুসন্ধান</h1>
            <p className="mt-2 text-slate-600">
              কেস আইডি, আবেদনকারী, বিষয় বা উৎস দিয়ে রেকর্ড খুঁজুন।
            </p>
          </div>

          <section className="rounded-2xl border border-[#d6e0f2] bg-white p-5 shadow-sm">
            <div className="flex flex-wrap gap-3">
              <input
                type="search"
                aria-label="কেস অনুসন্ধান"
                placeholder="কেস আইডি, আবেদনকারী বা বিষয় লিখুন"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="min-w-60 flex-1 rounded-xl border border-[#d6e0f2] px-4 py-3 outline-none focus:border-emerald-700"
              />
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setStatusFilter("সব");
                  setPriorityFilter("সব");
                  setTypeFilter("সব");
                }}
                className="rounded-xl border border-[#d6e0f2] px-5 py-3 font-semibold hover:bg-slate-50"
              >
                মুছে ফেলুন
              </button>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <select
                aria-label="অবস্থা অনুযায়ী"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="rounded-xl border border-[#d6e0f2] bg-white px-4 py-3"
              >
                <option value="সব">সব অবস্থা</option>
                {[...new Set(cases.map((item) => item.status))].map(
                  (status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ),
                )}
              </select>

              <select
                aria-label="অগ্রাধিকার অনুযায়ী"
                value={priorityFilter}
                onChange={(event) => setPriorityFilter(event.target.value)}
                className="rounded-xl border border-[#d6e0f2] bg-white px-4 py-3"
              >
                <option value="সব">সব অগ্রাধিকার</option>
                {[...new Set(cases.map((item) => item.priority))].map(
                  (priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ),
                )}
              </select>

              <select
                aria-label="বিষয় অনুযায়ী"
                value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value)}
                className="rounded-xl border border-[#d6e0f2] bg-white px-4 py-3"
              >
                <option value="সব">সব বিষয়</option>
                {[...new Set(cases.map((item) => item.type))].map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-[#d6e0f2] bg-white shadow-sm">
            <h2 className="border-b border-[#d6e0f2] p-5 text-lg font-bold">
              {filteredCases.length}টি কেস পাওয়া গেছে
            </h2>

            {filteredCases.length === 0 ? (
              <p className="p-8 text-center text-slate-500">
                এই অনুসন্ধানে কোনো কেস পাওয়া যায়নি।
              </p>
            ) : (
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
                    {filteredCases.map((item) => (
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
                            onClick={() => setSelectedCase(item)}
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
            )}
          </section>
        </div>
      ) : active === "case-register" ? (
        <CaseSupportRegister
          cases={cases}
          onOpen={setSelectedCase}
          onCreate={(newCase) => setCases((current) => [...current, newCase])}
        />
      ) : active === "task-queue" ? (
        <CaseSupportTasks
          cases={cases}
          onUpdate={(updated) =>
            setCases((current) =>
              current.map((item) =>
                item.id === updated.id ? { ...item, ...updated } : item,
              ),
            )
          }
        />
      ) : active === "reports" ? (
        <CaseSupportReports cases={cases} />
      ) : active === "audit-trail" ? (
        <CaseSupportAudit cases={cases} />
      ) : (
        <section className="rounded-2xl border border-[#d6e0f2] bg-white p-6">
          <h1 className="text-2xl font-bold">{sections[active]}</h1>
          <p className="mt-2 text-slate-600">
            এই অংশের কার্যক্রম পরবর্তী ধাপে যুক্ত হবে।
          </p>
        </section>
      )}

      {selectedCase && (
        <CaseSupportDetails
          item={selectedCase}
          onClose={() => setSelectedCase(null)}
          onUpdate={(updated) => {
            setSelectedCase(updated);
            setCases((current) =>
              current.map((item) =>
                item.id === updated.id ? { ...item, ...updated } : item,
              ),
            );
          }}
        />
      )}
    </div>
  );
}
