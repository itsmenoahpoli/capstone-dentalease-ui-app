"use client";

import { Flex } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/backoffice-dashboard/auth/signin");
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <Flex
      className="h-screen w-screen bg-slate-900"
      direction="column"
      gap="4"
      align="center"
      justify="center"
    >
      <Image
        src="/assets/brand-logo.png"
        alt="DentalEase"
        width={300}
        height={300}
      />
    </Flex>
  );
}
