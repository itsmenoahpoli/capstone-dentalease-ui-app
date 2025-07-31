"use client";

import { Table, Card, Text, Flex, Checkbox, Button } from "@radix-ui/themes";
import { Eye, Trash, MoreVertical, Plus, Loader } from "lucide-react";
import { useState, useMemo, useCallback } from "react";
import { AppBadge } from "../../app/AppBadge";
import { IconButton, DropdownMenu } from "@radix-ui/themes";
import { formatDateToWords } from "@/utils/helper.utils";

interface LatestDevelopment {
  id: number;
  development_id: string;
  title: string;
  description: string;
  category: "technology" | "service" | "facility" | "staff";
  status: "published" | "draft" | "archived";
  author: string;
  publish_date?: string;
  created_at: string;
  updated_at: string;
}

interface LatestDevelopmentsListProps {
  developments?: LatestDevelopment[];
}

export const LatestDevelopmentsList: React.FC<LatestDevelopmentsListProps> = ({
  developments = [],
}) => {
  const [selectedDevelopments, setSelectedDevelopments] = useState<Set<number>>(
    new Set()
  );
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [developmentsList, setDevelopmentsList] =
    useState<LatestDevelopment[]>(developments);

  const filteredDevelopments = useMemo(() => {
    return developmentsList.filter((development) => {
      const statusMatch = !statusFilter || development.status === statusFilter;
      const categoryMatch =
        !categoryFilter || development.category === categoryFilter;
      return statusMatch && categoryMatch;
    });
  }, [developmentsList, statusFilter, categoryFilter]);

  const filteredDevelopmentIds = useMemo(() => {
    return new Set(filteredDevelopments.map((development) => development.id));
  }, [filteredDevelopments]);

  const selectedFilteredDevelopments = useMemo(() => {
    return new Set(
      Array.from(selectedDevelopments).filter((id) =>
        filteredDevelopmentIds.has(id)
      )
    );
  }, [selectedDevelopments, filteredDevelopmentIds]);

  const isAllSelected = useMemo(() => {
    return (
      filteredDevelopments.length > 0 &&
      selectedFilteredDevelopments.size === filteredDevelopments.length
    );
  }, [filteredDevelopments.length, selectedFilteredDevelopments.size]);

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedDevelopments(
          new Set([...selectedDevelopments, ...filteredDevelopmentIds])
        );
      } else {
        const newSelected = new Set(selectedDevelopments);
        filteredDevelopmentIds.forEach((id) => newSelected.delete(id));
        setSelectedDevelopments(newSelected);
      }
    },
    [selectedDevelopments, filteredDevelopmentIds]
  );

  const handleSelectDevelopment = useCallback(
    (developmentId: number, checked: boolean) => {
      setSelectedDevelopments((prev) => {
        const newSelected = new Set(prev);
        if (checked) {
          newSelected.add(developmentId);
        } else {
          newSelected.delete(developmentId);
        }
        return newSelected;
      });
    },
    []
  );

  const handleEditDevelopment = (development: LatestDevelopment) => {
    console.log("Edit development:", development);
  };

  const handleDeleteClick = (development: LatestDevelopment) => {
    console.log("Delete development:", development);
  };

  const handleAddNewDevelopment = () => {
    console.log("Add new development");
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
          <Button onClick={handleAddNewDevelopment}>
            <Plus size={16} />
            Add Development
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
              <Table.ColumnHeaderCell>Development ID</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Title</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Category</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Author</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Publish Date</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Date Created</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {filteredDevelopments.length === 0 ? (
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
                      No developments found
                    </Text>
                    <Text size="2" color="gray">
                      Add your first development to get started
                    </Text>
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ) : (
              filteredDevelopments.map((development) => (
                <Table.Row key={development.id}>
                  <Table.Cell>
                    <Checkbox
                      checked={selectedDevelopments.has(development.id)}
                      onCheckedChange={(checked) =>
                        handleSelectDevelopment(
                          development.id,
                          checked as boolean
                        )
                      }
                    />
                  </Table.Cell>
                  <Table.Cell>D{development.development_id}</Table.Cell>
                  <Table.Cell>{development.title}</Table.Cell>
                  <Table.Cell>
                    <AppBadge status={development.category}>
                      {development.category === "technology"
                        ? "Technology"
                        : development.category === "service"
                        ? "Service"
                        : development.category === "facility"
                        ? "Facility"
                        : "Staff"}
                    </AppBadge>
                  </Table.Cell>
                  <Table.Cell>{development.author}</Table.Cell>
                  <Table.Cell>
                    <AppBadge status={development.status}>
                      {development.status === "published"
                        ? "Published"
                        : development.status === "draft"
                        ? "Draft"
                        : "Archived"}
                    </AppBadge>
                  </Table.Cell>
                  <Table.Cell>{development.publish_date || "N/A"}</Table.Cell>
                  <Table.Cell>
                    {formatDateToWords(development.created_at)}
                  </Table.Cell>
                  <Table.Cell>
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger>
                        <IconButton variant="ghost" size="1">
                          <MoreVertical size={16} />
                        </IconButton>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Content>
                        <DropdownMenu.Item
                          onClick={() => handleEditDevelopment(development)}
                        >
                          <Eye size={15} style={{ marginRight: 8 }} /> Edit
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                          color="red"
                          onClick={() => handleDeleteClick(development)}
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
