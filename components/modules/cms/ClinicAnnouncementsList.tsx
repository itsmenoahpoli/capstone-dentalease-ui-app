"use client";

import { Table, Card, Text, Flex, Checkbox, Button } from "@radix-ui/themes";
import { Eye, Trash, MoreVertical, Plus, Loader } from "lucide-react";
import { useState, useMemo, useCallback } from "react";
import { AppBadge } from "../../app/AppBadge";
import { IconButton, DropdownMenu } from "@radix-ui/themes";
import { formatDateToWords } from "@/utils/helper.utils";

interface ClinicAnnouncement {
  id: number;
  announcement_id: string;
  title: string;
  content: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "published" | "draft" | "archived";
  author: string;
  publish_date?: string;
  expiry_date?: string;
  created_at: string;
  updated_at: string;
}

interface ClinicAnnouncementsListProps {
  announcements?: ClinicAnnouncement[];
}

export const ClinicAnnouncementsList: React.FC<
  ClinicAnnouncementsListProps
> = ({ announcements = [] }) => {
  const [selectedAnnouncements, setSelectedAnnouncements] = useState<
    Set<number>
  >(new Set());
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [announcementsList, setAnnouncementsList] =
    useState<ClinicAnnouncement[]>(announcements);

  const filteredAnnouncements = useMemo(() => {
    return announcementsList.filter((announcement) => {
      const statusMatch = !statusFilter || announcement.status === statusFilter;
      const priorityMatch =
        !priorityFilter || announcement.priority === priorityFilter;
      return statusMatch && priorityMatch;
    });
  }, [announcementsList, statusFilter, priorityFilter]);

  const filteredAnnouncementIds = useMemo(() => {
    return new Set(
      filteredAnnouncements.map((announcement) => announcement.id)
    );
  }, [filteredAnnouncements]);

  const selectedFilteredAnnouncements = useMemo(() => {
    return new Set(
      Array.from(selectedAnnouncements).filter((id) =>
        filteredAnnouncementIds.has(id)
      )
    );
  }, [selectedAnnouncements, filteredAnnouncementIds]);

  const isAllSelected = useMemo(() => {
    return (
      filteredAnnouncements.length > 0 &&
      selectedFilteredAnnouncements.size === filteredAnnouncements.length
    );
  }, [filteredAnnouncements.length, selectedFilteredAnnouncements.size]);

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedAnnouncements(
          new Set([...selectedAnnouncements, ...filteredAnnouncementIds])
        );
      } else {
        const newSelected = new Set(selectedAnnouncements);
        filteredAnnouncementIds.forEach((id) => newSelected.delete(id));
        setSelectedAnnouncements(newSelected);
      }
    },
    [selectedAnnouncements, filteredAnnouncementIds]
  );

  const handleSelectAnnouncement = useCallback(
    (announcementId: number, checked: boolean) => {
      setSelectedAnnouncements((prev) => {
        const newSelected = new Set(prev);
        if (checked) {
          newSelected.add(announcementId);
        } else {
          newSelected.delete(announcementId);
        }
        return newSelected;
      });
    },
    []
  );

  const handleEditAnnouncement = (announcement: ClinicAnnouncement) => {
    console.log("Edit announcement:", announcement);
  };

  const handleDeleteClick = (announcement: ClinicAnnouncement) => {
    console.log("Delete announcement:", announcement);
  };

  const handleAddNewAnnouncement = () => {
    console.log("Add new announcement");
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
          <Button onClick={handleAddNewAnnouncement}>
            <Plus size={16} />
            Add Announcement
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
              <Table.ColumnHeaderCell>Announcement ID</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Title</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Priority</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Author</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Publish Date</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Expiry Date</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Date Created</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {filteredAnnouncements.length === 0 ? (
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
                      No announcements found
                    </Text>
                    <Text size="2" color="gray">
                      Add your first announcement to get started
                    </Text>
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ) : (
              filteredAnnouncements.map((announcement) => (
                <Table.Row key={announcement.id}>
                  <Table.Cell>
                    <Checkbox
                      checked={selectedAnnouncements.has(announcement.id)}
                      onCheckedChange={(checked) =>
                        handleSelectAnnouncement(
                          announcement.id,
                          checked as boolean
                        )
                      }
                    />
                  </Table.Cell>
                  <Table.Cell>A{announcement.announcement_id}</Table.Cell>
                  <Table.Cell>{announcement.title}</Table.Cell>
                  <Table.Cell>
                    <AppBadge status={announcement.priority}>
                      {announcement.priority === "low"
                        ? "Low"
                        : announcement.priority === "medium"
                        ? "Medium"
                        : announcement.priority === "high"
                        ? "High"
                        : "Urgent"}
                    </AppBadge>
                  </Table.Cell>
                  <Table.Cell>{announcement.author}</Table.Cell>
                  <Table.Cell>
                    <AppBadge status={announcement.status}>
                      {announcement.status === "published"
                        ? "Published"
                        : announcement.status === "draft"
                        ? "Draft"
                        : "Archived"}
                    </AppBadge>
                  </Table.Cell>
                  <Table.Cell>{announcement.publish_date || "N/A"}</Table.Cell>
                  <Table.Cell>{announcement.expiry_date || "N/A"}</Table.Cell>
                  <Table.Cell>
                    {formatDateToWords(announcement.created_at)}
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
                          onClick={() => handleEditAnnouncement(announcement)}
                        >
                          <Eye size={15} style={{ marginRight: 8 }} /> Edit
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                          color="red"
                          onClick={() => handleDeleteClick(announcement)}
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
