"use client";
import "react-perfect-scrollbar/dist/css/styles.css";
import PerfectScrollbar from "react-perfect-scrollbar";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard } from "lucide-react";
import { Flex, Avatar } from "@radix-ui/themes";

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
    ],
  },
  {
    section: "MANAGE",
    items: [
      {
        label: "Services",
        icon: <LayoutDashboard size={18} />,
        href: "/backoffice-dashboard/app/zz",
      },
      {
        label: "Appointments",
        icon: <LayoutDashboard size={18} />,
        href: "/backoffice-dashboard/app/zz",
      },
      {
        label: "Patient Records",
        icon: <LayoutDashboard size={18} />,
        href: "/backoffice-dashboard/app/zz",
      },
      {
        label: "Billings & Payments",
        icon: <LayoutDashboard size={18} />,
        href: "/backoffice-dashboard/app/zz",
      },
      {
        label: "Inventory",
        icon: <LayoutDashboard size={18} />,
        href: "/backoffice-dashboard/app/zz",
      },
      {
        label: "Prescriptions",
        icon: <LayoutDashboard size={18} />,
        href: "/backoffice-dashboard/app/zz",
      },
    ],
  },
  {
    section: "CMS",
    items: [
      {
        label: "Clinic Information",
        icon: <LayoutDashboard size={18} />,
        href: "/backoffice-dashboard/app/zz",
      },
      {
        label: "Clinic Announcements",
        icon: <LayoutDashboard size={18} />,
        href: "/backoffice-dashboard/app/zz",
      },
      {
        label: "Latest Developments",
        icon: <LayoutDashboard size={18} />,
        href: "/backoffice-dashboard/app/zz",
      },
      {
        label: "Owner Information",
        icon: <LayoutDashboard size={18} />,
        href: "/backoffice-dashboard/app/zz",
      },
      {
        label: "Our Team",
        icon: <LayoutDashboard size={18} />,
        href: "/backoffice-dashboard/app/zz",
      },
    ],
  },
  {
    section: "HELP & SUPPORT",
    items: [
      {
        label: "CONTACT US ENTRIES",
        icon: <LayoutDashboard size={18} />,
        href: "/backoffice-dashboard/app/zz",
      },
      {
        label: "CHAT SUPPORT AI",
        icon: <LayoutDashboard size={18} />,
        href: "/backoffice-dashboard/app/zz",
      },
    ],
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return href === pathname;
  };

  return (
    <div className="flex h-screen w-full">
      <div className="w-64 h-full bg-[#0c1427] flex flex-col">
        <div className="flex flex-col h-full py-4 gap-4 relative">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-800 p-4 justify-center">
            <Image
              src="/assets/brand-logo.png"
              alt="dentalease.png"
              width={250}
              height={250}
            />
          </div>
          <div
            className="flex flex-col gap-2 flex-1 px-4"
            // style={{ zoom: 0.95 }}
          >
            <PerfectScrollbar className="h-full">
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
                          isActive(item.href)
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
            </PerfectScrollbar>
          </div>
        </div>
      </div>
      <main className="flex-1 bg-slate-50 min-h-screen overflow-auto">
        <div className="bg-white flex justify-between items-center border-b border-gray-200 py-3 px-5 mb-6 fixed top-0 z-50 w-[calc(100%-16rem)]">
          <Flex></Flex>
          <Flex>
            <Avatar
              className="bg-amber-500 rounded-full"
              fallback={<span className="text-white font-medium">RC</span>}
            />
          </Flex>
        </div>
        <div className="pt-[4.5rem] px-5">{children}</div>
      </main>
    </div>
  );
}
