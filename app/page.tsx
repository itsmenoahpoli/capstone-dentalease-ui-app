import { Flex } from "@radix-ui/themes";
import Image from "next/image";

export default function Home() {
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
