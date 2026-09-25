"use client";

import { useState } from "react";

// Frontend demonstration. No notice is sent and no legally valid signature is created.
const stages = [
  "নিবন্ধন",
  "নিরাপত্তা",
  "নথিপত্র",
  "সময়সূচি",
  "উপস্থিতি",
  "মধ্যস্থতা",
  "ফলাফল",
  "সমঝোতাপত্র",
  "ই-স্বাক্ষর",
  "চূড়ান্তকরণ",
  "ফলো-আপ",
  "সমাপ্তি",
];
const box = "rounded-2xl border border-[#d6e0f2] bg-white p-5 shadow-sm sm:p-6";
const field =
  "mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-800 outline-none focus:border-emerald-700";
const primary =
  "rounded-xl bg-[#0d392e] px-5 py-2.5 font-semibold text-white hover:bg-[#145442]";
const secondary =
  "rounded-xl border border-slate-300 bg-white px-4 py-2.5 font-medium hover:bg-slate-50";
const seedDocs = [
  {
    name: "আইনগত সহায়তার আবেদন",
    source: "DLAO",
    version: 1,
    status: "যাচাই বাকি",
  },
  {
    name: "সহায়ক বিবৃতি",
    source: "আবেদনকারী",
    version: 1,
    status: "যাচাই বাকি",
  },
  {
    name: "পরিচয় ও যোগাযোগের তথ্য",
    source: "DLAO",
    version: 1,
    status: "যাচাই বাকি",
  },
];

function Label({ title, children }) {
  return (
    <label className="block text-sm font-semibold text-slate-700">
      {title}
      {children}
    </label>
  );
}

export default function MediationWorkflow({ record, onBack }) {
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [audit, setAudit] = useState([]);
  const [registration, setRegistration] = useState({
    caseId: record?.caseId || "CASE-2026-0142",
    mediationId: record?.id || "MED-2026-0042",
    applicant: record?.name || "ময়ূরী আক্তার",
    opposite: "",
    matter: "",
    source: "DLAO রেফারেল",
    mediator: "",
    language: "বাংলা",
  });
  const [safety, setSafety] = useState({
    contact: "ফোন কল",
    time: "",
    voluntary: false,
    clear: false,
  });
  const [documents, setDocuments] = useState(seedDocs);
  const [newDocument, setNewDocument] = useState("");
  const [schedule, setSchedule] = useState({
    date: "",
    time: "",
    mode: "সরাসরি",
    location: "",
    link: "",
  });
  const [notices, setNotices] = useState({
    applicant: false,
    opposite: false,
    mediator: false,
  });
  const [reminder, setReminder] = useState("");
  const [attendance, setAttendance] = useState({
    applicant: "",
    opposite: "",
    mediator: "উপস্থিত",
  });
  const [issues, setIssues] = useState([
    "ভরণপোষণের পরিমাণ",
    "পরিশোধের সময়সূচি",
  ]);
  const [newIssue, setNewIssue] = useState("");
  const [notes, setNotes] = useState("");
  const [proposals, setProposals] = useState([]);
  const [proposal, setProposal] = useState({ party: "আবেদনকারী", text: "" });
  const [outcome, setOutcome] = useState({
    kind: "",
    explanation: "",
    next: "",
  });
  const [settlement, setSettlement] = useState({
    version: 1,
    terms: "",
    approved: false,
    aiDraft: false,
  });
  const [otp, setOtp] = useState("");
  const [mobile, setMobile] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [signing, setSigning] = useState("");
  const [signatures, setSignatures] = useState({
    applicant: null,
    opposite: null,
  });
  const [signedHash, setSignedHash] = useState("");
  const [verified, setVerified] = useState(false);
  const [followup, setFollowup] = useState({
    date: "",
    responsible: "",
    status: "অপেক্ষমাণ",
  });

  function log(action) {
    setAudit((current) => [
      { action, at: new Date().toLocaleString("bn-BD") },
      ...current,
    ]);
  }
  function advance(action, next = step + 1) {
    setError("");
    log(action);
    setStep(next);
  }
  function back() {
    setError("");
    if (step === 0) onBack?.();
    else if (step === 10 && outcome.kind !== "পূর্ণ সমঝোতা") setStep(6);
    else setStep(step - 1);
  }
  function patch(setter, name, value) {
    setter((current) => ({ ...current, [name]: value }));
  }
  async function digest() {
    const text = [
      registration.caseId,
      registration.mediationId,
      settlement.version,
      settlement.terms,
    ].join("|");
    const bytes = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(text),
    );
    return Array.from(new Uint8Array(bytes), (n) =>
      n.toString(16).padStart(2, "0"),
    ).join("");
  }
  async function signParty(party) {
    if (otp !== "123456") {
      setError("ডেমো OTP সঠিক নয়। 123456 ব্যবহার করুন।");
      return;
    }
    const hash = await digest();
    if (signedHash && signedHash !== hash) {
      setError("অনুমোদিত সমঝোতাপত্রের সংস্করণ পরিবর্তিত হয়েছে।");
      return;
    }
    setSignedHash(hash);
    const stamp = {
      name:
        party === "applicant" ? registration.applicant : registration.opposite,
      at: new Date().toLocaleString("bn-BD"),
      hash,
    };
    const updated = { ...signatures, [party]: stamp };
    setSignatures(updated);
    setSigning("");
    setOtp("");
    setError("");
    log(
      `${party === "applicant" ? "আবেদনকারী" : "অপর পক্ষ"}-এর ডেমো স্বাক্ষর নথিভুক্ত`,
    );
    if (updated.applicant && updated.opposite) setStep(9);
  }
  async function finalize() {
    if (
      !signatures.applicant ||
      !signatures.opposite ||
      !signedHash ||
      (await digest()) !== signedHash
    ) {
      setError(
        "দুই পক্ষের স্বাক্ষর বা সমঝোতাপত্রের সংস্করণ যাচাই সম্পন্ন হয়নি।",
      );
      return;
    }
    setVerified(true);
    advance("মধ্যস্থতাকারী ডেমো সমঝোতা চূড়ান্ত করেছেন");
  }

  return (
    <div className="space-y-6 text-[#253449]">
      <div>
        <button
          type="button"
          onClick={back}
          className="text-sm font-semibold text-emerald-800 hover:underline"
        >
          ← {step === 0 ? "মধ্যস্থতার তালিকায় ফিরুন" : "আগের ধাপ"}
        </button>
        <p className="mt-4 text-xs font-bold uppercase tracking-wider text-emerald-800">
          DLAO / ডেমো কার্যক্রম
        </p>
        <h1 className="mt-1 text-3xl font-bold">সালিশি ও মধ্যস্থতা</h1>
        <p className="mt-2 text-slate-600">
          {registration.mediationId} · একই পৃষ্ঠায় বারো ধাপের কার্যক্রম
        </p>
      </div>
      <ol
        className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6"
        aria-label="মধ্যস্থতার অগ্রগতি"
      >
        {stages.map((label, index) => (
          <li
            key={label}
            aria-current={step === index ? "step" : undefined}
            className={`rounded-xl border p-3 text-sm font-medium ${index === step ? "border-blue-300 bg-blue-50 text-blue-900" : index < step ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-slate-200 bg-white text-slate-500"}`}
          >
            {index + 1}. {label}
          </li>
        ))}
      </ol>
      {error && (
        <p
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900"
        >
          {error}
        </p>
      )}

      {step === 0 && (
        <form
          className={box}
          onSubmit={(e) => {
            e.preventDefault();
            advance("মধ্যস্থতা নিবন্ধন সম্পন্ন");
          }}
        >
          <h2 className="mb-5 text-xl font-bold">১. মধ্যস্থতা নিবন্ধন</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["কেস আইডি", "caseId"],
              ["মধ্যস্থতা আইডি", "mediationId"],
            ].map(([label, key]) => (
              <Label key={key} title={label}>
                <input className={field} value={registration[key]} readOnly />
              </Label>
            ))}
            {[
              ["আবেদনকারীর নাম *", "applicant"],
              ["অপর পক্ষের নাম *", "opposite"],
              ["বিরোধের বিষয় *", "matter"],
              ["রেফারেলের উৎস *", "source"],
              ["মধ্যস্থতাকারীর নাম *", "mediator"],
            ].map(([label, key]) => (
              <Label key={key} title={label}>
                <input
                  className={field}
                  value={registration[key]}
                  onChange={(e) => patch(setRegistration, key, e.target.value)}
                  required
                />
              </Label>
            ))}
            <Label title="ভাষা">
              <select
                className={field}
                value={registration.language}
                onChange={(e) =>
                  patch(setRegistration, "language", e.target.value)
                }
              >
                <option>বাংলা</option>
                <option>ইংরেজি</option>
                <option>অন্যান্য</option>
              </select>
            </Label>
          </div>
          <p className="mt-5 rounded-xl bg-blue-50 p-3 text-sm">
            নিবন্ধন কেবল কার্যক্রমের রেকর্ড তৈরি করে; এটি আইনগত যোগ্যতার
            সিদ্ধান্ত নয়।
          </p>
          <button type="submit" className={`${primary} mt-5`}>
            নিবন্ধন করে এগিয়ে যান →
          </button>
        </form>
      )}

      {step === 1 && (
        <form
          className={box}
          onSubmit={(e) => {
            e.preventDefault();
            if (
              !safety.voluntary ||
              !safety.clear ||
              safety.contact === "যোগাযোগ নিরাপদ নয়"
            ) {
              setError(
                "নিরাপত্তা বা স্বেচ্ছায় অংশগ্রহণ নিশ্চিত হয়নি। মধ্যস্থতা থামিয়ে মানবিক পর্যালোচনা বা রেফারেল প্রয়োজন।",
              );
              return;
            }
            advance("নিরাপত্তা ও সম্মতি যাচাই সম্পন্ন");
          }}
        >
          <h2 className="mb-5 text-xl font-bold">
            ২. পক্ষসমূহের সম্মতি ও নিরাপত্তা
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Label title="নিরাপদ যোগাযোগের মাধ্যম">
              <select
                className={field}
                value={safety.contact}
                onChange={(e) => patch(setSafety, "contact", e.target.value)}
              >
                <option>ফোন কল</option>
                <option>এসএমএস</option>
                <option>ইউডিসির সহায়তায়</option>
                <option>যোগাযোগ নিরাপদ নয়</option>
              </select>
            </Label>
            <Label title="নিরাপদ যোগাযোগের সময় *">
              <input
                className={field}
                value={safety.time}
                onChange={(e) => patch(setSafety, "time", e.target.value)}
                placeholder="সন্ধ্যা ৬টা–৮টা"
                required
              />
            </Label>
          </div>
          <label className="mt-5 flex gap-3 rounded-xl border p-4 text-sm">
            <input
              type="checkbox"
              checked={safety.voluntary}
              onChange={(e) => patch(setSafety, "voluntary", e.target.checked)}
            />
            আবেদনকারী স্বেচ্ছায় অংশ নিচ্ছেন এবং বিষয়টি বুঝেছেন।
          </label>
          <label className="mt-3 flex gap-3 rounded-xl border p-4 text-sm">
            <input
              type="checkbox"
              checked={safety.clear}
              onChange={(e) => patch(setSafety, "clear", e.target.checked)}
            />
            এই পথে এগোনোর ক্ষেত্রে তাৎক্ষণিক নিরাপত্তা ঝুঁকি পাওয়া যায়নি।
          </label>
          <p className="mt-5 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">
            যেকোনো ঝুঁকি বা অসম্মতির ক্ষেত্রে পরবর্তী ধাপে যাওয়া বন্ধ থাকবে।
          </p>
          <button type="submit" className={`${primary} mt-5`}>
            নিরাপত্তা নিশ্চিত করে এগিয়ে যান →
          </button>
        </form>
      )}

      {step === 2 && (
        <div className={box}>
          <h2 className="text-xl font-bold">৩. নথিপত্র পর্যালোচনা</h2>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  {["নথি", "উৎস", "সংস্করণ", "অবস্থা"].map((x) => (
                    <th key={x} className="p-3">
                      {x}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {documents.map((doc, i) => (
                  <tr key={`${doc.name}-${i}`} className="border-t">
                    <td className="p-3">{doc.name}</td>
                    <td className="p-3">{doc.source}</td>
                    <td className="p-3">v{doc.version}</td>
                    <td className="p-3">
                      <select
                        aria-label={`${doc.name}-এর অবস্থা`}
                        className={field}
                        value={doc.status}
                        onChange={(e) =>
                          setDocuments((current) =>
                            current.map((d, n) =>
                              n === i ? { ...d, status: e.target.value } : d,
                            ),
                          )
                        }
                      >
                        <option>যাচাই বাকি</option>
                        <option>পর্যালোচনা সম্পন্ন</option>
                        <option>সমস্যা চিহ্নিত</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <form
            className="mt-5 flex flex-wrap gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              setDocuments((current) => [
                ...current,
                {
                  name: newDocument.trim(),
                  source: "মধ্যস্থতাকারী",
                  version: 1,
                  status: "যাচাই বাকি",
                },
              ]);
              setNewDocument("");
            }}
          >
            <input
              aria-label="নতুন নথির নাম"
              className={`${field} mt-0 flex-1`}
              value={newDocument}
              onChange={(e) => setNewDocument(e.target.value)}
              placeholder="আরেকটি নথির নাম"
              required
            />
            <button className={secondary}>নথি যোগ করুন</button>
          </form>
          <p className="mt-4 rounded-xl bg-blue-50 p-3 text-sm">
            সমস্যা চিহ্নিত নথির তথ্য অনুমান করে পূরণ করা হবে না।
          </p>
          <button
            type="button"
            className={`${primary} mt-5`}
            onClick={() => {
              if (documents.some((d) => d.status === "যাচাই বাকি")) {
                setError(
                  "প্রতিটি নথি পর্যালোচনা বা সমস্যাযুক্ত হিসেবে চিহ্নিত করুন।",
                );
                return;
              }
              advance("নথির চেকলিস্ট পর্যালোচনা সম্পন্ন");
            }}
          >
            নথি পর্যালোচনা শেষে এগিয়ে যান →
          </button>
        </div>
      )}

      {step === 3 && (
        <form
          className={box}
          onSubmit={(e) => {
            e.preventDefault();
            advance("সেশনের সময়সূচি নির্ধারিত");
          }}
        >
          <h2 className="mb-5 text-xl font-bold">৪. সময়সূচি, নোটিশ ও স্মারক</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Label title="তারিখ *">
              <input
                type="date"
                className={field}
                value={schedule.date}
                onChange={(e) => patch(setSchedule, "date", e.target.value)}
                required
              />
            </Label>
            <Label title="সময় *">
              <input
                type="time"
                className={field}
                value={schedule.time}
                onChange={(e) => patch(setSchedule, "time", e.target.value)}
                required
              />
            </Label>
            <Label title="অংশগ্রহণের ধরন">
              <select
                className={field}
                value={schedule.mode}
                onChange={(e) => patch(setSchedule, "mode", e.target.value)}
              >
                <option>সরাসরি</option>
                <option>অনলাইন</option>
                <option>হাইব্রিড</option>
              </select>
            </Label>
            <Label title="স্থান / সভার বিবরণ *">
              <input
                className={field}
                value={schedule.location}
                onChange={(e) => patch(setSchedule, "location", e.target.value)}
                required
              />
            </Label>
            {schedule.mode !== "সরাসরি" && (
              <Label title="অনলাইন সভার লিংক *">
                <input
                  type="url"
                  className={field}
                  value={schedule.link}
                  onChange={(e) => patch(setSchedule, "link", e.target.value)}
                  required
                />
              </Label>
            )}
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              ["applicant", "আবেদনকারী"],
              ["opposite", "অপর পক্ষ"],
              ["mediator", "মধ্যস্থতাকারী"],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  patch(setNotices, key, true);
                  log(`${label}-এর ডেমো নোটিশ প্রস্তুত`);
                }}
                className={secondary}
              >
                {label}: {notices[key] ? "প্রস্তুত ✓" : "নোটিশ প্রস্তুত করুন"}
              </button>
            ))}
          </div>
          <Label title="স্মারক (ঐচ্ছিক)">
            <input
              className={field}
              value={reminder}
              onChange={(e) => setReminder(e.target.value)}
              placeholder="যেমন: সেশনের ২৪ ঘণ্টা আগে"
            />
          </Label>
          <p className="mt-3 text-xs text-slate-500">
            নোটিশ বা স্মারক বাস্তবে পাঠানো হয় না।
          </p>
          <button className={`${primary} mt-5`}>
            সময়সূচি সংরক্ষণ করে এগিয়ে যান →
          </button>
        </form>
      )}

      {step === 4 && (
        <div className={box}>
          <h2 className="mb-5 text-xl font-bold">৫. উপস্থিতি নিবন্ধন</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["applicant", "আবেদনকারী", registration.applicant],
              ["opposite", "অপর পক্ষ", registration.opposite],
              ["mediator", "মধ্যস্থতাকারী", registration.mediator],
            ].map(([key, label, name]) => (
              <div key={key} className="rounded-xl border p-4">
                <strong>{label}</strong>
                <p className="mt-1 text-sm">{name}</p>
                <select
                  className={field}
                  aria-label={`${label}-এর উপস্থিতি`}
                  value={attendance[key]}
                  onChange={(e) => patch(setAttendance, key, e.target.value)}
                >
                  <option value="">নির্বাচন করুন</option>
                  <option>উপস্থিত</option>
                  <option>অনুপস্থিত</option>
                </select>
              </div>
            ))}
          </div>
          <p className="mt-4 rounded-xl bg-blue-50 p-3 text-sm">
            অনলাইন অংশগ্রহণে সমস্যা হলে সরাসরি উপস্থিতির ব্যবস্থা করা যেতে পারে।
          </p>
          <button
            type="button"
            className={`${primary} mt-5`}
            onClick={() => {
              if (Object.values(attendance).some((x) => x !== "উপস্থিত")) {
                setError(
                  "এই ডেমো সেশন শুরুর জন্য দুই পক্ষ ও মধ্যস্থতাকারীর উপস্থিতি প্রয়োজন।",
                );
                return;
              }
              advance("সকল পক্ষের উপস্থিতি নথিভুক্ত; সেশন শুরু");
            }}
          >
            মধ্যস্থতা সেশন শুরু করুন →
          </button>
        </div>
      )}

      {step === 5 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">৬. মধ্যস্থতা কার্যক্ষেত্র</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className={box}>
              <h3 className="font-bold">আলোচনার বিষয়</h3>
              {issues.map((issue, i) => (
                <div
                  key={`${issue}-${i}`}
                  className="mt-3 flex justify-between gap-3 rounded-lg border p-3 text-sm"
                >
                  <span>{issue}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setIssues((x) => x.filter((_, n) => n !== i))
                    }
                    className="text-rose-700"
                  >
                    মুছুন
                  </button>
                </div>
              ))}
              <form
                className="mt-4 flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  setIssues((x) => [...x, newIssue.trim()]);
                  setNewIssue("");
                }}
              >
                <input
                  aria-label="নতুন আলোচনার বিষয়"
                  className={`${field} mt-0`}
                  value={newIssue}
                  onChange={(e) => setNewIssue(e.target.value)}
                  required
                />
                <button className={secondary}>যোগ করুন</button>
              </form>
            </div>
            <div className={box}>
              <Label title="মধ্যস্থতাকারীর নোট">
                <textarea
                  className={`${field} min-h-40`}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="আলোচনার তথ্য লিখুন"
                />
              </Label>
              <button
                type="button"
                className={`${secondary} mt-3`}
                onClick={() => log("মধ্যস্থতার নোট ডেমোতে সংরক্ষিত")}
              >
                নোট সংরক্ষণ করুন
              </button>
              <button
                type="button"
                className={`${secondary} mt-3 sm:ml-2`}
                onClick={() => {
                  setSettlement((x) => ({
                    ...x,
                    aiDraft: true,
                    terms:
                      x.terms ||
                      "১. উভয় পক্ষ সম্মত শর্তাবলি যাচাই করবেন।\n২. পরিশোধের সময়সূচি মধ্যস্থতাকারী লিখবেন।",
                  }));
                  log("ডেমো খসড়ার নমুনা প্রস্তুত");
                }}
              >
                ডেমো খসড়ার নমুনা তৈরি
              </button>
            </div>
          </div>
          <div className={box}>
            <h3 className="font-bold">পক্ষগুলোর প্রস্তাব</h3>
            {proposals.map((p, i) => (
              <p key={i} className="mt-2 rounded-lg border p-3 text-sm">
                <strong>{p.party}:</strong> {p.text}
              </p>
            ))}
            <form
              className="mt-4 grid gap-2 sm:grid-cols-[180px_1fr_auto]"
              onSubmit={(e) => {
                e.preventDefault();
                setProposals((x) => [...x, { ...proposal }]);
                setProposal({ party: "আবেদনকারী", text: "" });
              }}
            >
              <select
                className={field}
                value={proposal.party}
                onChange={(e) => patch(setProposal, "party", e.target.value)}
              >
                <option>আবেদনকারী</option>
                <option>অপর পক্ষ</option>
              </select>
              <input
                aria-label="প্রস্তাব"
                className={field}
                value={proposal.text}
                onChange={(e) => patch(setProposal, "text", e.target.value)}
                required
              />
              <button className={secondary}>প্রস্তাব যোগ করুন</button>
            </form>
          </div>
          <p className="rounded-xl bg-blue-50 p-4 text-sm">
            খসড়া তৈরিতে প্রযুক্তি সহায়তা করতে পারে; সম্মতি বা ফলাফল
            মধ্যস্থতাকারী নির্ধারণ করবেন।
          </p>
          <div className="flex flex-wrap gap-2">
            {["পূর্ণ সমঝোতা", "আংশিক সমঝোতা", "সমঝোতা হয়নি"].map((kind) => (
              <button
                key={kind}
                type="button"
                className={primary}
                onClick={() => {
                  setOutcome({
                    kind,
                    explanation: "",
                    next:
                      kind === "পূর্ণ সমঝোতা"
                        ? "সমঝোতাপত্র প্রস্তুত"
                        : "পরবর্তী আইনি সহায়তা",
                  });
                  advance(`মধ্যস্থতার ফলাফল নির্বাচিত: ${kind}`);
                }}
              >
                {kind}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 6 && (
        <form
          className={box}
          onSubmit={(e) => {
            e.preventDefault();
            advance(
              `ফলাফল সংরক্ষিত: ${outcome.kind}`,
              outcome.kind === "পূর্ণ সমঝোতা" ? 7 : 10,
            );
          }}
        >
          <h2 className="mb-5 text-xl font-bold">৭. মধ্যস্থতার ফলাফল</h2>
          <p className="mb-4 rounded-xl bg-blue-50 p-3">
            নির্বাচিত: <strong>{outcome.kind}</strong>
          </p>
          <Label title="ফলাফলের কারণ *">
            <textarea
              className={`${field} min-h-28`}
              value={outcome.explanation}
              onChange={(e) => patch(setOutcome, "explanation", e.target.value)}
              required
            />
          </Label>
          <Label title="পরবর্তী পদক্ষেপ">
            <select
              className={field}
              value={outcome.next}
              onChange={(e) => patch(setOutcome, "next", e.target.value)}
            >
              {[
                "সমঝোতাপত্র প্রস্তুত",
                "আরেকটি মধ্যস্থতা সেশন",
                "উপযুক্ত কর্তৃপক্ষের কাছে রেফার",
                "পরবর্তী আইনি সহায়তা",
              ].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </Label>
          <button className={`${primary} mt-5`}>
            ফলাফল সংরক্ষণ করে এগিয়ে যান →
          </button>
        </form>
      )}

      {step === 7 && (
        <div className={box}>
          <h2 className="text-xl font-bold">৮. সমঝোতাপত্রের খসড়া</h2>
          <p className="mt-3 rounded-xl bg-blue-50 p-3 text-sm">
            সংস্করণ v{settlement.version} ·{" "}
            {settlement.aiDraft
              ? "ডেমো খসড়ার নমুনা — মধ্যস্থতাকারীর যাচাই প্রয়োজন"
              : "মধ্যস্থতাকারীর লেখা খসড়া"}
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Label title="পক্ষ ক">
              <input
                className={field}
                value={registration.applicant}
                readOnly
              />
            </Label>
            <Label title="পক্ষ খ">
              <input className={field} value={registration.opposite} readOnly />
            </Label>
          </div>
          <div className="mt-5 space-y-5">
            <Label title="এআই প্রস্তুতকৃত সমঝোতাপত্রের নমুনা">
              <textarea
                className={`${field} min-h-56 bg-blue-50 text-slate-700`}
                value={[
                  `কেস: ${registration.caseId}`,
                  `পক্ষ ক: ${registration.applicant}`,
                  `পক্ষ খ: ${registration.opposite}`,
                  `বিষয়: ${registration.matter}`,
                  "",
                  "সম্ভাব্য আলোচ্য বিষয়:",
                  ...issues.map((issue, index) => `${index + 1}. ${issue}`),
                  "",
                  "দুই পক্ষের বক্তব্য, সম্মতি এবং প্রযোজ্য শর্ত মধ্যস্থতাকারী যাচাই করে নিচের অংশে লিখবেন।",
                  "এই নমুনার কোনো শর্ত স্বয়ংক্রিয়ভাবে অনুমোদিত নয়।",
                ].join("\n")}
                readOnly
                aria-describedby="ai-draft-note"
              />
            </Label>

            <p id="ai-draft-note" className="text-xs text-slate-500">
              এটি কেসের ডেমো তথ্য থেকে স্বয়ংক্রিয়ভাবে সাজানো নমুনা; বাস্তব AI
              API ব্যবহার করা হয়নি। এই লেখাটি সম্পাদনা করা যাবে না।
            </p>

            <Label title="মধ্যস্থতাকারীর লেখা সম্মত শর্তাবলি *">
              <textarea
                className={`${field} min-h-56`}
                value={settlement.terms}
                onChange={(e) =>
                  setSettlement((current) => ({
                    ...current,
                    terms: e.target.value,
                    approved: false,
                  }))
                }
                placeholder="দুই পক্ষ যে শর্তে সম্মত হয়েছেন, তা যাচাই করে এখানে লিখুন"
                required
              />
            </Label>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              className={secondary}
              onClick={() =>
                log(`সমঝোতাপত্রের খসড়া v${settlement.version} সংরক্ষিত`)
              }
            >
              খসড়া সংরক্ষণ
            </button>
            <button
              type="button"
              className={secondary}
              onClick={() => {
                setSettlement((x) => ({
                  ...x,
                  version: x.version + 1,
                  approved: false,
                }));
                setSignatures({ applicant: null, opposite: null });
                setSignedHash("");
                log("সমঝোতাপত্রের নতুন সংস্করণ তৈরি");
              }}
            >
              নতুন সংস্করণ তৈরি
            </button>
            <button
              type="button"
              className={primary}
              onClick={() => {
                if (!settlement.terms.trim()) {
                  setError("সমঝোতার শর্তাবলি লিখুন।");
                  return;
                }
                setSettlement((x) => ({ ...x, approved: true }));
                advance(
                  `মধ্যস্থতাকারী v${settlement.version} স্বাক্ষরের জন্য অনুমোদন করেছেন`,
                );
              }}
            >
              স্বাক্ষরের জন্য অনুমোদন →
            </button>
          </div>
          <p className="mt-4 text-xs text-slate-500">
            স্বাক্ষর নির্দিষ্ট অনুমোদিত সংস্করণের সঙ্গে যুক্ত থাকবে।
          </p>
        </div>
      )}

      {step === 8 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">৯. ই-স্বাক্ষরের ডেমো</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["applicant", "আবেদনকারী", registration.applicant],
              ["opposite", "অপর পক্ষ", registration.opposite],
            ].map(([key, label, name]) => (
              <div key={key} className={box}>
                <h3 className="font-bold">{label}</h3>
                <p className="mt-2">{name}</p>
                <p className="mt-2 text-sm">
                  {signatures[key]
                    ? `ডেমো স্বাক্ষর নথিভুক্ত: ${signatures[key].at}`
                    : "অপেক্ষমাণ"}
                </p>
                {!signatures[key] && (
                  <button
                    type="button"
                    className={`${primary} mt-4`}
                    onClick={() => {
                      setSigning(key);
                      setMobile("");
                      setOtp("");
                      setOtpSent(false);
                      setError("");
                    }}
                  >
                    পরিচয় যাচাই ও স্বাক্ষর
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className={box}>
            <h3 className="font-bold">নথির অখণ্ডতা</h3>
            <p className="mt-2 break-all font-mono text-xs text-slate-600">
              {signedHash || "প্রথম ডেমো স্বাক্ষরের সময় SHA-256 hash তৈরি হবে।"}
            </p>
            <p className="mt-3 text-xs text-slate-500">
              OTP ও স্বাক্ষর কেবল স্থানীয় UI simulation; এটি বৈধ ই-স্বাক্ষর সেবা
              নয়।
            </p>
          </div>
          {signing && (
            <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="sign-title"
                className="w-full max-w-md rounded-2xl bg-white p-6"
              >
                <h3 id="sign-title" className="text-xl font-bold">
                  {signing === "applicant" ? "আবেদনকারী" : "অপর পক্ষ"}-এর ডেমো
                  স্বাক্ষর
                </h3>
                <p className="mt-3 text-sm">
                  ডেমো OTP: <strong>123456</strong>
                </p>
                <Label title="মোবাইল নম্বর">
                  <input
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    placeholder="01XXXXXXXXX"
                    maxLength={11}
                    className={field}
                    value={mobile}
                    onChange={(e) => {
                      setMobile(e.target.value.replace(/\D/g, ""));
                      setOtpSent(false);
                      setOtp("");
                    }}
                  />
                </Label>

                <button
                  type="button"
                  className={`${secondary} mt-3`}
                  onClick={() => {
                    if (!/^01[3-9]\d{8}$/.test(mobile)) {
                      setError("সঠিক ১১ সংখ্যার বাংলাদেশি মোবাইল নম্বর লিখুন।");
                      return;
                    }

                    setOtpSent(true);
                    setError("");
                  }}
                >
                  ডেমো OTP পাঠান
                </button>

                {otpSent && (
                  <p role="status" className="mt-3 text-sm text-emerald-800">
                    {mobile} নম্বরের জন্য ডেমো OTP প্রস্তুত। কোড:{" "}
                    <strong>123456</strong>
                  </p>
                )}

                <Label title="OTP">
                  <input
                    className={field}
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    disabled={!otpSent}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="৬ সংখ্যার কোড"
                  />
                </Label>
                <p className="mt-3 text-sm">
                  স্বাক্ষরের আগে সমঝোতাপত্রের v{settlement.version} সংস্করণ পড়া
                  হয়েছে বলে ধরে নেওয়া হচ্ছে।
                </p>
                <div className="mt-5 flex gap-2">
                  <button
                    type="button"
                    className={primary}
                    onClick={() => signParty(signing)}
                  >
                    যাচাই ও ডেমো স্বাক্ষর
                  </button>
                  <button
                    type="button"
                    className={secondary}
                    onClick={() => {
                      setSigning("");
                      setError("");
                    }}
                  >
                    বাতিল
                  </button>
                </div>
                {error && (
                  <p role="alert" className="mt-3 text-sm text-rose-700">
                    {error}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {step === 9 && (
        <div className={box}>
          <h2 className="text-xl font-bold">১০. চূড়ান্তকরণ</h2>
          <ul className="mt-5 space-y-3 text-sm">
            <li>
              ✓ আবেদনকারীর ডেমো স্বাক্ষর:{" "}
              {signatures.applicant ? "নথিভুক্ত" : "অপেক্ষমাণ"}
            </li>
            <li>
              ✓ অপর পক্ষের ডেমো স্বাক্ষর:{" "}
              {signatures.opposite ? "নথিভুক্ত" : "অপেক্ষমাণ"}
            </li>
            <li>✓ নথির সংস্করণ: v{settlement.version}</li>
            <li className="break-all">✓ SHA-256 hash: {signedHash}</li>
          </ul>
          <p className="mt-5 rounded-xl bg-amber-50 p-4 text-sm">
            চূড়ান্তকরণ মধ্যস্থতাকারীর মানবিক সিদ্ধান্ত। hash মিললেই সম্মতি বা
            আইনগত বৈধতা প্রমাণ হয় না।
          </p>
          <button
            type="button"
            className={`${primary} mt-5`}
            onClick={finalize}
          >
            যাচাই শেষে ডেমো চূড়ান্ত করুন →
          </button>
        </div>
      )}

      {step === 10 && (
        <form
          className={box}
          onSubmit={(e) => {
            e.preventDefault();
            advance("ফলো-আপ পরিকল্পনা সংরক্ষিত");
          }}
        >
          <h2 className="mb-5 text-xl font-bold">১১. ফলো-আপ পরিকল্পনা</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Label title="পরবর্তী তারিখ *">
              <input
                type="date"
                className={field}
                value={followup.date}
                onChange={(e) => patch(setFollowup, "date", e.target.value)}
                required
              />
            </Label>
            <Label title="দায়িত্বপ্রাপ্ত ব্যক্তি *">
              <input
                className={field}
                value={followup.responsible}
                onChange={(e) =>
                  patch(setFollowup, "responsible", e.target.value)
                }
                required
              />
            </Label>
            <Label title="অবস্থা">
              <select
                className={field}
                value={followup.status}
                onChange={(e) => patch(setFollowup, "status", e.target.value)}
              >
                <option>অপেক্ষমাণ</option>
                <option>সম্পন্ন</option>
                <option>সমস্যা জানানো হয়েছে</option>
              </select>
            </Label>
          </div>
          {!verified && (
            <p className="mt-4 rounded-xl bg-blue-50 p-3 text-sm">
              {outcome.kind} হওয়ায় সমঝোতাপত্র ও স্বাক্ষরের ধাপ প্রযোজ্য হয়নি।
            </p>
          )}
          <button className={`${primary} mt-5`}>
            ফলো-আপ সংরক্ষণ করে এগিয়ে যান →
          </button>
        </form>
      )}

      {step === 11 && (
        <div className={box}>
          <h2 className="text-xl font-bold">১২. কেস সমাপ্তি</h2>
          <p className="mt-4 text-sm">
            ফলাফল: <strong>{outcome.kind}</strong> · ফলো-আপ:{" "}
            <strong>{followup.status}</strong>
          </p>
          <p className="mt-3 text-sm">
            {verified
              ? "সমঝোতাপত্রের ডেমো চূড়ান্তকরণ সম্পন্ন।"
              : "পূর্ণ সমঝোতা না হওয়ায় পরবর্তী সহায়তার পরিকল্পনা নথিভুক্ত।"}
          </p>
          <button
            type="button"
            className={`${primary} mt-5`}
            onClick={() => {
              if (followup.status !== "সম্পন্ন") {
                setError(
                  "সমাপ্তির আগে ফলো-আপ অবস্থা ‘সম্পন্ন’ করুন। আগের ধাপে ফিরে অবস্থা পরিবর্তন করুন।",
                );
                return;
              }
              log("মানবিক পর্যালোচনার মাধ্যমে ডেমো কেস সমাপ্ত");
              setStep(12);
              setError("");
            }}
          >
            মানবিক পর্যালোচনায় কেস সমাপ্ত করুন
          </button>
        </div>
      )}
      {step === 12 && (
        <div className={box}>
          <h2 className="text-xl font-bold text-emerald-800">
            ডেমো কেস সমাপ্ত
          </h2>
          <p className="mt-3">
            {registration.mediationId} · {registration.caseId}
          </p>
          <p className="mt-2 text-sm text-slate-600">
            এই তথ্য শুধু বর্তমান পেজের ডেমো state-এ আছে; রিফ্রেশ করলে মুছে যাবে।
          </p>
          <button
            type="button"
            className={`${secondary} mt-5`}
            onClick={onBack}
          >
            মধ্যস্থতার তালিকায় ফিরুন
          </button>
        </div>
      )}
      {audit.length > 0 && (
        <details className={`${box} text-sm`}>
          <summary className="cursor-pointer font-bold">
            ডেমো অডিট ট্রেইল ({audit.length})
          </summary>
          <ol className="mt-4 space-y-2">
            {audit.map((event, i) => (
              <li key={i} className="border-t pt-2">
                {event.action} · {event.at}
              </li>
            ))}
          </ol>
        </details>
      )}
    </div>
  );
}
