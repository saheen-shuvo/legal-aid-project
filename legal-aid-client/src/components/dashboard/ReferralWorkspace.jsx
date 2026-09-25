"use client";

import { useState } from "react";

const tabs = [
  "প্রাপ্ত রেফারেল",
  "প্রেরিত রেফারেল",
  "ফলো-আপ",
  "সেবাপ্রার্থীর অবস্থা",
  "প্রতিবেদন",
  "অডিট",
];
const box = "rounded-2xl border border-[#d6e0f2] bg-white p-5 shadow-sm";
const input =
  "rounded-xl border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-emerald-700";
const btn =
  "rounded-xl bg-[#0d392e] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#155442]";
const alt =
  "rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold hover:bg-slate-50";
const th = "px-3 py-3 text-left text-xs font-semibold text-slate-600";
const td = "px-3 py-4 text-sm align-top";
const now = () => new Date().toISOString();
const ago = (h) => new Date(Date.now() - h * 3600000).toISOString();
const date = (s) =>
  s
    ? new Date(s).toLocaleString("bn-BD", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "—";
const statuses = {
  New: "নতুন",
  Acknowledged: "প্রাপ্তি স্বীকৃত",
  Accepted: "গ্রহণ করা হয়েছে",
  "Action In Progress": "কার্যক্রম চলছে",
  Returned: "ফেরত পাঠানো হয়েছে",
  Completed: "সম্পন্ন",
};
const priorities = {
  Urgent: "জরুরি",
  High: "উচ্চ",
  Medium: "মাঝারি",
  Low: "সাধারণ",
};

const seed = [
  {
    id: "REF-2026-00017",
    caseId: "LA-2026-00125",
    applicant: "ময়ূরী আক্তার",
    type: "পারিবারিক / ভরণপোষণ",
    priority: "High",
    from: "DLAO ঢাকা",
    to: "DLAO জয়পুরহাট",
    sentAt: ago(4),
    acknowledgedAt: null,
    acceptedAt: null,
    status: "New",
    reason: "আবেদনকারীর জন্য প্রাপক জেলায় সেবা প্রয়োজন।",
    history: "১৬৬৯৯-এ যোগাযোগ → আবেদন → DLAO পর্যালোচনা → রেফারেল",
    expected: "প্রাপ্তি স্বীকার এবং প্রয়োজনীয় ফলো-আপ যাচাই।",
    responsible: "প্রাপক DLAO কর্মকর্তা",
    docs: [
      { name: "আবেদন", required: true, received: true },
      { name: "রেফারেল নোট", required: true, received: true },
      { name: "পূর্ববর্তী আদেশ", required: false, received: false },
    ],
  },
  {
    id: "REF-2026-00018",
    caseId: "LA-2026-00127",
    applicant: "নুচিং মারমা",
    type: "ভূমি / প্রবেশাধিকার",
    priority: "High",
    from: "পার্বত্য জেলা DLAO",
    to: "DLAO জয়পুরহাট",
    sentAt: ago(30),
    acknowledgedAt: ago(10),
    acceptedAt: null,
    status: "Acknowledged",
    reason: "প্রাপক দপ্তরের মাধ্যমে কেস-সংযুক্ত সহায়তা প্রয়োজন।",
    history: "ইউডিসি সহায়তায় আবেদন গ্রহণ; আবেদনকারীর সম্মতি নথিভুক্ত।",
    expected: "প্যাকেজ দেখে গ্রহণ বা সংশোধনের জন্য ফেরত পাঠান।",
    responsible: "প্রাপক DLAO কর্মকর্তা",
    docs: [
      { name: "রেফারেল ফর্ম", required: true, received: true },
      { name: "আবেদনকারীর বিবৃতি", required: true, received: true },
    ],
  },
  {
    id: "REF-2026-00019",
    caseId: "LA-2026-00128",
    applicant: "রিনা বেগম",
    type: "পারিবারিক",
    priority: "Urgent",
    from: "DLAO রংপুর",
    to: "DLAO জয়পুরহাট",
    sentAt: ago(40),
    acknowledgedAt: null,
    acceptedAt: null,
    status: "New",
    reason: "জরুরি আন্তজেলা সহায়তার অনুরোধ।",
    history:
      "প্রাথমিক আবেদন নেওয়া হয়েছে; জরুরি চিহ্ন দিয়ে রেফারেল পাঠানো হয়েছে।",
    expected: "দ্রুত প্রাপ্তি স্বীকার করে প্যাকেজ পর্যালোচনা।",
    responsible: "প্রাপক DLAO কর্মকর্তা",
    docs: [
      { name: "রেফারেল ফর্ম", required: true, received: true },
      { name: "জরুরি নোট", required: true, received: true },
    ],
  },
  {
    id: "REF-2026-00020",
    caseId: "LA-2026-00130",
    applicant: "করিম মিয়া",
    type: "শ্রম",
    priority: "Medium",
    from: "DLAO ঢাকা",
    to: "DLAO জয়পুরহাট",
    sentAt: ago(72),
    acknowledgedAt: ago(70),
    acceptedAt: null,
    status: "Returned",
    reason: "গ্রহণের আগে ব্যাখ্যা প্রয়োজন।",
    history: "কাজসংক্রান্ত একটি নথি অনুপস্থিত বলে চিহ্নিত হয়েছে।",
    expected: "প্রেরক দপ্তর অনুপস্থিত নথি প্রদান করবে।",
    responsible: "প্রেরক DLAO কর্মকর্তা",
    docs: [
      { name: "রেফারেল ফর্ম", required: true, received: true },
      { name: "কাজের নথি", required: true, received: false },
    ],
  },
  {
    id: "REF-2026-00021",
    caseId: "LA-2026-00132",
    applicant: "সাবিনা খাতুন",
    type: "দেওয়ানি",
    priority: "Medium",
    from: "DLAO জয়পুরহাট",
    to: "DLAO বগুড়া",
    sentAt: ago(26),
    acknowledgedAt: null,
    acceptedAt: null,
    status: "New",
    reason: "প্রাপক জেলায় শুনানি সংক্রান্ত সহায়তা প্রয়োজন।",
    history: "মূল কেসে আবেদন এবং কর্মকর্তা পর্যালোচনা নথিভুক্ত।",
    expected: "প্রাপক দপ্তর প্রাপ্তি স্বীকার করবে।",
    responsible: "প্রাপক DLAO কর্মকর্তা",
    docs: [
      { name: "আবেদন", required: true, received: true },
      { name: "শুনানির নোট", required: true, received: true },
    ],
  },
  {
    id: "REF-2026-00022",
    caseId: "LA-2026-00134",
    applicant: "আবদুল মালেক",
    type: "পারিবারিক",
    priority: "High",
    from: "DLAO জয়পুরহাট",
    to: "DLAO ঢাকা",
    sentAt: ago(12),
    acknowledgedAt: ago(2),
    acceptedAt: ago(1),
    status: "Accepted",
    reason: "দূরবর্তী জেলায় আইনজীবীর সহায়তা প্রয়োজন।",
    history: "কেস পর্যালোচনা ও প্রেরকের সম্মতি নথিভুক্ত।",
    expected: "প্রাপক দপ্তর প্রয়োজনীয় ব্যবস্থা নেবে।",
    responsible: "প্রাপক DLAO কর্মকর্তা",
    docs: [{ name: "কেস সারাংশ", required: true, received: true }],
  },
];

function Badge({ children, tone = "slate" }) {
  const colors = {
    slate: "bg-slate-100 text-slate-700",
    green: "bg-emerald-100 text-emerald-800",
    orange: "bg-amber-100 text-amber-900",
    red: "bg-rose-100 text-rose-800",
  };
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${colors[tone]}`}
    >
      {children}
    </span>
  );
}

export default function ReferralWorkspace() {
  const [active, setActive] = useState(tabs[0]);
  const [records, setRecords] = useState(seed);
  const [audit, setAudit] = useState([]);
  const [selected, setSelected] = useState(null);
  const [detailTab, setDetailTab] = useState("সারসংক্ষেপ");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [seekerQuery, setSeekerQuery] = useState("");
  const [seekerResult, setSeekerResult] = useState(null);
  const [note, setNote] = useState("");
  const [followNote, setFollowNote] = useState("");
  const [returnReason, setReturnReason] = useState("");
  const [auditSearch, setAuditSearch] = useState("");
  const [message, setMessage] = useState("");
  const receivingOffice = "DLAO জয়পুরহাট";
  const isOverdue = (r) =>
    !r.acknowledgedAt && Date.now() - Date.parse(r.sentAt) > 24 * 3600000;
  const selectedRecord = records.find((r) => r.id === selected);
  const visible = records.filter((r) => {
    const match = [r.id, r.caseId, r.applicant, r.from, r.to]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase());
    return (
      match &&
      (!statusFilter || r.status === statusFilter) &&
      (!priorityFilter || r.priority === priorityFilter)
    );
  });
  const received = visible.filter((r) => r.to === receivingOffice);
  const sent = visible.filter((r) => r.from === receivingOffice);
  const followups = records.filter(
    (r) => isOverdue(r) || r.events?.some((e) => e.kind === "ফলো-আপ"),
  );

  function updateRecord(id, action, changes = {}, detail = "") {
    const target = records.find((r) => r.id === id);
    if (!target) return;
    const stamp = now();
    setRecords((items) =>
      items.map((r) =>
        r.id === id
          ? {
              ...r,
              ...changes,
              events: [
                {
                  at: stamp,
                  action,
                  detail,
                  kind: action === "ফলো-আপ নথিভুক্ত" ? "ফলো-আপ" : "",
                },
                ...(r.events || []),
              ],
            }
          : r,
      ),
    );
    setAudit((items) => [
      {
        at: stamp,
        actor: "DLAO ডেমো ব্যবহারকারী",
        action,
        referral: id,
        caseId: target.caseId,
        detail,
      },
      ...items,
    ]);
    setMessage(`${id}: ${action}`);
  }
  function open(id) {
    setSelected(id);
    setDetailTab("সারসংক্ষেপ");
    setMessage("");
    setNote("");
    setReturnReason("");
  }
  function close() {
    setSelected(null);
    setMessage("");
  }
  function seekerLookup() {
    setSeekerResult(
      records.find(
        (r) =>
          r.id.toLowerCase() === seekerQuery.trim().toLowerCase() ||
          r.caseId.toLowerCase() === seekerQuery.trim().toLowerCase(),
      ) || false,
    );
  }
  function csvExport() {
    const rows = [
      [
        "Referral",
        "Case",
        "Applicant",
        "From",
        "To",
        "Priority",
        "Status",
        "Sent",
        "Acknowledged",
        "Accepted",
      ],
      ...records.map((r) => [
        r.id,
        r.caseId,
        r.applicant,
        r.from,
        r.to,
        priorities[r.priority],
        statuses[r.status],
        r.sentAt,
        r.acknowledgedAt || "",
        r.acceptedAt || "",
      ]),
    ];
    const csv =
      "\uFEFF" +
      rows
        .map((row) =>
          row.map((v) => `"${String(v).replaceAll('"', '""')}"`).join(","),
        )
        .join("\r\n");
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "referral-demo-report.csv";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <div className="space-y-6 text-[#253449]">
      <header>
        <p className="text-xs font-bold uppercase tracking-widest text-emerald-800">
          DLAO / ডেমো রেকর্ড
        </p>
        <h1 className="mt-2 text-3xl font-bold">রেফারেল ব্যবস্থাপনা</h1>
        <p className="mt-2 text-sm text-slate-600">
          একই কেস আইডির সঙ্গে প্রাপ্তি, গ্রহণ, পদক্ষেপ এবং ফলো-আপ যুক্ত থাকে।
        </p>
      </header>
      <div
        role="tablist"
        aria-label="রেফারেলের বিভাগ"
        className="flex flex-wrap gap-2"
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={active === tab}
            className={active === tab ? btn : alt}
            onClick={() => {
              setActive(tab);
              close();
              setMessage("");
            }}
          >
            {tab}
          </button>
        ))}
      </div>
      {message && (
        <p
          role="status"
          className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-900"
        >
          {message}
        </p>
      )}

      {(active === "প্রাপ্ত রেফারেল" || active === "প্রেরিত রেফারেল") && (
        <section className={box}>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold">{active}</h2>
            <Badge tone="green">ফ্রন্টএন্ড ডেমো</Badge>
          </div>
          <div className="mb-4 flex flex-wrap gap-3">
            <input
              aria-label="রেফারেল অনুসন্ধান"
              className={`${input} min-w-56 flex-1`}
              placeholder="রেফারেল, কেস, আবেদনকারী বা দপ্তর অনুসন্ধান"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              aria-label="অবস্থা"
              className={input}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">সব অবস্থা</option>
              {Object.entries(statuses).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <select
              aria-label="অগ্রাধিকার"
              className={input}
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="">সব অগ্রাধিকার</option>
              {Object.entries(priorities).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse">
              <thead className="bg-slate-50">
                <tr>
                  {[
                    "রেফারেল",
                    "কেস / আবেদনকারী",
                    "অগ্রাধিকার",
                    active === "প্রাপ্ত রেফারেল" ? "প্রেরক" : "প্রাপক",
                    "প্রেরণের সময়",
                    "অবস্থা",
                    "পদক্ষেপ",
                  ].map((head) => (
                    <th key={head} className={th}>
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(active === "প্রাপ্ত রেফারেল" ? received : sent).map((r) => (
                  <tr key={r.id} className="border-t border-slate-200">
                    <td className={td}>
                      <strong>{r.id}</strong>
                      <p className="text-xs text-slate-500">{r.type}</p>
                    </td>
                    <td className={td}>
                      {r.caseId}
                      <br />
                      {r.applicant}
                    </td>
                    <td className={td}>
                      <Badge tone={r.priority === "Urgent" ? "red" : "orange"}>
                        {priorities[r.priority]}
                      </Badge>
                    </td>
                    <td className={td}>
                      {active === "প্রাপ্ত রেফারেল" ? r.from : r.to}
                    </td>
                    <td className={td}>{date(r.sentAt)}</td>
                    <td className={td}>
                      <Badge
                        tone={r.status === "Completed" ? "green" : "slate"}
                      >
                        {statuses[r.status]}
                      </Badge>
                      {isOverdue(r) && (
                        <p className="mt-1 text-xs font-semibold text-rose-700">
                          প্রাপ্তি স্বীকারের সময় পেরিয়েছে
                        </p>
                      )}
                    </td>
                    <td className={td}>
                      <button
                        type="button"
                        className="font-semibold text-emerald-800 hover:underline"
                        onClick={() => open(r.id)}
                      >
                        সম্পূর্ণ প্যাকেজ খুলুন
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(active === "প্রাপ্ত রেফারেল" ? received : sent).length === 0 && (
              <p className="p-5 text-center text-sm text-slate-500">
                কোনো রেফারেল পাওয়া যায়নি।
              </p>
            )}
          </div>
        </section>
      )}

      {active === "ফলো-আপ" && (
        <section className={box}>
          <h2 className="text-xl font-bold">রেফারেল ফলো-আপ</h2>
          <p className="my-4 rounded-xl bg-blue-50 p-3 text-sm">
            প্রাপ্তি স্বীকারের ২৪ ঘণ্টা পেরিয়ে গেলে রেফারেল এখানে দেখায়।
            নথিভুক্ত ফলো-আপও তালিকায় থাকে।
          </p>
          <div className="space-y-3">
            {followups.map((r) => (
              <div
                key={r.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4"
              >
                <div>
                  <strong>
                    {r.id} · {r.caseId}
                  </strong>
                  <p className="mt-1 text-sm">
                    {r.applicant} · {statuses[r.status]}
                  </p>
                </div>
                <button
                  type="button"
                  className={alt}
                  onClick={() => {
                    open(r.id);
                    setDetailTab("পদক্ষেপ");
                  }}
                >
                  ফলো-আপ নথিভুক্ত করুন
                </button>
              </div>
            ))}
            {followups.length === 0 && (
              <p className="text-sm text-slate-500">
                এই মুহূর্তে ফলো-আপের অপেক্ষায় কোনো রেকর্ড নেই।
              </p>
            )}
          </div>
        </section>
      )}

      {active === "সেবাপ্রার্থীর অবস্থা" && (
        <section className={box}>
          <h2 className="text-xl font-bold">সীমিত কেস অবস্থা</h2>
          <p className="my-4 rounded-xl bg-blue-50 p-3 text-sm">
            এখানে কেবল সাধারণ অগ্রগতির তথ্য দেখা যায়; অভ্যন্তরীণ নোট বা গোপন নথি
            দেখা যায় না।
          </p>
          <form
            className="flex flex-wrap gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              seekerLookup();
            }}
          >
            <input
              aria-label="কেস বা রেফারেল আইডি"
              className={`${input} min-w-56 flex-1`}
              placeholder="কেস আইডি বা রেফারেল আইডি"
              value={seekerQuery}
              onChange={(e) => setSeekerQuery(e.target.value)}
              required
            />
            <button className={btn}>অবস্থা দেখুন</button>
          </form>
          {seekerResult === false && (
            <p className="mt-4 text-sm text-rose-700">রেফারেল পাওয়া যায়নি।</p>
          )}
          {seekerResult && (
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ["কেস আইডি", seekerResult.caseId],
                ["রেফারেল", seekerResult.id],
                ["অবস্থা", statuses[seekerResult.status]],
                ["প্রাপক দপ্তর", seekerResult.to],
                ["পরবর্তী পদক্ষেপ", seekerResult.expected],
                [
                  "সর্বশেষ পরিবর্তন",
                  date(seekerResult.events?.[0]?.at || seekerResult.sentAt),
                ],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border p-4">
                  <p className="text-xs text-slate-500">{label}</p>
                  <p className="mt-2 font-semibold">{value}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {active === "প্রতিবেদন" && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold">রেফারেল প্রতিবেদন</h2>
            <button type="button" className={btn} onClick={csvExport}>
              CSV ডাউনলোড
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-4">
            {[
              ["মোট", records.length],
              [
                "প্রাপ্তি স্বীকৃত",
                records.filter((r) => r.acknowledgedAt).length,
              ],
              ["ফেরত", records.filter((r) => r.status === "Returned").length],
              [
                "সম্পন্ন",
                records.filter((r) => r.status === "Completed").length,
              ],
            ].map(([label, count]) => (
              <div key={label} className={box}>
                <p className="text-sm text-slate-500">{label}</p>
                <p className="mt-2 text-3xl font-bold">{count}</p>
              </div>
            ))}
          </div>
          <div className={`${box} overflow-x-auto`}>
            <table className="w-full min-w-[850px] border-collapse">
              <thead className="bg-slate-50">
                <tr>
                  {[
                    "রেফারেল",
                    "কেস",
                    "আবেদনকারী",
                    "প্রেরক",
                    "প্রাপক",
                    "অগ্রাধিকার",
                    "অবস্থা",
                    "প্রাপ্তি স্বীকৃতি",
                  ].map((x) => (
                    <th key={x} className={th}>
                      {x}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className={td}>{r.id}</td>
                    <td className={td}>{r.caseId}</td>
                    <td className={td}>{r.applicant}</td>
                    <td className={td}>{r.from}</td>
                    <td className={td}>{r.to}</td>
                    <td className={td}>{priorities[r.priority]}</td>
                    <td className={td}>{statuses[r.status]}</td>
                    <td className={td}>{date(r.acknowledgedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {active === "অডিট" && (
        <section className={box}>
          <h2 className="text-xl font-bold">অডিট ট্রেইল</h2>
          <input
            className={`${input} my-4 w-full`}
            aria-label="অডিট অনুসন্ধান"
            placeholder="পদক্ষেপ, রেফারেল বা কেস অনুসন্ধান"
            value={auditSearch}
            onChange={(e) => setAuditSearch(e.target.value)}
          />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse">
              <thead className="bg-slate-50">
                <tr>
                  {[
                    "সময়",
                    "কর্মকর্তা",
                    "পদক্ষেপ",
                    "রেফারেল",
                    "কেস",
                    "বিবরণ",
                  ].map((x) => (
                    <th key={x} className={th}>
                      {x}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {audit
                  .filter((a) =>
                    Object.values(a)
                      .join(" ")
                      .toLowerCase()
                      .includes(auditSearch.toLowerCase()),
                  )
                  .map((a, i) => (
                    <tr key={i} className="border-t">
                      <td className={td}>{date(a.at)}</td>
                      <td className={td}>{a.actor}</td>
                      <td className={td}>{a.action}</td>
                      <td className={td}>{a.referral}</td>
                      <td className={td}>{a.caseId}</td>
                      <td className={td}>{a.detail || "—"}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {audit.length === 0 && (
              <p className="p-4 text-sm text-slate-500">
                এখনও কোনো ডেমো পদক্ষেপ নেওয়া হয়নি।
              </p>
            )}
          </div>
        </section>
      )}

      {selectedRecord && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 p-3 sm:p-8"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="referral-title"
            className="mx-auto max-w-5xl rounded-2xl bg-[#f8fbff] p-5 shadow-2xl sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="referral-title" className="text-xl font-bold">
                  {selectedRecord.id} · {selectedRecord.applicant}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  একই কেস আইডিতে সংযুক্ত সম্পূর্ণ রেফারেল প্যাকেজ
                </p>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="বন্ধ করুন"
                className={alt}
              >
                ✕
              </button>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                ["কেস", selectedRecord.caseId],
                ["প্রেরক", selectedRecord.from],
                ["প্রাপক", selectedRecord.to],
                ["অগ্রাধিকার", priorities[selectedRecord.priority]],
                ["অবস্থা", statuses[selectedRecord.status]],
                ["দায়িত্বপ্রাপ্ত", selectedRecord.responsible],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border bg-white p-3">
                  <p className="text-xs text-slate-500">{label}</p>
                  <p className="mt-1 font-semibold">{value}</p>
                </div>
              ))}
            </div>
            <div
              role="tablist"
              aria-label="রেফারেলের বিস্তারিত"
              className="my-5 flex flex-wrap gap-2"
            >
              {[
                "সারসংক্ষেপ",
                "প্যাকেজ",
                "নথি",
                "ইতিহাস",
                "পদক্ষেপ",
                "সেবাপ্রার্থীর তথ্য",
              ].map((x) => (
                <button
                  key={x}
                  type="button"
                  role="tab"
                  aria-selected={detailTab === x}
                  className={detailTab === x ? btn : alt}
                  onClick={() => setDetailTab(x)}
                >
                  {x}
                </button>
              ))}
            </div>
            {detailTab === "সারসংক্ষেপ" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className={box}>
                  <h3 className="font-bold">রেফারেলের কারণ</h3>
                  <p className="mt-2 text-sm">{selectedRecord.reason}</p>
                  <h3 className="mt-5 font-bold">কেসের ইতিহাস</h3>
                  <p className="mt-2 text-sm">{selectedRecord.history}</p>
                </div>
                <div className={box}>
                  <h3 className="font-bold">প্রত্যাশিত পদক্ষেপ</h3>
                  <p className="mt-2 text-sm">{selectedRecord.expected}</p>
                  <p className="mt-5 text-sm text-slate-600">
                    প্রেরিত: {date(selectedRecord.sentAt)}
                    <br />
                    প্রাপ্তি স্বীকৃত: {date(selectedRecord.acknowledgedAt)}
                    <br />
                    গ্রহণ: {date(selectedRecord.acceptedAt)}
                  </p>
                </div>
              </div>
            )}
            {detailTab === "প্যাকেজ" && (
              <div className={box}>
                <h3 className="font-bold">সম্পূর্ণ ডিজিটাল রেফারেল প্যাকেজ</h3>
                <p className="mt-3 text-sm">
                  রেফারেলের কারণ, কেসের ইতিহাস, নথিপত্র, দায়িত্বপ্রাপ্ত
                  কর্মকর্তা এবং প্রত্যাশিত পদক্ষেপ একই কেস আইডির সঙ্গে যুক্ত।
                </p>
              </div>
            )}
            {detailTab === "নথি" && (
              <div className={box}>
                <h3 className="mb-4 font-bold">সংযুক্ত নথির চেকলিস্ট</h3>
                {selectedRecord.docs.map((d, i) => (
                  <div
                    key={i}
                    className="flex flex-wrap items-center justify-between gap-3 border-t py-3 text-sm"
                  >
                    <span>
                      {d.name} · {d.required ? "প্রয়োজনীয়" : "ঐচ্ছিক"}
                    </span>
                    <span>{d.received ? "পাওয়া গেছে" : "পাওয়া যায়নি"}</span>
                    {!d.received && (
                      <button
                        type="button"
                        className={alt}
                        onClick={() =>
                          updateRecord(
                            selectedRecord.id,
                            "নথি চাওয়া হয়েছে",
                            {},
                            d.name,
                          )
                        }
                      >
                        নথি চাইুন
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
            {detailTab === "ইতিহাস" && (
              <div className={box}>
                {selectedRecord.events?.length ? (
                  selectedRecord.events.map((e, i) => (
                    <p key={i} className="border-b py-3 text-sm">
                      <strong>{e.action}</strong> · {date(e.at)}
                      {e.detail && ` · ${e.detail}`}
                    </p>
                  ))
                ) : (
                  <p className="text-sm">এখনও কোনো নতুন ঘটনা নথিভুক্ত হয়নি।</p>
                )}
              </div>
            )}
            {detailTab === "সেবাপ্রার্থীর তথ্য" && (
              <div className={box}>
                <p className="mb-4 rounded-xl bg-blue-50 p-3 text-sm">
                  এখানে অভ্যন্তরীণ নোট বা গোপন নথি দেখানো হয় না।
                </p>
                <p>
                  প্রাপ্তি:{" "}
                  {selectedRecord.acknowledgedAt ? "স্বীকৃত" : "অপেক্ষমাণ"}
                </p>
                <p className="mt-2">
                  অবস্থা: {statuses[selectedRecord.status]}
                </p>
                <p className="mt-2">
                  পরবর্তী পদক্ষেপ: {selectedRecord.expected}
                </p>
              </div>
            )}
            {detailTab === "পদক্ষেপ" && (
              <div className={`${box} space-y-4`}>
                <div className="flex flex-wrap gap-2">
                  {!selectedRecord.acknowledgedAt &&
                    selectedRecord.to === receivingOffice && (
                      <button
                        type="button"
                        className={btn}
                        onClick={() =>
                          updateRecord(selectedRecord.id, "প্রাপ্তি স্বীকার", {
                            acknowledgedAt: now(),
                            status: "Acknowledged",
                          })
                        }
                      >
                        প্রাপ্তি স্বীকার করুন
                      </button>
                    )}
                  {selectedRecord.acknowledgedAt &&
                    !selectedRecord.acceptedAt &&
                    selectedRecord.status !== "Returned" &&
                    selectedRecord.to === receivingOffice && (
                      <button
                        type="button"
                        className={btn}
                        onClick={() =>
                          updateRecord(
                            selectedRecord.id,
                            "কার্যক্রমের দায়িত্ব গ্রহণ",
                            {
                              acceptedAt: now(),
                              status: "Accepted",
                              responsible: "প্রাপক DLAO কর্মকর্তা",
                            },
                          )
                        }
                      >
                        দায়িত্ব গ্রহণ করুন
                      </button>
                    )}
                  {selectedRecord.acceptedAt &&
                    selectedRecord.status !== "Completed" &&
                    selectedRecord.to === receivingOffice && (
                      <>
                        <button
                          type="button"
                          className={alt}
                          onClick={() =>
                            updateRecord(selectedRecord.id, "কার্যক্রম শুরু", {
                              status: "Action In Progress",
                            })
                          }
                        >
                          কার্যক্রম চলছে
                        </button>
                        <button
                          type="button"
                          className={btn}
                          onClick={() =>
                            updateRecord(
                              selectedRecord.id,
                              "কার্যক্রম সম্পন্ন",
                              { status: "Completed" },
                            )
                          }
                        >
                          সম্পন্ন করুন
                        </button>
                      </>
                    )}
                </div>
                {!selectedRecord.acceptedAt &&
                  selectedRecord.status !== "Returned" &&
                  selectedRecord.to === receivingOffice && (
                    <form
                      className="flex flex-wrap gap-2"
                      onSubmit={(e) => {
                        e.preventDefault();
                        updateRecord(
                          selectedRecord.id,
                          "সংশোধনের জন্য ফেরত",
                          {
                            status: "Returned",
                            expected:
                              "প্রেরক দপ্তর প্রয়োজনীয় ব্যাখ্যা বা নথি দেবে",
                          },
                          returnReason.trim(),
                        );
                        setReturnReason("");
                      }}
                    >
                      <input
                        aria-label="ফেরত পাঠানোর কারণ"
                        className={`${input} min-w-56 flex-1`}
                        required
                        value={returnReason}
                        onChange={(e) => setReturnReason(e.target.value)}
                        placeholder="ফেরত পাঠানোর কারণ লিখুন"
                      />
                      <button className={alt}>ফেরত পাঠান</button>
                    </form>
                  )}
                <form
                  className="flex flex-wrap gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    updateRecord(
                      selectedRecord.id,
                      "কেস-সংযুক্ত নোট যোগ",
                      {},
                      note.trim(),
                    );
                    setNote("");
                  }}
                >
                  <input
                    aria-label="কেস-সংযুক্ত নোট"
                    className={`${input} min-w-56 flex-1`}
                    required
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="অভ্যন্তরীণ নোট লিখুন"
                  />
                  <button className={alt}>নোট সংরক্ষণ</button>
                </form>
                <form
                  className="flex flex-wrap gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    updateRecord(
                      selectedRecord.id,
                      "ফলো-আপ নথিভুক্ত",
                      {},
                      followNote.trim(),
                    );
                    setFollowNote("");
                  }}
                >
                  <input
                    aria-label="ফলো-আপ বিবরণ"
                    className={`${input} min-w-56 flex-1`}
                    required
                    value={followNote}
                    onChange={(e) => setFollowNote(e.target.value)}
                    placeholder="ফলো-আপের বিবরণ লিখুন"
                  />
                  <button className={alt}>ফলো-আপ নথিভুক্ত</button>
                </form>
                <p className="rounded-xl bg-blue-50 p-3 text-sm">
                  <strong>প্রাপ্তি স্বীকার ≠ দায়িত্ব গ্রহণ:</strong> প্রথমটি
                  শুধু রেফারেল পাওয়া নিশ্চিত করে; দ্বিতীয়টি পদক্ষেপ নেওয়ার
                  দায়িত্ব গ্রহণ করে।
                </p>
              </div>
            )}
            <p className="mt-5 text-xs text-slate-500">
              এটি ফ্রন্টএন্ড ডেমো; রিফ্রেশ করলে নতুন পদক্ষেপগুলো মুছে যাবে।
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
