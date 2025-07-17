"use client";
import "react-perfect-scrollbar/dist/css/styles.css";
import "nprogress/nprogress.css";
import PerfectScrollbar from "react-perfect-scrollbar";
import NProgress from "nprogress";
import Link from "next/link";
import Image from "next/image";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { usePathname } from "next/navigation";
import {
  Braces,
  CalendarArrowDown,
  DollarSign,
  FileText,
  LayoutDashboard,
  ListChecks,
  ListFilterPlus,
  MessageCircleCode,
  TruckElectric,
} from "lucide-react";
import { Flex, Avatar } from "@radix-ui/themes";
import { AppBreadcrumbs, AppClock, UserSidebarProfile } from "@/components";
import { useEffect } from "react";

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
        icon: <ListChecks size={18} />,
        href: "/backoffice-dashboard/app/services",
      },
      {
        label: "Appointments",
        icon: <CalendarArrowDown size={18} />,
        href: "/backoffice-dashboard/app/zz",
      },
      {
        label: "Patient Records",
        icon: <ListFilterPlus size={18} />,
        href: "/backoffice-dashboard/app/zz",
      },
      {
        label: "Billings & Payments",
        icon: <DollarSign size={18} />,
        href: "/backoffice-dashboard/app/zz",
      },
      {
        label: "Inventory",
        icon: <TruckElectric size={18} />,
        href: "/backoffice-dashboard/app/zz",
      },
      {
        label: "Prescriptions",
        icon: <FileText size={18} />,
        href: "/backoffice-dashboard/app/zz",
      },
    ],
  },
  {
    section: "CMS",
    items: [
      {
        label: "Clinic Information",
        icon: <Braces size={18} />,
        href: "/backoffice-dashboard/app/zz",
      },
      {
        label: "Clinic Announcements",
        icon: <Braces size={18} />,
        href: "/backoffice-dashboard/app/zz",
      },
      {
        label: "Latest Developments",
        icon: <Braces size={18} />,
        href: "/backoffice-dashboard/app/zz",
      },
      {
        label: "Owner Information",
        icon: <Braces size={18} />,
        href: "/backoffice-dashboard/app/zz",
      },
      {
        label: "Our Team",
        icon: <Braces size={18} />,
        href: "/backoffice-dashboard/app/zz",
      },
    ],
  },
  {
    section: "HELP & SUPPORT",
    items: [
      {
        label: "Contact Us Entries",
        icon: <MessageCircleCode size={18} />,
        href: "/backoffice-dashboard/app/zz",
      },
      {
        label: "AI Chat Support",
        icon: <MessageCircleCode size={18} />,
        href: "/backoffice-dashboard/app/zz",
      },
    ],
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    NProgress.start();
    const timeout = setTimeout(() => {
      NProgress.done();
    }, 500);
    return () => clearTimeout(timeout);
  }, [pathname]);

  const isActive = (href: string) => {
    return href === pathname;
  };

  return (
    <div className="flex h-screen w-full">
      <div className="w-64 h-full bg-[#0c1427] flex flex-col fixed left-0 top-0 z-50">
        <div className="flex flex-col h-full w-full py-4 gap-4 relative">
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

          <div className="fixed left-0 bottom-1 w-64 px-3 z-50">
            <UserSidebarProfile
              name="Patrick"
              email="patrick.policarpio@domain.com"
            />
          </div>
        </div>
      </div>
      <main className="flex-1 bg-slate-50 min-h-screen overflow-auto ml-64">
        <div className="bg-white flex justify-between items-center border-b border-gray-200 py-3 px-5 mb-6 fixed top-0 z-50 w-[calc(100%-16rem)]">
          <Flex></Flex>
          <Flex>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button
                  type="button"
                  className="focus:outline-none hover:outline-none"
                >
                  <Avatar
                    className="bg-amber-500 rounded-full cursor-pointer"
                    fallback={
                      <span className="text-white font-medium">RC</span>
                    }
                  />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content className="min-w-[180px] bg-white rounded shadow-lg p-1 border border-gray-200 z-50">
                  <Link href="/backoffice-dashboard/app/account/my-account">
                    <DropdownMenu.Item className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer focus:outline-none hover:outline-none">
                      My Account
                    </DropdownMenu.Item>
                  </Link>
                  <DropdownMenu.Item className="px-4 py-2 text-sm text-red-500 hover:bg-red-100 cursor-pointer focus:outline-none hover:outline-none">
                    Sign Out
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </Flex>
        </div>
        <div className="pt-[5rem] px-5">
          <Flex justify="between" className="mb-4">
            <AppBreadcrumbs />
            <AppClock />
          </Flex>

          {children}
        </div>
      </main>
    </div>
  );
}
