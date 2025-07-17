"use client";

import { Button, DropdownMenu, Flex, Text } from "@radix-ui/themes";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { useState } from "react";

interface Service {
  id: string;
  category: string;
  name: string;
  price: number;
  status: "offered" | "not_offered";
}

interface ServicesFiltersProps {
  services: Service[];
  onCategoryChange: (category: string | null) => void;
  onStatusChange: (status: string | null) => void;
}

export default function ServicesFilters({
  services,
  onCategoryChange,
  onStatusChange,
}: ServicesFiltersProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const categories = Array.from(
    new Set(services.map((service) => service.category))
  ).sort();

  const statuses = [
    { value: "offered", label: "Offered" },
    { value: "not_offered", label: "Not Offered" },
  ];

  const handleCategorySelect = (category: string) => {
    const newCategory = selectedCategory === category ? null : category;
    setSelectedCategory(newCategory);
    onCategoryChange(newCategory);
  };

  const handleStatusSelect = (status: string) => {
    const newStatus = selectedStatus === status ? null : status;
    setSelectedStatus(newStatus);
    onStatusChange(newStatus);
  };

  return (
    <Flex gap="3" align="center">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button variant="outline" size="2" style={{ minWidth: "140px" }}>
            <Text>{selectedCategory || "All Categories"}</Text>
            <ChevronDownIcon />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item onClick={() => handleCategorySelect("")}>
            All Categories
          </DropdownMenu.Item>
          <DropdownMenu.Separator />
          {categories.map((category) => (
            <DropdownMenu.Item
              key={category}
              onClick={() => handleCategorySelect(category)}
            >
              {category}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Root>

      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button variant="outline" size="2" style={{ minWidth: "140px" }}>
            <Text>
              {selectedStatus
                ? statuses.find((s) => s.value === selectedStatus)?.label
                : "All Status"}
            </Text>
            <ChevronDownIcon />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item onClick={() => handleStatusSelect("")}>
            All Status
          </DropdownMenu.Item>
          <DropdownMenu.Separator />
          {statuses.map((status) => (
            <DropdownMenu.Item
              key={status.value}
              onClick={() => handleStatusSelect(status.value)}
            >
              {status.label}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Flex>
  );
}
