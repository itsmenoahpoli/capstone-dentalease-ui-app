import { Flex, Button } from "@radix-ui/themes";
import { PageHeader, AiChatbotList } from "@/components";

export const metadata = {
  title: "AI Chatbot | DentalEase",
  description: "Manage AI chatbot",
};

export default function Page() {
  return (
    <Flex direction="column" gap="4" className="h-full w-full">
      <PageHeader title="AI Chatbot" description="Manage AI chatbot">
        <Flex gap="2">
          <Button size="1" variant="soft">
            EXPORT DATA
          </Button>
          <Button size="1" variant="soft">
            IMPORT DATA
          </Button>
        </Flex>
      </PageHeader>
      <AiChatbotList />
    </Flex>
  );
}
