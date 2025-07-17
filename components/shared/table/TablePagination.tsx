"use client";

import { Flex, Button, Text, IconButton, DropdownMenu } from "@radix-ui/themes";
import {
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import React, { useState } from "react";

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  totalItems?: number;
  onPageSizeChange?: (size: number) => void;
}

export const TablePagination: React.FC<TablePaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSize = 25,
  totalItems,
  onPageSizeChange,
}) => {
  const canGoBack = currentPage > 1;
  const canGoForward = currentPage < totalPages;
  const pageSizeOptions = [10, 25, 50, 75, 100];
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handlePageSizeChange = (value: string) => {
    if (onPageSizeChange) onPageSizeChange(Number(value));
    onPageChange(1);
  };

  return (
    <Flex justify="between" align="center" gap="4">
      <Flex align="center" gap="2">
        <p className="text-xs text-gray-700 font-base">Show rows per page</p>
        <DropdownMenu.Root open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownMenu.Trigger>
            <Button variant="outline" size="1" style={{ minWidth: "100px" }}>
              <Text>{pageSize} / page</Text>
              {dropdownOpen ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronUp size={16} />
              )}
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            {pageSizeOptions.map((option) => (
              <DropdownMenu.Item
                key={option}
                onClick={() => handlePageSizeChange(String(option))}
              >
                {option} / page
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Flex>
      <Flex align="center" justify="between" gap="4" mt="4">
        <Flex align="center" gap="2">
          <IconButton
            size="1"
            variant="soft"
            disabled={!canGoBack}
            onClick={() => canGoBack && onPageChange(currentPage - 1)}
            aria-label="Previous Page"
          >
            <ChevronLeft size={16} />
          </IconButton>
          <Text size="2">
            Page {currentPage} of {totalPages}
          </Text>
          <IconButton
            size="1"
            variant="soft"
            disabled={!canGoForward}
            onClick={() => canGoForward && onPageChange(currentPage + 1)}
            aria-label="Next Page"
          >
            <ChevronRight size={16} />
          </IconButton>
        </Flex>
        {typeof totalItems === "number" && typeof pageSize === "number" && (
          <Text size="1">
            Showing {Math.min((currentPage - 1) * pageSize + 1, totalItems)}-
            {Math.min(currentPage * pageSize, totalItems)} of {totalItems}
          </Text>
        )}
      </Flex>
    </Flex>
  );
};
