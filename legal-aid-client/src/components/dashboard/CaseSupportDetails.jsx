"use client";

import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import { caseSupportTasks } from "./caseSupportTasks";

const tabs = [
  ["summary", "সারসংক্ষেপ"],
  ["reconstruction", "কেসের পূর্ণ বিবরণ"],
  ["timeline", "কার্যক্রমের সময়রেখা"],
  ["documents", "নথিপত্র"],
  ["tasks", "কাজের তালিকা"],
  ["versions", "সংস্করণের ইতিহাস"],
  ["actions", "পদক্ষেপ"],
];

const roles = [
  "প্রশাসনিক কর্মী",
  "ডিএলও কর্মকর্তা",
  "হেল্পলাইন কর্মী",
  "ইউডিসি উদ্যোক্তা",
  "মধ্যস্থতাকারী",
  "আইনজীবী",
];

const statuses = [
  "যাচাইয়ের অপেক্ষায়",
  "আইনজীবী নিয়োগ হয়েছে",
  "মধ্যস্থতা",
  "রেফারেল",
  "বন্ধ",
];

const initialActivity = {
  "LA-2026-00125": [
    [
      "২০ সেপ্টেম্বর ২০২৬",
      "হেল্পলাইন কর্মী",
      "আবেদন গ্রহণ",
      "ভরণপোষণ বিষয়ে প্রাথমিক তথ্য নথিভুক্ত করা হয়েছে।",
    ],
    [
      "২১ সেপ্টেম্বর ২০২৬",
      "ইউডিসি উদ্যোক্তা",
      "সহায়তাপ্রাপ্ত আবেদন",
      "আবেদনকারীর তথ্য কেস রেকর্ডে যুক্ত করা হয়েছে।",
    ],
    [
      "২৪ সেপ্টেম্বর ২০২৬",
      "আইনজীবী",
      "দায়িত্ব গ্রহণ",
      "প্যানেল আইনজীবী দায়িত্ব গ্রহণ করেছেন।",
    ],
  ],
  "LA-2026-00126": [
    [
      "২১ সেপ্টেম্বর ২০২৬",
      "ইউডিসি উদ্যোক্তা",
      "আবেদন গ্রহণ",
      "ইউডিসির মাধ্যমে আবেদন জমা হয়েছে।",
    ],
  ],
  "LA-2026-00127": [
    [
      "১৮ সেপ্টেম্বর ২০২৬",
      "ইউডিসি উদ্যোক্তা",
      "আবেদন গ্রহণ",
      "সহায়তাপ্রাপ্ত আবেদন কেসের সঙ্গে যুক্ত হয়েছে।",
    ],
    [
      "২২ সেপ্টেম্বর ২০২৬",
      "মধ্যস্থতাকারী",
      "মধ্যস্থতার সময় নির্ধারণ",
      "নিরাপদ ও স্বেচ্ছামূলক মধ্যস্থতা প্রক্রিয়া শুরু হয়েছে।",
    ],
  ],
  "LA-2026-00128": [
    [
      "১৯ সেপ্টেম্বর ২০২৬",
      "হেল্পলাইন কর্মী",
      "জরুরি আবেদন গ্রহণ",
      "জরুরি মানবিক ফলো-আপ প্রয়োজন।",
    ],
    [
      "২০ সেপ্টেম্বর ২০২৬",
      "ডিএলও কর্মকর্তা",
      "রেফারেল পাঠানো",
      "রেফারেল গ্রহণের নিশ্চয়তা চাওয়া হয়েছে।",
    ],
  ],
};

function today() {
  return new Date().toLocaleDateString("bn-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function initialRecord(item) {
  return {
    ...item,
    lawyer:
      item.id === "LA-2026-00125"
        ? "অ্যাডভোকেট রহমান"
        : item.id === "LA-2026-00127"
          ? "অ্যাডভোকেট অং"
          : "",
    office: item.id === "LA-2026-00127" ? "খাগড়াছড়ি ডিএলও" : "জয়পুরহাট ডিএলও",
    created: item.updated,
    documents:
      item.id === "LA-2026-00125"
        ? [
            ["হেল্পলাইন নোট", "আবেদন গ্রহণ", "১৬৬৯৯", "২০ সেপ্টেম্বর ২০২৬"],
            [
              "সহায়তাপ্রাপ্ত আবেদন",
              "আবেদনপত্র",
              "ইউডিসি",
              "২১ সেপ্টেম্বর ২০২৬",
            ],
          ]
        : item.id === "LA-2026-00127"
          ? [
              [
                "মধ্যস্থতার রেকর্ড",
                "মধ্যস্থতা",
                "মধ্যস্থতাকারী",
                "২৩ সেপ্টেম্বর ২০২৬",
              ],
            ]
          : [],
    tasks: item.tasks || caseSupportTasks[item.id] || [],
    events: initialActivity[item.id] || [],
  };
}

const inputClass =
  "mt-2 w-full rounded-xl border border-[#d6e0f2] bg-white px-3 py-2.5 outline-none focus:border-emerald-700";
const buttonClass =
  "rounded-xl bg-[#0d392e] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#175341]";

export default function CaseSupportDetails({ item, onClose, onUpdate }) {
  const [tab, setTab] = useState("summary");
  const [record, setRecord] = useState(() => initialRecord(item));
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`case-support:${item.id}`);
      if (saved) setRecord(JSON.parse(saved));
    } catch {
      // The initial demo record remains available if storage is unavailable.
    }
  }, [item.id]);

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  function saveRecord(next, notice) {
    setRecord(next);
    onUpdate?.(next);

    try {
      localStorage.setItem(`case-support:${item.id}`, JSON.stringify(next));
    } catch {
      // Changes still work for the current session.
    }

    setMessage(notice);
  }

  function addEvent(recordToUpdate, role, action, detail) {
    return {
      ...recordToUpdate,
      updated: today(),
      events: [...recordToUpdate.events, [today(), role, action, detail]],
    };
  }

  function addDocument(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const type = String(form.get("type") || "").trim();

    if (!name || !type) return;

    const next = addEvent(
      {
        ...record,
        documents: [
          ...record.documents,
          [name, type, "প্রশাসনিক কর্মী", today()],
        ],
      },
      "প্রশাসনিক কর্মী",
      "নথির রেফারেন্স যুক্ত",
      name,
    );

    saveRecord(next, "নথির রেফারেন্স যুক্ত হয়েছে।");
    event.currentTarget.reset();
  }

  function addTask(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const due = String(form.get("due") || "");

    if (!name || !due) return;

    const next = addEvent(
      {
        ...record,
        tasks: [
          ...record.tasks,
          {
            id: `T-${Date.now()}`,
            name,
            due,
            status: "অপেক্ষমাণ",
          },
        ],
      },
      "প্রশাসনিক কর্মী",
      "নতুন কাজ যুক্ত",
      name,
    );

    saveRecord(next, "কাজটি কেস রেকর্ডে যুক্ত হয়েছে।");
    event.currentTarget.reset();
  }

  function completeTask(taskId) {
    const task = record.tasks.find((entry) => entry.id === taskId);
    if (!task || task.status === "সম্পন্ন") return;

    const next = addEvent(
      {
        ...record,
        tasks: record.tasks.map((entry) =>
          entry.id === taskId ? { ...entry, status: "সম্পন্ন" } : entry,
        ),
      },
      "প্রশাসনিক কর্মী",
      "কাজ সম্পন্ন",
      task.name,
    );

    saveRecord(next, "কাজটি সম্পন্ন হয়েছে এবং ইতিহাসে যুক্ত হয়েছে।");
  }

  function updateStatus(event) {
    event.preventDefault();
    const nextStatus = String(new FormData(event.currentTarget).get("status"));

    if (nextStatus === record.status) {
      setMessage("কেসটি ইতোমধ্যে এই অবস্থায় আছে।");
      return;
    }

    const next = addEvent(
      { ...record, status: nextStatus },
      "প্রশাসনিক কর্মী",
      "কেসের অবস্থা পরিবর্তন",
      `নতুন অবস্থা: ${nextStatus}`,
    );

    saveRecord(next, "কেসের অবস্থা পরিবর্তন হয়েছে।");
  }

  function submitEvent(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const role = String(form.get("role") || "");
    const action = String(form.get("action") || "").trim();
    const detail = String(form.get("detail") || "").trim();

    if (!action || !detail) return;

    saveRecord(
      addEvent(record, role, action, detail),
      "কার্যক্রমটি কেসের ইতিহাসে যুক্ত হয়েছে।",
    );
    event.currentTarget.reset();
    setTab("timeline");
  }

  return (
    <div className="fixed inset-0 z-[70] bg-slate-950/55 p-3 sm:p-8">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="case-support-title"
        className="mx-auto flex max-h-full w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white text-[#202b3e] shadow-2xl"
      >
        <div className="shrink-0 border-b border-[#d6e0f2] bg-white px-5 pt-5 sm:px-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-emerald-800">{record.id}</p>
              <h2 id="case-support-title" className="mt-1 text-xl font-bold">
                {record.applicant}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                {record.status} · {record.priority} অগ্রাধিকার · {record.office}
              </p>
            </div>
            <button
              type="button"
              aria-label="বন্ধ করুন"
              onClick={onClose}
              className="rounded-lg border border-[#d6e0f2] p-2 hover:bg-slate-50"
            >
              <FiX aria-hidden="true" />
            </button>
          </div>

          <div
            role="tablist"
            aria-label="কেসের বিভাগ"
            className="mt-5 flex gap-1 overflow-x-auto"
          >
            {tabs.map(([id, label]) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={tab === id}
                onClick={() => {
                  setTab(id);
                  setMessage("");
                }}
                className={`shrink-0 border-b-2 px-3 py-3 text-sm font-bold ${
                  tab === id
                    ? "border-emerald-700 text-emerald-800"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-y-auto p-5 sm:p-7">
          {message && (
            <p
              role="status"
              className="mb-5 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-900"
            >
              {message}
            </p>
          )}

          {tab === "summary" && (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  ["আবেদনকারী", record.applicant],
                  ["কেসের বিষয়", record.type],
                  ["আবেদনের উৎস", record.source],
                  ["প্যানেল আইনজীবী", record.lawyer || "নিয়োগ হয়নি"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-xl border border-[#d6e0f2] p-4"
                  >
                    <p className="text-xs font-bold text-slate-500">{label}</p>
                    <p className="mt-3 font-bold">{value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-xl border border-[#d6e0f2] p-5">
                <h3 className="font-bold">বর্তমান কেস রেকর্ড</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  তৈরি: {record.created} · সর্বশেষ আপডেট: {record.updated}। নথি,
                  কাজ ও বিভিন্ন ভূমিকার কার্যক্রম এই কেস আইডির অধীনে সংযুক্ত
                  আছে।
                </p>
              </div>
            </>
          )}

          {tab === "reconstruction" && (
            <div className="space-y-5">
              <div className="rounded-xl bg-[#0d392e] p-5 text-white">
                <p className="text-xs font-bold text-emerald-200">
                  কেসের পূর্ণ বিবরণ
                </p>
                <h3 className="mt-2 text-2xl font-bold">{record.id}</h3>
                <p className="mt-2 text-sm text-emerald-50">
                  আবেদন গ্রহণ থেকে বর্তমান অবস্থা পর্যন্ত সংযুক্ত কার্যক্রম।
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  ["রেকর্ড তৈরি", record.created],
                  ["বর্তমান অবস্থা", record.status],
                  ["সর্বশেষ আপডেট", record.updated],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-xl border border-[#d6e0f2] p-4"
                  >
                    <p className="text-sm text-slate-500">{label}</p>
                    <p className="mt-2 font-bold">{value}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-xl border border-[#d6e0f2] p-5">
                <h3 className="mb-4 font-bold">সংযুক্ত কার্যক্রম</h3>
                <div className="space-y-4">
                  {record.events.map(([date, role, action, detail], index) => (
                    <div
                      key={index}
                      className="border-b border-[#d6e0f2] pb-4 last:border-0"
                    >
                      <p className="font-bold">
                        {index + 1}. {action}
                      </p>
                      <p className="mt-1 text-sm">{detail}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {date} · {role}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === "timeline" && (
            <div className="space-y-5">
              {record.events.map(([date, role, action, detail], index) => (
                <div key={index} className="border-l-2 border-emerald-700 pl-5">
                  <p className="text-xs text-slate-500">
                    {date} · {role}
                  </p>
                  <h3 className="mt-1 font-bold">{action}</h3>
                  <p className="mt-1 text-sm text-slate-600">{detail}</p>
                </div>
              ))}
            </div>
          )}

          {tab === "documents" && (
            <div>
              <form
                onSubmit={addDocument}
                className="flex flex-wrap items-end gap-3"
              >
                <label className="min-w-48 flex-1 text-sm font-semibold">
                  নথি বা রেফারেন্সের নাম
                  <input required name="name" className={inputClass} />
                </label>
                <label className="min-w-40 flex-1 text-sm font-semibold">
                  ধরন
                  <input required name="type" className={inputClass} />
                </label>
                <button className={buttonClass}>রেফারেন্স যুক্ত করুন</button>
              </form>

              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[560px] text-left text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      {["নাম", "ধরন", "উৎস", "তারিখ"].map((label) => (
                        <th key={label} className="px-4 py-3">
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#d6e0f2]">
                    {record.documents.map(
                      ([name, type, source, date], index) => (
                        <tr key={index}>
                          {[name, type, source, date].map((value, cell) => (
                            <td key={cell} className="px-4 py-3">
                              {value}
                            </td>
                          ))}
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
                {record.documents.length === 0 && (
                  <p className="p-6 text-center text-slate-500">
                    এখনো কোনো নথি যুক্ত হয়নি।
                  </p>
                )}
              </div>
            </div>
          )}

          {tab === "tasks" && (
            <div className="space-y-5">
              <form
                onSubmit={addTask}
                className="flex flex-wrap items-end gap-3"
              >
                <label className="min-w-48 flex-1 text-sm font-semibold">
                  কাজের নাম
                  <input required name="name" className={inputClass} />
                </label>
                <label className="min-w-40 text-sm font-semibold">
                  শেষ তারিখ
                  <input
                    required
                    type="date"
                    name="due"
                    className={inputClass}
                  />
                </label>
                <button className={buttonClass}>কাজ যুক্ত করুন</button>
              </form>

              {record.tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#d6e0f2] p-4"
                >
                  <div>
                    <h3 className="font-bold">{task.name}</h3>
                    <p className="mt-1 text-xs text-slate-500">
                      শেষ তারিখ: {task.due} · {task.status}
                    </p>
                  </div>
                  {task.status !== "সম্পন্ন" && (
                    <button
                      type="button"
                      onClick={() => completeTask(task.id)}
                      className={buttonClass}
                    >
                      সম্পন্ন করুন
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {tab === "versions" && (
            <div className="space-y-3">
              {record.events.map(([date, role, action, detail], index) => (
                <div
                  key={index}
                  className="flex gap-4 rounded-xl border border-[#d6e0f2] p-4"
                >
                  <strong className="text-emerald-800">v{index + 1}</strong>
                  <div>
                    <h3 className="font-bold">{action}</h3>
                    <p className="mt-1 text-sm text-slate-600">{detail}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {date} · {role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "actions" && (
            <div className="grid gap-5 lg:grid-cols-2">
              <form
                onSubmit={updateStatus}
                className="rounded-xl border border-[#d6e0f2] p-5"
              >
                <h3 className="font-bold">কেসের অবস্থা পরিবর্তন</h3>
                <label className="mt-4 block text-sm font-semibold">
                  অবস্থা
                  <select
                    name="status"
                    defaultValue={record.status}
                    key={record.status}
                    className={inputClass}
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>
                <button className={`${buttonClass} mt-4`}>
                  অবস্থা সংরক্ষণ
                </button>
              </form>

              <form
                onSubmit={submitEvent}
                className="rounded-xl border border-[#d6e0f2] p-5"
              >
                <h3 className="font-bold">ভূমিকা অনুযায়ী কার্যক্রম যুক্ত</h3>
                <select name="role" className={`${inputClass} mt-4`}>
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
                <input
                  required
                  name="action"
                  placeholder="কার্যক্রমের নাম"
                  className={inputClass}
                />
                <textarea
                  required
                  name="detail"
                  rows={3}
                  placeholder="বিস্তারিত লিখুন"
                  className={inputClass}
                />
                <button className={`${buttonClass} mt-4`}>
                  কার্যক্রম যুক্ত করুন
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
