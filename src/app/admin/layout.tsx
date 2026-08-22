import { AdminSidebar } from "@/presentation/components/admin/AdminSidebar";
import { requireStaffActor } from "@/application/auth/clerk-auth";

export default async function AdminLayout(props: {
  children: React.ReactNode;
}) {
  await requireStaffActor();

  return (
    <div className="admin-shell flex min-h-screen flex-col lg:flex-row">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
          {props.children}
        </main>
      </div>
    </div>
  );
}
