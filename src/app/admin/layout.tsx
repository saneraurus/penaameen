import { AdminSidebar } from "@/presentation/components/admin/AdminSidebar";

export default function AdminLayout(props: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-6">{props.children}</main>
      </div>
    </div>
  );
}