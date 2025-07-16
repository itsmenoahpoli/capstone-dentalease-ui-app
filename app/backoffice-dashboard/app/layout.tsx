"use client";

import { Button } from "@radix-ui/themes";
import Link from "next/link";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

const menu = [
  {
    section: "MAIN",
    items: [
      {
        label: "Dashboard Overview",
        icon: <LayoutDashboard size={18} />,
        href: "/backoffice-dashboard/app/overview",
        active: true,
      },
      {
        label: "Accounts Management",
        icon: <Users size={18} />,
        href: "/backoffice-dashboard/app/accounts",
        active: false,
      },
      {
        label: "Settings",
        icon: <Settings size={18} />,
        href: "/backoffice-dashboard/app/settings",
        active: false,
      },
    ],
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full">
      <div className="w-60 h-full bg-[#0c1427] flex flex-col">
        <div className="flex flex-col h-full py-4 gap-4 relative">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-800 p-4 justify-center">
            <img
              src="/assets/brand-logo.png"
              alt="dentalease.png"
              width={250}
              height={250}
            />
          </div>
          <div
            className="flex flex-col gap-2 flex-1 px-4"
            style={{ zoom: 0.95 }}
          >
            {menu.map((section) => (
              <div key={section.section} className="mb-4">
                <div className="text-xs text-gray-200 font-medium mb-2 px-3 tracking-widest">
                  {section.section}
                </div>
                <div className="flex flex-col gap-1">
                  {section.items.map((item) => (
                    <Link
                      href={item.href || "#"}
                      key={item.label}
                      className={`flex items-center gap-3 px-3 py-2 rounded cursor-pointer transition text-[13px] font-normal ${
                        item.active
                          ? "text-indigo-400"
                          : "text-gray-500 hover:text-indigo-400"
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <main className="flex-1 bg-slate-50 min-h-screen overflow-auto p-4 md:p-8 ml-0 md:ml-0">
        {children}
      </main>
    </div>
  );
}
