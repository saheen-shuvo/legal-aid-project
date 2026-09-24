import { notFound } from "next/navigation";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import DashboardContent from "../../../components/dashboard/DashboardContent";
import { dashboardRoles } from "../../../data/dashboardRoles";

export default async function DashboardPage({ params }) {
  const { role } = await params;
  const roleConfig = dashboardRoles[role];

  if (!roleConfig) notFound();

  return (
    <DashboardLayout role={role} roleConfig={roleConfig}>
      <DashboardContent role={role} roleConfig={roleConfig} />
    </DashboardLayout>
  );
}