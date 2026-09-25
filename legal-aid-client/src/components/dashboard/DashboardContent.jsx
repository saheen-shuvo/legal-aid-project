"use client";

import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import DlaoSections from "./DlaoSections";

const sectionIds = new Set([
  "command-centre",
  "applications",
  "case",
  "human-queue",
  "case-records",
  "tasks-follow-up",
  "ai-assistance",
  "documents",
  "panel-lawyers",
  "referrals",
  "mediation",
  "offline-sync",
  "safety-privacy",
  "audit-trail",
]);

const statCards = [
  { label: "নতুন আবেদন", value: "১৮", note: "আজ ৬টি পর্যালোচনা প্রয়োজন" },
  { label: "মানবিক পর্যালোচনা", value: "১১", note: "৩টি জরুরি" },
  { label: "সক্রিয় মামলা", value: "১২৬", note: "১৪টি পদক্ষেপের অপেক্ষায়" },
  { label: "রেফারেল", value: "৭", note: "২টি গ্রহণের নিশ্চিতকরণের অপেক্ষায়" },
  {
    label: "আইনজীবীর সতর্কতা",
    value: "৫",
    note: "৩টি নিষ্ক্রিয়তা / ২টি সময়সীমা",
  },
  {
    label: "নিরাপত্তা সতর্কতা",
    value: "৩",
    note: "মানবিক পর্যালোচনা প্রয়োজন",
  },
];

const sampleQueue = [
  {
    id: "APP-000035",
    name: "ময়ূরী / রিপন",
    reason: "নিরাপদ যোগাযোগ + অসম্পূর্ণ পরিচয়",
    owner: "DLAO",
    priority: "URGENT",
  },
  {
    id: "APP-000041",
    name: "নাবিলা",
    reason: "নিরাপত্তা সংকেত + সংবেদনশীল প্রমাণ",
    owner: "DLAO",
    priority: "URGENT",
  },
  {
    id: "APP-000038",
    name: "নুচিং মারমা",
    reason: "সহায়তাপ্রাপ্ত আবেদন গ্রহণ + অনুবাদ",
    owner: "DLAO",
    priority: "HIGH",
  },
  {
    id: "CASE-26-00417",
    name: "আব্দুল মালেক",
    reason: "আইনজীবীর আপডেট নির্ধারিত সময়ের পরও বাকি",
    owner: "Case Support",
    priority: "HIGH",
  },
  {
    id: "APP-000043",
    name: "ডেমো আবেদনকারী",
    reason: "অনুপস্থিত নথির ফলো-আপ প্রয়োজন",
    owner: "DLAO",
    priority: "NORMAL",
  },
  {
    id: "CASE-26-00420",
    name: "ডেমো মামলা",
    reason: "রেফারেল গ্রহণের নিশ্চিতকরণ অপেক্ষমাণ",
    owner: "Case Support",
    priority: "NORMAL",
  },
];

const workloads = [
  ["প্যানেল আইনজীবী", "৩১ জন সক্রিয়"],
  ["মধ্যস্থতাকারী", "৮ জন সক্রিয়"],
  ["রেফারেল", "৭টি সক্রিয়"],
  ["মামলা সহায়তা", "১৯টি কাজ"],
];

function ReviewDialog({ selected, onClose, onSubmit, message }) {
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center p-4">
      <button
        type="button"
        aria-label="পর্যালোচনা বন্ধ করুন"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/55"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-dialog-title"
        className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
      >
        <button
          type="button"
          aria-label="পর্যালোচনা বন্ধ করুন"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-2 text-slate-600 hover:bg-slate-100"
        >
          <FiX aria-hidden="true" />
        </button>

        <h2 id="review-dialog-title" className="pr-8 text-xl font-bold">
          {selected.section || "মানবিক পর্যালোচনা"} · {selected.id}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          {selected.name} · {selected.owner}
        </p>

        <div className="mt-5 rounded-xl border border-[#d6e0f2] bg-[#f8faff] p-4 text-sm leading-6">
          <p>
            <strong>কারণ:</strong> {selected.reason}
          </p>

          <p className="mt-2">
            <strong>অগ্রাধিকার / ধাপ:</strong> {selected.priority}
          </p>
        </div>

        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <label className="block text-sm font-semibold">
            ডেমো পর্যালোচনার নোট
            <textarea
              required
              name="notes"
              rows={3}
              placeholder="একটি সংক্ষিপ্ত নোট লিখুন"
              className="mt-2 w-full resize-none rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-emerald-700"
            />
          </label>

          <button
            type="submit"
            className="rounded-xl bg-[#0d392e] px-5 py-3 text-sm font-bold text-white"
          >
            ডেমো আপডেট রেকর্ড করুন
          </button>

          {message && (
            <p
              role="status"
              className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-900"
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default function DashboardContent({ role, roleConfig }) {
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState(null);
  const [reviewed, setReviewed] = useState([]);
  const [message, setMessage] = useState("");
  const [active, setActive] = useState("command-centre");
  const [tasks, setTasks] = useState([]);
  const [audit, setAudit] = useState([]);
  const queue = expanded ? sampleQueue : sampleQueue.slice(0, 4);

  useEffect(() => {
    if (role !== "dlao") return;
    const update = () => {
      const requested = window.location.hash.slice(1);
      setActive(sectionIds.has(requested) ? requested : "command-centre");
      window.scrollTo({ top: 0, behavior: "auto" });
    };
    update();
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, [role]);

  useEffect(() => {
    if (role !== "dlao") return;
    const addDemoTask = (event) => {
      const title = event.detail?.title;
      if (!title) return;
      setTasks((items) => [
        {
          id: `TASK-DEMO-${items.length + 1}`,
          title,
          notes: event.detail?.notes || "",
        },
        ...items,
      ]);
      setAudit((items) => [["Now", `Demo task created: ${title}`], ...items]);
    };
    window.addEventListener("dlao-demo-task", addDemoTask);
    return () => window.removeEventListener("dlao-demo-task", addDemoTask);
  }, [role]);

  useEffect(() => {
    if (!selected) return;
    const close = (event) => {
      if (event.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [selected]);

  function submitReview(event) {
    event.preventDefault();
    const recordId = selected.id;
    setReviewed((items) =>
      items.includes(recordId) ? items : [...items, recordId],
    );
    setAudit((items) => [
      ["Now", `Demo review noted for ${recordId}`],
      ...items,
    ]);
    setMessage(
      "Demo review noted locally. No official decision has been recorded.",
    );
  }

  if (role !== "dlao") {
    return (
      <section
        id="command-centre"
        className="rounded-2xl bg-white p-8 shadow-sm"
      >
        <h1 className="text-3xl font-bold">{roleConfig.title}</h1>
        <p className="mt-2 text-slate-600">{roleConfig.description}</p>
        <p className="mt-8 text-sm text-slate-500">
          This role’s demo dashboard will be added in a later step.
        </p>
      </section>
    );
  }

  if (active !== "command-centre") {
    return (
      <>
        <DlaoSections
          key={active}
          active={active}
          tasks={tasks}
          reviews={reviewed}
          audit={audit}
          onSelect={(record) => {
            setSelected(record);
            setMessage("");
          }}
        />
        {selected && (
          <ReviewDialog
            selected={selected}
            onClose={() => setSelected(null)}
            onSubmit={submitReview}
            message={message}
          />
        )}
      </>
    );
  }

  return (
    <div id="command-centre" className="scroll-mt-24">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-extrabold leading-tight tracking-tight text-[#202b3e] sm:text-[32px]">
            DLAO কমান্ড সেন্টার
          </h1>

          <p className="mt-1 text-sm text-[#5e6d84] sm:text-base">
            আবেদন, মামলা, মানবিক সিদ্ধান্ত, সেবা প্রদানকারীর কার্যক্রম এবং
            ঝুঁকির একটি সমন্বিত কার্যক্রমের চিত্র।
          </p>
        </div>

        <a
          href="#human-queue"
          className="rounded-xl bg-[#0d392e] px-5 py-3 text-sm font-bold text-white hover:bg-[#175341]"
        >
          মানবিক পর্যালোচনা কিউ খুলুন
        </a>
      </div>

      <section
        aria-label="DLAO পরিসংখ্যান"
        className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6"
      >
        {statCards.map((card) => (
          <div
            key={card.label}
            className="min-h-[156px] rounded-[19px] border border-[#d6e0f2] bg-white px-5 py-5 shadow-[0_8px_30px_rgba(19,48,92,0.055)]"
          >
            <p className="text-[13px] font-semibold tracking-[0.055em] text-[#607089]">
              {card.label}
            </p>

            <p className="mt-3 text-4xl font-extrabold leading-none text-[#202b3e]">
              {card.value}
            </p>

            <p className="mt-2 text-[13px] font-medium leading-5 text-[#265b49]">
              {card.note}
            </p>
          </div>
        ))}
      </section>

      <div className="mt-7 grid gap-5 xl:grid-cols-[minmax(0,1.53fr)_minmax(0,1fr)]">
        <section
          id="applications"
          className="min-w-0 scroll-mt-28 rounded-[20px] border border-[#d6e0f2] bg-white p-5 shadow-[0_8px_30px_rgba(19,48,92,0.055)] sm:p-[22px]"
        >
          <div
            id="human-queue"
            className="flex scroll-mt-28 items-center justify-between gap-2"
          >
            <h2 className="text-[17px] font-extrabold">
              আজকের মানবিক কার্যক্রমের কিউ
            </h2>

            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              className="shrink-0 rounded-lg px-2 py-1 text-sm font-bold text-[#111827] hover:bg-slate-100"
            >
              {expanded ? "কম দেখুন" : "সব দেখুন"}
            </button>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[690px] border-collapse text-left text-[14px]">
              <thead className="bg-[#fafbfd] text-[12px] font-bold uppercase tracking-[0.035em] text-[#607089]">
                <tr>
                  <th scope="col" className="px-3 py-3">
                    অগ্রাধিকার
                  </th>
                  <th scope="col" className="px-3 py-3">
                    রেকর্ড
                  </th>
                  <th scope="col" className="px-3 py-3">
                    কারণ
                  </th>
                  <th scope="col" className="px-3 py-3">
                    দায়িত্বপ্রাপ্ত
                  </th>
                  <th scope="col" className="px-3 py-3 text-right">
                    পদক্ষেপ
                  </th>
                </tr>
              </thead>

              <tbody>
                {queue.map((item) => (
                  <tr key={item.id} className="border-t border-[#dce5f3]">
                    <td className="px-3 py-3">
                      <span
                        className={`inline-block rounded-full px-2 py-1 text-[11px] font-bold ${
                          item.priority === "URGENT"
                            ? "bg-[#ffe8e7] text-[#ad493e]"
                            : item.priority === "HIGH"
                              ? "bg-[#fff2d5] text-[#82601b]"
                              : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {item.priority === "URGENT"
                          ? "জরুরি"
                          : item.priority === "HIGH"
                            ? "উচ্চ"
                            : item.priority}
                      </span>
                    </td>

                    <td className="px-3 py-3">
                      <span className="block font-bold text-[#263247]">
                        {item.id}
                      </span>
                      <span className="block text-xs text-[#61718b]">
                        {item.name}
                      </span>
                    </td>

                    <td className="px-3 py-3 text-[#263247]">{item.reason}</td>

                    <td className="px-3 py-3 text-[#263247]">{item.owner}</td>

                    <td className="px-3 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setMessage("");
                          setSelected(item);
                        }}
                        className="rounded-lg px-3 py-2 font-bold text-slate-900 hover:bg-[#eaf6f0] hover:text-emerald-900"
                      >
                        {reviewed.includes(item.id)
                          ? "পর্যালোচিত"
                          : "পর্যালোচনা করুন"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="min-w-0 rounded-[20px] border border-[#d6e0f2] bg-white p-5 shadow-[0_8px_30px_rgba(19,48,92,0.055)] sm:p-[22px]">
          <h2 className="text-[17px] font-extrabold">
            অগ্রাধিকার সুপারিশ — মানবিক পর্যালোচনা
          </h2>

          <div className="mt-4 rounded-xl border border-[#eed391] bg-[#fffbee] p-4">
            <h3 className="text-[18px] font-extrabold">এআই সুপারিশ: উচ্চ</h3>

            <p className="mt-1 text-[13px] leading-6">
              সংকেত: জরুরি অবস্থা + অ্যাক্সেসে বাধা + সংবেদনশীল যোগাযোগের
              সীমাবদ্ধতা। কোনো স্বয়ংক্রিয় আইনি সিদ্ধান্ত নেওয়া হয় না।
            </p>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              ["ক্যাটাগরি এজেন্ট", "পরিবার / সুরক্ষা-সংক্রান্ত সমস্যা"],
              ["প্রক্রিয়া এজেন্ট", "নিরাপদ যোগাযোগের যাচাই প্রয়োজন"],
              ["অর্কেস্ট্রেটর", "DLAO মানবিক পর্যালোচনার জন্য পাঠানো হয়েছে"],
            ].map(([label, text]) => (
              <div
                key={label}
                className="min-h-[114px] rounded-xl border border-[#d6e0f2] p-3.5"
              >
                <h3 className="text-sm font-bold">{label}</h3>

                <p className="mt-1 text-[13px] leading-[1.4] text-[#66758b]">
                  {text}
                </p>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              setMessage("");
              setSelected(sampleQueue[0]);
            }}
            className="mt-6 rounded-xl bg-[#0d392e] px-5 py-3 text-sm font-bold text-white hover:bg-[#175341]"
          >
            মানবিক পর্যালোচনা রেকর্ড করুন
          </button>
        </section>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-3">
        <section className="rounded-[20px] border border-[#d6e0f2] bg-white p-5 shadow-[0_8px_30px_rgba(19,48,92,0.055)]">
          <h2 className="text-[17px] font-extrabold">
            ব্যাকলগের অপেক্ষার সময়
          </h2>

          <p className="mt-1 text-[13px] text-[#607089]">
            অপেক্ষার সময় অনুযায়ী আবেদনসমূহ
          </p>

          <div className="mt-5 space-y-3.5">
            {[
              ["০–২ দিন", 42, "80%"],
              ["৩–৭ দিন", 21, "45%"],
              ["৮+ দিন", 7, "20%"],
            ].map(([label, count, width]) => (
              <div key={label}>
                <div className="flex justify-between text-[13px]">
                  <span>{label}</span>
                  <strong>{count}</strong>
                </div>

                <div className="mt-1 h-2 rounded-full bg-[#e9efed]">
                  <div
                    style={{ width }}
                    className="h-full rounded-full bg-[#145542]"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[20px] border border-[#d6e0f2] bg-white p-5 shadow-[0_8px_30px_rgba(19,48,92,0.055)]">
          <h2 className="text-[17px] font-extrabold">
            সেবা প্রদানকারীর কাজের চাপ
          </h2>

          <div className="mt-6 space-y-4">
            {workloads.map(([label, count]) => (
              <div
                key={label}
                className="flex justify-between gap-2 text-[13px]"
              >
                <span>{label}</span>
                <strong>{count}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[20px] border border-[#d6e0f2] bg-white p-5 shadow-[0_8px_30px_rgba(19,48,92,0.055)]">
          <h2 className="text-[17px] font-extrabold">সিস্টেমের অবস্থা</h2>

          <div className="mt-6 space-y-4 text-[13px]">
            <div className="flex justify-between gap-2">
              <span>সিঙ্ক কিউ</span>
              <strong className="rounded-full bg-[#e5f6ef] px-2.5 py-1 text-xs text-[#245846]">
                স্বাভাবিক
              </strong>
            </div>

            <div className="flex justify-between gap-2">
              <span>অডিট ইভেন্ট</span>
              <strong>১,২৮৪</strong>
            </div>

            <div className="flex justify-between gap-2">
              <span>এআই আত্মবিশ্বাস-সংক্রান্ত ব্যতিক্রম</span>
              <strong className="rounded-full bg-[#fff2d5] px-2.5 py-1 text-xs text-[#82601b]">
                ৪
              </strong>
            </div>

            <div className="flex justify-between gap-2">
              <span>ব্যর্থ নোটিফিকেশন</span>
              <strong className="rounded-full bg-[#e5f6ef] px-2.5 py-1 text-xs text-[#245846]">
                ০
              </strong>
            </div>
          </div>
        </section>
      </div>

      {selected && (
        <ReviewDialog
          selected={selected}
          onClose={() => setSelected(null)}
          onSubmit={submitReview}
          message={message}
        />
      )}
    </div>
  );
}
