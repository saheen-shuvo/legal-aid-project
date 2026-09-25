"use client";

import { useEffect, useState } from "react";

export default function GoogleTranslate() {
  const [language, setLanguage] = useState("bn");

  useEffect(() => {
    if (document.getElementById("google-translate-script")) return;

    window.googleTranslateElementInit = function () {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "bn",
          includedLanguages: "bn,en",
          autoDisplay: false,
        },
        "google_translate_element",
      );
    };

    const script = document.createElement("script");

    script.id = "google-translate-script";
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;

    document.body.appendChild(script);
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);

    const select = document.querySelector(".goog-te-combo");

    if (!select) return;

    select.value = lang;
    select.dispatchEvent(new Event("change"));
  };

  return (
    <>
      {/* Hidden Google Translator */}
      <div id="google_translate_element" className="hidden" />

      {/* Custom Language Toggle */}
      <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1">
        <button
          type="button"
          onClick={() => changeLanguage("bn")}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
            language === "bn"
              ? "bg-[#0d392e] text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          বাংলা
        </button>

        <button
          type="button"
          onClick={() => changeLanguage("en")}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
            language === "en"
              ? "bg-[#0d392e] text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          English
        </button>
      </div>
    </>
  );
}
