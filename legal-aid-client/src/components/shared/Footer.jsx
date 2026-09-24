import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { FiMail } from "react-icons/fi";
import euImg from "../../assets/footerImg/eu.png";
import undpImg from "../../assets/footerImg/undp.png";

const footerLinks = [
  { label: "আইনগত সহায়তা পান", href: "/apply" },
  { label: "আবেদন ট্র্যাক করুন", href: "/track" },
  { label: "আইনি তথ্য", href: "/legal-information" },
  { label: "তথ্য অধিকার (আরটিআই)", href: "/rti" },
  { label: "গোপনীয়তা নোটিশ", href: "/privacy" },
  { label: "ইউজার ম্যানুয়াল", href: "/user-manual" },
  { label: "প্রবেশগম্যতা বিবৃতি", href: "/accessibility" },
];

export default function Footer() {
  return (
    <footer className="bg-[#f8fafb] text-gray-700">
      <div className="mx-auto max-w-7xl px-4 pt-12 pb-10 sm:px-6">
        {/* Partner and department logos */}
        <div className="grid grid-cols-3 items-center justify-items-center gap-4 pb-10 sm:pb-12">
          <Image
            src={euImg}
            alt="ইউরোপীয় ইউনিয়ন"
            width={105}
            height={105}
            className="h-auto max-h-20 w-auto max-w-full object-contain sm:max-h-28"
          />

          <Image
            src="https://db.nlaso.gov.bd/Images/nlaso.png"
            alt="বাংলাদেশ আইনগত সহায়তা অধিদপ্তর"
            width={155}
            height={120}
            className="h-auto max-h-24 w-auto max-w-full object-contain sm:max-h-32"
          />

          <Image
            src={undpImg}
            alt="ইউএনডিপি"
            width={70}
            height={110}
            className="h-auto max-h-20 w-auto max-w-full object-contain sm:max-h-28"
          />
        </div>

        {/* Footer navigation */}
        <nav
          aria-label="ফুটার নেভিগেশন"
          className="grid grid-cols-2 gap-x-5 gap-y-4 border-y border-gray-300 py-7 text-sm sm:grid-cols-3 lg:flex lg:items-center lg:justify-between lg:gap-5 lg:text-base"
        >
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-emerald-900 hover:underline"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Copyright and social icons */}
        <div className="flex flex-col gap-5 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm sm:text-base">
            © ডিজিটাল লিগ্যাল এইড সিস্টেম (DLAS) ২০২৬ · সর্বস্বত্ব সংরক্ষিত।
          </p>

          <div
            aria-label="সামাজিক যোগাযোগমাধ্যম"
            className="flex items-center gap-7 text-lg text-gray-700"
          >
            <FaFacebookF aria-label="Facebook" />
            <FaLinkedinIn aria-label="LinkedIn" />
            <FaXTwitter aria-label="X" />
            <FiMail aria-label="ইমেইল" />
          </div>
        </div>
      </div>
    </footer>
  );
}