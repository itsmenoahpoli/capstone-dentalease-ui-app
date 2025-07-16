import { Flex } from "@radix-ui/themes";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Flex
      className="!h-screen w-full bg-slate-900"
      justify="center"
      align="center"
    >
      <Flex
        direction="column"
        gap="5"
        className="h-screen min-w-[400px]"
        justify="center"
        align="center"
      >
        <img
          src="/assets/brand-logo.png"
          alt="DentalEase"
          width={300}
          height={300}
        />

        <div className="w-full px-8" style={{ zoom: 0.9 }}>
          {children}
        </div>
      </Flex>
    </Flex>
  );
}
