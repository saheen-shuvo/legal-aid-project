"use client";

import { caseSupportTasks } from "./caseSupportTasks";
import { initialRecord } from "./CaseSupportDetails";

function localDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function displayDate(value) {
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("bn-BD", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
}

export default function CaseSupportTasks({ cases, onUpdate }) {
  const rows = cases
    .flatMap((item) =>
      (item.tasks || caseSupportTasks[item.id] || []).map((task) => ({
        item,
        task,
      })),
    )
    .sort((a, b) => {
      if (a.task.status === "মেয়াদোত্তীর্ণ") return -1;
      if (b.task.status === "মেয়াদোত্তীর্ণ") return 1;
      return a.task.due.localeCompare(b.task.due);
    });

  function saveCase(next) {
    onUpdate(next);

    try {
      localStorage.setItem(
        `case-support:${next.id}`,
        JSON.stringify(next),
      );
    } catch {
      // The current page remains usable if browser storage is unavailable.
    }
  }

  function completeTask(item, task) {
    let record;

    try {
      const saved = localStorage.getItem(`case-support:${item.id}`);
      record = saved ? JSON.parse(saved) : initialRecord(item);
    } catch {
      record = initialRecord(item);
    }

    const eventDate = new Date().toLocaleDateString("bn-BD", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    saveCase({
      ...record,
      updated: eventDate,
      tasks: record.tasks.map((entry) =>
        entry.id === task.id
          ? { ...entry, status: "সম্পন্ন" }
          : entry,
      ),
      events: [
        ...record.events,
        [
          eventDate,
          "প্রশাসনিক কর্মী",
          "কাজ সম্পন্ন",
          task.name,
        ],
      ],
    });
  }

  function refreshOverdue() {
    const currentDate = localDate();

    cases.forEach((item) => {
      let record;

      try {
        const saved = localStorage.getItem(`case-support:${item.id}`);
        record = saved ? JSON.parse(saved) : initialRecord(item);
      } catch {
        record = initialRecord(item);
      }

      const tasks = record.tasks.map((task) =>
        task.status === "অপেক্ষমাণ" && task.due < currentDate
          ? { ...task, status: "মেয়াদোত্তীর্ণ" }
          : task,
      );

      if (tasks.some((task, index) => task.status !== record.tasks[index].status)) {
        saveCase({ ...record, tasks });
      }
    });
  }

  return (
    <div className="space-y-6 text-[#202b3e]">
      <div>
        <p className="text-sm font-bold text-emerald-800">
          ডিএলও / প্রশাসন ও কেস সাপোর্ট
        </p>
        <h1 className="mt-2 text-3xl font-extrabold">কাজের তালিকা</h1>
        <p className="mt-2 text-slate-600">
          সব কেসের অসম্পন্ন ও মেয়াদোত্তীর্ণ কাজ এক জায়গায় দেখুন।
        </p>
      </div>

      <section className="overflow-hidden rounded-2xl border border-[#d6e0f2] bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#d6e0f2] p-5">
          <div>
            <h2 className="text-xl font-bold">মনোযোগ প্রয়োজন এমন কাজ</h2>
            <p className="mt-1 text-sm text-slate-500">
              কাজ সম্পন্ন করলে তা সংশ্লিষ্ট কেসের ইতিহাসে যুক্ত হবে।
            </p>
          </div>
          <button
            type="button"
            onClick={refreshOverdue}
            className="rounded-xl border border-[#d6e0f2] px-4 py-2.5 text-sm font-bold text-emerald-900 hover:bg-slate-50"
          >
            মেয়াদোত্তীর্ণ অবস্থা হালনাগাদ
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-5 py-3">কাজ</th>
                <th className="px-4 py-3">কেস</th>
                <th className="px-4 py-3">শেষ তারিখ</th>
                <th className="px-4 py-3">অবস্থা</th>
                <th className="px-5 py-3">পদক্ষেপ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d6e0f2]">
              {rows.map(({ item, task }) => (
                <tr key={`${item.id}-${task.id}`}>
                  <td className="px-5 py-4">
                    <strong>{task.name}</strong>
                    <span className="mt-1 block text-xs text-slate-500">
                      {item.applicant}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-bold">{item.id}</td>
                  <td className="px-4 py-4">{displayDate(task.due)}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        task.status === "সম্পন্ন"
                          ? "bg-emerald-100 text-emerald-800"
                          : task.status === "মেয়াদোত্তীর্ণ"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    {task.status !== "সম্পন্ন" && (
                      <button
                        type="button"
                        onClick={() => completeTask(item, task)}
                        className="rounded-lg border border-[#d6e0f2] px-3 py-2 text-xs font-bold text-emerald-900 hover:bg-emerald-50"
                      >
                        সম্পন্ন করুন
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {rows.length === 0 && (
            <p className="p-8 text-center text-slate-500">
              এখনো কোনো কাজ যুক্ত হয়নি।
            </p>
          )}
        </div>
      </section>
    </div>
  );
}