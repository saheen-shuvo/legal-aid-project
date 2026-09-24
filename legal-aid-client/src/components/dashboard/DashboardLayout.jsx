/* eslint-disable react/no-unescaped-entities */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FiActivity,
  FiArchive,
  FiCheck,
  FiClipboard,
  FiFileText,
  FiFlag,
  FiGrid,
  FiLayers,
  FiMenu,
  FiRepeat,
  FiShield,
  FiUsers,
  FiX,
} from "react-icons/fi";

const dlaoItems = [
  { label: "কমান্ড সেন্টার", icon: FiGrid, href: "#command-centre" },
  { label: "আবেদনসমূহ", icon: FiClipboard, href: "#applications" },
  { label: "হিউম্যান রিভিউ কিউ", icon: FiFlag, href: "#human-queue" },
  { label: "ইউনিফাইড কেস রেকর্ডস", icon: FiArchive, href: "#case-records" },
  { label: "টাস্ক এবং ফলো-আপ", icon: FiCheck, href: "#tasks-follow-up" },
  {
    label: "এআই অ্যাসিস্ট্যান্স সেন্টার",
    icon: FiActivity,
    href: "#ai-assistance",
  },
  { label: "নথিপত্র", icon: FiFileText, href: "#documents" },
  { label: "প্যানেল আইনজীবী", icon: FiUsers, href: "#panel-lawyers" },
  { label: "রেফারেল", icon: FiRepeat, href: "#referrals" },
  { label: "সালিশি ও মধ্যস্থতা", icon: FiLayers, href: "#mediation" },
  { label: "অফলাইন ও সিঙ্ক", icon: FiRepeat, href: "#offline-sync" },
  { label: "নিরাপত্তা ও গোপনীয়তা", icon: FiShield, href: "#safety-privacy" },
  { label: "অডিট ট্রেইল", icon: FiActivity, href: "#audit-trail" },
  { label: "২৩ রিকোয়ারমেন্ট কভারেজ", icon: FiCheck, href: "#coverage" },
];

export default function DashboardLayout({ role, roleConfig, children }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dialog, setDialog] = useState(null);
  const [taskCreated, setTaskCreated] = useState(false);
  const [activeHash, setActiveHash] = useState("#command-centre");
  const isDlao = role === "dlao";
  const items = isDlao
    ? dlaoItems
    : [
        { label: "ড্যাশবোর্ড", icon: FiGrid, href: "#command-centre" },
        { label: "আবেদনসমূহ", icon: FiClipboard, href: "#applications" },
        { label: "নথিপত্র", icon: FiFileText },
        { label: "সেটিংস", icon: FiShield },
      ];

  useEffect(() => {
    const updateHash = () =>
      setActiveHash(window.location.hash || "#command-centre");
    updateHash();
    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, [role]);

  useEffect(() => {
    if (!dialog && !drawerOpen) return;
    const onEscape = (event) => {
      if (event.key === "Escape") {
        setDrawerOpen(false);
        setDialog(null);
      }
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [dialog, drawerOpen]);

  function sidebar() {
    return (
      <>
        <div className="border-b border-white/10 px-8 pb-6 pt-9">
          <Link
            href="/"
            className="text-[22px] font-extrabold tracking-tight text-white"
          >
            লিগ্যাল এইড
          </Link>
          <p className="mt-1 text-[13px] font-semibold text-emerald-100/75">
            পাঁচ দরজা · এক রেকর্ড
          </p>
        </div>
        <div className="mx-5 mt-4 rounded-xl bg-white/[0.09] px-4 py-3.5 leading-tight text-white">
          <p className="text-[15px] font-bold">
            {isDlao ? "DLAO Command Centre" : roleConfig.title}
          </p>
          <p className="mt-1 text-[13px] text-white/65">
            {isDlao ? "District Legal Aid Officer" : "Role-based dashboard"}
          </p>
        </div>
        <nav
          className="space-y-1.5 px-5 pb-8 pt-4"
          aria-label="Dashboard navigation"
        >
          {items.map(({ label, icon: Icon, href }, index) =>
            href ? (
              <a
                href={href}
                key={label}
                onClick={() => setDrawerOpen(false)}
                aria-current={activeHash === href ? "page" : undefined}
                className={`flex min-h-11 items-center gap-2.5 rounded-xl px-4 py-2.5 text-[14px] font-medium transition hover:bg-white/15 ${
                  activeHash === href || (!activeHash && index === 0)
                    ? "bg-white/[0.14] text-white"
                    : "text-white/80"
                }`}
              >
                <Icon size={15} aria-hidden="true" />
                {label}
              </a>
            ) : (
              <span
                key={label}
                aria-disabled="true"
                className="flex min-h-11 items-center gap-2.5 rounded-xl px-4 py-2.5 text-[14px] font-medium text-white/75"
              >
                <Icon size={15} aria-hidden="true" />
                {label}
              </span>
            ),
          )}
        </nav>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f9ff] text-[#202b3e] lg:flex">
      <aside className="hidden w-[clamp(260px,18.4vw,360px)] shrink-0 bg-[#0d392e] lg:block">
        <div className="sticky top-0 max-h-screen overflow-y-auto">
          {sidebar()}
        </div>
      </aside>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 bg-slate-950/55"
          />
          <aside className="relative h-full w-[min(85vw,320px)] overflow-y-auto bg-[#0d392e] shadow-2xl">
            <button
              type="button"
              aria-label="Close navigation"
              onClick={() => setDrawerOpen(false)}
              className="absolute right-4 top-5 rounded-lg p-2 text-white hover:bg-white/10"
            >
              <FiX size={20} aria-hidden="true" />
            </button>
            {sidebar()}
          </aside>
        </div>
      )}

      <div className="min-w-0 flex-1">
        <header className="flex min-h-[86px] flex-wrap items-center justify-between gap-3 border-b border-[#e3e9f5] bg-white px-5 py-3 sm:px-8">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              aria-label="নেভিগেশন খুলুন"
              onClick={() => setDrawerOpen(true)}
              className="rounded-lg p-2 hover:bg-slate-100 lg:hidden"
            >
              <FiMenu size={22} aria-hidden="true" />
            </button>

            <p className="text-sm font-bold text-[#52627b]">
              {isDlao ? "DLAO / ২৩/২৩ কভারেজ" : roleConfig.title}
            </p>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <span className="rounded-full bg-[#e5f6ef] px-3 py-1 text-xs font-bold text-[#245846]">
              ● ডেমো মোড
            </span>

            <button
              type="button"
              onClick={() => setDialog("policy")}
              className="text-xs font-bold text-slate-900 hover:text-emerald-800 sm:text-sm"
            >
              ডেটা নীতি
            </button>

            {isDlao && (
              <button
                type="button"
                onClick={() => {
                  setTaskCreated(false);
                  setDialog("task");
                }}
                className="rounded-xl bg-[#0d392e] px-3 py-2.5 text-xs font-bold text-white hover:bg-[#175341] sm:px-5 sm:text-sm"
              >
                + নতুন কাজ
              </button>
            )}
          </div>
        </header>

        <main className="mx-auto max-w-[1700px] px-5 pb-12 pt-5 sm:px-8 xl:px-[4.5%]">
          {children}
        </main>
      </div>

      {dialog && (
        <div className="fixed inset-0 z-[60] grid place-items-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/55"
            aria-label="Close dialog"
            onClick={() => setDialog(null)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="dashboard-dialog-title"
            className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <button
              type="button"
              aria-label="Close dialog"
              onClick={() => setDialog(null)}
              className="absolute right-4 top-4 rounded-lg p-2 text-slate-600 hover:bg-slate-100"
            >
              <FiX aria-hidden="true" />
            </button>
            <h2
              id="dashboard-dialog-title"
              className="pr-8 text-lg font-bold text-slate-900"
            >
              {dialog === "policy" ? "Data Policy" : "New Task · Demo"}
            </h2>
            {dialog === "policy" ? (
              <p className="mt-4 text-sm leading-7 text-slate-600">
                এই স্ক্রিনে প্রতিযোগিতার ডেমোর জন্য কাল্পনিক রেকর্ড ব্যবহার করা
                হয়েছে। কোনো লাইভ সিস্টেম থেকে আবেদন, মামলা বা ব্যক্তিগত তথ্য
                সংগ্রহ করা হয় না।
              </p>
            ) : (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  const form = new FormData(event.currentTarget);

                  window.dispatchEvent(
                    new CustomEvent("dlao-demo-task", {
                      detail: {
                        title: String(form.get("title") || "").trim(),
                        notes: String(form.get("notes") || "").trim(),
                      },
                    }),
                  );

                  setTaskCreated(true);
                  event.currentTarget.reset();
                }}
                className="mt-5 space-y-4"
              >
                <label className="block text-sm font-semibold">
                  কাজের শিরোনাম
                  <input
                    required
                    name="title"
                    className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-700"
                    placeholder="যেমন: আবেদনটির ফলো-আপ করুন"
                  />
                </label>

                <label className="block text-sm font-semibold">
                  নোট
                  <textarea
                    name="notes"
                    rows={3}
                    className="mt-2 w-full resize-none rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-700"
                    placeholder="সংক্ষিপ্ত বিবরণ"
                  />
                </label>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-[#0d392e] px-4 py-3 font-semibold text-white hover:bg-[#175341]"
                >
                  ডেমো কাজ তৈরি করুন
                </button>

                {taskCreated && (
                  <p
                    role="status"
                    className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-900"
                  >
                    এই সেশনের জন্য কাজটি "কাজ ও ফলো-আপ" বিভাগে যোগ করা হয়েছে।{" "}
                    <a
                      href="#tasks-follow-up"
                      onClick={() => setDialog(null)}
                      className="font-bold underline"
                    >
                      কাজগুলো দেখুন
                    </a>
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
