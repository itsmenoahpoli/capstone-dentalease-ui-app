"use client";

import { Table, Card, Text, Flex, Checkbox, Button } from "@radix-ui/themes";
import { Eye, Trash, MoreVertical, Plus, Loader } from "lucide-react";
import { useState, useMemo, useCallback } from "react";
import { AppBadge } from "../../app/AppBadge";
import { IconButton, DropdownMenu } from "@radix-ui/themes";
import { formatDateToWords } from "@/utils/helper.utils";

interface InventoryItem {
  id: number;
  item_id: string;
  item_name: string;
  category: string;
  quantity: number;
  unit: string;
  unit_price: number;
  supplier: string;
  status: "in_stock" | "low_stock" | "out_of_stock";
  expiry_date?: string;
  created_at: string;
  updated_at: string;
}

interface InventoryListProps {
  items?: InventoryItem[];
}

export const InventoryList: React.FC<InventoryListProps> = ({ items = [] }) => {
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [itemsList, setItemsList] = useState<InventoryItem[]>(items);

  const filteredItems = useMemo(() => {
    return itemsList.filter((item) => {
      const statusMatch = !statusFilter || item.status === statusFilter;
      const categoryMatch = !categoryFilter || item.category === categoryFilter;
      return statusMatch && categoryMatch;
    });
  }, [itemsList, statusFilter, categoryFilter]);

  const filteredItemIds = useMemo(() => {
    return new Set(filteredItems.map((item) => item.id));
  }, [filteredItems]);

  const selectedFilteredItems = useMemo(() => {
    return new Set(
      Array.from(selectedItems).filter((id) => filteredItemIds.has(id))
    );
  }, [selectedItems, filteredItemIds]);

  const isAllSelected = useMemo(() => {
    return (
      filteredItems.length > 0 &&
      selectedFilteredItems.size === filteredItems.length
    );
  }, [filteredItems.length, selectedFilteredItems.size]);

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedItems(new Set([...selectedItems, ...filteredItemIds]));
      } else {
        const newSelected = new Set(selectedItems);
        filteredItemIds.forEach((id) => newSelected.delete(id));
        setSelectedItems(newSelected);
      }
    },
    [selectedItems, filteredItemIds]
  );

  const handleSelectItem = useCallback((itemId: number, checked: boolean) => {
    setSelectedItems((prev) => {
      const newSelected = new Set(prev);
      if (checked) {
        newSelected.add(itemId);
      } else {
        newSelected.delete(itemId);
      }
      return newSelected;
    });
  }, []);

  const handleEditItem = (item: InventoryItem) => {
    console.log("Edit item:", item);
  };

  const handleDeleteClick = (item: InventoryItem) => {
    console.log("Delete item:", item);
  };

  const handleAddNewItem = () => {
    console.log("Add new item");
  };

  return (
    <Card>
      <Flex direction="column" gap="4">
        <Flex justify="between" align="center">
          <Flex gap="2">
            <Button
              size="1"
              variant={statusFilter === "in_stock" ? "solid" : "soft"}
              onClick={() =>
                setStatusFilter(statusFilter === "in_stock" ? null : "in_stock")
              }
            >
              In Stock
            </Button>
            <Button
              size="1"
              variant={statusFilter === "low_stock" ? "solid" : "soft"}
              onClick={() =>
                setStatusFilter(
                  statusFilter === "low_stock" ? null : "low_stock"
                )
              }
            >
              Low Stock
            </Button>
            <Button
              size="1"
              variant={statusFilter === "out_of_stock" ? "solid" : "soft"}
              onClick={() =>
                setStatusFilter(
                  statusFilter === "out_of_stock" ? null : "out_of_stock"
                )
              }
            >
              Out of Stock
            </Button>
          </Flex>
          <Button onClick={handleAddNewItem}>
            <Plus size={16} />
            Add Item
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
              <Table.ColumnHeaderCell>Item ID</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Item Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Category</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Quantity</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Unit Price</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Supplier</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Expiry Date</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Date Added</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {filteredItems.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={11}>
                  <Flex
                    direction="column"
                    align="center"
                    justify="center"
                    className="py-12 px-6"
                    gap="3"
                  >
                    <Text size="5" weight="medium" color="gray">
                      No inventory items found
                    </Text>
                    <Text size="2" color="gray">
                      Add your first inventory item to get started
                    </Text>
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ) : (
              filteredItems.map((item) => (
                <Table.Row key={item.id}>
                  <Table.Cell>
                    <Checkbox
                      checked={selectedItems.has(item.id)}
                      onCheckedChange={(checked) =>
                        handleSelectItem(item.id, checked as boolean)
                      }
                    />
                  </Table.Cell>
                  <Table.Cell>I{item.item_id}</Table.Cell>
                  <Table.Cell>{item.item_name}</Table.Cell>
                  <Table.Cell>{item.category}</Table.Cell>
                  <Table.Cell>
                    {item.quantity} {item.unit}
                  </Table.Cell>
                  <Table.Cell>
                    PHP {item.unit_price.toLocaleString()}
                  </Table.Cell>
                  <Table.Cell>{item.supplier}</Table.Cell>
                  <Table.Cell>
                    <AppBadge status={item.status}>
                      {item.status === "in_stock"
                        ? "In Stock"
                        : item.status === "low_stock"
                        ? "Low Stock"
                        : "Out of Stock"}
                    </AppBadge>
                  </Table.Cell>
                  <Table.Cell>{item.expiry_date || "N/A"}</Table.Cell>
                  <Table.Cell>{formatDateToWords(item.created_at)}</Table.Cell>
                  <Table.Cell>
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger>
                        <IconButton variant="ghost" size="1">
                          <MoreVertical size={16} />
                        </IconButton>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Content>
                        <DropdownMenu.Item onClick={() => handleEditItem(item)}>
                          <Eye size={15} style={{ marginRight: 8 }} /> Edit
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                          color="red"
                          onClick={() => handleDeleteClick(item)}
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
