"use client";

import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import DlaoSections from "./DlaoSections";
import ReferralWorkspace from "./ReferralWorkspace";
import DuplicateReview from "./DuplicateReview";
import CaseSupportDashboard from "./CaseSupportDashboard";

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
  "duplicate",
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
  const [activeRole, setActiveRole] = useState("clo");
  const [selectedCase, setSelectedCase] = useState(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [managementStep, setManagementStep] = useState(1);

  const [cases, setCases] = useState([
    {
      id: "LA-2026-00125",
      applicant: "নুচিং মারমা",
      representative: "ইউডিসি (UDC) সহায়তাকারী",
      issue: "জমি / প্রবেশাধিকার সংক্রান্ত বিরোধ",
      safety: "উচ্চ ঝুঁকি (অপেক্ষমাণ)",
      consent: "অপেক্ষমাণ",
      advice: "শুরু হয়নি",
      source: "ইউডিসি সহায়তাপ্রাপ্ত (UDC-assisted)",
      assignedTo: null,

      workflow: {
        safeContact: "অপেক্ষমাণ",
        identityVerification: "অপেক্ষমাণ",
        representativeInfo: "অপেক্ষমাণ",
        informedConsent: "অপেক্ষমাণ",
        legalAdvice: "শুরু হয়নি",
        nextAction: "নির্বাচিত নয়",
        notice: "এখনও যোগ্য নয়",
        mediation: "শুরু হয়নি",
      },

      location: "খাগড়াছড়ি, চট্টগ্রাম পার্বত্য অঞ্চল",
      language: "মারমা",
      applicationMethod: "ইউডিসি-এর মাধ্যমে সহায়তাপ্রাপ্ত",
      digitalAccess: "সীমিত",
      network: "দুর্বল / অস্থির",
      literacyAccessibility: "সহায়তা প্রয়োজন",
      udcRole: "আবেদন এবং ফরম পূরণে সহায়তা",
      statement:
        "আবেদনকারীর নিজস্ব বক্তব্য ইউডিসি-প্রবিষ্ট তথ্য থেকে আলাদাভাবে রেকর্ড করা হয়েছে",
      translation: "মারমা → বাংলা (যেখানে প্রয়োজন)",
      applicantConfirmation: "পড়ে শুনিয়ে নিশ্চিতকরণ প্রয়োজন",
      safeContactStatus: "নিশ্চিত করতে হবে",
      informedConsentStatus: "নিশ্চিত করতে হবে",
      riskLevel: "উচ্চ",
    },
    {
      id: "LA-2026-00126",
      applicant: "নাবিলা",
      representative: "প্রযোজ্য নয়",
      issue: "ডিজিটাল ক্ষতি / অনলাইন হয়রানি",
      safety: "উচ্চ ঝুঁকি (অপেক্ষমাণ)",
      consent: "অপেক্ষমাণ",
      advice: "শুরু হয়নি",
      source: "ডিজিটাল / নাগরিক ইনটেক",
      assignedTo: null,

      workflow: {
        safeContact: "অপেক্ষমাণ",
        identityVerification: "অপেক্ষমাণ",
        representativeInfo: "অপেক্ষমাণ",
        informedConsent: "অপেক্ষমাণ",
        legalAdvice: "শুরু হয়নি",
        nextAction: "নির্বাচিত নয়",
        notice: "এখনও যোগ্য নয়",
        mediation: "শুরু হয়নি",
      },

      location: "ঝিনাইদহ",
      natureOfProblem: "ভুয়া/সম্পাদিত ছবি বা ডিজিটাল কন্টেন্ট সংক্রান্ত ক্ষতি",
      digitalSafety: "উচ্চ গোপনীয়তা প্রয়োজন",
      privacyRisk:
        "সংবেদনশীল তথ্য এবং প্রমাণের জন্য সীমিত প্রবেশাধিকার প্রয়োজন",
      evidence: "ডিজিটাল প্রমাণ / স্ক্রিনশট / প্রাসঙ্গিক অনলাইন কন্টেন্ট",
      communication: "নিরাপদ এবং গোপনীয় যোগাযোগ প্রয়োজন",
      applicantConfirmation: "প্রয়োজন",
      informedConsentStatus: "প্রয়োজন",
      riskLevel: "উচ্চ",
    },
    {
      id: "LA-2026-00127",
      applicant: "ময়ূরী আক্তার",
      representative: "রিপন — ভাই / প্রতিনিধি",
      issue: "পরিবার / ভরণপোষণ",
      safety: "সাধারণ ঝুঁকি",
      consent: "সম্পন্ন",
      advice: "চলমান",
      source: "অনলাইন ইনটেক",
      assignedTo: "officer-a",

      workflow: {
        safeContact: "সম্পন্ন",
        identityVerification: "সম্পন্ন",
        representativeInfo: "সম্পন্ন",
        informedConsent: "সম্পন্ন",
        legalAdvice: "চলমান",
        nextAction: "আইনি নোটিশ প্রেরণ",
        notice: "প্রস্তুত হচ্ছে",
        mediation: "শুরু হয়নি",
      },

      location: "সিলেট সদর, সিলেট",
      language: "বাংলা",
      applicationMethod: "স্বয়ংক্রিয় অনলাইন আবেদন",
      digitalAccess: "সম্পূর্ণ",
      network: "ভাল / স্থিতিশীল",
      literacyAccessibility: "স্বনির্ভর",
      evidence: "বিয়ের কাবিননামা ও দেনমোহর সংক্রান্ত কাগজপত্র",
      communication: "ফোন কল এবং হোয়াটসঅ্যাপ",
      applicantConfirmation: "সম্পন্ন",
      informedConsentStatus: "অনুমোদিত",
      riskLevel: "মধ্যম",
    },
    {
      id: "LA-2026-00128",
      applicant: "আব্দুল করিম",
      representative: "প্রযোজ্য নয়",
      issue: "শ্রমিক অধিকার / বকেয়া বেতন",
      safety: "কম ঝুঁকি",
      consent: "সম্পন্ন",
      advice: "সম্পন্ন",
      source: "কল সেন্টার / হেল্পলাইন",
      assignedTo: "officer-b",

      workflow: {
        safeContact: "সম্পন্ন",
        identityVerification: "সম্পন্ন",
        representativeInfo: "প্রযোজ্য নয়",
        informedConsent: "সম্পন্ন",
        legalAdvice: "সম্পন্ন",
        nextAction: "সালিশি বৈঠক (Mediation)",
        notice: "প্রেরিত",
        mediation: "প্রক্রিয়াধীন",
      },

      location: "গাজীপুর সদর, গাজীপুর",
      language: "বাংলা",
      applicationMethod: "ফোন কলের মাধ্যমে প্রবিষ্ট",
      digitalAccess: "সীমিত",
      network: "ভাল",
      literacyAccessibility: "সহায়তা প্রদান করা হয়েছে",
      evidence: "কারখানার পরিচয়পত্র ও ৩ মাসের ব্যাংক স্টেটমেন্ট",
      communication: "সরাসরি ফোন কল",
      applicantConfirmation: "সম্পন্ন",
      informedConsentStatus: "অনুমোদিত",
      riskLevel: "কম",
    },
    {
      id: "LA-2026-00129",
      applicant: "সুচরিতা চাকমা",
      representative: "রাজীব চাকমা — স্বামী",
      issue: "বাস্তুচ্যুত / গৃহহীন সংক্রান্ত আইনি সহায়তা",
      safety: "উচ্চ ঝুঁকি (অপেক্ষমাণ)",
      consent: "অপেক্ষমাণ",
      advice: "শুরু হয়নি",
      source: "ইউডিসি সহায়তাপ্রাপ্ত (UDC-assisted)",
      assignedTo: null,

      workflow: {
        safeContact: "অপেক্ষমাণ",
        identityVerification: "প্রক্রিয়াধীন",
        representativeInfo: "সম্পন্ন",
        informedConsent: "অপেক্ষমাণ",
        legalAdvice: "শুরু হয়নি",
        nextAction: "নির্বাচিত নয়",
        notice: "এখনও যোগ্য নয়",
        mediation: "শুরু হয়নি",
      },

      location: "রাঙ্গামাটি সদর, রাঙ্গামাটি",
      language: "চাকমা / বাংলা",
      applicationMethod: "ইউডিসি-এর মাধ্যমে সহায়তাপ্রাপ্ত",
      digitalAccess: "সীমিত",
      network: "অস্থির",
      literacyAccessibility: "সহায়তা প্রয়োজন",
      udcRole: "আবেদন তথ্য সংগ্রহ ও স্ক্যানিং সহায়তা",
      statement: "ইউডিসি প্রতিনিধির উপস্থিতিতে মৌখিক তথ্য রেকর্ড করা হয়েছে",
      translation: "চাকমা → বাংলা",
      applicantConfirmation: "পড়ে শুনিয়ে নিশ্চিতকরণ প্রয়োজন",
      safeContactStatus: "যাচাইকরণ বাকি",
      informedConsentStatus: "অপেক্ষমাণ",
      riskLevel: "উচ্চ",
    },
    {
      id: "LA-2026-00130",
      applicant: "মো: রফিকুল ইসলাম",
      representative: "প্রযোজ্য নয়",
      issue: "ভোক্তা অধিকার / আর্থিক প্রতারণা",
      safety: "কম ঝুঁকি",
      consent: "সম্পন্ন",
      advice: "চলমান",
      source: "অনলাইন ইনটেক",
      assignedTo: "officer-c",

      workflow: {
        safeContact: "সম্পন্ন",
        identityVerification: "সম্পন্ন",
        representativeInfo: "প্রযোজ্য নয়",
        informedConsent: "সম্পন্ন",
        legalAdvice: "চলমান",
        nextAction: "ভোক্তা অধিকার সংরক্ষণে অভিযোগ দায়ের",
        notice: "প্রস্তুত হচ্ছে",
        mediation: "শুরু হয়নি",
      },

      location: "বগুড়া সদর, বগুড়া",
      language: "বাংলা",
      applicationMethod: "স্বয়ংক্রিয় অনলাইন আবেদন",
      digitalAccess: "সম্পূর্ণ",
      network: "ভাল",
      literacyAccessibility: "স্বনির্ভর",
      evidence: "ই-কমার্স রসিদ এবং পেমেন্ট ট্রানজেকশন আইডি",
      communication: "ইমেইল ও ফোন কল",
      applicantConfirmation: "সম্পন্ন",
      informedConsentStatus: "অনুমোদিত",
      riskLevel: "কম",
    },
    {
      id: "LA-2026-00128",
      applicant: "রিনা বেগম",
      representative: "সেলিম — স্বামী / প্রতিনিধি",
      issue: "পারিবারিক বিরোধ",
      safety: "অপেক্ষমাণ",
      consent: "অপেক্ষমাণ",
      advice: "শুরু হয়নি",
      source: "অনলাইন",
      assignedTo: null,
      workflow: {
        safeContact: "অপেক্ষমাণ",
        identityVerification: "অপেক্ষমাণ",
        representativeInfo: "অপেক্ষমাণ",
        informedConsent: "অপেক্ষমাণ",
        legalAdvice: "শুরু হয়নি",
        nextAction: "নির্বাচিত নয়",
        notice: "এখনও যোগ্য নয়",
        mediation: "শুরু হয়নি",
      },
    },
    {
      id: "LA-2026-00129",
      applicant: "নাবিলা সুলতানা",
      representative: "কামাল — পিতা / প্রতিনিধি",
      issue: "ডিজিটাল হয়রানি",
      safety: "অপেক্ষমাণ",
      consent: "অপেক্ষমাণ",
      advice: "শুরু হয়নি",
      source: "১৬৬৯৯",
      assignedTo: null,
      workflow: {
        safeContact: "অপেক্ষমাণ",
        identityVerification: "অপেক্ষমাণ",
        representativeInfo: "অপেক্ষমাণ",
        informedConsent: "অপেক্ষমাণ",
        legalAdvice: "শুরু হয়নি",
        nextAction: "নির্বাচিত নয়",
        notice: "এখনও যোগ্য নয়",
        mediation: "শুরু হয়নি",
      },
    },
  ]);

  const roles = [
    {
      id: "clo",
      label: "চিফ লিগ্যাল এইড অফিসার",
      shortLabel: "CLO",
    },
    {
      id: "officer-a",
      label: "এ. রহমান",
      shortLabel: "এ. রহমান",
    },
    {
      id: "officer-b",
      label: "এস. চাকমা",
      shortLabel: "এস. চাকমা",
    },
    {
      id: "officer-c",
      label: "এম. হাসান",
      shortLabel: "এম. হাসান",
    },
  ];

  const roleCounts = roles.reduce((acc, role) => {
    acc[role.id] = cases.filter((item) => item.assignedTo === role.id).length;

    return acc;
  }, {});

  const assignedCases = cases.filter((item) => item.assignedTo === activeRole);

  function assignCase(roleId) {
    if (!selectedCase) return;

    setCases((currentCases) =>
      currentCases.map((item) =>
        item.id === selectedCase.id
          ? {
              ...item,
              assignedTo: roleId,
            }
          : item,
      ),
    );

    setActiveRole(roleId);
    setShowAssignModal(false);
    setSelectedCase(null);
  }

  function updateWorkflow(caseId, field, value) {
    setCases((currentCases) =>
      currentCases.map((item) =>
        item.id === caseId
          ? {
              ...item,
              workflow: {
                ...item.workflow,
                [field]: value,
              },
            }
          : item,
      ),
    );

    setSelectedCase((current) =>
      current && current.id === caseId
        ? {
            ...current,
            workflow: {
              ...current.workflow,
              [field]: value,
            },
          }
        : current,
    );
  }
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

  if (role === "dlo-administration-case-support") {
    return <CaseSupportDashboard />;
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

  if (active === "referrals") {
    return <ReferralWorkspace />;
  }

  if (active === "duplicate") {
    return <DuplicateReview />;
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

      <div className="mt-6 space-y-6">
        {/* ================= ROLE TABS ================= */}
        <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
            {roles.map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => setActiveRole(role.id)}
                className={`rounded-xl px-4 py-3 text-left transition ${
                  activeRole === role.id
                    ? "bg-emerald-800 text-white shadow-sm"
                    : "bg-slate-50 text-slate-700 hover:bg-emerald-50"
                }`}
              >
                <div className="text-sm font-bold">{role.shortLabel}</div>

                <div
                  className={`mt-1 text-xs ${
                    activeRole === role.id
                      ? "text-emerald-100"
                      : "text-slate-500"
                  }`}
                >
                  {role.label}
                </div>

                <div className="mt-2">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${
                      activeRole === role.id
                        ? "bg-white/15 text-white"
                        : "bg-white text-slate-600"
                    }`}
                  >
                    {roleCounts[role.id] || 0} টি মামলা
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ================= ASSIGNED CASES ================= */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {roles.find((role) => role.id === activeRole)?.label}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  এই ভূমিকায় দায়িত্বপ্রাপ্ত মামলাসমূহ
                </p>
              </div>

              <span className="w-fit rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800">
                মোট {assignedCases.length} টি মামলা
              </span>
            </div>
          </div>

          {assignedCases.length === 0 ? (
            <div className="px-5 py-14 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
                📂
              </div>

              <h3 className="mt-4 text-base font-bold text-slate-800">
                কোনো মামলা দায়িত্বপ্রাপ্ত নেই
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                এই ভূমিকায় বর্তমানে কোনো মামলা পরিচালনার জন্য বরাদ্দ করা হয়নি।
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[1100px] w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-600">
                    <th className="px-4 py-3">মামলা</th>
                    <th className="px-4 py-3">আবেদনকারী</th>
                    <th className="px-4 py-3">বিষয়</th>
                    <th className="px-4 py-3">নিরাপত্তা</th>
                    <th className="px-4 py-3">সম্মতি</th>
                    <th className="px-4 py-3">পরামর্শ</th>
                    <th className="px-4 py-3">অ্যাকশন</th>
                  </tr>
                </thead>

                <tbody>
                  {assignedCases.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-slate-100 last:border-0"
                    >
                      <td className="px-4 py-4 font-bold text-slate-900">
                        {item.id}
                      </td>

                      <td className="px-4 py-4">
                        <div className="font-semibold text-slate-800">
                          {item.applicant}
                        </div>

                        <div className="mt-1 text-xs text-slate-500">
                          {item.representative}
                        </div>
                      </td>

                      <td className="px-4 py-4 font-medium text-slate-700">
                        {item.issue}
                      </td>

                      <td className="px-4 py-4">
                        <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                          {item.safety}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                          {item.consent}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                          {item.advice}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCase(item);
                            setManagementStep(1);
                            setShowManageModal(true);
                          }}
                          className="rounded-lg bg-emerald-800 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-700"
                        >
                          পরিচালনা করুন
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ================= UNASSIGNED CASE QUEUE ================= */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-5">
            <h2 className="text-lg font-bold text-slate-900">
              মামলা দায়িত্ব প্রদান তালিকা
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              নতুন মামলাগুলো পর্যালোচনা করে সংশ্লিষ্ট কর্মকর্তাকে দায়িত্ব দিন
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[1100px] w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-600">
                  <th className="px-4 py-3">মামলা নম্বর</th>
                  <th className="px-4 py-3">আবেদনকারী</th>
                  <th className="px-4 py-3">উৎস</th>
                  <th className="px-4 py-3">বিষয়</th>
                  <th className="px-4 py-3">ঝুঁকি</th>
                  <th className="px-4 py-3">বর্তমান অবস্থা</th>
                  <th className="px-4 py-3">তথ্য</th>
                  <th className="px-4 py-3">অ্যাকশন</th>
                </tr>
              </thead>

              <tbody>
                {cases
                  .filter((item) => item.assignedTo === null)
                  .map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-slate-100 last:border-0"
                    >
                      <td className="px-4 py-4 font-bold text-slate-900">
                        {item.id}
                      </td>

                      <td className="px-4 py-4">
                        <div className="font-semibold text-slate-800">
                          {item.applicant}
                        </div>

                        <div className="mt-1 text-xs text-slate-500">
                          {item.representative}
                        </div>
                      </td>

                      <td className="px-4 py-4 font-medium text-slate-700">
                        {item.source}
                      </td>

                      <td className="px-4 py-4 font-medium text-slate-700">
                        {item.issue}
                      </td>

                      <td className="px-4 py-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700">
                          <span className="h-2 w-2 rounded-full bg-red-500" />
                          উচ্চ
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                          দায়িত্বহীন
                        </span>
                      </td>

                      {/* VIEW INFO */}
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCase(item);
                            setShowInfoModal(true);
                          }}
                          className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                        >
                          তথ্য দেখুন
                        </button>
                      </td>

                      {/* ASSIGN */}
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCase(item);
                            setShowAssignModal(true);
                          }}
                          className="rounded-lg bg-[#174a78] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#123d64]"
                        >
                          অ্যাসাইন/হ্যান্ডেল
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ================= CASE INFO MODAL ================= */}
        {showInfoModal && selectedCase && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
            <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
              {/* Header */}
              <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-6 py-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    মামলার বিস্তারিত তথ্য
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    {selectedCase.id}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowInfoModal(false);
                    setSelectedCase(null);
                  }}
                  className="rounded-lg px-3 py-2 text-slate-500 transition hover:bg-slate-100"
                >
                  ✕
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto p-6">
                {/* Basic Case Information */}
                <section>
                  <h4 className="mb-4 text-sm font-bold text-slate-900">
                    মামলার মৌলিক তথ্য
                  </h4>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold text-slate-500">
                        মামলা নম্বর
                      </p>
                      <p className="mt-1 font-bold text-slate-900">
                        {selectedCase.id}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-slate-500">
                        আবেদনকারী
                      </p>
                      <p className="mt-1 font-semibold text-slate-800">
                        {selectedCase.applicant}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-slate-500">
                        প্রতিনিধি
                      </p>
                      <p className="mt-1 font-semibold text-slate-800">
                        {selectedCase.representative}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-slate-500">
                        আবেদন উৎস
                      </p>
                      <p className="mt-1 font-semibold text-slate-800">
                        {selectedCase.source}
                      </p>
                    </div>

                    <div className="sm:col-span-2">
                      <p className="text-xs font-semibold text-slate-500">
                        সমস্যার ধরন
                      </p>
                      <p className="mt-1 font-semibold text-slate-800">
                        {selectedCase.issue}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-slate-500">
                        ঝুঁকির মাত্রা
                      </p>
                      <p className="mt-1 font-semibold text-red-600">
                        {selectedCase.riskLevel}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-slate-500">
                        নিরাপত্তা অবস্থা
                      </p>
                      <p className="mt-1 font-semibold text-amber-700">
                        {selectedCase.safety}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-slate-500">
                        সম্মতি
                      </p>
                      <p className="mt-1 font-semibold text-amber-700">
                        {selectedCase.consent}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-slate-500">
                        আইনি পরামর্শ
                      </p>
                      <p className="mt-1 font-semibold text-slate-800">
                        {selectedCase.advice}
                      </p>
                    </div>
                  </div>
                </section>

                {/* Workflow */}
                <section className="mt-7 border-t border-slate-200 pt-6">
                  <h4 className="mb-4 text-sm font-bold text-slate-900">
                    মানবিক পর্যালোচনা ও ওয়ার্কফ্লো
                  </h4>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-semibold text-slate-500">
                        নিরাপদ যোগাযোগ
                      </p>
                      <p className="mt-1 text-sm font-semibold text-amber-700">
                        {selectedCase.workflow?.safeContact || "তথ্য নেই"}
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-semibold text-slate-500">
                        পরিচয় যাচাই
                      </p>
                      <p className="mt-1 text-sm font-semibold text-amber-700">
                        {selectedCase.workflow?.identityVerification ||
                          "তথ্য নেই"}
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-semibold text-slate-500">
                        প্রতিনিধির তথ্য
                      </p>
                      <p className="mt-1 text-sm font-semibold text-amber-700">
                        {selectedCase.workflow?.representativeInfo ||
                          "তথ্য নেই"}
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-semibold text-slate-500">
                        অবহিত সম্মতি
                      </p>
                      <p className="mt-1 text-sm font-semibold text-amber-700">
                        {selectedCase.workflow?.informedConsent || "তথ্য নেই"}
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-semibold text-slate-500">
                        আইনি পরামর্শ
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {selectedCase.workflow?.legalAdvice || "তথ্য নেই"}
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-semibold text-slate-500">
                        পরবর্তী পদক্ষেপ
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {selectedCase.workflow?.nextAction || "তথ্য নেই"}
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-semibold text-slate-500">
                        নোটিশ
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {selectedCase.workflow?.notice || "তথ্য নেই"}
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-semibold text-slate-500">
                        মধ্যস্থতা
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {selectedCase.workflow?.mediation || "তথ্য নেই"}
                      </p>
                    </div>
                  </div>
                </section>

                {/* Location & Accessibility */}
                <section className="mt-7 border-t border-slate-200 pt-6">
                  <h4 className="mb-4 text-sm font-bold text-slate-900">
                    আবেদনকারীর অবস্থান ও অ্যাক্সেসিবিলিটি
                  </h4>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold text-slate-500">
                        অবস্থান
                      </p>
                      <p className="mt-1 font-semibold text-slate-800">
                        {selectedCase.location}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-slate-500">
                        ভাষা
                      </p>
                      <p className="mt-1 font-semibold text-slate-800">
                        {selectedCase.language}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-slate-500">
                        আবেদন পদ্ধতি
                      </p>
                      <p className="mt-1 font-semibold text-slate-800">
                        {selectedCase.applicationMethod}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-slate-500">
                        ডিজিটাল অ্যাক্সেস
                      </p>
                      <p className="mt-1 font-semibold text-slate-800">
                        {selectedCase.digitalAccess}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-slate-500">
                        নেটওয়ার্ক পরিস্থিতি
                      </p>
                      <p className="mt-1 font-semibold text-slate-800">
                        {selectedCase.network}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-slate-500">
                        সাক্ষরতা / অ্যাক্সেসিবিলিটি
                      </p>
                      <p className="mt-1 font-semibold text-slate-800">
                        {selectedCase.literacyAccessibility}
                      </p>
                    </div>
                  </div>
                </section>

                {/* UDC Information */}
                <section className="mt-7 border-t border-slate-200 pt-6">
                  <h4 className="mb-4 text-sm font-bold text-slate-900">
                    ইউডিসি সহায়তা
                  </h4>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold text-slate-500">
                        ইউডিসি-এর ভূমিকা
                      </p>
                      <p className="mt-1 font-semibold text-slate-800">
                        {selectedCase.udcRole}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-slate-500">
                        অনুবাদ
                      </p>
                      <p className="mt-1 font-semibold text-slate-800">
                        {selectedCase.translation}
                      </p>
                    </div>
                  </div>
                </section>

                {/* Applicant Statement */}
                <section className="mt-7 border-t border-slate-200 pt-6">
                  <h4 className="mb-4 text-sm font-bold text-slate-900">
                    আবেদনকারীর বক্তব্য ও নিশ্চিতকরণ
                  </h4>

                  <div className="space-y-4">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-semibold text-slate-500">
                        বক্তব্য
                      </p>

                      <p className="mt-2 text-sm leading-6 text-slate-700">
                        {selectedCase.statement}
                      </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-xs font-semibold text-slate-500">
                          আবেদনকারী নিশ্চিতকরণ
                        </p>
                        <p className="mt-1 font-semibold text-amber-700">
                          {selectedCase.applicantConfirmation}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-slate-500">
                          নিরাপদ যোগাযোগের অবস্থা
                        </p>
                        <p className="mt-1 font-semibold text-amber-700">
                          {selectedCase.safeContactStatus}
                        </p>
                      </div>

                      <div className="sm:col-span-2">
                        <p className="text-xs font-semibold text-slate-500">
                          অবহিত সম্মতির অবস্থা
                        </p>
                        <p className="mt-1 font-semibold text-amber-700">
                          {selectedCase.informedConsentStatus}
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Assigned Officer */}
                <section className="mt-7 border-t border-slate-200 pt-6">
                  <h4 className="mb-4 text-sm font-bold text-slate-900">
                    দায়িত্বপ্রাপ্ত কর্মকর্তা
                  </h4>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold text-slate-500">
                      দায়িত্বপ্রাপ্ত
                    </p>

                    <p className="mt-1 font-semibold text-slate-800">
                      {selectedCase.assignedTo ||
                        "এখনও কাউকে দায়িত্ব দেওয়া হয়নি"}
                    </p>
                  </div>
                </section>
              </div>

              {/* Footer */}
              <div className="flex shrink-0 justify-end border-t border-slate-200 px-6 py-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowInfoModal(false);
                    setSelectedCase(null);
                  }}
                  className="rounded-lg bg-slate-800 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-700"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= ASSIGN MODAL ================= */}
        {showAssignModal && selectedCase && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
              <div className="border-b border-slate-200 px-6 py-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      মামলা দায়িত্ব প্রদান
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      {selectedCase.id}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setShowAssignModal(false);
                      setSelectedCase(null);
                    }}
                    className="rounded-lg px-3 py-2 text-slate-500 hover:bg-slate-100"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="space-y-3 p-6">
                <p className="mb-4 text-sm text-slate-600">
                  এই মামলাটি কার কাছে দায়িত্ব দেবেন নির্বাচন করুন:
                </p>

                {/* SELF HANDLE */}
                <button
                  type="button"
                  onClick={() => assignCase("clo")}
                  className="flex w-full items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-left transition hover:border-emerald-400 hover:bg-emerald-100"
                >
                  <div>
                    <div className="text-sm font-bold text-emerald-900">
                      নিজে দায়িত্ব নিন
                    </div>

                    <div className="mt-1 text-xs text-emerald-700">
                      চিফ লিগ্যাল এইড অফিসার
                    </div>
                  </div>

                  <span className="text-emerald-700">→</span>
                </button>

                {/* OFFICER A */}
                <button
                  type="button"
                  onClick={() => assignCase("officer-a")}
                  className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-4 text-left transition hover:border-emerald-400 hover:bg-emerald-50"
                >
                  <div>
                    <div className="text-sm font-bold text-slate-800">
                      রহমান কে দায়িত্ব দিন
                    </div>

                    <div className="mt-1 text-xs text-slate-500">এ. রহমান</div>
                  </div>

                  <span className="text-emerald-700">→</span>
                </button>

                {/* OFFICER B */}
                <button
                  type="button"
                  onClick={() => assignCase("officer-b")}
                  className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-4 text-left transition hover:border-emerald-400 hover:bg-emerald-50"
                >
                  <div>
                    <div className="text-sm font-bold text-slate-800">
                      চাকমা কে দায়িত্ব দিন
                    </div>

                    <div className="mt-1 text-xs text-slate-500">এস. চাকমা</div>
                  </div>

                  <span className="text-emerald-700">→</span>
                </button>

                {/* OFFICER C */}
                <button
                  type="button"
                  onClick={() => assignCase("officer-c")}
                  className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-4 text-left transition hover:border-emerald-400 hover:bg-emerald-50"
                >
                  <div>
                    <div className="text-sm font-bold text-slate-800">
                      হাসান কে দায়িত্ব দিন
                    </div>

                    <div className="mt-1 text-xs text-slate-500">এম. হাসান</div>
                  </div>

                  <span className="text-emerald-700">→</span>
                </button>
              </div>

              <div className="border-t border-slate-200 px-6 py-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedCase(null);
                  }}
                  className="w-full rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-200"
                >
                  বাতিল
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {selected && (
        <ReviewDialog
          selected={selected}
          onClose={() => setSelected(null)}
          onSubmit={submitReview}
          message={message}
        />
      )}

      {/* ================= CASE MANAGEMENT MODAL ================= */}
      {showManageModal && selectedCase && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/60 p-4">
          <div className="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* ================= HEADER ================= */}
            <div className="border-b border-slate-200 bg-white px-5 py-4 sm:px-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                    {activeRole === "officer-a"
                      ? "এ. রহমান — মামলা পরিচালনা"
                      : activeRole === "officer-b"
                        ? "এস. চাকমা — মামলা পরিচালনা"
                        : activeRole === "officer-c"
                          ? "এম. হাসান — মামলা পরিচালনা"
                          : "চিফ লিগ্যাল এইড অফিসার — মামলা পরিচালনা"}
                  </h2>

                  <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                    <span className="font-bold text-slate-800">
                      {selectedCase.id}
                    </span>

                    <span className="text-slate-400">•</span>

                    <span className="text-slate-600">
                      {selectedCase.applicant}
                    </span>

                    <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700">
                      উচ্চ ঝুঁকি
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowManageModal(false);
                    setSelectedCase(null);
                  }}
                  className="shrink-0 rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* ================= MODAL BODY ================= */}
            <div className="max-h-[calc(92vh-80px)] overflow-y-auto">
              <div className="space-y-6 p-5 sm:p-6">
                {/* ================= HUMAN LED WORKFLOW NOTICE ================= */}
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-sm font-bold text-emerald-900">
                    মানব-নিয়ন্ত্রিত কার্যপ্রবাহ
                  </p>

                  <p className="mt-2 text-sm leading-6 text-emerald-900/80">
                    সংবেদনশীল তথ্য সংগ্রহ বা কোনো নোটিশ পাঠানোর আগে কর্মকর্তাকে
                    নিরাপদ যোগাযোগের সুযোগ নিশ্চিত করতে হবে। AI সম্মতি, যোগ্যতা,
                    নিরাপত্তা বা মধ্যস্থতা সম্পর্কে কোনো সিদ্ধান্ত নেয় না।
                  </p>
                </div>

                {/* ================= WORKFLOW STEPS ================= */}
                {/* ================= WORKFLOW STEPS ================= */}
                <div className="grid gap-2 sm:grid-cols-3">
                  {/* STEP 1 */}
                  <button
                    type="button"
                    onClick={() => setManagementStep(1)}
                    className={`rounded-xl border px-4 py-3 text-left transition ${
                      managementStep === 1
                        ? "border-emerald-300 bg-emerald-50"
                        : "border-slate-200 bg-slate-50 hover:border-emerald-300 hover:bg-emerald-50"
                    }`}
                  >
                    <div
                      className={`text-xs font-bold ${
                        managementStep === 1
                          ? "text-emerald-700"
                          : "text-slate-500"
                      }`}
                    >
                      ধাপ ১
                    </div>

                    <div
                      className={`mt-1 text-sm font-bold ${
                        managementStep === 1
                          ? "text-emerald-900"
                          : "text-slate-800"
                      }`}
                    >
                      নিরাপদ যোগাযোগ ও সম্মতি
                    </div>
                  </button>

                  {/* STEP 2 */}
                  <button
                    type="button"
                    onClick={() => setManagementStep(2)}
                    className={`rounded-xl border px-4 py-3 text-left transition ${
                      managementStep === 2
                        ? "border-emerald-300 bg-emerald-50"
                        : "border-slate-200 bg-slate-50 hover:border-emerald-300 hover:bg-emerald-50"
                    }`}
                  >
                    <div
                      className={`text-xs font-bold ${
                        managementStep === 2
                          ? "text-emerald-700"
                          : "text-slate-500"
                      }`}
                    >
                      ধাপ ২
                    </div>

                    <div
                      className={`mt-1 text-sm font-bold ${
                        managementStep === 2
                          ? "text-emerald-900"
                          : "text-slate-800"
                      }`}
                    >
                      আইনি পরামর্শ
                    </div>
                  </button>

                  {/* STEP 3 */}
                  <button
                    type="button"
                    onClick={() => setManagementStep(3)}
                    className={`rounded-xl border px-4 py-3 text-left transition ${
                      managementStep === 3
                        ? "border-emerald-300 bg-emerald-50"
                        : "border-slate-200 bg-slate-50 hover:border-emerald-300 hover:bg-emerald-50"
                    }`}
                  >
                    <div
                      className={`text-xs font-bold ${
                        managementStep === 3
                          ? "text-emerald-700"
                          : "text-slate-500"
                      }`}
                    >
                      ধাপ ৩
                    </div>

                    <div
                      className={`mt-1 text-sm font-bold ${
                        managementStep === 3
                          ? "text-emerald-900"
                          : "text-slate-800"
                      }`}
                    >
                      আইনি সহায়তা / নিরাপত্তা যাচাই
                    </div>
                  </button>
                </div>

                {/* ================= ACTIVE WORKFLOW CONTENT ================= */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                  {/* STEP 1 CONTENT */}
                  {/* STEP 1 CONTENT */}
                  {managementStep === 1 && (
                    <div className="space-y-5">
                      <div>
                        <h3 className="text-base font-bold text-slate-900">
                          নিরাপদ যোগাযোগ ও সম্মতি
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-slate-500">
                          আবেদনকারীর সঙ্গে নিরাপদ যোগাযোগ নিশ্চিত করে পরিচয়,
                          প্রতিনিধির তথ্য এবং অবহিত সম্মতির বিষয়গুলো যাচাই করুন।
                        </p>
                      </div>

                      <div className="space-y-3">
                        {/* SAFE CONTACT */}
                        <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm font-bold text-slate-800">
                              নিরাপদ যোগাযোগ
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              আবেদনকারীর সঙ্গে নিরাপদ যোগাযোগের সুযোগ নিশ্চিত
                              হয়েছে কি না।
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              updateWorkflow(
                                selectedCase.id,
                                "safeContact",
                                "সম্পন্ন",
                              )
                            }
                            disabled={
                              selectedCase.workflow?.safeContact === "সম্পন্ন"
                            }
                            className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
                              selectedCase.workflow?.safeContact === "সম্পন্ন"
                                ? "cursor-not-allowed bg-emerald-100 text-emerald-700"
                                : "bg-emerald-800 text-white hover:bg-emerald-700"
                            }`}
                          >
                            {selectedCase.workflow?.safeContact === "সম্পন্ন"
                              ? "সম্পন্ন হয়েছে"
                              : "সম্পন্ন করুন"}
                          </button>
                        </div>

                        {/* IDENTITY VERIFICATION */}
                        <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm font-bold text-slate-800">
                              পরিচয় / আবেদনকারী যাচাই
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              আবেদনকারীর পরিচয় ও প্রদত্ত তথ্য যাচাই করুন।
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              updateWorkflow(
                                selectedCase.id,
                                "identityVerification",
                                "সম্পন্ন",
                              )
                            }
                            disabled={
                              selectedCase.workflow?.identityVerification ===
                              "সম্পন্ন"
                            }
                            className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
                              selectedCase.workflow?.identityVerification ===
                              "সম্পন্ন"
                                ? "cursor-not-allowed bg-emerald-100 text-emerald-700"
                                : "bg-emerald-800 text-white hover:bg-emerald-700"
                            }`}
                          >
                            {selectedCase.workflow?.identityVerification ===
                            "সম্পন্ন"
                              ? "সম্পন্ন হয়েছে"
                              : "সম্পন্ন করুন"}
                          </button>
                        </div>

                        {/* REPRESENTATIVE INFORMATION */}
                        <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm font-bold text-slate-800">
                              প্রতিনিধির তথ্য
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              প্রতিনিধি সম্পর্কিত তথ্য যাচাই ও নথিভুক্ত করুন।
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              updateWorkflow(
                                selectedCase.id,
                                "representativeInfo",
                                "সম্পন্ন",
                              )
                            }
                            disabled={
                              selectedCase.workflow?.representativeInfo ===
                              "সম্পন্ন"
                            }
                            className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
                              selectedCase.workflow?.representativeInfo ===
                              "সম্পন্ন"
                                ? "cursor-not-allowed bg-emerald-100 text-emerald-700"
                                : "bg-emerald-800 text-white hover:bg-emerald-700"
                            }`}
                          >
                            {selectedCase.workflow?.representativeInfo ===
                            "সম্পন্ন"
                              ? "সম্পন্ন হয়েছে"
                              : "সম্পন্ন করুন"}
                          </button>
                        </div>

                        {/* INFORMED CONSENT */}
                        <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm font-bold text-slate-800">
                              অবহিত সম্মতি
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              আবেদনকারীর অবহিত সম্মতি নথিভুক্ত করুন।
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              updateWorkflow(
                                selectedCase.id,
                                "informedConsent",
                                "সম্পন্ন",
                              )
                            }
                            disabled={
                              selectedCase.workflow?.informedConsent ===
                              "সম্পন্ন"
                            }
                            className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
                              selectedCase.workflow?.informedConsent ===
                              "সম্পন্ন"
                                ? "cursor-not-allowed bg-emerald-100 text-emerald-700"
                                : "bg-emerald-800 text-white hover:bg-emerald-700"
                            }`}
                          >
                            {selectedCase.workflow?.informedConsent ===
                            "সম্পন্ন"
                              ? "সম্পন্ন হয়েছে"
                              : "সম্পন্ন করুন"}
                          </button>
                        </div>
                      </div>

                      {/* STEP 1 STATUS */}
                      <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                        <p className="text-xs font-bold text-emerald-800">
                          ধাপ ১-এর অবস্থা
                        </p>

                        <p className="mt-1 text-sm font-semibold text-emerald-900">
                          {
                            [
                              selectedCase.workflow?.safeContact,
                              selectedCase.workflow?.identityVerification,
                              selectedCase.workflow?.representativeInfo,
                              selectedCase.workflow?.informedConsent,
                            ].filter((item) => item === "সম্পন্ন").length
                          }{" "}
                          / ৪টি ধাপ সম্পন্ন
                        </p>
                      </div>
                    </div>
                  )}

                  {/* STEP 2 CONTENT */}
                  {managementStep === 2 && (
                    <div className="space-y-5">
                      <div>
                        <h3 className="text-base font-bold text-slate-900">
                          আইনি পরামর্শ
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-slate-500">
                          প্রয়োজনীয় তথ্য যাচাই ও সম্মতি নিশ্চিত হওয়ার পর
                          আবেদনকারীকে উপযুক্ত আইনি পরামর্শ প্রদান করুন।
                        </p>
                      </div>

                      <div className="rounded-xl border border-slate-200 bg-white p-4">
                        <p className="text-xs font-semibold text-slate-500">
                          বর্তমান অবস্থা
                        </p>

                        <div className="mt-2">
                          <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                            শুরু হয়নি
                          </span>
                        </div>
                      </div>

                      <div className="rounded-xl border border-slate-200 bg-white p-4">
                        <label className="text-sm font-bold text-slate-800">
                          কর্মকর্তার পরামর্শ / নোট
                        </label>

                        <textarea
                          rows={4}
                          placeholder="আইনি পরামর্শের সংক্ষিপ্ত বিবরণ লিখুন..."
                          className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10"
                        />
                      </div>

                      <button
                        type="button"
                        className="rounded-lg bg-emerald-800 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700"
                      >
                        আইনি পরামর্শ সংরক্ষণ করুন
                      </button>
                    </div>
                  )}

                  {/* STEP 3 CONTENT */}
                  {managementStep === 3 && (
                    <div className="space-y-5">
                      <div>
                        <h3 className="text-base font-bold text-slate-900">
                          আইনি সহায়তা / নিরাপত্তা যাচাই
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-slate-500">
                          নিরাপত্তা, যোগ্যতা এবং পরবর্তী পদক্ষেপ কর্মকর্তার
                          মানবিক পর্যালোচনার মাধ্যমে নির্ধারণ করা হবে।
                        </p>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-xl border border-slate-200 bg-white p-4">
                          <p className="text-xs font-semibold text-slate-500">
                            পরবর্তী পদক্ষেপ
                          </p>

                          <span className="mt-2 inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                            নির্বাচিত নয়
                          </span>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-white p-4">
                          <p className="text-xs font-semibold text-slate-500">
                            নোটিশ
                          </p>

                          <span className="mt-2 inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                            এখনও যোগ্য নয়
                          </span>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-white p-4">
                          <p className="text-xs font-semibold text-slate-500">
                            ওডিআর / মধ্যস্থতা
                          </p>

                          <span className="mt-2 inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                            শুরু হয়নি
                          </span>
                        </div>

                        <div className="rounded-xl border border-red-100 bg-red-50 p-4">
                          <p className="text-xs font-semibold text-red-600">
                            নিরাপত্তা যাচাই
                          </p>

                          <span className="mt-2 inline-flex rounded-full bg-red-100 px-2.5 py-1 text-xs font-bold text-red-700">
                            কর্মকর্তার পর্যালোচনা প্রয়োজন
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="rounded-lg bg-emerald-800 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700"
                      >
                        পরবর্তী পদক্ষেপ নির্ধারণ করুন
                      </button>
                    </div>
                  )}
                </div>

                {/* ================= CURRENT STATUS ================= */}
                <section>
                  <h3 className="mb-4 text-base font-bold text-slate-900">
                    বর্তমান অবস্থা
                  </h3>

                  <div className="grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <p className="text-xs font-semibold text-slate-500">
                        আবেদনকারী
                      </p>

                      <p className="mt-1 font-bold text-slate-900">
                        {selectedCase.applicant}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-slate-500">
                        প্রতিনিধি
                      </p>

                      <p className="mt-1 font-semibold text-slate-800">
                        {selectedCase.representative}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-slate-500">
                        বিষয়
                      </p>

                      <p className="mt-1 font-semibold text-slate-800">
                        {selectedCase.issue}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-slate-500">
                        দায়িত্বপ্রাপ্ত কর্মকর্তা
                      </p>

                      <p className="mt-1 font-semibold text-slate-800">
                        {activeRole === "officer-a"
                          ? "এ. রহমান"
                          : activeRole === "officer-b"
                            ? "এস. চাকমা"
                            : activeRole === "officer-c"
                              ? "এম. হাসান"
                              : "CLO — নিজ দায়িত্ব"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-slate-500">
                        অবস্থা
                      </p>

                      <span className="mt-1 inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
                        দায়িত্বপ্রাপ্ত — কর্মকর্তার যোগাযোগ অপেক্ষমাণ
                      </span>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-slate-500">
                        ঝুঁকি
                      </p>

                      <span className="mt-1 inline-flex rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700">
                        উচ্চ
                      </span>
                    </div>
                  </div>
                </section>

                {/* ================= WORKFLOW STATE ================= */}
                <section>
                  <h3 className="mb-4 text-base font-bold text-slate-900">
                    কার্যপ্রবাহের অবস্থা
                  </h3>

                  <div className="overflow-hidden rounded-xl border border-slate-200">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[650px] text-sm">
                        <thead>
                          <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-bold text-slate-600">
                            <th className="px-4 py-3">কার্যপ্রবাহ</th>

                            <th className="px-4 py-3">অবস্থা</th>
                          </tr>
                        </thead>

                        <tbody>
                          <tr className="border-b border-slate-100">
                            <td className="px-4 py-3 font-semibold text-slate-800">
                              নিরাপদ যোগাযোগ
                            </td>

                            <td className="px-4 py-3">
                              <span
                                className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                                  selectedCase.workflow?.safeContact ===
                                  "সম্পন্ন"
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-amber-50 text-amber-700"
                                }`}
                              >
                                {selectedCase.workflow?.safeContact ||
                                  "অপেক্ষমাণ"}
                              </span>
                            </td>
                          </tr>

                          <tr className="border-b border-slate-100">
                            <td className="px-4 py-3 font-semibold text-slate-800">
                              পরিচয় / আবেদনকারী যাচাই
                            </td>

                            <td className="px-4 py-3">
                              <span
                                className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                                  selectedCase.workflow
                                    ?.identityVerification === "সম্পন্ন"
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-amber-50 text-amber-700"
                                }`}
                              >
                                {selectedCase.workflow?.identityVerification ||
                                  "অপেক্ষমাণ"}
                              </span>
                            </td>
                          </tr>

                          <tr className="border-b border-slate-100">
                            <td className="px-4 py-3 font-semibold text-slate-800">
                              প্রতিনিধির তথ্য
                            </td>

                            <td className="px-4 py-3">
                              <span
                                className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                                  selectedCase.workflow
                                    ?.identityVerification === "সম্পন্ন"
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-amber-50 text-amber-700"
                                }`}
                              >
                                {selectedCase.workflow?.identityVerification ||
                                  "অপেক্ষমাণ"}
                              </span>
                            </td>
                          </tr>

                          <tr className="border-b border-slate-100">
                            <td className="px-4 py-3 font-semibold text-slate-800">
                              অবহিত সম্মতি
                            </td>

                            <td className="px-4 py-3">
                              <span
                                className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                                  selectedCase.workflow?.representativeInfo ===
                                  "সম্পন্ন"
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-amber-50 text-amber-700"
                                }`}
                              >
                                {selectedCase.workflow?.representativeInfo ||
                                  "অপেক্ষমাণ"}
                              </span>
                            </td>
                          </tr>

                          <tr className="border-b border-slate-100">
                            <td className="px-4 py-3 font-semibold text-slate-800">
                              আইনি পরামর্শ
                            </td>

                            <td className="px-4 py-3">
                              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                                শুরু হয়নি
                              </span>
                            </td>
                          </tr>

                          <tr className="border-b border-slate-100">
                            <td className="px-4 py-3 font-semibold text-slate-800">
                              পরবর্তী পদক্ষেপ
                            </td>

                            <td className="px-4 py-3">
                              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                                নির্বাচিত নয়
                              </span>
                            </td>
                          </tr>

                          <tr className="border-b border-slate-100">
                            <td className="px-4 py-3 font-semibold text-slate-800">
                              নোটিশ
                            </td>

                            <td className="px-4 py-3">
                              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                                এখনও যোগ্য নয়
                              </span>
                            </td>
                          </tr>

                          <tr>
                            <td className="px-4 py-3 font-semibold text-slate-800">
                              ওডিআর / মধ্যস্থতা
                            </td>

                            <td className="px-4 py-3">
                              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                                শুরু হয়নি
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </section>

                {/* ================= TIMELINE ================= */}
                <section>
                  <h3 className="mb-4 text-base font-bold text-slate-900">
                    কার্যক্রমের সময়রেখা
                  </h3>

                  <div className="space-y-4">
                    <div className="relative border-l-2 border-emerald-200 pl-5">
                      <div className="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-emerald-700" />

                      <p className="text-sm font-bold text-slate-900">
                        CLO — মামলা দায়িত্ব প্রদান
                      </p>

                      <p className="mt-1 text-sm text-slate-600">
                        দায়িত্বপ্রাপ্ত কর্মকর্তা এ. রহমান নির্ধারণ করা হয়েছে।
                      </p>
                    </div>

                    <div className="relative border-l-2 border-slate-200 pl-5">
                      <div className="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-slate-400" />

                      <p className="text-sm font-bold text-slate-900">
                        CLO — মামলা দায়িত্ব প্রদান
                      </p>

                      <p className="mt-1 text-sm text-slate-600">
                        দায়িত্ব CLO — নিজ দায়িত্ব হিসেবে নির্ধারণ করা হয়েছে।
                      </p>
                    </div>

                    <div className="relative border-l-2 border-slate-200 pl-5">
                      <div className="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-slate-400" />

                      <p className="text-sm font-bold text-slate-900">
                        CLO — মামলা দায়িত্ব প্রদান
                      </p>

                      <p className="mt-1 text-sm text-slate-600">
                        দায়িত্ব CLO — নিজ দায়িত্ব হিসেবে নির্ধারণ করা হয়েছে।
                      </p>
                    </div>

                    <div className="relative border-l-2 border-slate-200 pl-5">
                      <div className="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-slate-400" />

                      <p className="text-sm font-bold text-slate-900">
                        CLO — মামলা দায়িত্ব প্রদান
                      </p>

                      <p className="mt-1 text-sm text-slate-600">
                        দায়িত্বপ্রাপ্ত কর্মকর্তা এ. রহমান নির্ধারণ করা হয়েছে।
                      </p>
                    </div>

                    <div className="relative border-l-2 border-slate-200 pl-5">
                      <div className="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-slate-400" />

                      <p className="text-sm font-bold text-slate-900">
                        CLO — মামলা দায়িত্ব প্রদান
                      </p>

                      <p className="mt-1 text-sm text-slate-600">
                        দায়িত্বপ্রাপ্ত কর্মকর্তা এম. হাসান নির্ধারণ করা হয়েছে।
                      </p>
                    </div>

                    <div className="relative border-l-2 border-slate-200 pl-5">
                      <div className="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-slate-400" />

                      <p className="text-sm font-bold text-slate-900">
                        CLO — মামলা দায়িত্ব প্রদান
                      </p>

                      <p className="mt-1 text-sm text-slate-600">
                        দায়িত্বপ্রাপ্ত কর্মকর্তা এম. হাসান নির্ধারণ করা হয়েছে।
                      </p>
                    </div>

                    <div className="relative pl-5">
                      <div className="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-slate-400" />

                      <p className="text-sm font-bold text-slate-900">
                        সিস্টেম — মামলা তৈরি
                      </p>

                      <p className="mt-1 text-sm text-slate-600">
                        ১৬৬৯৯ ভয়েস গ্রহণ; প্রতিনিধি: রিপন।
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            </div>

            {/* ================= FOOTER ================= */}
            <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-5 py-4 sm:px-6">
              <button
                type="button"
                onClick={() => {
                  setShowManageModal(false);
                  setSelectedCase(null);
                }}
                className="rounded-lg bg-slate-800 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-700"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
