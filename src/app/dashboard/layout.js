import SidebarNav from "@/components/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex">
      <SidebarNav />
      <main className="ml-56 flex-1 p-6">{children}</main>
    </div>
  );
}
