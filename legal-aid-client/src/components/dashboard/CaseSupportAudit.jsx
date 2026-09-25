"use client";

import { initialRecord } from "./CaseSupportDetails";

export default function CaseSupportAudit({ cases }) {
  const entries = cases.flatMap((item) => {
    // Updated cases already contain events. Otherwise, use the demo history.
    const events = item.events || initialRecord(item).events;

    return events.map((event, index) => ({
      id: `${item.id}-${index}`,
      caseId: item.id,
      applicant: item.applicant,
      date: event[0],
      role: event[1],
      action: event[2],
      detail: event[3],
    }));
  });

  return (
    <div className="space-y-6 text-[#202b3e]">
      <div>
        <p className="text-sm font-bold text-emerald-800">
          ডিএলও / প্রশাসন ও কেস সাপোর্ট
        </p>
        <h1 className="mt-2 text-3xl font-extrabold">অডিট ইতিহাস</h1>
        <p className="mt-2 text-slate-600">
          কোন কেসে, কোন ভূমিকায়, কী কার্যক্রম হয়েছে তার তালিকা।
        </p>
      </div>

      <section className="overflow-hidden rounded-2xl border border-[#d6e0f2] bg-white shadow-sm">
        <div className="border-b border-[#d6e0f2] p-5">
          <h2 className="text-xl font-bold">ভূমিকা অনুযায়ী কার্যক্রমের ইতিহাস</h2>
          <p className="mt-1 text-sm text-slate-500">
            মোট {entries.length}টি কার্যক্রম নথিভুক্ত আছে।
          </p>
        </div>

        {entries.length === 0 ? (
          <p className="p-8 text-center text-slate-500">
            এখনো কোনো কার্যক্রম নথিভুক্ত হয়নি।
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-5 py-3">তারিখ</th>
                  <th className="px-4 py-3">কেস</th>
                  <th className="px-4 py-3">কর্মী / ভূমিকা</th>
                  <th className="px-4 py-3">কার্যক্রম</th>
                  <th className="px-5 py-3">বিস্তারিত</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d6e0f2]">
                {[...entries].reverse().map((entry) => (
                  <tr key={entry.id} className="align-top hover:bg-slate-50">
                    <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                      {entry.date}
                    </td>
                    <td className="px-4 py-4">
                      <strong>{entry.caseId}</strong>
                      <span className="mt-1 block text-xs text-slate-500">
                        {entry.applicant}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-semibold">
                      {entry.role}
                    </td>
                    <td className="px-4 py-4 font-semibold">
                      {entry.action}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {entry.detail}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}