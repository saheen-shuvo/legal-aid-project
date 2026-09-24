import Link from "next/link";
import CitizenRegistrationForm from "../../components/CitizenRegistrationForm";
import UdcRegistrationForm from "../../components/UdcRegistrationForm";
import StaffRegistrationForm from "../../components/StaffRegistrationForm";
import PanelLawyerRegistrationForm from "@/components/PanelLawyerRegistrationForm";

export default async function RegisterPage({ searchParams }) {
  const { role } = await searchParams;

  if (!role || role === "applicant") {
    return <CitizenRegistrationForm />;
  }

  if (role === "udc-entrepreneur") {
    return <UdcRegistrationForm />;
  }

  if (role === "dlo-officer") {
    return <StaffRegistrationForm title="ডিএলও অফিসার" />;
  }

  if (role === "legal-aid-officer-mediator") {
    return <StaffRegistrationForm title="লিগ্যাল এইড অফিসার/মেডিয়েটর" />;
  }

  if (role === "panel-lawyer") {
    return <PanelLawyerRegistrationForm />;
  }

  if (role === "dlo-administration-case-support") {
    return (
      <StaffRegistrationForm title="ডিএলও অ্যাডমিনিস্ট্রেশন/কেস সাপোর্ট" />
    );
  }

  if (role === "nlaso") {
    return <StaffRegistrationForm title="এনএলএএসও (NLASO)" />;
  }

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-emerald-900">
          এই ভূমিকার নিবন্ধন ফর্ম শিগগিরই যুক্ত হবে
        </h1>
        <Link href="/register?role=applicant" className="btn btn-link mt-4">
          নাগরিক নিবন্ধন দেখুন
        </Link>
      </div>
    </main>
  );
}
