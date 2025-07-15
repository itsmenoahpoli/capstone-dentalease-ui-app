import { Flex } from "@radix-ui/themes";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Flex className="h-screen w-full" justify="center" align="center">
      <Flex
        direction="column"
        gap="4"
        justify="center"
        className="h-screen min-w-[400px]"
      >
        <img
          src="/assets/brand-logo.png"
          alt="DentalEase"
          width={100}
          height={100}
        />
        {children}
      </Flex>
    </Flex>
  );
}
