"use client";

import { Table, Card, Text, Flex, Checkbox, Button } from "@radix-ui/themes";
import { Eye, Trash, MoreVertical, Plus, Loader } from "lucide-react";
import { useState, useMemo, useCallback } from "react";
import { AppBadge } from "../../app/AppBadge";
import { IconButton, DropdownMenu } from "@radix-ui/themes";
import { formatDateToWords } from "@/utils/helper.utils";

interface AiChatbot {
  id: number;
  chatbot_id: string;
  name: string;
  description: string;
  model: string;
  status: "active" | "inactive" | "training" | "maintenance";
  version: string;
  accuracy: number;
  total_conversations: number;
  last_updated: string;
  created_at: string;
  updated_at: string;
}

interface AiChatbotListProps {
  chatbots?: AiChatbot[];
}

export const AiChatbotList: React.FC<AiChatbotListProps> = ({
  chatbots = [],
}) => {
  const [selectedChatbots, setSelectedChatbots] = useState<Set<number>>(
    new Set()
  );
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [chatbotsList, setChatbotsList] = useState<AiChatbot[]>(chatbots);

  const filteredChatbots = useMemo(() => {
    return chatbotsList.filter((chatbot) => {
      const statusMatch = !statusFilter || chatbot.status === statusFilter;
      return statusMatch;
    });
  }, [chatbotsList, statusFilter]);

  const filteredChatbotIds = useMemo(() => {
    return new Set(filteredChatbots.map((chatbot) => chatbot.id));
  }, [filteredChatbots]);

  const selectedFilteredChatbots = useMemo(() => {
    return new Set(
      Array.from(selectedChatbots).filter((id) => filteredChatbotIds.has(id))
    );
  }, [selectedChatbots, filteredChatbotIds]);

  const isAllSelected = useMemo(() => {
    return (
      filteredChatbots.length > 0 &&
      selectedFilteredChatbots.size === filteredChatbots.length
    );
  }, [filteredChatbots.length, selectedFilteredChatbots.size]);

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedChatbots(
          new Set([...selectedChatbots, ...filteredChatbotIds])
        );
      } else {
        const newSelected = new Set(selectedChatbots);
        filteredChatbotIds.forEach((id) => newSelected.delete(id));
        setSelectedChatbots(newSelected);
      }
    },
    [selectedChatbots, filteredChatbotIds]
  );

  const handleSelectChatbot = useCallback(
    (chatbotId: number, checked: boolean) => {
      setSelectedChatbots((prev) => {
        const newSelected = new Set(prev);
        if (checked) {
          newSelected.add(chatbotId);
        } else {
          newSelected.delete(chatbotId);
        }
        return newSelected;
      });
    },
    []
  );

  const handleEditChatbot = (chatbot: AiChatbot) => {
    console.log("Edit chatbot:", chatbot);
  };

  const handleDeleteClick = (chatbot: AiChatbot) => {
    console.log("Delete chatbot:", chatbot);
  };

  const handleAddNewChatbot = () => {
    console.log("Add new chatbot");
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
            <Button
              size="1"
              variant={statusFilter === "training" ? "solid" : "soft"}
              onClick={() =>
                setStatusFilter(statusFilter === "training" ? null : "training")
              }
            >
              Training
            </Button>
            <Button
              size="1"
              variant={statusFilter === "maintenance" ? "solid" : "soft"}
              onClick={() =>
                setStatusFilter(
                  statusFilter === "maintenance" ? null : "maintenance"
                )
              }
            >
              Maintenance
            </Button>
          </Flex>
          <Button onClick={handleAddNewChatbot}>
            <Plus size={16} />
            Add Chatbot
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
              <Table.ColumnHeaderCell>Chatbot ID</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Model</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Version</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Accuracy</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>
                Total Conversations
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Last Updated</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {filteredChatbots.length === 0 ? (
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
                      No AI chatbots found
                    </Text>
                    <Text size="2" color="gray">
                      Add your first AI chatbot to get started
                    </Text>
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ) : (
              filteredChatbots.map((chatbot) => (
                <Table.Row key={chatbot.id}>
                  <Table.Cell>
                    <Checkbox
                      checked={selectedChatbots.has(chatbot.id)}
                      onCheckedChange={(checked) =>
                        handleSelectChatbot(chatbot.id, checked as boolean)
                      }
                    />
                  </Table.Cell>
                  <Table.Cell>AI{chatbot.chatbot_id}</Table.Cell>
                  <Table.Cell>{chatbot.name}</Table.Cell>
                  <Table.Cell>{chatbot.model}</Table.Cell>
                  <Table.Cell>{chatbot.version}</Table.Cell>
                  <Table.Cell>
                    <AppBadge status={chatbot.status}>
                      {chatbot.status === "active"
                        ? "Active"
                        : chatbot.status === "inactive"
                        ? "Inactive"
                        : chatbot.status === "training"
                        ? "Training"
                        : "Maintenance"}
                    </AppBadge>
                  </Table.Cell>
                  <Table.Cell>{chatbot.accuracy}%</Table.Cell>
                  <Table.Cell>
                    {chatbot.total_conversations.toLocaleString()}
                  </Table.Cell>
                  <Table.Cell>
                    {formatDateToWords(chatbot.last_updated)}
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
                          onClick={() => handleEditChatbot(chatbot)}
                        >
                          <Eye size={15} style={{ marginRight: 8 }} /> Edit
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                          color="red"
                          onClick={() => handleDeleteClick(chatbot)}
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
