"use client";

import { Table, Card, Text, Flex, Checkbox, Button } from "@radix-ui/themes";
import { Eye, Trash, MoreVertical, Plus, Loader } from "lucide-react";
import { useState, useMemo, useCallback } from "react";
import { AppBadge } from "../../app/AppBadge";
import { IconButton, DropdownMenu } from "@radix-ui/themes";
import { formatDateToWords } from "@/utils/helper.utils";

interface ClinicInformation {
  id: number;
  info_id: string;
  title: string;
  content: string;
  category: "general" | "services" | "policies" | "contact";
  status: "published" | "draft" | "archived";
  author: string;
  created_at: string;
  updated_at: string;
}

interface ClinicInformationListProps {
  information?: ClinicInformation[];
}

export const ClinicInformationList: React.FC<ClinicInformationListProps> = ({
  information = [],
}) => {
  const [selectedInfo, setSelectedInfo] = useState<Set<number>>(new Set());
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [infoList, setInfoList] = useState<ClinicInformation[]>(information);

  const filteredInfo = useMemo(() => {
    return infoList.filter((info) => {
      const statusMatch = !statusFilter || info.status === statusFilter;
      const categoryMatch = !categoryFilter || info.category === categoryFilter;
      return statusMatch && categoryMatch;
    });
  }, [infoList, statusFilter, categoryFilter]);

  const filteredInfoIds = useMemo(() => {
    return new Set(filteredInfo.map((info) => info.id));
  }, [filteredInfo]);

  const selectedFilteredInfo = useMemo(() => {
    return new Set(
      Array.from(selectedInfo).filter((id) => filteredInfoIds.has(id))
    );
  }, [selectedInfo, filteredInfoIds]);

  const isAllSelected = useMemo(() => {
    return (
      filteredInfo.length > 0 &&
      selectedFilteredInfo.size === filteredInfo.length
    );
  }, [filteredInfo.length, selectedFilteredInfo.size]);

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedInfo(new Set([...selectedInfo, ...filteredInfoIds]));
      } else {
        const newSelected = new Set(selectedInfo);
        filteredInfoIds.forEach((id) => newSelected.delete(id));
        setSelectedInfo(newSelected);
      }
    },
    [selectedInfo, filteredInfoIds]
  );

  const handleSelectInfo = useCallback((infoId: number, checked: boolean) => {
    setSelectedInfo((prev) => {
      const newSelected = new Set(prev);
      if (checked) {
        newSelected.add(infoId);
      } else {
        newSelected.delete(infoId);
      }
      return newSelected;
    });
  }, []);

  const handleEditInfo = (info: ClinicInformation) => {
    console.log("Edit info:", info);
  };

  const handleDeleteClick = (info: ClinicInformation) => {
    console.log("Delete info:", info);
  };

  const handleAddNewInfo = () => {
    console.log("Add new info");
  };

  return (
    <Card>
      <Flex direction="column" gap="4">
        <Flex justify="between" align="center">
          <Flex gap="2">
            <Button
              size="1"
              variant={statusFilter === "published" ? "solid" : "soft"}
              onClick={() =>
                setStatusFilter(
                  statusFilter === "published" ? null : "published"
                )
              }
            >
              Published
            </Button>
            <Button
              size="1"
              variant={statusFilter === "draft" ? "solid" : "soft"}
              onClick={() =>
                setStatusFilter(statusFilter === "draft" ? null : "draft")
              }
            >
              Draft
            </Button>
            <Button
              size="1"
              variant={statusFilter === "archived" ? "solid" : "soft"}
              onClick={() =>
                setStatusFilter(statusFilter === "archived" ? null : "archived")
              }
            >
              Archived
            </Button>
          </Flex>
          <Button onClick={handleAddNewInfo}>
            <Plus size={16} />
            Add Information
          </Button>
        </Flex>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                />
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Info ID</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Title</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Category</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Author</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Date Created</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Last Updated</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {filteredInfo.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={9}>
                  <Flex
                    direction="column"
                    align="center"
                    justify="center"
                    className="py-12 px-6"
                    gap="3"
                  >
                    <Text size="5" weight="medium" color="gray">
                      No clinic information found
                    </Text>
                    <Text size="2" color="gray">
                      Add your first clinic information to get started
                    </Text>
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ) : (
              filteredInfo.map((info) => (
                <Table.Row key={info.id}>
                  <Table.Cell>
                    <Checkbox
                      checked={selectedInfo.has(info.id)}
                      onCheckedChange={(checked) =>
                        handleSelectInfo(info.id, checked as boolean)
                      }
                    />
                  </Table.Cell>
                  <Table.Cell>I{info.info_id}</Table.Cell>
                  <Table.Cell>{info.title}</Table.Cell>
                  <Table.Cell>
                    <AppBadge status={info.category}>
                      {info.category === "general"
                        ? "General"
                        : info.category === "services"
                        ? "Services"
                        : info.category === "policies"
                        ? "Policies"
                        : "Contact"}
                    </AppBadge>
                  </Table.Cell>
                  <Table.Cell>{info.author}</Table.Cell>
                  <Table.Cell>
                    <AppBadge status={info.status}>
                      {info.status === "published"
                        ? "Published"
                        : info.status === "draft"
                        ? "Draft"
                        : "Archived"}
                    </AppBadge>
                  </Table.Cell>
                  <Table.Cell>{formatDateToWords(info.created_at)}</Table.Cell>
                  <Table.Cell>{formatDateToWords(info.updated_at)}</Table.Cell>
                  <Table.Cell>
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger>
                        <IconButton variant="ghost" size="1">
                          <MoreVertical size={16} />
                        </IconButton>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Content>
                        <DropdownMenu.Item onClick={() => handleEditInfo(info)}>
                          <Eye size={15} style={{ marginRight: 8 }} /> Edit
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                          color="red"
                          onClick={() => handleDeleteClick(info)}
                        >
                          <Trash size={15} style={{ marginRight: 8 }} /> Delete
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Root>
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table.Root>
      </Flex>
    </Card>
  );
};
