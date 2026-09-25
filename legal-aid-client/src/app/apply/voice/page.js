/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react/no-unescaped-entities */
"use client";

import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  FiArrowDown,
  FiCheck,
  FiDelete,
  FiMic,
  FiPhone,
  FiPhoneOff,
  FiRefreshCw,
  FiSend,
  FiShield,
  FiVolume2,
  FiVolumeX,
} from "react-icons/fi";

// All conversations and records are competition demo data. No microphone is used.
const CASE_ID = "CASE-2026-000342";
const CASE_DIGITS = "2026000342";
const CASE_PIN = "1234";
const SAMPLE_APP_ID = "20260342";
const SAMPLE_APP_PIN = "5824";
const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"];
const bn = (value) =>
  String(value).replace(/[০-৯]/g, (digit) => "০১২৩৪৫৬৭৮৯".indexOf(digit));
const bnDigit = (value) =>
  String(value).replace(/\d/g, (digit) => "০১২৩৪৫৬৭৮৯"[Number(digit)]);

function baseView(step, data) {
  const menu = {
    title: "মূল মেনু",
    body: "আপনার প্রয়োজনীয় সেবা নির্বাচন করুন।",
    options: [
      ["1", "নতুন আবেদন"],
      ["2", "আবেদনের অবস্থা"],
      ["3", "শুনানি ও পরবর্তী পদক্ষেপ"],
      ["4", "মধ্যস্থতার সময়সূচি"],
      ["5", "মধ্যস্থতা সম্পর্কে জানুন"],
      ["6", "আইনজীবীর আপডেট"],
      ["7", "রেফারেলের অবস্থা"],
      ["8", "বিশেষ যোগাযোগ সহায়তা"],
      ["0", "মেনু আবার শুনুন"],
    ],
  };
  const caseService =
    {
      hearing: "শুনানি",
      mediation: "মধ্যস্থতার সময়সূচি",
      lawyer: "আইনজীবীর আপডেট",
      referral: "রেফারেল",
    }[data.service] || "মামলার";

  switch (step) {
    case "idle":
      return {
        title: "ফোন ডেমো",
        body: "কিপ্যাডে 16699 লিখে সবুজ কল বোতাম চাপুন অথবা বলুন। এটি কোনো বাস্তব কল নয়।",
        mode: "digits",
      };
    case "language":
      return {
        title: "ভাষা নির্বাচন",
        body: "স্বাগতম। আপনি স্বয়ংক্রিয় আইনি সহায়তার নমুনা কথোপকথনে আছেন।",
        options: [
          ["1", "বাংলা"],
          ["2", "English"],
          ["3", "অন্যান্য ভাষা"],
        ],
      };
    case "otherLanguages":
      return {
        title: "অন্যান্য ভাষা",
        body: "ভাষা নির্বাচন করুন। অনুবাদিত কথোপকথন এই ডেমোতে এখনো যুক্ত হয়নি।",
        options: [
          ["1", "চাকমা"],
          ["2", "মারমা"],
          ["3", "সাঁওতালি"],
          ["4", "গারো"],
          ["5", "ত্রিপুরা"],
          ["0", "বাংলায় চালিয়ে যান"],
        ],
      };
    case "languageNotice":
      return {
        title: "ভাষার ডেমো",
        body: `${data.language} ভাষার পূর্ণ কথোপকথন এখনো তৈরি হয়নি। বাংলায় ডেমো চালাতে ১ চাপুন অথবা বলুন।`,
        options: [
          ["1", "বাংলায় চালিয়ে যান"],
          ["0", "ভাষা নির্বাচন"],
        ],
      };
    case "menu":
      return menu;

    case "newName":
      return {
        title: "নতুন আবেদন",
        body: "প্রথমে আপনার নাম লিখুন অথবা বলুন।",
        mode: "text",
        placeholder: "আপনার নাম",
      };
    case "newPin":
      return {
        title: "গোপন PIN",
        body: "ডেমোর জন্য ৪ সংখ্যার PIN তৈরি করুন। বাস্তবে ব্যবহার করেন এমন PIN এখানে দেবেন না।",
        mode: "pin",
        placeholder: "৪ সংখ্যার PIN",
      };
    case "newBehalf":
      return {
        title: "কার জন্য আবেদন?",
        body: "আপনি নিজের জন্য আইনি সহায়তা চাইছেন, নাকি অন্য কারও হয়ে?",
        options: [
          ["1", "নিজের জন্য"],
          ["2", "অন্য কারও হয়ে"],
        ],
      };
    case "newRelation":
      return {
        title: "সম্পর্ক",
        body: "যার হয়ে আবেদন করছেন, তাঁর সঙ্গে আপনার সম্পর্ক কী?",
        mode: "text",
        placeholder: "যেমন: বোন",
      };
    case "newPerson":
      return {
        title: "আবেদনকারীর নাম",
        body: "যার হয়ে আবেদন করছেন, তাঁর নাম লিখুন অথবা বলুন।",
        mode: "text",
        placeholder: "নাম",
      };
    case "newProblem":
      return {
        title: "সমস্যার বিবরণ",
        body: "আইনগত সমস্যাটি নিজের ভাষায় লিখুন অথবা বলুন।",
        mode: "text",
        multiline: true,
        placeholder: "সংক্ষেপে লিখুন",
      };
    case "newDistrict":
      return {
        title: "এলাকা",
        body: "সংশ্লিষ্ট ব্যক্তি কোন জেলা বা এলাকায় থাকেন?",
        mode: "text",
        placeholder: "জেলা বা এলাকা",
      };
    case "newId":
      return {
        title: "পরিচয়পত্র",
        body: "পরিচয়পত্র এখন পাওয়া যাচ্ছে কি?",
        options: [
          ["1", "হ্যাঁ"],
          ["2", "না / জানা নেই"],
        ],
      };
    case "newSafe":
      return {
        title: "নিরাপদ যোগাযোগ",
        body: "সংশ্লিষ্ট ব্যক্তির নম্বরে সরাসরি যোগাযোগ কি নিরাপদ?",
        options: [
          ["1", "হ্যাঁ"],
          ["2", "না / নিশ্চিত নই"],
        ],
      };
    case "newSafeTime":
      return {
        title: "নিরাপদ সময়",
        body: "নিরাপদ যোগাযোগের সময় বা মাধ্যম নিশ্চিতভাবে জানা থাকলে লিখুন; না জানলে ০ চাপুন অথবা বলুন।",
        mode: "text",
        placeholder: "সময় বা মাধ্যম",
      };
    case "newReview":
      return {
        title: "তথ্য যাচাই",
        body: `নাম: ${data.name}\nকার জন্য: ${data.behalf === "2" ? `${data.person} (${data.relation})` : "নিজের জন্য"}\nএলাকা: ${data.district}\nপরিচয়পত্র: ${data.idAvailable === "1" ? "আছে" : "পাওয়া যাচ্ছে না / অজানা"}\nনিরাপদ যোগাযোগ: ${data.safe === "1" ? "হ্যাঁ" : "নিশ্চিত নয়"}\nসমস্যা: ${data.problem}\n\nতথ্য ঠিক আছে?`,
        options: [
          ["1", "ঠিক আছে"],
          ["2", "সংশোধন করুন"],
        ],
      };
    case "newConsent":
      return {
        title: "জমা দেওয়ার সম্মতি",
        body: "এই তথ্যগুলো আবেদন হিসেবে জমা দেওয়ার সিমুলেশন চালাতে চান?",
        options: [
          ["1", "হ্যাঁ"],
          ["2", "সংশোধন করুন"],
        ],
      };
    case "newSms":
      return {
        title: "ডেমো আবেদন নম্বর",
        body: `আপনার ডেমো নম্বর: ${data.appId}\nডেমো অবস্থা: মানব পর্যালোচনার অপেক্ষায়।\n\nএই নম্বরে সংবেদনশীল SMS পাঠানো নিরাপদ কি? ডেমোতে কোনো SMS পাঠানো হবে না।`,
        options: [
          ["1", "নিরাপদ"],
          ["2", "নিরাপদ নয়"],
        ],
      };
    case "newAlt":
      return {
        title: "বিকল্প যোগাযোগ",
        body: "এই নম্বরে SMS পাঠানো হবে না। নিরাপদ বিকল্প নম্বর দিতে চান?",
        options: [
          ["3", "বিকল্প নম্বর দেব"],
          ["4", "এখন দেব না"],
        ],
      };
    case "newAltNumber":
      return {
        title: "নিরাপদ নম্বর",
        body: "শুধু ডেমোর জন্য একটি নম্বর লিখুন অথবা বলুন। কোনো বার্তা পাঠানো হবে না।",
        mode: "digits",
        placeholder: "01XXXXXXXXX",
      };
    case "newAltConfirm":
      return {
        title: "নম্বর নিশ্চিত করুন",
        body: `আপনি ${data.altNumber} লিখেছেন। ঠিক থাকলে ১ চাপুন অথবা বলুন, সংশোধনে ২।`,
        options: [
          ["1", "ঠিক আছে"],
          ["2", "সংশোধন"],
        ],
      };
    case "newDone":
      return {
        title: "ডেমো শেষ",
        body: `ডেমো আবেদন নম্বর: ${data.appId}\nপরিস্থিতি: মানব যাচাইয়ের অপেক্ষায়।\n\nএটি বাস্তবে জমা হয়নি। PIN কাউকে জানাবেন না।`,
        options: [
          ["1", "নম্বর আবার দেখুন"],
          ["0", "মূল মেনু"],
        ],
      };

    case "statusId":
      return {
        title: "আবেদনের অবস্থা",
        body: `আবেদন নম্বর লিখুন অথবা বলুন। নমুনা: ${SAMPLE_APP_ID}; অথবা এই সেশনে তৈরি ডেমো নম্বর ব্যবহার করুন।`,
        mode: "text",
        placeholder: "আবেদন নম্বর",
      };
    case "statusPin":
      return {
        title: "ডেমো PIN যাচাই",
        body: `৪ সংখ্যার PIN লিখুন অথবা বলুন। নমুনা নম্বরের PIN: ${SAMPLE_APP_PIN}। এটি বাস্তব পরিচয় যাচাই নয়।`,
        mode: "pin",
      };
    case "statusBehalf":
      return {
        title: "প্রতিনিধিত্ব",
        body: "নিজের আবেদন, নাকি অন্যের হয়ে জমা দেওয়া আবেদন?",
        options: [
          ["1", "নিজের আবেদন"],
          ["2", "অন্যের হয়ে জমা"],
        ],
      };
    case "statusResult":
      return {
        title: "ডেমো আবেদন অবস্থা",
        body: `আবেদন ${data.lookupId}: মানব যাচাইয়ের অপেক্ষায়।\nএখনো গ্রহণ বা Case ID তৈরির তথ্য নেই।${data.lookupBehalf === "2" ? "\nঅন্য ব্যক্তির ব্যক্তিগত বিবরণ দেখানো হচ্ছে না।" : ""}\nএটি নমুনা তথ্য, লাইভ অবস্থা নয়।`,
        options: [
          ["1", "আবার দেখুন"],
          ["0", "মূল মেনু"],
        ],
      };

    case "caseId":
      return {
        title: caseService,
        body: `Case ID লিখুন অথবা বলুন। ডেমো Case ID: ${CASE_ID}।`,
        mode: "text",
        placeholder: "CASE-2026-000342",
      };
    case "casePin":
      return {
        title: "ডেমো PIN",
        body: `৪ সংখ্যার PIN লিখুন অথবা বলুন। নমুনা Case ID-এর PIN: ${CASE_PIN}। এটি বাস্তব পরিচয় যাচাই নয়।`,
        mode: "pin",
      };
    case "caseSafe":
      return {
        title: "ব্যক্তিগত তথ্যের নিরাপত্তা",
        body: "এখন ব্যক্তিগত মামলার নমুনা তথ্য দেখা কি নিরাপদ?",
        options: [
          ["1", "হ্যাঁ, নিরাপদ"],
          ["2", "না, এখন নয়"],
        ],
      };
    case "caseUnsafe":
      return {
        title: "তথ্য আড়াল করা হয়েছে",
        body: "আপনি নিরাপদ স্থানে থাকলে আবার এই ডেমো চালাতে পারবেন।",
        options: [["0", "মূল মেনু"]],
      };
    case "hearing":
      return {
        title: "শুনানি · নমুনা রেকর্ড",
        body: "পরবর্তী শুনানি: ৫ অক্টোবর ২০২৬, সকাল ১০টা; বরগুনার সংশ্লিষ্ট আদালত। আদালতকক্ষের তথ্য ডেমো রেকর্ডে নেই। একটি নথি যাচাই বাকি। এটি বাস্তব মামলার তথ্য নয়।",
        options: [
          ["1", "প্রস্তুতি ও আইনজীবীর আপডেট"],
          ["0", "মূল মেনু"],
        ],
      };
    case "hearingUpdate":
      return {
        title: "পরবর্তী পদক্ষেপ",
        body: "নমুনা আইনজীবীর সর্বশেষ আপডেট: ১০ সেপ্টেম্বর ২০২৬। যোগাযোগের অনুরোধ করতে চান?",
        options: [
          ["1", "যোগাযোগের অনুরোধ"],
          ["2", "এখন নয়"],
        ],
      };
    case "hearingDifficulty":
      return {
        title: "উপস্থিতির অসুবিধা",
        body: "শুনানিতে উপস্থিত হতে আপনার কোনো অসুবিধা আছে?",
        options: [
          ["1", "হ্যাঁ"],
          ["2", "না"],
        ],
      };
    case "hearingReason":
      return {
        title: "অসুবিধার বিবরণ",
        body: "অসুবিধাটি সংক্ষেপে লিখুন অথবা বলুন।",
        mode: "text",
        multiline: true,
      };
    case "hearingReview":
      return {
        title: "অনুরোধ যাচাই",
        body: `আইনজীবীর সঙ্গে যোগাযোগ: ${data.lawyerContact ? "হ্যাঁ" : "না"}\nউপস্থিতির অসুবিধা: ${data.difficulty || "নেই"}\n\nএটি ডেমো অনুরোধ হিসেবে এগোবে।`,
        options: [
          ["1", "ঠিক আছে"],
          ["2", "সংশোধন"],
        ],
      };
    case "hearingConsent":
      return {
        title: "অনুরোধের সম্মতি",
        body: "অনুরোধ জমা দেওয়ার সিমুলেশন চালাবেন? শুনানির সময় বা উপস্থিতির নিয়ম এতে বদলাবে না।",
        options: [
          ["1", "হ্যাঁ"],
          ["2", "ফিরে যান"],
        ],
      };
    case "hearingDone":
      return {
        title: "ডেমো অনুরোধ",
        body: "অনুরোধটি এই সিমুলেশনে নথিভুক্ত হয়েছে। বাস্তবে কোনো কর্মকর্তা বা আইনজীবীর কাছে যায়নি। শুনানির সময় পরিবর্তন হয়নি।",
        options: [["0", "মূল মেনু"]],
      };

    case "mediation":
      return {
        title: "মধ্যস্থতা · নমুনা রেকর্ড",
        body: "নমুনা বৈঠক: ৭ অক্টোবর ২০২৬, বিকেল ৩টা; বরগুনা জেলা লিগ্যাল এইড অফিস। বর্তমানে সরাসরি উপস্থিতি নির্ধারিত। উপস্থিত হতে পারবেন?",
        options: [
          ["1", "পারব"],
          ["2", "অসুবিধা আছে"],
        ],
      };
    case "mediationReason":
      return {
        title: "উপস্থিতির অসুবিধা",
        body: "অসুবিধার কারণ লিখুন অথবা বলুন।",
        mode: "text",
        multiline: true,
      };
    case "mediationRemote":
      return {
        title: "দূরবর্তী অংশগ্রহণ",
        body: "দূরবর্তীভাবে অংশ নেওয়ার অনুরোধ করতে চান?",
        options: [
          ["1", "হ্যাঁ"],
          ["2", "না"],
        ],
      };
    case "mediationMethod":
      return {
        title: "পছন্দের পদ্ধতি",
        body: "কোন পদ্ধতি সুবিধাজনক?",
        options: [
          ["1", "ফোন"],
          ["2", "ভিডিও কল"],
          ["3", "অনুমোদিত স্থানীয় কেন্দ্র"],
        ],
      };
    case "mediationDate":
      return {
        title: "সময়সূচি",
        body: "তারিখ বা সময় পরিবর্তনের অনুরোধও করতে চান?",
        options: [
          ["1", "হ্যাঁ"],
          ["2", "না"],
        ],
      };
    case "mediationReview":
      return {
        title: "অনুরোধ যাচাই",
        body: `অসুবিধা: ${data.mediationReason}\nদূরবর্তী পদ্ধতি: ${data.method || "চাওয়া হয়নি"}\nসময়সূচি বদলের অনুরোধ: ${data.dateChange ? "হ্যাঁ" : "না"}\n\nনমুনা নথির পূর্ণ তালিকা নিশ্চিত নয়।`,
        options: [
          ["1", "ঠিক আছে"],
          ["2", "সংশোধন"],
        ],
      };
    case "mediationConsent":
      return {
        title: "সম্মতি",
        body: "এই ডেমো অনুরোধ নথিভুক্ত করবেন? বর্তমান বৈঠকের তারিখ ও অংশগ্রহণ পদ্ধতি অপরিবর্তিত থাকবে।",
        options: [
          ["1", "হ্যাঁ"],
          ["2", "ফিরে যান"],
        ],
      };
    case "mediationDone":
      return {
        title: "ডেমো অনুরোধ",
        body: "এই সিমুলেশনে পর্যালোচনার অনুরোধ দেখানো হয়েছে। বাস্তবে কোনো অনুরোধ পাঠানো হয়নি বা দূরবর্তী অংশগ্রহণ অনুমোদিত হয়নি।",
        options: [["0", "মূল মেনু"]],
      };

    case "mediationInfo":
      return {
        title: "মধ্যস্থতা কী?",
        body: "মধ্যস্থতায় পক্ষগুলো আলোচনার মাধ্যমে সমাধানের চেষ্টা করে; একজন মধ্যস্থতাকারী আলোচনায় সহায়তা করেন। এটি কোনো নির্দিষ্ট মামলার আইনি পরামর্শ নয়।",
        options: [
          ["1", "কীভাবে অংশ নেব"],
          ["2", "সময়সূচির ডেমো"],
          ["0", "মূল মেনু"],
        ],
      };
    case "mediationHow":
      return {
        title: "অংশগ্রহণ",
        body: "প্রয়োজনীয় নথি ও উপস্থিতির নিয়ম সংশ্লিষ্ট কর্মকর্তার কাছে নিশ্চিত করুন। অনুমতি ছাড়া দূরবর্তী অংশগ্রহণ ধরে নেবেন না।",
        options: [
          ["0", "মূল মেনু"],
          ["2", "সময়সূচির ডেমো"],
        ],
      };

    case "lawyer":
      return {
        title: "আইনজীবী · নমুনা রেকর্ড",
        body: "নমুনা সর্বশেষ আপডেট: ১০ সেপ্টেম্বর ২০২৬; পরবর্তী আপডেটের সময়সীমা পেরিয়েছে। কোন অনুরোধ করবেন?",
        options: [
          ["1", "যোগাযোগের অনুরোধ"],
          ["2", "পরিবর্তনের আবেদন"],
        ],
      };
    case "lawyerReason":
      return {
        title: "পরিবর্তনের কারণ",
        body: "আইনজীবী পরিবর্তনের কারণ লিখুন অথবা বলুন।",
        mode: "text",
        multiline: true,
      };
    case "lawyerContact":
      return {
        title: "যোগাযোগও চান?",
        body: "বর্তমান আইনজীবীর সঙ্গে যোগাযোগের অনুরোধও করতে চান?",
        options: [
          ["1", "হ্যাঁ"],
          ["2", "না"],
        ],
      };
    case "lawyerReview":
      return {
        title: "অনুরোধ যাচাই",
        body: `যোগাযোগ: ${data.wantContact ? "হ্যাঁ" : "না"}\nপরিবর্তন: ${data.changeLawyer ? "হ্যাঁ" : "না"}${data.changeLawyer ? `\nকারণ: ${data.changeReason}` : ""}`,
        options: [
          ["1", "ঠিক আছে"],
          ["2", "সংশোধন"],
        ],
      };
    case "lawyerConsent":
      return {
        title: "সম্মতি",
        body: "এই ডেমো অনুরোধ নথিভুক্ত করবেন? এতে আইনজীবী পরিবর্তন হবে না।",
        options: [
          ["1", "হ্যাঁ"],
          ["2", "ফিরে যান"],
        ],
      };
    case "lawyerDone":
      return {
        title: "ডেমো অনুরোধ",
        body: "অনুরোধগুলো শুধু এই সিমুলেশনে দেখানো হয়েছে। বাস্তবে পাঠানো হয়নি এবং বর্তমান আইনজীবী পরিবর্তিত হননি।",
        options: [["0", "মূল মেনু"]],
      };

    case "referral":
      return {
        title: "রেফারেল · নমুনা রেকর্ড",
        body: `নমুনা Case ID ${CASE_ID} অন্য জেলা অফিসে পাঠানো হয়েছে। প্রাপক অফিসের acknowledgement এখনো নেই। Case ID অপরিবর্তিত। পরবর্তী পদক্ষেপ জানতে চান?`,
        options: [
          ["1", "হ্যাঁ"],
          ["0", "মূল মেনু"],
        ],
      };
    case "referralNext":
      return {
        title: "রেফারেলের পরবর্তী পদক্ষেপ",
        body: "প্রাপক অফিস স্বীকৃতি দিলে একই কেস রেকর্ডে যুক্ত হওয়ার কথা। ফলো-আপের অনুরোধ করতে চান?",
        options: [
          ["1", "ফলো-আপ"],
          ["0", "মূল মেনু"],
        ],
      };
    case "referralReview":
      return {
        title: "ফলো-আপ যাচাই",
        body: "প্রাপক অফিসের সঙ্গে যোগাযোগের জন্য ডেমো ফলো-আপ অনুরোধ। ঠিক বুঝেছি?",
        options: [
          ["1", "ঠিক আছে"],
          ["2", "ফিরে যান"],
        ],
      };
    case "referralConsent":
      return {
        title: "সম্মতি",
        body: "ডেমো ফলো-আপ নথিভুক্ত করবেন?",
        options: [
          ["1", "হ্যাঁ"],
          ["2", "ফিরে যান"],
        ],
      };
    case "referralDone":
      return {
        title: "ডেমো ফলো-আপ",
        body: "অনুরোধটি বাস্তবে পাঠানো হয়নি। প্রাপক অফিসের স্বীকৃতি এখনো নমুনা রেকর্ডে নেই; নতুন Case ID তৈরি হয়নি।",
        options: [["0", "মূল মেনু"]],
      };

    case "special":
      return {
        title: "বিশেষ যোগাযোগ সহায়তা",
        body: "আপনার পরিস্থিতির জরুরিতা নির্বাচন করুন।",
        options: [
          ["1", "তাৎক্ষণিক জীবনঝুঁকি"],
          ["2", "গুরুতর আঘাতের আশঙ্কা"],
          ["3", "অন্যান্য আইনি সমস্যা"],
        ],
      };
    case "specialUrgent":
      return {
        title: "জরুরি পরিস্থিতি",
        body: "এটি কেবল সিমুলেশন: কোনো মানব কর্মকর্তা বা জরুরি সেবায় তথ্য পাঠানো হয়নি। আপনি এখন বিপদে থাকলে স্থানীয় জরুরি সেবা ৯৯৯-এ নিজে যোগাযোগ করুন, যদি নিরাপদ হয়।",
        options: [["0", "মূল মেনু"]],
      };
    case "specialTopic":
      return {
        title: "সমস্যার ধরন",
        body: "সমস্যার ধরন নির্বাচন করুন।",
        options: [
          ["1", "দেওয়ানি"],
          ["2", "ফৌজদারি"],
          ["3", "জমি / সম্পত্তি"],
          ["4", "পারিবারিক"],
          ["5", "অন্যান্য"],
        ],
      };
    case "specialDetails":
      return {
        title: "সহায়তার বিবরণ",
        body: "আপনি নিরাপদে যতটুকু পারেন লিখুন অথবা বলুন।",
        mode: "text",
        multiline: true,
      };
    case "specialReview":
      return {
        title: "তথ্য যাচাই",
        body: `ধরন: ${data.specialTopic}\nবিবরণ: ${data.specialDetails}\n\nতথ্য ঠিক আছে?`,
        options: [
          ["1", "ঠিক আছে"],
          ["2", "সংশোধন"],
        ],
      };
    case "specialConsent":
      return {
        title: "সম্মতি",
        body: "ডেমো আবেদন তৈরির ধাপ দেখবেন?",
        options: [
          ["1", "হ্যাঁ"],
          ["2", "ফিরে যান"],
        ],
      };
    case "specialDone":
      return {
        title: "ডেমো শেষ",
        body: "এই সিমুলেশনে তথ্য দেখানো হয়েছে, বাস্তবে কোনো আবেদন বা মানব পর্যালোচনার কাজ তৈরি হয়নি।",
        options: [["0", "মূল মেনু"]],
      };
    default:
      return menu;
  }
}

function routeAnswer(step, value, data) {
  const go = (next, patch = {}) => ({ next, patch });
  const fail = (error) => ({ error });
  switch (step) {
    case "language":
      return value === "1"
        ? go("menu")
        : value === "3"
          ? go("otherLanguages")
          : go("languageNotice", { language: "English" });
    case "otherLanguages":
      return value === "0"
        ? go("menu")
        : go("languageNotice", {
            language: {
              1: "চাকমা",
              2: "মারমা",
              3: "সাঁওতালি",
              4: "গারো",
              5: "ত্রিপুরা",
            }[value],
          });
    case "languageNotice":
      return value === "1" ? go("menu") : go("language");
    case "menu":
      return (
        {
          0: "menu",
          1: "newName",
          2: "statusId",
          3: "caseId",
          4: "caseId",
          5: "mediationInfo",
          6: "caseId",
          7: "caseId",
          8: "special",
        }[value] &&
        go(
          {
            0: "menu",
            1: "newName",
            2: "statusId",
            3: "caseId",
            4: "caseId",
            5: "mediationInfo",
            6: "caseId",
            7: "caseId",
            8: "special",
          }[value],
          {
            service: {
              3: "hearing",
              4: "mediation",
              6: "lawyer",
              7: "referral",
            }[value],
          },
        )
      );

    case "newName":
      return go("newPin", { name: value });
    case "newPin":
      return go("newBehalf", { pin: value });
    case "newBehalf":
      return value === "1"
        ? go("newProblem", { behalf: value })
        : go("newRelation", { behalf: value });
    case "newRelation":
      return go("newPerson", { relation: value });
    case "newPerson":
      return go("newProblem", { person: value });
    case "newProblem":
      return go("newDistrict", { problem: value });
    case "newDistrict":
      return go("newId", { district: value });
    case "newId":
      return go("newSafe", { idAvailable: value });
    case "newSafe":
      return go("newSafeTime", { safe: value });
    case "newSafeTime":
      return go("newReview", {
        safeTime: value === "0" ? "নিশ্চিত নয়" : value,
      });
    case "newReview":
      return go(value === "1" ? "newConsent" : "newName");
    case "newConsent":
      return value === "1"
        ? go("newSms", {
            appId: SAMPLE_APP_ID,
          })
        : go("newReview");
    case "newSms":
      return value === "1" ? go("newDone") : go("newAlt");
    case "newAlt":
      return go(value === "3" ? "newAltNumber" : "newDone");
    case "newAltNumber":
      return /^01[3-9]\d{8}$/.test(value)
        ? go("newAltConfirm", { altNumber: value })
        : fail("১১ সংখ্যার বাংলাদেশি নম্বর লিখুন (01XXXXXXXXX)।");
    case "newAltConfirm":
      return go(value === "1" ? "newDone" : "newAltNumber");
    case "newDone":
      return go(value === "1" ? "newDone" : "menu");

    case "statusId":
      return go("statusPin", { lookupId: value });
    case "statusPin": {
      const expected =
        data.lookupId === data.appId
          ? data.pin
          : data.lookupId === SAMPLE_APP_ID
            ? SAMPLE_APP_PIN
            : null;
      return expected && value === expected
        ? go("statusBehalf")
        : fail(
            "ডেমো নম্বর বা PIN মিলছে না। নমুনা নম্বর ও PIN পর্দায় দেওয়া আছে।",
          );
    }
    case "statusBehalf":
      return go("statusResult", { lookupBehalf: value });
    case "statusResult":
      return go(value === "1" ? "statusResult" : "menu");

    case "caseId":
      return value.toUpperCase() === CASE_ID || value === CASE_DIGITS
        ? go("casePin")
        : fail(`ডেমো Case ID লিখুন: ${CASE_ID}`);
    case "casePin":
      return value === CASE_PIN ? go("caseSafe") : fail("ডেমো PIN মেলেনি।");
    case "caseSafe":
      return go(value === "1" ? data.service : "caseUnsafe");
    case "caseUnsafe":
      return go("menu");
    case "hearing":
      return go(value === "1" ? "hearingUpdate" : "menu");
    case "hearingUpdate":
      return go("hearingDifficulty", {
        lawyerContact: value === "1",
      });
    case "hearingDifficulty":
      return value === "1"
        ? go("hearingReason")
        : go("hearingReview", { difficulty: "নেই" });
    case "hearingReason":
      return go("hearingReview", { difficulty: value });
    case "hearingReview":
      return go(value === "1" ? "hearingConsent" : "hearingUpdate");
    case "hearingConsent":
      return go(value === "1" ? "hearingDone" : "hearingReview");
    case "hearingDone":
      return go("menu");

    case "mediation":
      return go(value === "1" ? "menu" : "mediationReason");
    case "mediationReason":
      return go("mediationRemote", { mediationReason: value });
    case "mediationRemote":
      return go(value === "1" ? "mediationMethod" : "mediationReview", {
        method: value === "1" ? data.method : null,
      });
    case "mediationMethod":
      return go("mediationDate", {
        method: { 1: "ফোন", 2: "ভিডিও", 3: "স্থানীয় কেন্দ্র" }[value],
      });
    case "mediationDate":
      return go("mediationReview", { dateChange: value === "1" });
    case "mediationReview":
      return go(value === "1" ? "mediationConsent" : "mediationReason");
    case "mediationConsent":
      return go(value === "1" ? "mediationDone" : "mediationReview");
    case "mediationDone":
      return go(value === "1" ? "humanAgent" : "menu");
    case "mediationInfo":
      return go({ 0: "menu", 1: "mediationHow", 2: "caseId" }[value], {
        service: value === "2" ? "mediation" : data.service,
      });
    case "mediationHow":
      return go(value === "0" ? "menu" : "caseId", {
        service: "mediation",
      });

    case "lawyer":
      return value === "1"
        ? go("lawyerReview", {
            wantContact: true,
            changeLawyer: false,
          })
        : go("lawyerReason", { changeLawyer: true });
    case "lawyerReason":
      return go("lawyerContact", { changeReason: value });
    case "lawyerContact":
      return go("lawyerReview", { wantContact: value === "1" });
    case "lawyerReview":
      return go(value === "1" ? "lawyerConsent" : "lawyer");
    case "lawyerConsent":
      return go(value === "1" ? "lawyerDone" : "lawyerReview");
    case "lawyerDone":
      return go(value === "1" ? "humanAgent" : "menu");

    case "referral":
      return go(value === "1" ? "referralNext" : "menu");
    case "referralNext":
      return go(value === "1" ? "referralReview" : "menu");
    case "referralReview":
      return go(value === "1" ? "referralConsent" : "referralNext");
    case "referralConsent":
      return go(value === "1" ? "referralDone" : "referralReview");
    case "referralDone":
      return go("menu");

    case "special":
      return value === "3"
        ? go("specialTopic")
        : go("specialUrgent", { risk: value });
    case "specialUrgent":
      return go(value === "1" ? "specialLocation" : "specialEscalation");
    case "specialLocation":
      return go("specialEscalation", { location: value });
    case "specialEscalation":
      return go("menu");
    case "specialTopic":
      return go("specialDetails", {
        specialTopic: {
          1: "দেওয়ানি",
          2: "ফৌজদারি",
          3: "জমি / সম্পত্তি",
          4: "পারিবারিক",
          5: "অন্যান্য",
        }[value],
      });
    case "specialDetails":
      return go("specialReview", { specialDetails: value });
    case "specialReview":
      return go(value === "1" ? "specialConsent" : "specialDetails");
    case "specialConsent":
      return go(value === "1" ? "specialPin" : "specialReview");
    case "specialPin":
      return go("specialSms", { specialPin: value });
    case "specialSms":
      return go(value === "1" ? "specialDone" : "specialAlt");
    case "specialAlt":
      return go(value === "3" ? "specialNumber" : "specialDone");
    case "specialNumber":
      return /^01[3-9]\d{8}$/.test(value)
        ? go("specialConfirm", { specialNumber: value })
        : fail("১১ সংখ্যার নম্বর দিন।");
    case "specialConfirm":
      return go(value === "1" ? "specialDone" : "specialNumber");
    case "specialDone":
      return go("menu");
    case "humanAgent":
      return go("menu");
    default:
      return fail("এই ধাপটি আবার শুরু করুন।");
  }
}

// The supplied caller script. Values are inserted only when the demo voice button is pressed.
const SCRIPT_REPLIES = {
  newName: { value: "রিপন", text: "আমার নাম রিপন।" },
  newRelation: { value: "বোন", text: "আমার বোন।" },
  newPerson: { value: "ময়ূরী আক্তার", text: "ময়ূরী আক্তার।" },
  newProblem: {
    value:
      "আমার বোনের স্বামী তার ফোন নিয়ন্ত্রণ করে। বোন আমার সঙ্গে ঠিকমতো কথা বলতে পারে না।",
    text: "আমার বোনের স্বামী তার ফোন নিয়ন্ত্রণ করে। বোন আমার সঙ্গে ঠিকমতো কথা বলতে পারে না।",
  },
  newDistrict: { value: "জয়পুরহাট", text: "জয়পুরহাট।" },
  newSafeTime: { value: "0", text: "না, নিরাপদ কোনো সময় বা মাধ্যম জানি না।" },
  hearingReason: {
    value: "আদালত অনেক দূরে। গেলে আমার এক দিনের কাজ বন্ধ থাকে।",
    text: "হ্যাঁ। আদালত অনেক দূরে। গেলে আমার এক দিনের কাজ বন্ধ থাকে।",
  },
  mediationReason: {
    value: "দূরত্ব ও যাতায়াতের কারণে কাজে অসুবিধা হয়।",
    text: "অফিস অনেক দূরে। সরাসরি গেলে এক দিনের কাজ বন্ধ থাকে।",
  },
  lawyerReason: {
    value:
      "আমার আইনজীবী নিয়মিত মামলার খবর দেন না। শুনানির তারিখও ঠিকমতো জানতে পারি না। তাই আমি আইনজীবী পরিবর্তন করতে চাই।",
    text: "আমার আইনজীবী নিয়মিত মামলার খবর দেন না। শুনানির তারিখও ঠিকমতো জানতে পারি না। তাই আমি আইনজীবী পরিবর্তন করতে চাই।",
  },
  specialLocation: {
    value: "জয়পুরহাট",
    text: "আমি জয়পুরহাটে আছি। আমার জরুরি সহায়তা প্রয়োজন।",
  },
};
const SCRIPT_CHOICES = {
  language: "1",
  otherLanguages: "0",
  languageNotice: "1",
  menu: "1",
  newBehalf: "2",
  newId: "2",
  newSafe: "2",
  newReview: "1",
  newConsent: "1",
  newSms: "2",
  newAlt: "3",
  newAltConfirm: "1",
  newDone: "0",
  statusBehalf: "2",
  statusResult: "0",
  caseSafe: "1",
  caseUnsafe: "0",
  hearing: "1",
  hearingUpdate: "1",
  hearingDifficulty: "1",
  hearingReview: "1",
  hearingConsent: "1",
  hearingDone: "0",
  mediation: "2",
  mediationRemote: "1",
  mediationMethod: "1",
  mediationDate: "2",
  mediationReview: "1",
  mediationConsent: "1",
  mediationDone: "1",
  mediationInfo: "1",
  mediationHow: "0",
  lawyer: "2",
  lawyerContact: "1",
  lawyerReview: "1",
  lawyerConsent: "1",
  lawyerDone: "1",
  referral: "1",
  referralNext: "1",
  referralReview: "1",
  referralConsent: "1",
  referralDone: "0",
  special: "3",
  specialUrgent: "1",
  specialEscalation: "0",
  specialTopic: "3",
  specialReview: "1",
  specialConsent: "1",
  specialSms: "2",
  specialAlt: "3",
  specialConfirm: "1",
  specialDone: "0",
  humanAgent: "0",
};

function chatView(step, data) {
  const current = { ...baseView(step, data) };
  const copy = {
    idle: "কিপ্যাডে ১৬৬৯৯ ডায়াল করুন। তারপর সবুজ কল বোতাম চাপুন।",
    language:
      "স্বাগতম। আপনি স্বয়ংক্রিয় আইনি সহায়তা ব্যবস্থার ডেমোতে সংযুক্ত হয়েছেন। আপনার ভাষা নির্বাচন করুন।",
    menu: "আপনি বাংলা ভাষা নির্বাচন করেছেন। আপনার প্রয়োজনীয় সেবা নির্বাচন করুন।",
    newName:
      "আপনার অভিযোগ বা আইনি সহায়তার বিষয়টি শুনতে আমি প্রস্তুত। প্রথমে আপনার নাম বলুন।",
    newPin: `ধন্যবাদ, ${data.name || "রিপন"}। এখন একটি ৪ সংখ্যার গোপন PIN তৈরি করুন। কিপ্যাডে PIN দিয়ে # চাপুন।`,
    newBehalf:
      "আপনার ৪ সংখ্যার PIN গ্রহণ করা হয়েছে। আপনি নিজের জন্য আইনি সহায়তা চাইছেন, নাকি অন্য কারও হয়ে কথা বলছেন?",
    newRelation: "আপনি যার হয়ে কথা বলছেন, তার সঙ্গে আপনার সম্পর্ক কী?",
    newPerson: "আপনার বোনের নাম কী?",
    newProblem:
      "এখন আপনার সমস্যাটি নিজের ভাষায় বলুন। আমি প্রয়োজনীয় তথ্যগুলো নথিভুক্ত করব।",
    newDistrict:
      "আমি বুঝেছি। সংশ্লিষ্ট ব্যক্তি বর্তমানে কোন জেলা বা এলাকায় থাকেন?",
    newId: "তার পরিচয়পত্র বর্তমানে পাওয়া যাচ্ছে কি?",
    newSafe: `${data.idAvailable === "2" ? "পরিচয়পত্র বর্তমানে পাওয়া যাচ্ছে না—এই তথ্য রাখা হয়েছে। এ কারণে এই পর্যায়ে আবেদন বাতিল করা হচ্ছে না।\n\n" : ""}সংশ্লিষ্ট ব্যক্তির সঙ্গে সরাসরি যোগাযোগ করা কি নিরাপদ?`,
    newSafeTime: `${data.safe === "2" ? "অনিরাপদ নম্বরে কোনো স্বয়ংক্রিয় SMS বা সংবেদনশীল তথ্য পাঠানো হবে না।\n\n" : ""}যোগাযোগের নিরাপদ কোনো সময় বা মাধ্যম কি নিশ্চিতভাবে জানেন?`,
    newReview: `${data.name || "রিপন"}, আপনার দেওয়া তথ্যগুলো সংক্ষেপে জানাচ্ছি।\n\n${data.behalf === "2" ? `আপনি আপনার ${data.relation} ${data.person}-এর হয়ে কথা বলছেন।` : "আপনি নিজের জন্য সহায়তা চাইছেন।"}\nএলাকা: ${data.district}।\nবিবরণ: ${data.problem}\nপরিচয়পত্র: ${data.idAvailable === "1" ? "পাওয়া যাচ্ছে" : "বর্তমানে পাওয়া যাচ্ছে না"}।\nনিরাপদ যোগাযোগ: ${data.safe === "1" ? "সরাসরি যোগাযোগ নিরাপদ" : "নিশ্চিত নয়"}।\nনিরাপদ সময়: ${data.safeTime || "নিশ্চিত নয়"}।\n\nআমি কি ঠিকভাবে বুঝেছি?`,
    newConsent:
      "আপনি কি এই তথ্যগুলো আইনি সহায়তার আবেদন হিসেবে জমা দেওয়ার ডেমো চালাতে চান?",
    newSms: `ডেমো আবেদন নম্বর: ${data.appId || SAMPLE_APP_ID}।\nঅবস্থা: মানব যাচাইয়ের অপেক্ষায়।\n\nএই ফোন নম্বরে আবেদন নম্বর পাঠানো নিরাপদ কি? PIN কোনো SMS-এ পাঠানো হবে না।`,
    newDone: `ধন্যবাদ, ${data.name || "রিপন"}।\nডেমো আবেদন নম্বর: ${data.appId || SAMPLE_APP_ID}।\nঅবস্থা: মানব যাচাইয়ের অপেক্ষায়।\n\nআবেদনকারীর অনুমতি যাচাই ছাড়া সংবেদনশীল তথ্য প্রকাশ করা হবে না। আপনার PIN কাউকে জানাবেন না।`,
    statusId: `আপনার পূর্বের আবেদনের নম্বরটি কিপ্যাডে দিন অথবা বলুন।\nডেমো নম্বর: ${SAMPLE_APP_ID}।`,
    statusPin:
      "নিরাপত্তা যাচাইয়ের জন্য ৪ সংখ্যার গোপন PIN কিপ্যাডে দিন। শেষে # চাপুন।",
    statusBehalf:
      "ডেমো PIN মিলেছে। নিজের আবেদন সম্পর্কে জানতে চান, নাকি অন্য কারও হয়ে জমা দেওয়া আবেদন?",
    statusResult: `আবেদন ${data.lookupId || SAMPLE_APP_ID} বর্তমানে একজন অনুমোদিত কর্মকর্তার যাচাইয়ের অপেক্ষায়। এখনো গ্রহণ করা হয়নি, তাই Case ID তৈরি হয়নি।${data.lookupBehalf === "2" ? "\n\nআপনার আবেদন জমা দেওয়ার তথ্য মিলেছে। অন্য ব্যক্তির সংবেদনশীল তথ্য দেখার অনুমতি যাচাই হয়নি; তাই কেবল সাধারণ স্ট্যাটাস দেখানো হচ্ছে।" : ""}`,
    caseId: `আপনার Case ID বলুন অথবা শুধু সংখ্যাগুলো কিপ্যাডে দিন।\n\n${CASE_ID}\nকিপ্যাডে লিখুন: ${CASE_DIGITS}।`,
    casePin: "ধন্যবাদ। এবার আপনার গোপন PIN কিপ্যাডে দিন। শেষে # চাপুন।",
    caseSafe:
      "ডেমো পরিচয় ও তথ্য দেখার অনুমতি যাচাইয়ের ধাপ সম্পন্ন। এখন ব্যক্তিগত মামলার তথ্য দেখা বা শোনা কি নিরাপদ?",
    hearing:
      "নমুনা রেকর্ড অনুযায়ী পরবর্তী শুনানি ৫ অক্টোবর ২০২৬, সকাল ১০টা। স্থান: বরগুনার সংশ্লিষ্ট আদালত। আদালতকক্ষের তথ্য রেকর্ডে নেই।\n\nএকটি প্রয়োজনীয় নথি যাচাই বাকি। শুনানির প্রস্তুতি সম্পর্কে আরও জানতে চান?",
    hearingUpdate:
      "আইনজীবীর সর্বশেষ অগ্রগতির আপডেট ১০ সেপ্টেম্বর ২০২৬। পরবর্তী আপডেটের সময়সীমা পার হয়েছে। আইনজীবীর সঙ্গে যোগাযোগের অনুরোধ করতে চান?",
    hearingDifficulty: "শুনানিতে উপস্থিত হতে আপনার কোনো অসুবিধা আছে কি?",
    hearingReason: "উপস্থিত হতে কী অসুবিধা হচ্ছে, নিজের ভাষায় বলুন।",
    hearingReview: `আপনার বক্তব্য সংক্ষেপে জানাচ্ছি।\n\nআইনজীবীর সঙ্গে যোগাযোগের অনুরোধ: ${data.lawyerContact ? "হ্যাঁ" : "না"}।\nউপস্থিতির অসুবিধা: ${data.difficulty || "নেই"}\n\nআমি কি ঠিক বুঝেছি?`,
    hearingDone:
      "ডেমো অনুরোধ নথিভুক্ত হয়েছে। সংশ্লিষ্ট কর্মকর্তার পর্যালোচনার ধাপ দেখানো হলো। শুনানির তারিখ বা উপস্থিতির প্রয়োজনীয়তা পরিবর্তন করা হয়নি।",
    mediationReason: "মধ্যস্থতায় সরাসরি উপস্থিত হতে কী অসুবিধা হচ্ছে, বলুন।",
    mediationRemote:
      "বুঝেছি। আপনি কি দূর থেকে অংশগ্রহণের অনুমতি চাইতে চান? চূড়ান্ত সিদ্ধান্ত অনুমোদিত কর্মকর্তা নেবেন।",
    mediationDone:
      "দূরবর্তী অংশগ্রহণের অনুরোধের ডেমো সম্পন্ন। বর্তমান সময়সূচি ও সরাসরি উপস্থিতির ব্যবস্থা পরিবর্তন হয়নি। অনুমোদন ছাড়া ফোনে অংশ নেওয়া যাবে বলে ধরে নেবেন না।\n\nমানব কর্মকর্তার সহায়তার ডেমো দেখতে চান?",
    lawyerReason: "কেন আইনজীবী পরিবর্তন করতে চান, নিজের ভাষায় বলুন।",
    lawyerDone:
      "ডেমো অনুরোধ নথিভুক্ত হয়েছে। অনুমোদিত কর্মকর্তা অনুরোধ পর্যালোচনা করবেন। বর্তমান আইনজীবী পরিবর্তন করা হয়নি।\n\nমানব কর্মকর্তার সহায়তার ডেমো দেখতে চান?",
    referralDone:
      "ডেমো ফলো-আপ নথিভুক্ত হয়েছে। প্রাপক অফিস এখনো রেফারেল পাওয়ার স্বীকৃতি দেয়নি। একই Case ID থাকবে; নতুন মামলা তৈরি হয়নি।",
    specialDetails: "আপনার সমস্যার বিস্তারিত নিজের ভাষায় বলুন।",
  };
  if (copy[step]) current.body = copy[step];
  if (step === "menu")
    current.options = current.options.map(([key, label]) => [
      key,
      key === "0" ? "মেনু আবার দেখুন" : label,
    ]);
  if (step === "statusId" || step === "caseId") current.mode = "digits";
  if (step === "newSafeTime") current.options = [["0", "জানি না"]];
  if (step === "mediationDone" || step === "lawyerDone")
    current.options = [
      ["1", "মানব কর্মকর্তার সহায়তা"],
      ["0", "মূল মেনু"],
    ];
  const extras = {
    humanAgent: {
      title: "মানব কর্মকর্তা · ডেমো",
      body: "স্বাগতম। আপনার অনুরোধের প্রয়োজনীয় তথ্য আমার কাছে রয়েছে। এই হস্তান্তরটি স্ক্রিপ্টের নমুনা; বাস্তবে কোনো কর্মকর্তার সঙ্গে সংযোগ করা হয়নি।",
      options: [["0", "মূল মেনু"]],
    },
    specialUrgent: {
      title: "জরুরি সহায়তা",
      body: `আপনার নির্বাচিত ঝুঁকি: ${data.risk === "1" ? "জীবন ঝুঁকি" : "গুরুতর আঘাতের আশঙ্কা"}। নিরাপদে দিতে পারলে আপনার অবস্থান বলুন। কোনো তথ্য দিতে বাধ্য নন।`,
      options: [
        ["1", "অবস্থান বলব"],
        ["2", "এখন বলা নিরাপদ নয়"],
      ],
    },
    specialLocation: {
      title: "অবস্থান",
      body: "আপনার বর্তমান অবস্থান ও কী সহায়তা প্রয়োজন, নিরাপদে বলতে পারলে বলুন।",
      mode: "text",
    },
    specialEscalation: {
      title: "জরুরি মানব পর্যালোচনা · ডেমো",
      body: "জরুরি মানব পর্যালোচনার ধাপ দেখানো হচ্ছে। এই ডেমো কোনো জরুরি সেবা বা কর্মকর্তাকে খবর দেয়নি। বাস্তবে তাৎক্ষণিক বিপদে থাকলে নিরাপদ হলে ৯৯৯-এ যোগাযোগ করুন।",
      options: [["0", "মূল মেনু"]],
    },
    specialPin: {
      title: "PIN তৈরি",
      body: "ডেমো আবেদন নম্বর 2026035। আবেদনটি মানব যাচাইয়ের অপেক্ষায়। এখন কিপ্যাডে একটি ৪ সংখ্যার PIN তৈরি করুন।",
      mode: "pin",
    },
    specialSms: {
      title: "নিরাপদ যোগাযোগ",
      body: "এই ফোন নম্বরে আবেদন নম্বর পাঠানো নিরাপদ কি? PIN পাঠানো হবে না।",
      options: [
        ["1", "হ্যাঁ"],
        ["2", "না"],
      ],
    },
    specialAlt: {
      title: "বিকল্প নম্বর",
      body: "এই নম্বরে কোনো সংবেদনশীল SMS যাবে না। বিকল্প নিরাপদ নম্বর দিতে চান?",
      options: [
        ["3", "অন্য নম্বর"],
        ["4", "এখন দেব না"],
      ],
    },
    specialNumber: {
      title: "নিরাপদ নম্বর",
      body: "শুধু ডেমোর জন্য ১১ সংখ্যার একটি নম্বর দিন অথবা বলুন।",
      mode: "digits",
    },
    specialConfirm: {
      title: "নম্বর যাচাই",
      body: `আপনার দেওয়া নম্বর ${data.specialNumber}। ঠিক আছে?`,
      options: [
        ["1", "ঠিক আছে"],
        ["2", "পরিবর্তন"],
      ],
    },
    specialDone: {
      title: "আবেদন · ডেমো",
      body: "ডেমো আবেদন নম্বর: 2026035।\nঅবস্থা: মানব যাচাইয়ের অপেক্ষায়।\n\nযাচাই ও গ্রহণের পর Case ID তৈরি হতে পারে। আপনার PIN কাউকে জানাবেন না।",
      options: [["0", "মূল মেনু"]],
    },
  };
  return extras[step] || current;
}

function scriptReply(step, data, current) {
  if (SCRIPT_REPLIES[step]) {
    if (step === "newProblem" && data.behalf === "1")
      return { value: "আমার জমি নিয়ে সমস্যা।", text: "আমার জমি নিয়ে সমস্যা।" };
    return SCRIPT_REPLIES[step];
  }
  if (step === "specialDetails") {
    const text =
      data.specialTopic === "জমি / সম্পত্তি"
        ? "আমার জমি নিয়ে সমস্যা।"
        : `আমার ${data.specialTopic || "আইনগত"} বিষয়ে সহায়তা প্রয়োজন।`;
    return { value: text, text };
  }
  if (step === "statusId") return { value: SAMPLE_APP_ID, text: SAMPLE_APP_ID };
  if (step === "caseId") return { value: CASE_ID, text: `${CASE_ID}।` };
  if (step === "newAltNumber" || step === "specialNumber")
    return { value: "01700000000", text: "01700000000।" };
  if (!current.options) return null;
  const key = SCRIPT_CHOICES[step] || current.options[0][0];
  const label = current.options.find(([value]) => value === key)?.[1];
  const texts = {
    newBehalf: "আমি আমার বোনের হয়ে কথা বলছি।",
    newId: "না।",
    newSafe: "না। তার স্বামী ফোন চেক করে।",
    newReview: "হ্যাঁ, ঠিক আছে।",
    newConsent: "হ্যাঁ, জমা দিন।",
    statusBehalf: "আমার বোনের হয়ে আবেদন করেছিলাম।",
    hearing: "হ্যাঁ, জানতে চাই।",
    hearingUpdate: "হ্যাঁ, চাই।",
    mediationDate: "না, তারিখ পরিবর্তন চাই না।",
    lawyerContact: "হ্যাঁ, সেটাও চাই।",
    referral: "হ্যাঁ, জানতে চাই।",
    specialTopic: "আমার জমি নিয়ে সমস্যা।",
  };
  return { value: key, text: texts[step] || `${label}।` };
}

// Bengali grapheme clusters keep vowel signs and conjuncts together during animation.
function AnimatedMessage({ message, animate, onComplete, onProgress }) {
  const [visible, setVisible] = useState(0);
  useEffect(() => {
    if (!animate) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const characters =
      typeof Intl.Segmenter === "function"
        ? Array.from(
            new Intl.Segmenter("bn", { granularity: "grapheme" }).segment(
              message.text,
            ),
            (part) => part.segment,
          )
        : Array.from(message.text);
    const chunk = Math.max(1, Math.ceil(characters.length / 65));
    let count = 0;
    if (reduced) {
      onComplete(message.id);
      return;
    }
    const interval = setInterval(() => {
      count = Math.min(characters.length, count + chunk);
      setVisible(characters.slice(0, count).join("").length);
      onProgress();
      if (count === characters.length) {
        clearInterval(interval);
        onComplete(message.id);
      }
    }, 25);
    return () => clearInterval(interval);
  }, [animate, message.id, message.text, onComplete, onProgress]);
  return (
    <p className="whitespace-pre-line text-sm leading-7">
      {animate ? message.text.slice(0, visible) : message.text}
      {animate && (
        <span
          aria-hidden="true"
          className="ml-1 inline-block h-4 w-0.5 animate-pulse bg-current motion-reduce:animate-none"
        />
      )}
    </p>
  );
}

export default function VoiceSimulator() {
  const [step, setStep] = useState("idle");
  const [data, setData] = useState({});
  const [entry, setEntry] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 0,
      role: "agent",
      text: chatView("idle", {}).body,
      title: "শুরু করুন",
    },
  ]);
  const [phase, setPhase] = useState("ready");
  const [animatedId, setAnimatedId] = useState(null);
  const [error, setError] = useState("");
  const [soundOn, setSoundOn] = useState(true);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [showLatest, setShowLatest] = useState(false);
  const [ended, setEnded] = useState(false);
  const timer = useRef(null);
  const speakTimer = useRef(null);
  const utteranceRef = useRef(null);
  const soundRef = useRef(true);
  const sequence = useRef(1);
  const session = useRef(0);
  const locked = useRef(false);
  const animationRef = useRef(null);
  const pendingAgent = useRef(null);
  const screenRef = useRef(null);
  const followBottom = useRef(true);
  const current = chatView(step, data);
  const reply = scriptReply(step, data, current);
  const busy = phase !== "ready";
  const isPin = current.mode === "pin";
  const voiceOnly = current.mode === "text" && !current.options;
  const caller = data.service ? "আব্দুল মালেক" : data.name || "কলার";
  const hints = {
    idle: "16699",
    newPin: "5824",
    statusId: SAMPLE_APP_ID,
    statusPin: data.lookupId === data.appId ? data.pin : SAMPLE_APP_PIN,
    caseId: CASE_DIGITS,
    casePin: CASE_PIN,
    newAltNumber: "01700000000",
    specialPin: "1112",
    specialNumber: "01700000000",
  };

  const scrollBottom = useCallback(() => {
    if (followBottom.current && screenRef.current)
      screenRef.current.scrollTop = screenRef.current.scrollHeight;
  }, []);
  useEffect(scrollBottom, [messages, phase, scrollBottom]);
  const finishAnimation = useCallback((id) => {
    if (animationRef.current !== id) return;
    animationRef.current = null;
    if (pendingAgent.current) {
      const continueConversation = pendingAgent.current;
      pendingAgent.current = null;
      setAnimatedId(null);
      continueConversation();
      return;
    }
    locked.current = false;
    setAnimatedId(null);
    setPhase("ready");
  }, []);

  // Output speech is retained from the supplied working component. No speech recognition is used.
  const stopSpeech = useCallback(() => {
    clearTimeout(speakTimer.current);
    if (utteranceRef.current) {
      utteranceRef.current.onstart = null;
      utteranceRef.current.onend = null;
      utteranceRef.current.onerror = null;
      utteranceRef.current = null;
    }
    window.speechSynthesis?.cancel();
  }, []);
  const speakNow = useCallback(
    (text) => {
      stopSpeech();
      setSpeaking(false);
      if (
        !soundRef.current ||
        !("speechSynthesis" in window) ||
        !("SpeechSynthesisUtterance" in window)
      )
        return;
      const version = session.current;
      speakTimer.current = setTimeout(() => {
        if (session.current !== version || !soundRef.current) return;
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "bn-BD";
        utterance.rate = 0.88;
        const voice = synth
          .getVoices()
          .find((item) => item.lang.toLowerCase().startsWith("bn"));
        if (voice) utterance.voice = voice;
        utteranceRef.current = utterance;
        utterance.onstart = () => setSpeaking(true);
        utterance.onend = () => setSpeaking(false);
        utterance.onerror = () => setSpeaking(false);
        if (synth.paused) synth.resume();
        synth.speak(utterance);
      }, 30);
    },
    [stopSpeech],
  );
  useEffect(() => {
    setSpeechSupported(
      "speechSynthesis" in window && "SpeechSynthesisUtterance" in window,
    );
    window.speechSynthesis?.getVoices();
    return () => {
      clearTimeout(timer.current);
      stopSpeech();
    };
  }, [stopSpeech]);

  function promptText(view) {
    return [
      view.body,
      ...(view.options || []).map(
        ([key, label]) => `${label}। ${bnDigit(key)} চাপুন অথবা বলুন।`,
      ),
    ].join("\n");
  }
  function enqueueAgent(next, nextData, responseText, source = "keypad") {
    locked.current = true;
    setError("");
    setEntry("");
    followBottom.current = true;
    setShowLatest(false);
    const nextView = chatView(next, nextData);
    const version = session.current;
    const showAgent = () => {
      if (session.current !== version) return;
      setPhase("thinking");
      timer.current = setTimeout(() => {
        if (session.current !== version) return;
        const id = sequence.current++;
        animationRef.current = id;
        setStep(next);
        setData(nextData);
        setMessages((history) => [
          ...history,
          {
            id,
            role: "agent",
            text: nextView.body,
            options: nextView.options,
            title: nextView.title,
          },
        ]);
        setAnimatedId(id);
        setPhase("typing");
      }, 420);
    };
    if (responseText) {
      const replyId = sequence.current++;
      setMessages((history) => [
        ...history,
        {
          id: replyId,
          role: "caller",
          text: responseText,
          source,
          title: caller,
        },
      ]);
      if (source === "voice") {
        pendingAgent.current = showAgent;
        animationRef.current = replyId;
        setAnimatedId(replyId);
        setPhase("script");
      } else showAgent();
    } else showAgent();
    speakNow(promptText(nextView));
  }

  function submit(answer = entry, source = "keypad", spokenText) {
    if (locked.current || ended) return;
    const value = bn(String(answer).trim());
    if (step === "idle") {
      if (value !== "16699") return setError("কল শুরু করতে 16699 ডায়াল করুন।");
      return enqueueAgent("language", {}, "১৬৬৯৯-এ ডেমো কল শুরু", "keypad");
    }
    if (!value) return setError("কিপ্যাডে নম্বর দিন। শেষে # চাপুন।");
    if (current.options && !current.options.some(([key]) => key === value))
      return setError(
        `এই ধাপে ${current.options.map(([key]) => bnDigit(key)).join(", ")} থেকে নির্বাচন করুন।`,
      );
    if (isPin && !/^\d{4}$/.test(value))
      return setError("PIN ঠিক ৪ সংখ্যার হতে হবে।");
    if (
      current.mode === "digits" &&
      source === "keypad" &&
      !/^\d+$/.test(value)
    )
      return setError("কিপ্যাডে শুধু সংখ্যা ব্যবহার করুন।");
    const result = routeAnswer(step, value, data);
    if (result.error) return setError(result.error);
    const option = current.options?.find(([key]) => key === value);
    const display = isPin
      ? "••••  · PIN দেওয়া হয়েছে"
      : spokenText ||
        (option ? `${bnDigit(value)} · ${option[1]}` : bnDigit(value));
    enqueueAgent(result.next, { ...data, ...result.patch }, display, source);
  }

  function keyPress(key) {
    if (locked.current || ended || voiceOnly) return;
    setError("");
    if (key === "*") return setEntry((value) => value.slice(0, -1));
    if (key === "#") return submit();
    if (current.options) return submit(key);
    setEntry((value) => (value + key).slice(0, isPin ? 4 : 15));
  }
  function reset() {
    session.current += 1;
    clearTimeout(timer.current);
    stopSpeech();
    locked.current = false;
    animationRef.current = null;
    pendingAgent.current = null;
    followBottom.current = true;
    setStep("idle");
    setData({});
    setEntry("");
    setError("");
    setPhase("ready");
    setAnimatedId(null);
    setSpeaking(false);
    setEnded(false);
    setShowLatest(false);
    setMessages([
      {
        id: sequence.current++,
        role: "agent",
        text: chatView("idle", {}).body,
        title: "শুরু করুন",
      },
    ]);
  }
  function hangUp() {
    if (step === "idle" || ended) return;
    session.current += 1;
    clearTimeout(timer.current);
    stopSpeech();
    animationRef.current = null;
    pendingAgent.current = null;
    locked.current = false;
    setAnimatedId(null);
    setPhase("ready");
    setSpeaking(false);
    setEnded(true);
    setEntry("");
    setError("");
    setMessages((history) => [
      ...history,
      {
        id: sequence.current++,
        role: "system",
        text: "ডেমো কল শেষ হয়েছে। নতুন কল শুরু করতে রিসেট করুন।",
      },
    ]);
  }
  function toggleSound() {
    const next = !soundRef.current;
    soundRef.current = next;
    setSoundOn(next);
    if (!next) {
      stopSpeech();
      setSpeaking(false);
    } else if (step !== "idle" && !ended) speakNow(promptText(current));
  }
  function onKeyDown(event) {
    if (
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.target.closest("button")
    )
      return;
    if (/^[0-9*#]$/.test(event.key)) {
      event.preventDefault();
      keyPress(event.key);
    } else if (event.key === "Backspace") {
      event.preventDefault();
      keyPress("*");
    } else if (event.key === "Enter") {
      event.preventDefault();
      keyPress("#");
    }
  }

  return (
    <>
      <Navbar />
      <section
        lang="bn"
        className="min-h-screen bg-[#f0f5f2] px-3 py-8 text-slate-800 sm:px-6 sm:py-14"
      >
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1fr_440px] lg:gap-20">
          <div className="order-2 lg:order-1">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-xs font-semibold text-emerald-800">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />{" "}
              ইন্টারঅ্যাকটিভ ডেমো
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-snug text-emerald-950 sm:text-5xl">
              সহায়তার শুরু
              <br />
              <span className="text-emerald-700">একটি কথোপকথনে।</span>
            </h1>
            <p className="mt-5 max-w-md text-base leading-8 text-slate-600">
              ১৬৬৯৯ ডায়াল করুন। কিপ্যাডে সেবা বেছে নিন। নাম বা বিবরণ বলার সময়ে
              স্ক্রিপ্টের উত্তরটি কথোপকথনে যোগ করুন।
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white bg-white/75 p-5">
                <span className="text-xs font-bold tracking-widest text-emerald-600">
                  ০১ · কিপ্যাড
                </span>
                <p className="mt-2 text-sm leading-6">
                  নম্বর ও PIN দিন। <strong>#</strong> দিয়ে পাঠান,{" "}
                  <strong>*</strong> দিয়ে মুছুন। মেনুর সংখ্যা চাপলেই নির্বাচন
                  হবে।
                </p>
              </div>
              <div className="rounded-2xl border border-white bg-white/75 p-5">
                <span className="text-xs font-bold tracking-widest text-emerald-600">
                  ০২ · স্ক্রিপ্ট
                </span>
                <p className="mt-2 text-sm leading-6">
                  "উত্তর বলুন" চাপলে প্রস্তুত উত্তর যোগ হবে। মাইক্রোফোন বা ভয়েস
                  রেকর্ডিং ব্যবহার হয় না।
                </p>
              </div>
            </div>
            <details className="mt-6 rounded-2xl border border-emerald-100 bg-white/70 p-5 text-sm">
              <summary className="cursor-pointer font-semibold text-emerald-900">
                ডেমোর নম্বর ও PIN দেখুন
              </summary>
              <div className="mt-4 space-y-2 leading-6 text-slate-600">
                <p>
                  আবেদন: <strong>{SAMPLE_APP_ID}</strong> · PIN:{" "}
                  <strong>{SAMPLE_APP_PIN}</strong>
                </p>
                <p>
                  কেস: <strong>{CASE_ID}</strong>
                  <br />
                  কিপ্যাডে: <strong>{CASE_DIGITS}</strong> · PIN:{" "}
                  <strong>{CASE_PIN}</strong>
                </p>
                <p>
                  বিশেষ সহায়তার PIN: <strong>1112</strong>
                </p>
              </div>
            </details>
            <p className="mt-5 flex items-start gap-2 text-xs leading-6 text-slate-500">
              <FiShield className="mt-1 shrink-0" aria-hidden="true" />
              সব তথ্য নমুনা। বাস্তবে কোনো কল, আবেদন, SMS বা জরুরি সহায়তার অনুরোধ
              পাঠানো হয় না।
            </p>
          </div>

          <div className="order-1 mx-auto w-full max-w-110 lg:order-2">
            <div
              tabIndex={0}
              onKeyDown={onKeyDown}
              aria-label="ডেমো ফোন: সংখ্যা, Enter ও Backspace ব্যবহার করতে পারবেন"
              className="overflow-hidden rounded-[2.8rem] border-[6px] border-slate-800 bg-slate-900 p-2 shadow-2xl shadow-emerald-950/20 outline-none focus-visible:ring-4 focus-visible:ring-emerald-300"
            >
              <div className="flex h-6 items-center justify-center">
                <div className="h-1 w-20 rounded-full bg-slate-600" />
              </div>
              <div className="overflow-hidden rounded-4xl bg-white">
                <header className="flex items-center gap-3 bg-emerald-900 px-4 py-2 text-white">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/15">
                    <FiPhone size={21} aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-bold text-sm">লিগ্যাল এইড · ১৬৬৯৯</h2>
                    <p className="mt-1 flex items-center gap-1.5 text-[10px] text-emerald-100">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${ended ? "bg-slate-300" : "bg-emerald-300"}`}
                      />
                      {ended
                        ? "কল শেষ"
                        : speaking
                          ? "এজেন্ট কথা বলছে"
                          : step === "idle"
                            ? "ডায়াল করতে প্রস্তুত"
                            : "সংযুক্ত · নমুনা কথোপকথন"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={toggleSound}
                    disabled={!speechSupported}
                    aria-label={
                      soundOn
                        ? "এজেন্টের শব্দ বন্ধ করুন"
                        : "এজেন্টের শব্দ চালু করুন"
                    }
                    aria-pressed={soundOn}
                    className="rounded-full p-2 hover:bg-white/15 disabled:opacity-30"
                  >
                    {soundOn ? (
                      <FiVolume2 aria-hidden="true" />
                    ) : (
                      <FiVolumeX aria-hidden="true" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={reset}
                    aria-label="নতুন করে শুরু করুন"
                    className="rounded-full p-2 hover:bg-white/15"
                  >
                    <FiRefreshCw aria-hidden="true" />
                  </button>
                </header>
                <div className="border-b border-emerald-100 bg-emerald-50 px-4 py-1 text-center text-[10px] font-medium text-emerald-800">
                  স্ক্রিপ্টের কথোপকথন · মাইক্রোফোন বন্ধ
                </div>
                <div className="relative">
                  <div
                    ref={screenRef}
                    role="log"
                    aria-label="কথোপকথন"
                    aria-live="off"
                    onScroll={(event) => {
                      const el = event.currentTarget;
                      const near =
                        el.scrollHeight - el.scrollTop - el.clientHeight < 70;
                      followBottom.current = near;
                      setShowLatest(!near);
                    }}
                    className="h-75 space-y-5 overflow-y-auto overscroll-contain bg-[#f6f8f6] px-3 py-5 sm:h-75"
                  >
                    <div className="text-center text-[10px] font-medium text-slate-400">
                      আজ · ১৬৬৯৯ ডেমো
                    </div>
                    {messages.map((message) =>
                      message.role === "system" ? (
                        <p
                          key={message.id}
                          className="rounded-xl bg-slate-200/60 px-4 py-3 text-center text-xs text-slate-600"
                        >
                          {message.text}
                        </p>
                      ) : (
                        <div
                          key={message.id}
                          className={`flex animate-[chatIn_180ms_ease-out] motion-reduce:animate-none ${message.role === "caller" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[92%] rounded-2xl px-4 py-3 shadow-sm ${message.role === "caller" ? "rounded-tr-sm bg-emerald-800 text-white" : "rounded-tl-sm border border-slate-100 bg-white text-slate-700"}`}
                          >
                            <div
                              className={`mb-2 flex items-center gap-1.5 text-[10px] font-semibold ${message.role === "caller" ? "text-emerald-200" : "text-emerald-700"}`}
                            >
                              {message.role === "agent" ? (
                                <>
                                  <FiShield aria-hidden="true" />{" "}
                                  {message.title === "মানব কর্মকর্তা · ডেমো"
                                    ? "মানব কর্মকর্তা · ডেমো"
                                    : "লিগ্যাল এইড এজেন্ট"}
                                </>
                              ) : (
                                <>
                                  {message.source === "voice" && (
                                    <FiMic aria-hidden="true" />
                                  )}{" "}
                                  {message.title} ·{" "}
                                  {message.source === "voice"
                                    ? "স্ক্রিপ্টের উত্তর"
                                    : "কিপ্যাড"}
                                </>
                              )}
                            </div>
                            <AnimatedMessage
                              message={message}
                              animate={message.id === animatedId}
                              onComplete={finishAnimation}
                              onProgress={scrollBottom}
                            />
                            {message.options && message.id !== animatedId && (
                              <ul className="mt-3 space-y-2 border-t border-slate-100 pt-3">
                                {message.options.map(([key, label]) => (
                                  <li
                                    key={key}
                                    className="flex items-start gap-2 text-xs leading-5"
                                  >
                                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded bg-emerald-50 font-bold text-emerald-800">
                                      {bnDigit(key)}
                                    </span>
                                    <span>
                                      {label}
                                      <span className="block text-[10px] text-slate-400">
                                        {bnDigit(key)} চাপুন অথবা বলুন
                                      </span>
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            )}
                            {message.role === "caller" && (
                              <span className="mt-1 flex justify-end text-emerald-200">
                                <FiCheck
                                  size={12}
                                  aria-label="ডেমো উত্তর দেওয়া হয়েছে"
                                />
                              </span>
                            )}
                          </div>
                        </div>
                      ),
                    )}
                    {phase === "thinking" && (
                      <div
                        className="flex w-fit items-center gap-1 rounded-2xl rounded-tl-sm border border-slate-100 bg-white px-5 py-4"
                        role="status"
                        aria-label="এজেন্ট উত্তর প্রস্তুত করছে"
                      >
                        {[0, 1, 2].map((dot) => (
                          <span
                            key={dot}
                            style={{ animationDelay: `${dot * 130}ms` }}
                            className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500 motion-reduce:animate-none"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  {showLatest && (
                    <button
                      type="button"
                      onClick={() => {
                        followBottom.current = true;
                        scrollBottom();
                        setShowLatest(false);
                      }}
                      className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full border border-emerald-200 bg-white px-3 py-2 text-xs text-emerald-900 shadow-md"
                    >
                      <FiArrowDown aria-hidden="true" /> সর্বশেষ
                    </button>
                  )}
                </div>
                <p className="sr-only" role="status" aria-live="polite">
                  {phase === "ready"
                    ? `${current.body} ${(current.options || []).map(([key, label]) => `${bnDigit(key)}: ${label}`).join("। ")}`
                    : "উত্তর তৈরি হচ্ছে"}
                </p>
                <div className="border-t border-slate-200 bg-white px-4 py-3">
                  {ended ? (
                    <button
                      type="button"
                      onClick={reset}
                      className="w-full rounded-xl bg-emerald-800 px-4 py-3 text-sm font-semibold text-white"
                    >
                      নতুন কল শুরু করুন
                    </button>
                  ) : (
                    <>
                      {reply && !isPin && step !== "idle" && (
                        <div className="mb-3">
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() =>
                              submit(reply.value, "voice", reply.text)
                            }
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-900 transition hover:bg-emerald-100 disabled:opacity-40"
                          >
                            <FiMic aria-hidden="true" /> উত্তর বলুন
                          </button>
                          <p
                            className="mt-1.5 truncate text-center text-[10px] text-slate-400"
                            title={reply.text}
                          >
                            নমুনা: “{reply.text}”
                          </p>
                        </div>
                      )}
                      {!voiceOnly && (
                        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1">
                          <output
                            aria-label={isPin ? "গোপন PIN" : "কিপ্যাডের নম্বর"}
                            className="min-w-0 flex-1 truncate text-center font-mono text-lg tracking-[0.16em] text-emerald-950"
                          >
                            {entry ? (
                              isPin ? (
                                "•".repeat(entry.length)
                              ) : (
                                entry
                              )
                            ) : (
                              <span className="font-sans text-xs tracking-normal text-slate-400">
                                {current.options
                                  ? "কিপ্যাডে একটি বিকল্প চাপুন"
                                  : isPin
                                    ? "৪ সংখ্যার PIN"
                                    : "কিপ্যাডে নম্বর দিন"}
                              </span>
                            )}
                          </output>
                          <button
                            type="button"
                            disabled={busy || !entry}
                            onClick={() => keyPress("*")}
                            aria-label="শেষ সংখ্যা মুছুন"
                            className="rounded-lg p-2 text-slate-500 disabled:opacity-30"
                          >
                            <FiDelete aria-hidden="true" />
                          </button>
                        </div>
                      )}
                      {voiceOnly && (
                        <p className="text-center text-[10px] text-slate-400">
                          এই ধাপে নাম বা বিবরণ স্ক্রিপ্ট থেকে যোগ হবে।
                        </p>
                      )}
                      {hints[step] && !entry && (
                        <p className="mt-1.5 text-center text-[10px] text-slate-400">
                          ডেমোর জন্য: {hints[step]}
                        </p>
                      )}
                    </>
                  )}
                  {error && (
                    <p
                      role="alert"
                      className="mt-2 rounded-lg bg-red-50 p-2 text-xs text-red-700"
                    >
                      {error}
                    </p>
                  )}
                </div>
                <div className="border-t border-slate-100 bg-[#f9faf9] px-6 pb-4 pt-3">
                  <div className="grid grid-cols-3 gap-2">
                    {KEYS.map((key) => (
                      <button
                        type="button"
                        key={key}
                        disabled={busy || ended || voiceOnly}
                        onClick={() => keyPress(key)}
                        aria-label={
                          key === "*"
                            ? "শেষ সংখ্যা মুছুন"
                            : key === "#"
                              ? "নম্বর পাঠান"
                              : key
                        }
                        className="h-10 rounded-xl border border-slate-100 bg-white font-mono text-xl font-medium text-slate-700 shadow-sm transition hover:bg-emerald-50 active:scale-95 disabled:opacity-25 sm:h-11"
                      >
                        {key}
                      </button>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center justify-center gap-5">
                    <button
                      type="button"
                      disabled={busy || ended || step === "idle"}
                      onClick={() =>
                        enqueueAgent("menu", data, "মূল মেনুতে ফিরুন", "keypad")
                      }
                      aria-label="মূল মেনু"
                      className="rounded-full bg-slate-200 p-3 text-slate-600 disabled:opacity-30"
                    >
                      <FiRefreshCw aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      disabled={busy || ended || voiceOnly || !entry}
                      onClick={() => submit()}
                      aria-label={step === "idle" ? "কল করুন" : "নম্বর পাঠান"}
                      className="rounded-full bg-emerald-700 p-4 text-xl text-white shadow-lg shadow-emerald-900/20 transition hover:bg-emerald-600 disabled:opacity-30"
                    >
                      {step === "idle" ? (
                        <FiPhone aria-hidden="true" />
                      ) : (
                        <FiSend aria-hidden="true" />
                      )}
                    </button>
                    <button
                      type="button"
                      disabled={step === "idle" || ended}
                      onClick={hangUp}
                      aria-label="কল শেষ করুন"
                      className="rounded-full bg-red-100 p-3 text-red-600 disabled:opacity-30"
                    >
                      <FiPhoneOff aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="mx-auto mt-3 h-1 w-24 rounded-full bg-slate-600" />
            </div>
          </div>
        </div>
        <style>{`@keyframes chatIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      </section>
      <Footer />
    </>
  );
}
