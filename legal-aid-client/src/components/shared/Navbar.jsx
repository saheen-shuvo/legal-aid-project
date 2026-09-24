"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FiArrowRight,
  FiChevronDown,
  FiLogIn,
  FiMenu,
  FiUserPlus,
  FiX,
} from "react-icons/fi";

const links = [
  { label: "আবেদন করুন", href: "/apply" },
  { label: "আবেদন ট্র্যাক করুন", href: "/track" },
];

const registrationRoles = [
  { label: "নাগরিক", slug: "applicant" },
  { label: "ডিএলও অফিসার", slug: "dlo-officer" },
  { label: "লিগ্যাল এইড অফিসার/মেডিয়েটর", slug: "legal-aid-officer-mediator" },
  { label: "ইউডিসি অন্ট্রাপ্রেনার", slug: "udc-entrepreneur" },
  { label: "প্যানাল আইনজীবী", slug: "panel-lawyer" },
  { label: "ডিএলও অ্যাডমিনিস্ট্রেশন/ কেস সাপোর্ট", slug: "dlo-administration-case-support" },
  { label: "এনএলএএসও (NLASO)", slug: "nlaso" },
];

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (!drawerOpen) return;

    function handleEscape(event) {
      if (event.key === "Escape") setDrawerOpen(false);
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [drawerOpen]);

  return (
    <>
      <header className="border-b border-gray-200 bg-white">
        <nav
          aria-label="প্রধান নেভিগেশন"
          className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6"
        >
          {/* Logo and department name */}
          <Link href="/" className="flex min-w-0 items-center gap-2 sm:gap-3">
            <Image
              src="https://db.nlaso.gov.bd/Images/nlaso.png"
              alt=""
              width={64}
              height={64}
              priority
              className="h-12 w-12 shrink-0 object-contain sm:h-16 sm:w-16"
            />

            <span className="min-w-0">
              <span className="block text-sm font-bold leading-tight text-orange-600 sm:text-lg xl:whitespace-nowrap">
                বাংলাদেশ আইনগত সহায়তা অধিদপ্তর
              </span>
              <span className="mt-1 block text-xs font-semibold leading-tight text-green-800 sm:text-sm">
                গণপ্রজাতন্ত্রী বাংলাদেশ সরকার
              </span>
            </span>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-4 xl:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="whitespace-nowrap text-sm font-medium text-gray-800 hover:text-green-800"
              >
                {link.label}
              </Link>
            ))}

            <span className="whitespace-nowrap text-sm font-medium text-green-900">
              English
            </span>

            <Link
              href="/login"
              className="btn btn-outline btn-sm whitespace-nowrap rounded-full border-emerald-600 text-emerald-900 hover:bg-emerald-50"
            >
              <FiLogIn aria-hidden="true" />
              লগ ইন
            </Link>

            {/* Desktop registration dropdown */}
            <details className="dropdown dropdown-end">
              <summary className="btn btn-sm list-none whitespace-nowrap rounded-full border-emerald-900 bg-emerald-900 text-white hover:bg-emerald-800">
                <FiUserPlus aria-hidden="true" />
                রেজিস্ট্রেশন
                <FiChevronDown aria-hidden="true" />
              </summary>

              <ul className="menu dropdown-content z-50 mt-2 w-60 rounded-box border border-gray-200 bg-white p-2 text-gray-800 shadow-lg">
                {registrationRoles.map((role) => (
                  <li key={role.slug}>
                    <Link href={`/register?role=${role.slug}`}>
                      {role.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          </div>

          {/* Mobile and tablet menu button */}
          <button
            type="button"
            className="btn btn-ghost btn-square shrink-0 xl:hidden"
            aria-label="মেনু খুলুন"
            aria-expanded={drawerOpen}
            aria-controls="mobile-navigation"
            onClick={() => setDrawerOpen(true)}
          >
            <FiMenu size={25} aria-hidden="true" />
          </button>
        </nav>
      </header>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 xl:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="মেনু বন্ধ করুন"
            onClick={() => setDrawerOpen(false)}
          />

          <aside
            id="mobile-navigation"
            aria-label="মোবাইল নেভিগেশন"
            className="relative flex h-full w-[min(85vw,320px)] flex-col overflow-y-auto bg-white p-5 shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <span className="font-bold text-green-900">মেনু</span>
              <button
                type="button"
                className="btn btn-ghost btn-square btn-sm"
                aria-label="মেনু বন্ধ করুন"
                onClick={() => setDrawerOpen(false)}
              >
                <FiX size={23} aria-hidden="true" />
              </button>
            </div>

            <div className="flex flex-col gap-1 py-5">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-3 py-3 font-medium text-gray-800 hover:bg-green-50"
                  onClick={() => setDrawerOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <span className="px-3 py-3 font-medium text-green-900">
                English
              </span>
            </div>

            <div className="mt-auto flex flex-col gap-3 border-t border-gray-200 pt-5">
              <Link
                href="/login"
                className="btn btn-outline rounded-full border-emerald-600 text-emerald-900"
                onClick={() => setDrawerOpen(false)}
              >
                <FiLogIn aria-hidden="true" />
                লগ ইন
              </Link>

              {/* Mobile registration dropdown */}
              <details className="rounded-xl border border-gray-200">
                <summary className="flex cursor-pointer list-none items-center justify-center gap-2 rounded-xl bg-emerald-900 px-4 py-3 font-medium text-white">
                  <FiUserPlus aria-hidden="true" />
                  রেজিস্ট্রেশন
                  <FiChevronDown aria-hidden="true" />
                </summary>

                <div className="flex flex-col p-2">
                  {registrationRoles.map((role) => (
                    <Link
                      key={role.slug}
                      href={`/register?role=${role.slug}`}
                      className="rounded-lg px-3 py-2 text-gray-800 hover:bg-green-50"
                      onClick={() => setDrawerOpen(false)}
                    >
                      {role.label}
                    </Link>
                  ))}
                </div>
              </details>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}