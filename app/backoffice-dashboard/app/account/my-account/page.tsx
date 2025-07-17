"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Flex, Card } from "@radix-ui/themes";
import { PageHeader } from "@/components";

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tab = searchParams.get("tab") || "general";

  const handleTabClick = (tabName: string) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set("tab", tabName);
    router.push(`?${params.toString()}`);
  };

  useEffect(() => {
    document.title = "My Account | Dentalease";
  }, []);

  return (
    <Flex direction="column" gap="4" className="h-full w-full">
      <PageHeader
        title="My Account"
        description="Manage my account details & information"
      />
      <div className="flex flex-1">
        <div className="w-48 min-h-[300px] border-r border-gray-200 flex flex-col pb-8 px-4 gap-2">
          <button
            onClick={() => handleTabClick("general")}
            className={`px-3 py-2 rounded text-gray-800 hover:bg-gray-100 text-sm text-left ${
              tab === "general" ? "bg-gray-100 font-medium" : ""
            }`}
          >
            General
          </button>
          <button
            onClick={() => handleTabClick("password")}
            className={`px-3 py-2 rounded text-gray-800 hover:bg-gray-100 text-sm text-left ${
              tab === "password" ? "bg-gray-100 font-medium" : ""
            }`}
          >
            Password
          </button>
          <button
            onClick={() => handleTabClick("security")}
            className={`px-3 py-2 rounded text-gray-800 hover:bg-gray-100 text-sm text-left ${
              tab === "security" ? "bg-gray-100 font-medium" : ""
            }`}
          >
            Security
          </button>
        </div>

        <div className="flex-1 px-8">
          {tab === "general" && (
            <Card>
              <Flex
                direction="column"
                gap="2"
                className="border-b border-gray-200 pb-2 mb-7"
              >
                <h1 className="text-md text-gray-700 font-medium">General</h1>
                <p className="text-gray-500 text-sm">
                  General settings related to your profile.
                </p>
              </Flex>
            </Card>
          )}
          {tab === "password" && (
            <Card>
              <Flex
                direction="column"
                gap="2"
                className="border-b border-gray-200 pb-2 mb-7"
              >
                <h1 className="text-md text-gray-700 font-medium">Password</h1>
                <p className="text-gray-500 text-sm">
                  You can change your password here.
                </p>
              </Flex>
            </Card>
          )}
          {tab === "security" && (
            <Card>
              <Flex
                direction="column"
                gap="2"
                className="border-b border-gray-200 pb-2 mb-7"
              >
                <h1 className="text-md text-gray-700 font-medium">General</h1>
                <p className="text-gray-500 text-sm">
                  Enable extra security for your account.
                </p>
              </Flex>
            </Card>
          )}
        </div>
      </div>
    </Flex>
  );
}
