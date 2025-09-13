"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Car, User, Settings } from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Cars", href: "/dashboard/car", icon: Car },
  { name: "Billings", href: "/dashboard/bill", icon: User },
  { name: "Documentation", href: "/dashboard/docs", icon: Settings },
  { name: "Profile", href: "/dashboard/profile", icon: Settings },
  { name: "Setting", href: "/dashboard/setting", icon: Settings },
];

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-56 border-r bg-primary-foreground p-4 flex flex-col gap-4">
      <h2 className="text-xl font-bold mb-4">Shopp Car</h2>
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-white"
                  : "hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
