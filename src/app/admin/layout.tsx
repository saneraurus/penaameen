import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/presentation/components/admin/AdminSidebar";
import { AdminAmeenCopilot } from "@/presentation/components/admin/AdminAmeenCopilot";
import { getStaffActor } from "@/application/auth/clerk-auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout(props: {
  children: React.ReactNode;
}) {
  const headerList = await headers();
  const pathname = headerList.get("x-pathname") || "";

  // If accessing the admin login page directly, render without sidebar shell
  if (pathname === "/admin/login") {
    return <>{props.children}</>;
  }

  const staff = await getStaffActor();

  if (!staff) {
    redirect("/admin/login");
  }

  return (
    <div className="admin-shell flex min-h-screen flex-col lg:flex-row">
      <AdminSidebar staff={staff} />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-background-50">
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 lg:py-10 scrollbar-none">
          {props.children}
        </main>
      </div>
      <AdminAmeenCopilot />
    </div>
  );
}
