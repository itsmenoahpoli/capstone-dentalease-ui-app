"use client";

import { Table, Card, Text, Flex, Checkbox, Button } from "@radix-ui/themes";
import { Eye, Trash, MoreVertical, Plus, Loader } from "lucide-react";
import { useState, useMemo, useCallback } from "react";
import { AppBadge } from "../../app/AppBadge";
import { IconButton, DropdownMenu } from "@radix-ui/themes";
import { formatDateToWords } from "@/utils/helper.utils";

interface OwnerInformation {
  id: number;
  owner_id: string;
  name: string;
  position: string;
  bio: string;
  email: string;
  phone: string;
  image_url?: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

interface OwnerInformationListProps {
  owners?: OwnerInformation[];
}

export const OwnerInformationList: React.FC<OwnerInformationListProps> = ({
  owners = [],
}) => {
  const [selectedOwners, setSelectedOwners] = useState<Set<number>>(new Set());
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [ownersList, setOwnersList] = useState<OwnerInformation[]>(owners);

  const filteredOwners = useMemo(() => {
    return ownersList.filter((owner) => {
      const statusMatch = !statusFilter || owner.status === statusFilter;
      return statusMatch;
    });
  }, [ownersList, statusFilter]);

  const filteredOwnerIds = useMemo(() => {
    return new Set(filteredOwners.map((owner) => owner.id));
  }, [filteredOwners]);

  const selectedFilteredOwners = useMemo(() => {
    return new Set(
      Array.from(selectedOwners).filter((id) => filteredOwnerIds.has(id))
    );
  }, [selectedOwners, filteredOwnerIds]);

  const isAllSelected = useMemo(() => {
    return (
      filteredOwners.length > 0 &&
      selectedFilteredOwners.size === filteredOwners.length
    );
  }, [filteredOwners.length, selectedFilteredOwners.size]);

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedOwners(new Set([...selectedOwners, ...filteredOwnerIds]));
      } else {
        const newSelected = new Set(selectedOwners);
        filteredOwnerIds.forEach((id) => newSelected.delete(id));
        setSelectedOwners(newSelected);
      }
    },
    [selectedOwners, filteredOwnerIds]
  );

  const handleSelectOwner = useCallback((ownerId: number, checked: boolean) => {
    setSelectedOwners((prev) => {
      const newSelected = new Set(prev);
      if (checked) {
        newSelected.add(ownerId);
      } else {
        newSelected.delete(ownerId);
      }
      return newSelected;
    });
  }, []);

  const handleEditOwner = (owner: OwnerInformation) => {
    console.log("Edit owner:", owner);
  };

  const handleDeleteClick = (owner: OwnerInformation) => {
    console.log("Delete owner:", owner);
  };

  const handleAddNewOwner = () => {
    console.log("Add new owner");
  };

  return (
    <Card>
      <Flex direction="column" gap="4">
        <Flex justify="between" align="center">
          <Flex gap="2">
            <Button
              size="1"
              variant={statusFilter === "active" ? "solid" : "soft"}
              onClick={() =>
                setStatusFilter(statusFilter === "active" ? null : "active")
              }
            >
              Active
            </Button>
            <Button
              size="1"
              variant={statusFilter === "inactive" ? "solid" : "soft"}
              onClick={() =>
                setStatusFilter(statusFilter === "inactive" ? null : "inactive")
              }
            >
              Inactive
            </Button>
          </Flex>
          <Button onClick={handleAddNewOwner}>
            <Plus size={16} />
            Add Owner
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
              <Table.ColumnHeaderCell>Owner ID</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Position</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Phone</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Date Added</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {filteredOwners.length === 0 ? (
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
                      No owner information found
                    </Text>
                    <Text size="2" color="gray">
                      Add your first owner information to get started
                    </Text>
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ) : (
              filteredOwners.map((owner) => (
                <Table.Row key={owner.id}>
                  <Table.Cell>
                    <Checkbox
                      checked={selectedOwners.has(owner.id)}
                      onCheckedChange={(checked) =>
                        handleSelectOwner(owner.id, checked as boolean)
                      }
                    />
                  </Table.Cell>
                  <Table.Cell>O{owner.owner_id}</Table.Cell>
                  <Table.Cell>{owner.name}</Table.Cell>
                  <Table.Cell>{owner.position}</Table.Cell>
                  <Table.Cell>{owner.email}</Table.Cell>
                  <Table.Cell>{owner.phone}</Table.Cell>
                  <Table.Cell>
                    <AppBadge status={owner.status}>
                      {owner.status === "active" ? "Active" : "Inactive"}
                    </AppBadge>
                  </Table.Cell>
                  <Table.Cell>{formatDateToWords(owner.created_at)}</Table.Cell>
                  <Table.Cell>
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger>
                        <IconButton variant="ghost" size="1">
                          <MoreVertical size={16} />
                        </IconButton>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Content>
                        <DropdownMenu.Item
                          onClick={() => handleEditOwner(owner)}
                        >
                          <Eye size={15} style={{ marginRight: 8 }} /> Edit
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                          color="red"
                          onClick={() => handleDeleteClick(owner)}
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
