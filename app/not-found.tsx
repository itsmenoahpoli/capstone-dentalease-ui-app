import Link from "next/link";
import { Card, Flex, Heading, Text, Button } from "@radix-ui/themes";

export const metadata = {
  title: "Page Not Found | DentalEase",
  description: "Page not found",
};

export default function NotFound() {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      className="min-h-screen bg-slate-900"
    >
      <Card className="!p-10 shadow-lg bg-white">
        <Flex
          direction="column"
          justify="center"
          align="center"
          gap="3"
          className="w-full"
        >
          <Heading as="h1" size="9" className="font-bold text-slate-800 mb-2">
            404
          </Heading>
          <Heading as="h2" size="5" className="font-medium text-slate-700 mb-6">
            Page Not Found
          </Heading>
          <Text
            as="p"
            size="4"
            className="text-slate-500 mb-8 text-center max-w-md"
          >
            Sorry, the page you are looking for does not exist or has been
            moved.
          </Text>
          <Button
            asChild
            size="3"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md px-8 py-3 shadow"
          >
            <Link href="/">Go to Homepage</Link>
          </Button>
        </Flex>
      </Card>
    </Flex>
  );
}
