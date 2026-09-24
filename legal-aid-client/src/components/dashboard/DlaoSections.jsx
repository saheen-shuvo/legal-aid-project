"use client";

import { useState } from "react";
import {
  FiArrowRight,
  FiCheckCircle,
  FiFileText,
  FiRefreshCw,
  FiSearch,
  FiShield,
} from "react-icons/fi";

const demoSections = {
  applications: {
    title: "আবেদনসমূহ",
    subtitle: "ডেমো চ্যানেলের মাধ্যমে প্রাপ্ত আবেদনসমূহ।",
    metrics: [
      ["নতুন", "১৮"],
      ["পর্যালোচনার অপেক্ষায়", "১১"],
      ["নিরাপদ যোগাযোগ প্রয়োজন", "৩"],
    ],
    records: [
      [
        "APP-000035",
        "ময়ূরী / রিপন",
        "নিরাপদ যোগাযোগ + অসম্পূর্ণ পরিচয়",
        "হিউম্যান রিভিউ",
        "DLAO",
      ],
      [
        "APP-000041",
        "নাবিলা",
        "সংবেদনশীল প্রমাণাদি",
        "জরুরি পর্যালোচনা",
        "DLAO",
      ],
      [
        "APP-000038",
        "নুচিং মারমা",
        "সহায়ক ইনটেক + অনুবাদ",
        "অনুবাদ প্রয়োজন",
        "DLAO",
      ],
      [
        "APP-000044",
        "রহিমা বেগম",
        "পরিচয় যাচাইয়ের অনুরোধ করা হয়েছে",
        "পেন্ডিং",
        "কেস সাপোর্ট",
      ],
    ],
  },
  "human-queue": {
    title: "হিউম্যান রিভিউ কিউ",
    subtitle:
      "যে কেসগুলোতে কোনো সিদ্ধান্ত নেওয়ার আগে একজন দায়িত্বপ্রাপ্ত ব্যক্তির পর্যালোচনা প্রয়োজন।",
    metrics: [
      ["কিউতে আছে", "১১"],
      ["জরুরি", "৩"],
      ["নিরাপত্তা সংক্রান্ত", "৩"],
    ],
    records: [
      [
        "APP-000035",
        "ময়ূরী / রিপন",
        "নিরাপদ যোগাযোগ + অসম্পূর্ণ পরিচয়",
        "জরুরি",
        "DLAO",
      ],
      [
        "APP-000041",
        "নাবিলা",
        "নিরাপত্তা সংকেত + সংবেদনশীল প্রমাণাদি",
        "জরুরি",
        "DLAO",
      ],
      [
        "APP-000038",
        "নুচিং মারমা",
        "সহায়ক ইনটেক + অনুবাদ",
        "উচ্চ অগ্রাধিকার",
        "DLAO",
      ],
      [
        "CASE-26-00417",
        "আব্দুল মালেক",
        "আইনজীবীর তথ্য আপডেট বিলম্বিত",
        "উচ্চ অগ্রাধিকার",
        "কেস সাপোর্ট",
      ],
    ],
  },
  "case-records": {
    title: "ইউনিফাইড কেস রেকর্ডস",
    subtitle:
      "আপডেট, রেফারেল এবং ফলো-আপ হিস্ট্রির জন্য একটি সমন্বিত কেস রেকর্ড।",
    metrics: [
      ["সক্রিয় কেস", "১২৬"],
      ["পদক্ষেপের অপেক্ষায়", "১৪"],
      ["চলতি রেফারেল", "৭"],
    ],
    records: [
      [
        "CASE-26-00417",
        "আব্দুল মালেক",
        "শুনানি এবং আইনজীবীর তথ্য আপডেট",
        "সক্রিয়",
        "কেস সাপোর্ট",
      ],
      [
        "CASE-26-00420",
        "ডেমো ক্লায়েন্ট",
        "রেফারেল প্রাপ্তি স্বীকার",
        "পেন্ডিং",
        "DLAO",
      ],
      [
        "CASE-26-00422",
        "ডেমো ক্লায়েন্ট",
        "সালিশির সময়সূচী নির্ধারণ",
        "সক্রিয়",
        "মিডিয়েটর",
      ],
    ],
  },
  "tasks-follow-up": {
    title: "টাস্ক এবং ফলো-আপ",
    subtitle: "অর্পিত কাজ এবং অমীমাংসিত ফলো-আপের অনুরোধসমূহ।",
    metrics: [
      ["চলতি টাস্ক", "১৯"],
      ["আজকের মধ্যে দেয়", "৬"],
      ["ফলো-আপ", "৪"],
    ],
    records: [
      [
        "TASK-0101",
        "APP-000035",
        "নিরাপদ যোগাযোগের পদ্ধতি যাচাই করুন",
        "আজকের মধ্যে দেয়",
        "DLAO",
      ],
      [
        "TASK-0102",
        "CASE-26-00417",
        "আইনজীবীর তথ্য আপডেটের জন্য অনুরোধ করুন",
        "চলতি",
        "কেস সাপোর্ট",
      ],
      [
        "TASK-0103",
        "CASE-26-00420",
        "রেফারেল প্রাপ্তি স্বীকার পরীক্ষা করুন",
        "চলতি",
        "DLAO",
      ],
    ],
  },
  documents: {
    title: "নথিপত্র",
    subtitle: "নমুনা ফাইল এবং অমীমাংসিত নথি যাচাইসমূহ।",
    metrics: [
      ["নমুনা ফাইল", "৩৬"],
      ["যাচাইয়ের অপেক্ষায়", "৪"],
      ["অ্যাক্সেস অনুরোধ", "২"],
    ],
    records: [
      [
        "DOC-0101",
        "APP-000035",
        "পরিচয়পত্র অনুপলব্ধ",
        "পর্যালোচনা প্রয়োজন",
        "DLAO",
      ],
      [
        "DOC-0102",
        "CASE-26-00417",
        "শুনানির প্রস্তুতিমূলক নথি",
        "পেন্ডিং",
        "কেস সাপোর্ট",
      ],
      ["DOC-0103", "APP-000038", "অনুবাদিত ইনটেক সারসংক্ষেপ", "উপলব্ধ", "DLAO"],
    ],
  },
  "panel-lawyers": {
    title: "প্যানেল আইনজীবী",
    subtitle: "ডেমো প্রদানকারীর কাজের চাপ এবং বিলম্বিত তথ্য আপডেট।",
    metrics: [
      ["সক্রিয় আইনজীবী", "৩১"],
      ["নিষ্ক্রিয়তার সতর্কবার্তা", "৩"],
      ["শেষ সময়সীমা", "২"],
    ],
    records: [
      [
        "LAW-001",
        "প্যানেল আইনজীবী এ",
        "CASE-26-00417 · তথ্য আপডেট বিলম্বিত",
        "সতর্কবার্তা",
        "DLAO",
      ],
      ["LAW-002", "প্যানেল আইনজীবী বি", "৪টি সক্রিয় কেস", "সক্রিয়", "DLAO"],
      ["LAW-003", "প্যানেল আইনজীবী সি", "২টি সক্রিয় কেস", "সক্রিয়", "DLAO"],
    ],
  },
  referrals: {
    title: "রেফারেল",
    subtitle: "একই কেস রেকর্ডের সাথে সংযুক্ত ট্র্যাক করা হ্যান্ডওভারসমূহ।",
    metrics: [
      ["চলতি", "৭"],
      ["প্রাপ্তি স্বীকার পেন্ডিং", "২"],
      ["ফলো-আপ", "১"],
    ],
    records: [
      [
        "REF-0201",
        "CASE-26-00420",
        "গন্তব্য অফিসের প্রাপ্তি স্বীকার",
        "পেন্ডিং",
        "DLAO",
      ],
      [
        "REF-0202",
        "CASE-26-00424",
        "জেলা অফিস হ্যান্ডওভার",
        "প্রাপ্তি স্বীকার সম্পন্ন",
        "DLAO",
      ],
      [
        "REF-0203",
        "CASE-26-00427",
        "ফলো-আপের অনুরোধ করা হয়েছে",
        "ফলো-আপ",
        "কেস সাপোর্ট",
      ],
    ],
  },
  mediation: {
    title: "সালিশি ও মধ্যস্থতা",
    subtitle:
      "আসন্ন সেশন এবং মধ্যস্থতাকারীর সিদ্ধান্তের অপেক্ষায় থাকা অনুরোধসমূহ।",
    metrics: [
      ["সেশন", "৮"],
      ["অংশগ্রহণের অনুরোধ", "২"],
      ["পর্যালোচনার অপেক্ষায়", "১"],
    ],
    records: [
      [
        "MED-0301",
        "আব্দুল মালেক",
        "৭ অক্টোবর ২০২৬ · দুপুর ৩:০০",
        "রিমোট অনুরোধ",
        "মিডিয়েটর",
      ],
      [
        "MED-0302",
        "ডেমো অংশগ্রহণকারী",
        "৯ অক্টোবর ২০২৬ · সকাল ১১:০০",
        "নির্ধারিত",
        "মিডিয়েটর",
      ],
      [
        "MED-0303",
        "ডেমো অংশগ্রহণকারী",
        "১০ অক্টোবর ২০২৬ · দুপুর ২:০০",
        "নির্ধারিত",
        "মিডিয়েটর",
      ],
    ],
  },
};

const panelClass =
  "rounded-[20px] border border-[#d6e0f2] bg-white p-5 shadow-[0_8px_30px_rgba(19,48,92,0.055)]";

function SectionHeading({ title, subtitle, label }) {
  return (
    <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#227058]">
          DLAO / {label || "ডেমো রেকর্ড"}
        </p>

        <h1 className="mt-2 text-[28px] font-extrabold text-[#202b3e] sm:text-[32px]">
          {title}
        </h1>

        <p className="mt-1 text-sm text-[#5e6d84] sm:text-base">{subtitle}</p>
      </div>

      <a
        href="#command-centre"
        className="inline-flex items-center gap-2 rounded-xl border border-[#cddbd4] bg-white px-4 py-2.5 text-sm font-semibold text-[#0d392e] hover:bg-emerald-50"
      >
        কমান্ড সেন্টার <FiArrowRight size={14} aria-hidden="true" />
      </a>
    </div>
  );
}

export default function DlaoSections({
  active,
  tasks,
  reviews,
  audit,
  onSelect,
}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All stages");
  const [syncTime, setSyncTime] = useState("Not run in this session");
  const [aiRecord, setAiRecord] = useState("APP-000035");
  const section = demoSections[active];

  if (section) {
    const rows =
      active === "tasks-follow-up"
        ? [
            ...tasks.map((task) => [
              task.id,
              task.title,
              task.notes || "New demo task",
              "Open",
              "DLAO",
            ]),
            ...section.records,
          ]
        : section.records;
    const stages = [...new Set(rows.map((row) => row[3]))];
    const filtered = rows.filter(
      (row) =>
        (filter === "All stages" || row[3] === filter) &&
        row.join(" ").toLowerCase().includes(search.toLowerCase()),
    );
    return (
      <section id={active} className="scroll-mt-24">
        <SectionHeading title={section.title} subtitle={section.subtitle} />
        <div className="grid gap-4 sm:grid-cols-3">
          {section.metrics.map(([label, value]) => (
            <div key={label} className={panelClass}>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#607089]">
                {label}
              </p>
              <p className="mt-3 text-3xl font-extrabold">{value}</p>
            </div>
          ))}
        </div>
        <div className={`${panelClass} mt-6`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold">
              {section.title} · নমুনা রেকর্ড
            </h2>

            <span className="rounded-full bg-[#e5f6ef] px-3 py-1 text-xs font-semibold text-[#245846]">
              ফ্রন্টএন্ড ডেমো
            </span>
          </div>

          <div className="my-5 flex flex-wrap gap-3">
            <label className="flex min-w-[220px] flex-1 items-center gap-2 rounded-xl border border-slate-200 px-3">
              <FiSearch className="text-slate-400" aria-hidden="true" />

              <input
                aria-label="ডেমো রেকর্ড অনুসন্ধান করুন"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="রেকর্ড অনুসন্ধান করুন"
                className="w-full bg-transparent py-3 text-sm outline-none"
              />
            </label>

            <select
              aria-label="ধাপ অনুযায়ী ফিল্টার করুন"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
            >
              <option>সব ধাপ</option>
              {stages.map((stage) => (
                <option key={stage}>{stage}</option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] border-collapse text-left text-sm">
              <thead className="bg-[#fafbfd] text-xs uppercase tracking-wide text-[#607089]">
                <tr>
                  <th className="px-3 py-3">রেকর্ড</th>
                  <th className="px-3 py-3">নাম / রেফারেন্স</th>
                  <th className="px-3 py-3">বিস্তারিত</th>
                  <th className="px-3 py-3">ধাপ</th>
                  <th className="px-3 py-3">দায়িত্বপ্রাপ্ত</th>
                  <th className="px-3 py-3 text-right">পদক্ষেপ</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map(([id, name, reason, status, owner]) => (
                  <tr key={id} className="border-t border-[#dce5f3]">
                    <td className="px-3 py-4 font-bold">{id}</td>
                    <td className="px-3 py-4">{name}</td>
                    <td className="px-3 py-4">{reason}</td>

                    <td className="px-3 py-4">
                      <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-900">
                        {reviews.includes(id) ? "পর্যালোচিত · ডেমো" : status}
                      </span>
                    </td>

                    <td className="px-3 py-4">{owner}</td>

                    <td className="px-3 py-4 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          onSelect({
                            id,
                            name,
                            reason,
                            priority: status,
                            owner,
                            section: section.title,
                          })
                        }
                        className="rounded-lg px-3 py-2 font-bold hover:bg-emerald-50"
                      >
                        খুলুন
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <p className="py-8 text-center text-sm text-slate-500">
                অনুসন্ধানের সাথে মিলে এমন কোনো ডেমো রেকর্ড পাওয়া যায়নি।
              </p>
            )}
          </div>
        </div>
      </section>
    );
  }

  if (active === "ai-assistance")
    return (
      <section id={active}>
        <SectionHeading
          title="AI Assistance Centre"
          subtitle="Sample suggestions that always route important actions to a person."
          label="Human oversight"
        />
        <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
          <div className={panelClass}>
            <h2 className="text-lg font-bold">
              অগ্রাধিকার সুপারিশ · মানবিক পর্যালোচনা
            </h2>

            <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-7">
              উচ্চ: জরুরি অবস্থা, সীমিত অ্যাক্সেস এবং নিরাপদ যোগাযোগের
              সীমাবদ্ধতা রয়েছে। কোনো স্বয়ংক্রিয় আইনি সিদ্ধান্ত নেওয়া হয় না।
            </p>

            <label className="mt-5 block text-sm font-semibold">
              ডেমো রেকর্ড
              <select
                value={aiRecord}
                onChange={(event) => setAiRecord(event.target.value)}
                className="mt-2 block w-full rounded-xl border border-slate-200 p-3"
              >
                <option>APP-000035</option>
                <option>APP-000041</option>
                <option>APP-000038</option>
              </select>
            </label>

            <button
              type="button"
              onClick={() =>
                onSelect({
                  id: aiRecord,
                  name: "ডেমো সুপারিশ",
                  reason:
                    "কোনো পদক্ষেপ নেওয়ার আগে একজন মানব কর্মকর্তা সহায়ক রেকর্ডটি যাচাই করবেন।",
                  priority: "উচ্চ",
                  owner: "DLAO",
                  section: "এআই সহায়তা কেন্দ্র",
                })
              }
              className="mt-5 rounded-xl bg-[#0d392e] px-5 py-3 text-sm font-bold text-white"
            >
              মূল রেকর্ড পর্যালোচনা করুন
            </button>
          </div>

          <div className={panelClass}>
            <h2 className="text-lg font-bold">এজেন্ট হস্তান্তর</h2>

            <div className="mt-4 space-y-3 text-sm">
              {[
                ["ক্যাটাগরি এজেন্ট", "পরিবার / সুরক্ষা-সংক্রান্ত সমস্যা"],
                ["প্রক্রিয়া এজেন্ট", "নিরাপদ যোগাযোগের যাচাই প্রয়োজন"],
                ["অর্কেস্ট্রেটর", "DLAO মানবিক পর্যালোচনার জন্য পাঠানো হয়েছে"],
              ].map(([name, text]) => (
                <div
                  key={name}
                  className="rounded-xl border border-slate-200 p-3"
                >
                  <strong>{name}</strong>
                  <p className="mt-1 text-slate-600">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );

  if (active === "offline-sync")
    return (
      <section id={active}>
        <SectionHeading
          title="অফলাইন ও সিঙ্ক"
          subtitle="সহায়তাপ্রাপ্ত সেবা কেন্দ্রগুলোর নমুনা সিঙ্ক স্ট্যাটাস।"
        />

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ["সিঙ্ক কিউ", "স্বাভাবিক"],
            ["অপেক্ষমাণ আপলোড", "০"],
            ["ব্যর্থ নোটিফিকেশন", "০"],
          ].map(([label, value]) => (
            <div key={label} className={panelClass}>
              <p className="text-sm text-slate-500">{label}</p>
              <p className="mt-4 text-3xl font-extrabold text-[#145542]">
                {value}
              </p>
            </div>
          ))}
        </div>

        <div className={`${panelClass} mt-6`}>
          <h2 className="text-lg font-bold">সিঙ্ক সিমুলেশন</h2>

          <p className="mt-2 text-sm text-slate-600">
            সর্বশেষ ডেমো সিঙ্ক: {syncTime}।
          </p>

          <button
            type="button"
            onClick={() =>
              setSyncTime(
                new Date().toLocaleTimeString("en-BD", {
                  hour: "numeric",
                  minute: "2-digit",
                }),
              )
            }
            className="mt-5 flex items-center gap-2 rounded-xl bg-[#0d392e] px-5 py-3 text-sm font-bold text-white"
          >
            <FiRefreshCw aria-hidden="true" /> ডেমো সিঙ্ক চালান
          </button>

          <p className="mt-3 text-xs text-slate-500">
            কোনো ফাইল স্থানান্তর করা হয় না।
          </p>
        </div>
      </section>
    );

  if (active === "safety-privacy")
    return (
      <section id={active}>
        <SectionHeading
          title="নিরাপত্তা ও গোপনীয়তা"
          subtitle="কোনো তথ্য প্রকাশ বা কারও সাথে যোগাযোগের আগে মানবিক যাচাই করা হয়।"
        />

        <div className="grid gap-5 md:grid-cols-3">
          {[
            [
              "নিরাপদ যোগাযোগ",
              "যোগাযোগের পদ্ধতি যাচাই না করা পর্যন্ত কোনো সংবেদনশীল বার্তা পাঠানো হয় না।",
            ],
            [
              "অ্যাক্সেস নিয়ন্ত্রণ",
              "অন্য কোনো ব্যক্তির রেকর্ড দেখার আগে কলকারীর সেই তথ্য দেখার অধিকার যাচাই করতে হবে।",
            ],
            [
              "সংবেদনশীল প্রমাণ",
              "চিহ্নিত রেকর্ডগুলো মানবিক পর্যালোচনার কিউতে পাঠানো হয়।",
            ],
          ].map(([label, body]) => (
            <article key={label} className={panelClass}>
              <FiShield
                className="text-[#145542]"
                size={24}
                aria-hidden="true"
              />
              <h2 className="mt-5 font-bold">{label}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
            </article>
          ))}
        </div>

        <a
          href="#human-queue"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0d392e] px-5 py-3 text-sm font-bold text-white"
        >
          মানবিক পর্যালোচনা কিউ খুলুন <FiArrowRight aria-hidden="true" />
        </a>
      </section>
    );

  if (active === "audit-trail")
    return (
      <section id={active}>
        <SectionHeading
          title="অডিট ট্রেইল"
          subtitle="এই ব্রাউজার সেশনে সংঘটিত কার্যক্রম ও আপডেটের ইতিহাস।"
        />

        <div className={panelClass}>
          <h2 className="text-lg font-bold">সাম্প্রতিক কার্যক্রম</h2>

          <ol className="mt-5 divide-y divide-slate-100">
            {[
              ...audit,
              ["10:42", "REF-0201 গন্তব্য অফিসে পাঠানো হয়েছে"],
              [
                "10:21",
                "CASE-26-00417 আইনজীবীর আপডেটের জন্য চিহ্নিত করা হয়েছে",
              ],
              ["09:45", "APP-000035 মানবিক পর্যালোচনার জন্য পাঠানো হয়েছে"],
            ].map(([time, event], index) => (
              <li
                key={`${time}-${index}`}
                className="flex flex-wrap gap-3 py-4 text-sm"
              >
                <span className="w-16 shrink-0 font-semibold text-[#145542]">
                  {time}
                </span>
                <span>{event}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>
    );

  if (active === "coverage")
    return (
      <section id={active}>
        <SectionHeading
          title="২৩টি প্রয়োজনীয়তার কভারেজ"
          subtitle="প্রতিযোগিতার প্রোটোটাইপে অন্তর্ভুক্ত প্রয়োজনীয়তাগুলোর সারসংক্ষেপ।"
        />

        <div className={panelClass}>
          <div className="flex items-end gap-3">
            <strong className="text-5xl text-[#145542]">23/23</strong>
            <span className="pb-1 text-sm text-slate-600">
              ডেমোতে ম্যাপ করা হয়েছে
            </span>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["আবেদন গ্রহণ ও অ্যাক্সেস", "5"],
              ["মামলা পরিচালনা কার্যপ্রবাহ", "6"],
              ["সেবা প্রদান", "5"],
              ["নিরাপত্তা ও তদারকি", "4"],
              ["রিপোর্টিং ও অডিট", "3"],
            ].map(([label, count]) => (
              <div
                key={label}
                className="rounded-xl border border-slate-200 p-4"
              >
                <FiCheckCircle className="text-[#145542]" aria-hidden="true" />

                <p className="mt-2 font-bold">{label}</p>

                <p className="text-sm text-slate-500">
                  {count}টি প্রয়োজনীয়তা ম্যাপ করা হয়েছে
                </p>
              </div>
            ))}
          </div>

          <p className="mt-6 text-xs text-slate-500">
            এটি একটি প্রদর্শনমূলক UI ম্যাপিং; এই স্ক্রিনটি প্রোডাকশন ব্যবহারের
            প্রস্তুতি যাচাই করে না।
          </p>
        </div>
      </section>
    );

  return (
    <section id={active} className={panelClass}>
      <FiFileText size={24} aria-hidden="true" />
      <p className="mt-3">সাইডবার থেকে একটি বিভাগ নির্বাচন করুন।</p>
    </section>
  );
}
