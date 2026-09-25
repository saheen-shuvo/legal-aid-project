"use client";

import { useState } from "react";

const stepNames = ["নিবন্ধন", "নিরাপত্তা", "নথিপত্র", "সময়সূচি"];

const initialDocuments = [
  { name: "আইনগত সহায়তার আবেদন", status: "যাচাই বাকি" },
  { name: "সহায়ক বিবৃতি", status: "যাচাই বাকি" },
  { name: "পরিচয় ও যোগাযোগের তথ্য", status: "যাচাই বাকি" },
];

const inputClass =
  "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-emerald-700";

const cardClass =
  "rounded-2xl border border-[#d6e0f2] bg-white p-5 shadow-sm sm:p-6";

function Field({ label, children }) {
  return (
    <label className="block text-sm font-semibold text-slate-700">
      {label}
      {children}
    </label>
  );
}

export default function MediationWorkflow({ onBack }) {
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [finished, setFinished] = useState(false);

  const [registration, setRegistration] = useState({
    caseId: "CASE-2026-0142",
    mediationId: "MED-2026-0042",
    applicant: "ময়ূরী আক্তার",
    oppositeParty: "",
    matter: "",
    source: "DLAO রেফারেল",
    mediator: "",
    language: "বাংলা",
  });

  const [safety, setSafety] = useState({
    safeContact: "ফোন কল",
    contactTime: "",
    voluntary: false,
    noImmediateRisk: false,
  });

  const [documents, setDocuments] = useState(initialDocuments);

  const [schedule, setSchedule] = useState({
    date: "",
    time: "",
    mode: "সরাসরি উপস্থিতি",
    location: "",
    remoteLink: "",
  });

  const [noticesSent, setNoticesSent] = useState(false);

  function updateRegistration(event) {
    const { name, value } = event.target;
    setRegistration((current) => ({ ...current, [name]: value }));
  }

  function updateSchedule(event) {
    const { name, value } = event.target;
    setSchedule((current) => ({ ...current, [name]: value }));
  }

  function goBack() {
    setError("");
    if (finished) {
      setFinished(false);
      setStep(3);
    } else if (step > 0) {
      setStep((current) => current - 1);
    } else {
      onBack?.();
    }
  }

  function submitRegistration(event) {
    event.preventDefault();
    setError("");
    setStep(1);
  }

  function submitSafety(event) {
    event.preventDefault();

    if (!safety.voluntary || !safety.noImmediateRisk) {
      setError(
        "স্বেচ্ছায় অংশগ্রহণ ও নিরাপত্তা নিশ্চিত হয়নি। দায়িত্বপ্রাপ্ত কর্মকর্তা পর্যালোচনা না করা পর্যন্ত মধ্যস্থতার পরবর্তী ধাপে যাওয়া যাবে না।",
      );
      return;
    }

    setError("");
    setStep(2);
  }

  function submitDocuments(event) {
    event.preventDefault();

    if (documents.some((document) => document.status === "যাচাই বাকি")) {
      setError("প্রতিটি নথি যাচাই করুন অথবা সমস্যাযুক্ত হিসেবে চিহ্নিত করুন।");
      return;
    }

    setError("");
    setStep(3);
  }

  function submitSchedule(event) {
    event.preventDefault();
    setError("");
    setFinished(true);
  }

  function updateDocument(index, status) {
    setDocuments((current) =>
      current.map((document, currentIndex) =>
        currentIndex === index ? { ...document, status } : document,
      ),
    );
    setError("");
  }

  return (
    <div className="space-y-6 text-[#253449]">
      <div>
        <button
          type="button"
          onClick={goBack}
          className="mb-3 text-sm font-semibold text-emerald-800 hover:underline"
        >
          ← {step === 0 && !finished ? "মধ্যস্থতার তালিকায় ফিরুন" : "আগের ধাপ"}
        </button>

        <p className="text-sm font-semibold text-emerald-800">
          DLAO / মধ্যস্থতা কার্যক্রম
        </p>
        <h1 className="mt-2 text-3xl font-bold">সালিশি ও মধ্যস্থতা</h1>
        <p className="mt-2 text-slate-600">
          একই কেস রেকর্ডে নিবন্ধন, নিরাপত্তা যাচাই, নথি পর্যালোচনা ও সময়সূচি।
        </p>
      </div>

      {/* Step indicator */}
      <ol className="grid gap-2 sm:grid-cols-4">
        {stepNames.map((name, index) => (
          <li
            key={name}
            aria-current={!finished && step === index ? "step" : undefined}
            className={`rounded-xl border px-4 py-3 text-sm font-semibold ${
              finished || index < step
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : index === step
                  ? "border-blue-300 bg-blue-50 text-blue-800"
                  : "border-slate-200 bg-white text-slate-500"
            }`}
          >
            {index + 1}. {name}
          </li>
        ))}
      </ol>

      {error && (
        <p
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"
        >
          {error}
        </p>
      )}

      {finished ? (
        <div className={cardClass}>
          <h2 className="text-xl font-bold text-emerald-800">
            ডেমো সময়সূচি প্রস্তুত
          </h2>
          <p className="mt-3">
            {registration.mediationId} · {registration.applicant} ও{" "}
            {registration.oppositeParty}
          </p>
          <p className="mt-2 text-sm text-slate-600">
            {schedule.date} · {schedule.time} · {schedule.mode}
          </p>
          <p className="mt-4 text-sm text-slate-600">
            এটি শুধু আপনার ব্রাউজারে দেখানো ডেমো। কোনো পক্ষকে বাস্তবে নোটিশ
            পাঠানো হয়নি।
          </p>

          <button
            type="button"
            onClick={() => setNoticesSent(true)}
            className="mt-5 rounded-xl bg-[#0d392e] px-5 py-3 font-semibold text-white"
          >
            ডেমো নোটিশ প্রস্তুত করুন
          </button>

          {noticesSent && (
            <p role="status" className="mt-3 text-sm text-emerald-800">
              আবেদনকারী, অপর পক্ষ ও মধ্যস্থতাকারীর জন্য ডেমো নোটিশ প্রস্তুত।
            </p>
          )}
        </div>
      ) : step === 0 ? (
        <form onSubmit={submitRegistration} className={cardClass}>
          <h2 className="mb-5 text-xl font-bold">১. মধ্যস্থতা নিবন্ধন</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="কেস আইডি">
              <input
                value={registration.caseId}
                readOnly
                className={inputClass}
              />
            </Field>

            <Field label="মধ্যস্থতা আইডি">
              <input
                value={registration.mediationId}
                readOnly
                className={inputClass}
              />
            </Field>

            <Field label="আবেদনকারীর নাম *">
              <input
                name="applicant"
                value={registration.applicant}
                onChange={updateRegistration}
                required
                className={inputClass}
              />
            </Field>

            <Field label="অপর পক্ষের নাম *">
              <input
                name="oppositeParty"
                value={registration.oppositeParty}
                onChange={updateRegistration}
                required
                className={inputClass}
              />
            </Field>

            <Field label="বিরোধের বিষয় *">
              <input
                name="matter"
                value={registration.matter}
                onChange={updateRegistration}
                required
                placeholder="যেমন: পারিবারিক ভরণপোষণ"
                className={inputClass}
              />
            </Field>

            <Field label="রেফারেলের উৎস *">
              <input
                name="source"
                value={registration.source}
                onChange={updateRegistration}
                required
                className={inputClass}
              />
            </Field>

            <Field label="মধ্যস্থতাকারীর নাম *">
              <input
                name="mediator"
                value={registration.mediator}
                onChange={updateRegistration}
                required
                className={inputClass}
              />
            </Field>

            <Field label="ভাষা">
              <select
                name="language"
                value={registration.language}
                onChange={updateRegistration}
                className={inputClass}
              >
                <option>বাংলা</option>
                <option>ইংরেজি</option>
                <option>অন্যান্য</option>
              </select>
            </Field>
          </div>

          <button
            type="submit"
            className="mt-6 rounded-xl bg-[#0d392e] px-5 py-3 font-semibold text-white"
          >
            নিবন্ধন করে এগিয়ে যান →
          </button>
        </form>
      ) : step === 1 ? (
        <form onSubmit={submitSafety} className={cardClass}>
          <h2 className="mb-2 text-xl font-bold">
            ২. পক্ষসমূহের সম্মতি ও নিরাপত্তা
          </h2>
          <p className="mb-5 text-sm text-slate-600">
            সেশন নির্ধারণের আগে নিরাপদ যোগাযোগ ও স্বেচ্ছায় অংশগ্রহণ যাচাই করুন।
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="নিরাপদ যোগাযোগের মাধ্যম">
              <select
                value={safety.safeContact}
                onChange={(event) =>
                  setSafety({
                    ...safety,
                    safeContact: event.target.value,
                  })
                }
                className={inputClass}
              >
                <option>ফোন কল</option>
                <option>এসএমএস</option>
                <option>ইউডিসির সহায়তায়</option>
                <option>এখন যোগাযোগ নিরাপদ নয়</option>
              </select>
            </Field>

            <Field label="যোগাযোগের নিরাপদ সময় *">
              <input
                value={safety.contactTime}
                onChange={(event) =>
                  setSafety({
                    ...safety,
                    contactTime: event.target.value,
                  })
                }
                required
                placeholder="যেমন: সন্ধ্যা ৬টা–৮টা"
                className={inputClass}
              />
            </Field>
          </div>

          <div className="mt-5 space-y-3">
            <label className="flex items-start gap-3 rounded-xl border border-slate-200 p-4 text-sm">
              <input
                type="checkbox"
                checked={safety.voluntary}
                onChange={(event) =>
                  setSafety({
                    ...safety,
                    voluntary: event.target.checked,
                  })
                }
                className="mt-1"
              />
              আবেদনকারী স্বেচ্ছায় অংশ নিচ্ছেন এবং বিষয়টি তাঁকে বুঝিয়ে বলা হয়েছে।
            </label>

            <label className="flex items-start gap-3 rounded-xl border border-slate-200 p-4 text-sm">
              <input
                type="checkbox"
                checked={safety.noImmediateRisk}
                onChange={(event) =>
                  setSafety({
                    ...safety,
                    noImmediateRisk: event.target.checked,
                  })
                }
                className="mt-1"
              />
              এই পথে মধ্যস্থতা চালানোর ক্ষেত্রে তাৎক্ষণিক নিরাপত্তা ঝুঁকি পাওয়া যায়নি।
            </label>
          </div>

          <p className="mt-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
            কোনো পক্ষের নিরাপত্তা ঝুঁকি থাকলে বা অংশগ্রহণ স্বেচ্ছায় না হলে
            মধ্যস্থতা থামিয়ে দায়িত্বপ্রাপ্ত কর্মকর্তার পর্যালোচনা প্রয়োজন।
          </p>

          <button
            type="submit"
            className="mt-6 rounded-xl bg-[#0d392e] px-5 py-3 font-semibold text-white"
          >
            নিরাপত্তা নিশ্চিত করে এগিয়ে যান →
          </button>
        </form>
      ) : step === 2 ? (
        <form onSubmit={submitDocuments} className={cardClass}>
          <h2 className="mb-2 text-xl font-bold">৩. নথিপত্র পর্যালোচনা</h2>
          <p className="mb-5 text-sm text-slate-600">
            প্রতিটি নথির অবস্থা যাচাই করুন। সমস্যা থাকলে তা দৃশ্যমান রাখুন।
          </p>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[540px] text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3">নথি</th>
                  <th className="px-4 py-3">অবস্থা</th>
                  <th className="px-4 py-3">পদক্ষেপ</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((document, index) => (
                  <tr
                    key={document.name}
                    className="border-t border-slate-200"
                  >
                    <td className="px-4 py-4">{document.name}</td>
                    <td className="px-4 py-4">{document.status}</td>
                    <td className="px-4 py-4">
                      <select
                        aria-label={`${document.name}-এর অবস্থা`}
                        value={document.status}
                        onChange={(event) =>
                          updateDocument(index, event.target.value)
                        }
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2"
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

          <p className="mt-5 rounded-xl bg-blue-50 p-4 text-sm text-blue-900">
            পড়া যায় না এমন নথির তথ্য অনুমান করা হবে না। প্রয়োজনীয় ব্যাখ্যা বা
            নতুন নথির সিদ্ধান্ত মধ্যস্থতাকারী নেবেন।
          </p>

          <button
            type="submit"
            className="mt-6 rounded-xl bg-[#0d392e] px-5 py-3 font-semibold text-white"
          >
            নথি পর্যালোচনা শেষ করে এগিয়ে যান →
          </button>
        </form>
      ) : (
        <form onSubmit={submitSchedule} className={cardClass}>
          <h2 className="mb-2 text-xl font-bold">
            ৪. সেশনের সময়সূচি ও নোটিশ
          </h2>
          <p className="mb-5 text-sm text-slate-600">
            তারিখ, সময় ও সেশনে অংশ নেওয়ার পদ্ধতি নির্ধারণ করুন।
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="তারিখ *">
              <input
                type="date"
                name="date"
                value={schedule.date}
                onChange={updateSchedule}
                required
                className={inputClass}
              />
            </Field>

            <Field label="সময় *">
              <input
                type="time"
                name="time"
                value={schedule.time}
                onChange={updateSchedule}
                required
                className={inputClass}
              />
            </Field>

            <Field label="সেশনের ধরন">
              <select
                name="mode"
                value={schedule.mode}
                onChange={updateSchedule}
                className={inputClass}
              >
                <option>সরাসরি উপস্থিতি</option>
                <option>অনলাইন</option>
                <option>হাইব্রিড</option>
              </select>
            </Field>

            <Field label="স্থান / সভার বিবরণ *">
              <input
                name="location"
                value={schedule.location}
                onChange={updateSchedule}
                required
                placeholder="যেমন: জেলা লিগ্যাল এইড অফিস"
                className={inputClass}
              />
            </Field>

            {schedule.mode !== "সরাসরি উপস্থিতি" && (
              <div className="sm:col-span-2">
                <Field label="অনলাইন সভার লিংক *">
                  <input
                    name="remoteLink"
                    value={schedule.remoteLink}
                    onChange={updateSchedule}
                    required
                    placeholder="https://..."
                    className={inputClass}
                  />
                </Field>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="mt-6 rounded-xl bg-[#0d392e] px-5 py-3 font-semibold text-white"
          >
            সময়সূচি সংরক্ষণ করুন
          </button>
        </form>
      )}
    </div>
  );
}