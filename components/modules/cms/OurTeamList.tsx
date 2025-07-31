"use client";

import { Table, Card, Text, Flex, Checkbox, Button } from "@radix-ui/themes";
import { Eye, Trash, MoreVertical, Plus, Loader } from "lucide-react";
import { useState, useMemo, useCallback } from "react";
import { AppBadge } from "../../app/AppBadge";
import { IconButton, DropdownMenu } from "@radix-ui/themes";
import { formatDateToWords } from "@/utils/helper.utils";

interface TeamMember {
  id: number;
  member_id: string;
  name: string;
  position: string;
  department: string;
  bio: string;
  email: string;
  phone: string;
  image_url?: string;
  status: "active" | "inactive";
  hire_date: string;
  created_at: string;
  updated_at: string;
}

interface OurTeamListProps {
  members?: TeamMember[];
}

export const OurTeamList: React.FC<OurTeamListProps> = ({ members = [] }) => {
  const [selectedMembers, setSelectedMembers] = useState<Set<number>>(
    new Set()
  );
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [membersList, setMembersList] = useState<TeamMember[]>(members);

  const filteredMembers = useMemo(() => {
    return membersList.filter((member) => {
      const statusMatch = !statusFilter || member.status === statusFilter;
      const departmentMatch =
        !departmentFilter || member.department === departmentFilter;
      return statusMatch && departmentMatch;
    });
  }, [membersList, statusFilter, departmentFilter]);

  const filteredMemberIds = useMemo(() => {
    return new Set(filteredMembers.map((member) => member.id));
  }, [filteredMembers]);

  const selectedFilteredMembers = useMemo(() => {
    return new Set(
      Array.from(selectedMembers).filter((id) => filteredMemberIds.has(id))
    );
  }, [selectedMembers, filteredMemberIds]);

  const isAllSelected = useMemo(() => {
    return (
      filteredMembers.length > 0 &&
      selectedFilteredMembers.size === filteredMembers.length
    );
  }, [filteredMembers.length, selectedFilteredMembers.size]);

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedMembers(new Set([...selectedMembers, ...filteredMemberIds]));
      } else {
        const newSelected = new Set(selectedMembers);
        filteredMemberIds.forEach((id) => newSelected.delete(id));
        setSelectedMembers(newSelected);
      }
    },
    [selectedMembers, filteredMemberIds]
  );

  const handleSelectMember = useCallback(
    (memberId: number, checked: boolean) => {
      setSelectedMembers((prev) => {
        const newSelected = new Set(prev);
        if (checked) {
          newSelected.add(memberId);
        } else {
          newSelected.delete(memberId);
        }
        return newSelected;
      });
    },
    []
  );

  const handleEditMember = (member: TeamMember) => {
    console.log("Edit member:", member);
  };

  const handleDeleteClick = (member: TeamMember) => {
    console.log("Delete member:", member);
  };

  const handleAddNewMember = () => {
    console.log("Add new member");
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
          <Button onClick={handleAddNewMember}>
            <Plus size={16} />
            Add Member
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
              <Table.ColumnHeaderCell>Member ID</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Position</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Department</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Phone</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Hire Date</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {filteredMembers.length === 0 ? (
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
                      No team members found
                    </Text>
                    <Text size="2" color="gray">
                      Add your first team member to get started
                    </Text>
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ) : (
              filteredMembers.map((member) => (
                <Table.Row key={member.id}>
                  <Table.Cell>
                    <Checkbox
                      checked={selectedMembers.has(member.id)}
                      onCheckedChange={(checked) =>
                        handleSelectMember(member.id, checked as boolean)
                      }
                    />
                  </Table.Cell>
                  <Table.Cell>T{member.member_id}</Table.Cell>
                  <Table.Cell>{member.name}</Table.Cell>
                  <Table.Cell>{member.position}</Table.Cell>
                  <Table.Cell>{member.department}</Table.Cell>
                  <Table.Cell>{member.email}</Table.Cell>
                  <Table.Cell>{member.phone}</Table.Cell>
                  <Table.Cell>
                    <AppBadge status={member.status}>
                      {member.status === "active" ? "Active" : "Inactive"}
                    </AppBadge>
                  </Table.Cell>
                  <Table.Cell>{member.hire_date}</Table.Cell>
                  <Table.Cell>
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger>
                        <IconButton variant="ghost" size="1">
                          <MoreVertical size={16} />
                        </IconButton>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Content>
                        <DropdownMenu.Item
                          onClick={() => handleEditMember(member)}
                        >
                          <Eye size={15} style={{ marginRight: 8 }} /> Edit
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                          color="red"
                          onClick={() => handleDeleteClick(member)}
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
