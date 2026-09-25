import Link from "next/link";
import {
  FiBriefcase,
  FiGlobe,
  FiMessageSquare,
  FiPhoneCall,
  FiUsers,
} from "react-icons/fi";

const actions = [
  {
    number: "০১",
    title: "ফোনে সহায়তা (16699)",
    description: "ফোনে কথা বলার জন্য সহায়তার অনুরোধ করুন।",
    href: "/apply/voice",
    icon: FiPhoneCall,
  },
  {
    number: "০২",
    title: "এসএমএস সহায়তা",
    description: "মোবাইলে বার্তার মাধ্যমে সহায়তা চান।",
    href: "/apply/sms",
    icon: FiMessageSquare,
  },
  {
    number: "০৩",
    title: "অনলাইনে আবেদন",
    description: "ওয়েবের মাধ্যমে আইনগত সহায়তার আবেদন করুন।",
    href: "/login",
    icon: FiGlobe,
  },
  {
    number: "০৪",
    title: "ইউডিসির মাধ্যমে আবেদন",
    description: "ইউডিসি সহায়তাকারীর মাধ্যমে আবেদন শুরু করুন।",
    href: "/login",
    icon: FiUsers,
  },
  {
    number: "০৫",
    title: "ডিএলএও রেফারেল",
    description: "বিদ্যমান বিষয়ে রেফারেলের তথ্য প্রদান করুন।",
    href: "/login",
    icon: FiBriefcase,
  },
];

export default function ActionCards() {
  return (
    <section
      aria-labelledby="action-cards-title"
      className="bg-[#f7faf9] px-4 py-16 sm:px-6 sm:py-20"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <span className="text-sm font-bold tracking-wide text-emerald-700">
            সেবা গ্রহণের মাধ্যম
          </span>

          <h2
            id="action-cards-title"
            className="mt-3 text-3xl font-bold text-emerald-950 sm:text-4xl"
          >
            একটি সেবা, পাঁচটি মাধ্যম
          </h2>

          <p className="mt-4 text-xs leading-7 text-slate-600">
            প্রতিটি মাধ্যম সেবা গ্রহণের আলাদা ইন্টারফেস। পরিকল্পনা অনুযায়ী সব
            মাধ্যমের তথ্য একই মূল কেস নথিতে যুক্ত হবে।
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
          {actions.map((action, index) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.href}
                href={action.href}
                className={`group flex min-h-64 flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700 lg:col-span-2 ${
                  index === 3 ? "lg:col-start-2" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800 transition group-hover:bg-emerald-800 group-hover:text-white">
                    <Icon size={27} aria-hidden="true" />
                  </span>
                  <span className="text-sm font-semibold text-slate-400">
                    {action.number}
                  </span>
                </div>

                <h3 className="mt-7 text-xl font-bold text-slate-900">
                  {action.title}
                </h3>
                <p className="mt-3 leading-7 text-slate-600">
                  {action.description}
                </p>

                <span className="mt-auto pt-6 text-sm font-bold text-emerald-800">
                  বিস্তারিত দেখুন
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
