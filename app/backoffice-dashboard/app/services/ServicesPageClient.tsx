"use client";

import { useState } from "react";
import { Flex, Button } from "@radix-ui/themes";
import {
  PageHeader,
  ServicesManageList,
  ServiceDetailsFormModal,
} from "@/components";

export default function ServicesPageClient() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <Flex direction="column" gap="4" className="h-full w-full">
      <PageHeader
        title="Services"
        description="Manage facility offered services"
      >
        <Flex gap="2">
          <Button size="1" variant="soft">
            EXPORT DATA
          </Button>
          <Button size="1" variant="soft">
            IMPORT DATA
          </Button>
          <Button size="1" onClick={() => setModalOpen(true)}>
            ADD SERVICE
          </Button>
        </Flex>
      </PageHeader>
      <ServiceDetailsFormModal open={modalOpen} onOpenChange={setModalOpen} />
      <ServicesManageList />
    </Flex>
  );
}
