import { AdminHeader } from "@/presentation/components/admin/AdminHeader";
import { StaffAccessManager } from "@/presentation/components/admin/StaffAccessManager";
import { requireStaffActor } from "@/application/auth/clerk-auth";
import { getStaffMembers } from "@/lib/admin/staff";

export default async function AdminStaffAccessPage() {
  void (await requireStaffActor("access:read"));
  const members = await getStaffMembers();

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Staff & Admin Access"
        description="Kelola pengguna administrator, peran hak akses, dan kata sandi tim operasional"
      />

      <StaffAccessManager initialMembers={members} />
    </div>
  );
}
