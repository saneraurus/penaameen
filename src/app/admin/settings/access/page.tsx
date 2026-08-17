import { AdminHeader } from "@/presentation/components/admin/AdminHeader";
import { StaffAccessManager } from "@/presentation/components/admin/StaffAccessManager";
import { requireStaffActor } from "@/application/auth/clerk-auth";
import { getStaffMembers } from "@/lib/admin/staff";

export default async function AdminStaffAccessPage() {
  void (await requireStaffActor("access:read"));
  const members = await getStaffMembers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <AdminHeader
          title="Staff Access"
          description="Manage team members, roles, and capabilities"
        />
        <button
          type="button"
          disabled
          title="Invite flow requires Clerk configuration"
          className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg opacity-50 cursor-not-allowed"
        >
          Invite Staff
        </button>
      </div>

      <StaffAccessManager initialMembers={members} />
    </div>
  );
}
