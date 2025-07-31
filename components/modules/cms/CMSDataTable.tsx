"use client";

import {
  Table,
  Card,
  Text,
  Flex,
  Checkbox,
  Button,
  TextArea,
} from "@radix-ui/themes";
import { Eye, Trash, Plus, Loader, Edit, Search } from "lucide-react";
import { useState, useMemo, useCallback, useEffect } from "react";
import { AppBadge } from "../../app/AppBadge";
import { IconButton, Dialog, AlertDialog } from "@radix-ui/themes";
import { formatDateToWords } from "@/utils/helper.utils";
import { cmsService, CMSContent, CreateCMSData } from "@/services/cms.service";

interface CMSDataTableProps {
  category: string;
  categoryDisplay: string;
}

export const CMSDataTable: React.FC<CMSDataTableProps> = ({
  category,
  categoryDisplay,
}) => {
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [cmsList, setCmsList] = useState<CMSContent[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isActiveFilter, setIsActiveFilter] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<CMSContent | null>(null);
  const [deletingItem, setDeletingItem] = useState<CMSContent | null>(null);
  const [formData, setFormData] = useState<CreateCMSData>({
    category,
    title: "",
    content: "",
    metadata: {},
    is_active: true,
  });

  const loadCMSContent = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await cmsService.getCMSContentByCategory(category);
      setCmsList(data);
    } catch (error) {
      console.error("Error loading CMS content:", error);
    } finally {
      setIsLoading(false);
    }
  }, [category]);

  useEffect(() => {
    loadCMSContent();
  }, [loadCMSContent]);

  const filteredItems = useMemo(() => {
    return cmsList.filter((item) => {
      const searchMatch =
        !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase());
      const statusMatch =
        !isActiveFilter ||
        (isActiveFilter === "active" && item.is_active) ||
        (isActiveFilter === "inactive" && !item.is_active);
      return searchMatch && statusMatch;
    });
  }, [cmsList, searchQuery, isActiveFilter]);

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

  const handleEditItem = (item: CMSContent) => {
    setEditingItem(item);
    setFormData({
      category: item.category,
      title: item.title,
      content: item.content,
      metadata: item.metadata,
      is_active: item.is_active,
    });
    setShowForm(true);
  };

  const handleDeleteClick = (item: CMSContent) => {
    setDeletingItem(item);
    setShowDeleteDialog(true);
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setFormData({
      category,
      title: "",
      content: "",
      metadata: {},
      is_active: true,
    });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (editingItem) {
        await cmsService.updateCMSContent({
          id: editingItem.id,
          ...formData,
        });
      } else {
        await cmsService.createCMSContent(formData);
      }
      setShowForm(false);
      loadCMSContent();
    } catch (error) {
      console.error("Error saving CMS content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;

    setIsLoading(true);
    try {
      await cmsService.deleteCMSContent(deletingItem.id);
      setShowDeleteDialog(false);
      setDeletingItem(null);
      loadCMSContent();
    } catch (error) {
      console.error("Error deleting CMS content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusToggle = async (item: CMSContent) => {
    setIsLoading(true);
    try {
      await cmsService.updateCMSContentStatus(item.id, !item.is_active);
      loadCMSContent();
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <div className="p-4">
          <Flex justify="between" align="center" className="mb-4">
            <Text size="5" weight="bold">
              {categoryDisplay}
            </Text>
            <Button onClick={handleAddNew} disabled={isLoading}>
              <Plus size={16} />
              Add New
            </Button>
          </Flex>

          <Flex gap="3" className="mb-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md pl-10"
              />
              <Search
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>

            <select
              value={isActiveFilter || ""}
              onChange={(e) => setIsActiveFilter(e.target.value || null)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
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
                <Table.ColumnHeaderCell>Title</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Content Preview</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Created</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {isLoading ? (
                <Table.Row>
                  <Table.Cell colSpan={6}>
                    <Flex justify="center" align="center" className="py-8">
                      <Loader className="animate-spin" />
                      <Text className="ml-2">Loading...</Text>
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ) : filteredItems.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={6}>
                    <Flex justify="center" align="center" className="py-8">
                      <Text color="gray">No content found</Text>
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
                    <Table.Cell>
                      <Text weight="medium">{item.title}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text className="text-gray-600">
                        {item.content.substring(0, 100)}
                        {item.content.length > 100 && "..."}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <AppBadge
                        variant={item.is_active ? "success" : "danger"}
                        text={item.is_active ? "Active" : "Inactive"}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2" color="gray">
                        {formatDateToWords(item.created_at)}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Flex gap="2">
                        <IconButton
                          size="1"
                          variant="ghost"
                          onClick={() => handleEditItem(item)}
                        >
                          <Edit size={14} />
                        </IconButton>
                        <IconButton
                          size="1"
                          variant="ghost"
                          onClick={() => handleStatusToggle(item)}
                        >
                          <Eye size={14} />
                        </IconButton>
                        <IconButton
                          size="1"
                          variant="ghost"
                          color="red"
                          onClick={() => handleDeleteClick(item)}
                        >
                          <Trash size={14} />
                        </IconButton>
                      </Flex>
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table.Root>
        </div>
      </Card>

      <Dialog.Root open={showForm} onOpenChange={setShowForm}>
        <Dialog.Content className="w-[600px]">
          <Dialog.Title>
            {editingItem ? "Edit Content" : "Add New Content"}
          </Dialog.Title>

          <div className="space-y-4 mt-4">
            <div>
              <Text weight="medium" className="block mb-2">
                Title
              </Text>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Enter title..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <Text weight="medium" className="block mb-2">
                Content
              </Text>
              <TextArea
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                placeholder="Enter content..."
                rows={8}
              />
            </div>

            <div>
              <Checkbox
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_active: checked as boolean })
                }
              />
              <Text className="ml-2">Active</Text>
            </div>
          </div>

          <Flex gap="3" justify="end" className="mt-6">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </Dialog.Close>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? <Loader className="animate-spin" /> : null}
              {editingItem ? "Update" : "Create"}
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      <AlertDialog.Root
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      >
        <AlertDialog.Content>
          <AlertDialog.Title>Delete Content</AlertDialog.Title>
          <AlertDialog.Description>
            Are you sure you want to delete &quot;{deletingItem?.title}&quot;?
            This action cannot be undone.
          </AlertDialog.Description>
          <Flex gap="3" mt="4" justify="end">
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button color="red" onClick={handleDelete} disabled={isLoading}>
                {isLoading ? <Loader className="animate-spin" /> : null}
                Delete
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </div>
  );
};
