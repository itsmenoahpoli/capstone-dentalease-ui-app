"use client";

import { useMemo } from "react";
import { Flex, Avatar } from "@radix-ui/themes";

export const UserSidebarProfile: React.FC<{ name: string; email: string }> = ({
  name,
  email,
}) => {
  const initials = useMemo(() => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  }, [name]);

  return (
    <Flex
      justify="center"
      gap="3"
      className="bg-[#232b3e] rounded-full px-3 py-2 mb-4 shadow-lg"
    >
      <Avatar
        src="https://randomuser.me/api/portraits/men/32.jpg"
        fallback={<span>{initials}</span>}
        size="3"
        radius="full"
      />
      <div className="flex flex-col flex-1 min-w-0">
        <span className="text-sm text-white font-medium truncate">{name}</span>
        <span className="text-xs text-gray-400 truncate">{email}</span>
      </div>
      <span className="text-gray-400 text-xl font-bold">...</span>
    </Flex>
  );
};
