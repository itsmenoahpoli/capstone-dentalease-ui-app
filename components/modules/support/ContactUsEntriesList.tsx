"use client";

import { Table, Card, Text, Flex, Checkbox, Button } from "@radix-ui/themes";
import { Eye, Trash, MoreVertical, Plus, Loader } from "lucide-react";
import { useState, useMemo, useCallback } from "react";
import { AppBadge } from "../../app/AppBadge";
import { IconButton, DropdownMenu } from "@radix-ui/themes";
import { formatDateToWords } from "@/utils/helper.utils";

interface ContactUsEntry {
  id: number;
  entry_id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: "new" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  assigned_to?: string;
  created_at: string;
  updated_at: string;
}

interface ContactUsEntriesListProps {
  entries?: ContactUsEntry[];
}

export const ContactUsEntriesList: React.FC<ContactUsEntriesListProps> = ({
  entries = [],
}) => {
  const [selectedEntries, setSelectedEntries] = useState<Set<number>>(
    new Set()
  );
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [entriesList, setEntriesList] = useState<ContactUsEntry[]>(entries);

  const filteredEntries = useMemo(() => {
    return entriesList.filter((entry) => {
      const statusMatch = !statusFilter || entry.status === statusFilter;
      const priorityMatch =
        !priorityFilter || entry.priority === priorityFilter;
      return statusMatch && priorityMatch;
    });
  }, [entriesList, statusFilter, priorityFilter]);

  const filteredEntryIds = useMemo(() => {
    return new Set(filteredEntries.map((entry) => entry.id));
  }, [filteredEntries]);

  const selectedFilteredEntries = useMemo(() => {
    return new Set(
      Array.from(selectedEntries).filter((id) => filteredEntryIds.has(id))
    );
  }, [selectedEntries, filteredEntryIds]);

  const isAllSelected = useMemo(() => {
    return (
      filteredEntries.length > 0 &&
      selectedFilteredEntries.size === filteredEntries.length
    );
  }, [filteredEntries.length, selectedFilteredEntries.size]);

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedEntries(new Set([...selectedEntries, ...filteredEntryIds]));
      } else {
        const newSelected = new Set(selectedEntries);
        filteredEntryIds.forEach((id) => newSelected.delete(id));
        setSelectedEntries(newSelected);
      }
    },
    [selectedEntries, filteredEntryIds]
  );

  const handleSelectEntry = useCallback((entryId: number, checked: boolean) => {
    setSelectedEntries((prev) => {
      const newSelected = new Set(prev);
      if (checked) {
        newSelected.add(entryId);
      } else {
        newSelected.delete(entryId);
      }
      return newSelected;
    });
  }, []);

  const handleEditEntry = (entry: ContactUsEntry) => {
    console.log("Edit entry:", entry);
  };

  const handleDeleteClick = (entry: ContactUsEntry) => {
    console.log("Delete entry:", entry);
  };

  const handleAddNewEntry = () => {
    console.log("Add new entry");
  };

  return (
    <Card>
      <Flex direction="column" gap="4">
        <Flex justify="between" align="center">
          <Flex gap="2">
            <Button
              size="1"
              variant={statusFilter === "new" ? "solid" : "soft"}
              onClick={() =>
                setStatusFilter(statusFilter === "new" ? null : "new")
              }
            >
              New
            </Button>
            <Button
              size="1"
              variant={statusFilter === "in_progress" ? "solid" : "soft"}
              onClick={() =>
                setStatusFilter(
                  statusFilter === "in_progress" ? null : "in_progress"
                )
              }
            >
              In Progress
            </Button>
            <Button
              size="1"
              variant={statusFilter === "resolved" ? "solid" : "soft"}
              onClick={() =>
                setStatusFilter(statusFilter === "resolved" ? null : "resolved")
              }
            >
              Resolved
            </Button>
            <Button
              size="1"
              variant={statusFilter === "closed" ? "solid" : "soft"}
              onClick={() =>
                setStatusFilter(statusFilter === "closed" ? null : "closed")
              }
            >
              Closed
            </Button>
          </Flex>
          <Button onClick={handleAddNewEntry}>
            <Plus size={16} />
            Add Entry
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
              <Table.ColumnHeaderCell>Entry ID</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Subject</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Priority</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Assigned To</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Date Created</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {filteredEntries.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={10}>
                  <Flex
                    direction="column"
                    align="center"
                    justify="center"
                    className="py-12 px-6"
                    gap="3"
                  >
                    <Text size="5" weight="medium" color="gray">
                      No contact us entries found
                    </Text>
                    <Text size="2" color="gray">
                      Add your first contact us entry to get started
                    </Text>
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ) : (
              filteredEntries.map((entry) => (
                <Table.Row key={entry.id}>
                  <Table.Cell>
                    <Checkbox
                      checked={selectedEntries.has(entry.id)}
                      onCheckedChange={(checked) =>
                        handleSelectEntry(entry.id, checked as boolean)
                      }
                    />
                  </Table.Cell>
                  <Table.Cell>C{entry.entry_id}</Table.Cell>
                  <Table.Cell>{entry.name}</Table.Cell>
                  <Table.Cell>{entry.email}</Table.Cell>
                  <Table.Cell>{entry.subject}</Table.Cell>
                  <Table.Cell>
                    <AppBadge status={entry.priority}>
                      {entry.priority === "low"
                        ? "Low"
                        : entry.priority === "medium"
                        ? "Medium"
                        : entry.priority === "high"
                        ? "High"
                        : "Urgent"}
                    </AppBadge>
                  </Table.Cell>
                  <Table.Cell>
                    <AppBadge status={entry.status}>
                      {entry.status === "new"
                        ? "New"
                        : entry.status === "in_progress"
                        ? "In Progress"
                        : entry.status === "resolved"
                        ? "Resolved"
                        : "Closed"}
                    </AppBadge>
                  </Table.Cell>
                  <Table.Cell>{entry.assigned_to || "Unassigned"}</Table.Cell>
                  <Table.Cell>{formatDateToWords(entry.created_at)}</Table.Cell>
                  <Table.Cell>
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger>
                        <IconButton variant="ghost" size="1">
                          <MoreVertical size={16} />
                        </IconButton>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Content>
                        <DropdownMenu.Item
                          onClick={() => handleEditEntry(entry)}
                        >
                          <Eye size={15} style={{ marginRight: 8 }} /> Edit
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                          color="red"
                          onClick={() => handleDeleteClick(entry)}
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
