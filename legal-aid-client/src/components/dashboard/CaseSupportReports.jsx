"use client";

function countBy(cases, field) {
  return cases.reduce((counts, item) => {
    const value = item[field] || "নির্ধারিত নয়";
    counts[value] = (counts[value] || 0) + 1;
    return counts;
  }, {});
}

function ReportCard({ title, counts }) {
  return (
    <section className="rounded-2xl border border-[#d6e0f2] bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold">{title}</h2>
      <div className="mt-4">
        {Object.entries(counts).map(([label, total]) => (
          <div
            key={label}
            className="flex items-center justify-between gap-4 border-b border-[#d6e0f2] py-3 last:border-0"
          >
            <span className="text-sm text-slate-600">{label}</span>
            <strong>{total}</strong>
          </div>
        ))}
        {Object.keys(counts).length === 0 && (
          <p className="text-sm text-slate-500">কোনো কেস নেই।</p>
        )}
      </div>
    </section>
  );
}

export default function CaseSupportReports({ cases }) {
  function exportCsv() {
    const headings = [
      "কেস আইডি",
      "আবেদনকারী",
      "বিষয়",
      "অগ্রাধিকার",
      "অবস্থা",
      "আবেদনের উৎস",
      "সর্বশেষ আপডেট",
    ];

    const rows = cases.map((item) => [
      item.id,
      item.applicant,
      item.type,
      item.priority,
      item.status,
      item.source,
      item.updated,
    ]);

    const csv = [headings, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value ?? "").replaceAll('"', '""')}"`)
          .join(","),
      )
      .join("\r\n");

    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "DLO_Case_Report.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <div className="space-y-6 text-[#202b3e]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-emerald-800">
            ডিএলও / প্রশাসন ও কেস সাপোর্ট
          </p>
          <h1 className="mt-2 text-3xl font-extrabold">নিয়মিত প্রতিবেদন</h1>
          <p className="mt-2 text-slate-600">
            কেস রেকর্ডের বর্তমান তথ্য থেকে তৈরি সারসংক্ষেপ।
          </p>
        </div>

        <div className="flex flex-wrap gap-2 print:hidden">
          <button
            type="button"
            onClick={exportCsv}
            className="rounded-xl bg-[#0d392e] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#175341]"
          >
            CSV ডাউনলোড
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-xl border border-[#d6e0f2] bg-white px-4 py-2.5 text-sm font-bold text-emerald-900 hover:bg-slate-50"
          >
            প্রিন্ট করুন
          </button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <ReportCard title="অবস্থা অনুযায়ী" counts={countBy(cases, "status")} />
        <ReportCard title="বিষয় অনুযায়ী" counts={countBy(cases, "type")} />
        <ReportCard
          title="অগ্রাধিকার অনুযায়ী"
          counts={countBy(cases, "priority")}
        />
      </div>

      <p className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm leading-7 text-emerald-950">
        প্রতিবেদনটি বর্তমানে দেখানো কেস রেকর্ড থেকে তৈরি হয়। নতুন কেস তৈরি বা
        কেসের অবস্থা পরিবর্তন করলে এখানকার সংখ্যাও পরিবর্তিত হবে।
      </p>
    </div>
  );
}