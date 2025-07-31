"use client";

import { useState, useEffect } from "react";
import {
  Card,
  Text,
  Flex,
  Button,
  Grid,
  Badge,
  Dialog,
  TextField,
  Checkbox,
} from "@radix-ui/themes";
import { Plus, Edit, Trash, Calendar, User } from "lucide-react";
import { cmsService, CMSContent, CreateCMSData } from "@/services/cms.service";
import { WYSIWYGEditor } from "./WYSIWYGEditor";

interface ClinicAnnouncementsGridProps {
  category: string;
  categoryDisplay: string;
}

interface AnnouncementFormData {
  id?: number;
  title: string;
  content: string;
  is_active: boolean;
}

export const ClinicAnnouncementsGrid: React.FC<
  ClinicAnnouncementsGridProps
> = ({ category, categoryDisplay }) => {
  const [announcements, setAnnouncements] = useState<CMSContent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] =
    useState<CMSContent | null>(null);
  const [formData, setFormData] = useState<AnnouncementFormData>({
    title: "",
    content: "",
    is_active: true,
  });

  useEffect(() => {
    loadAnnouncements();
  }, [category]);

  const loadAnnouncements = async () => {
    setIsLoading(true);
    try {
      const response = await cmsService.getCMSContentByCategory(category);
      let announcementsList: CMSContent[] = [];

      if (Array.isArray(response)) {
        announcementsList = response;
      } else if (response && typeof response === "object") {
        announcementsList = [response];
      }

      setAnnouncements(announcementsList);
    } catch (error) {
      console.error("Error loading announcements:", error);
      setAnnouncements([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (editingAnnouncement) {
        await cmsService.updateCMSContent({
          id: editingAnnouncement.id,
          category,
          title: formData.title,
          content: formData.content,
          is_active: formData.is_active,
        });
      } else {
        await cmsService.createCMSContent({
          category,
          title: formData.title,
          content: formData.content,
          is_active: formData.is_active,
        });
      }
      await loadAnnouncements();
      handleCloseForm();
    } catch (error) {
      console.error("Error saving announcement:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (announcement: CMSContent) => {
    setEditingAnnouncement(announcement);
    setFormData({
      id: announcement.id,
      title: announcement.title,
      content: announcement.content,
      is_active: announcement.is_active,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this announcement?")) {
      try {
        await cmsService.deleteCMSContent(id);
        await loadAnnouncements();
      } catch (error) {
        console.error("Error deleting announcement:", error);
      }
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingAnnouncement(null);
    setFormData({
      title: "",
      content: "",
      is_active: true,
    });
  };

  const handleInputChange = (
    field: keyof AnnouncementFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <Card>
        <Flex justify="center" align="center" p="6">
          <Text>Loading announcements...</Text>
        </Flex>
      </Card>
    );
  }

  return (
    <>
      <Flex direction="column" gap="4">
        <Flex justify="end">
          <Button onClick={() => setShowForm(true)} size="2">
            <Plus size="16" />
            Add Announcement
          </Button>
        </Flex>

        {announcements.length === 0 ? (
          <Card>
            <Flex justify="center" align="center" p="6">
              <Text color="gray">
                No announcements found. Create your first announcement!
              </Text>
            </Flex>
          </Card>
        ) : (
          <Grid columns={{ initial: "1", sm: "2", lg: "3" }} gap="4">
            {announcements.map((announcement) => (
              <Card key={announcement.id} style={{ height: "fit-content" }}>
                <Flex direction="column" gap="3">
                  <Flex justify="between" align="start">
                    <div style={{ flex: 1 }}>
                      <Text size="3" weight="bold" mb="1">
                        {announcement.title}
                      </Text>
                      <Flex gap="2" align="center" mb="2">
                        <Calendar size="12" />
                        <Text size="1" color="gray">
                          {formatDate(announcement.created_at)}
                        </Text>
                      </Flex>
                    </div>
                    <Badge variant={announcement.is_active ? "solid" : "soft"}>
                      {announcement.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </Flex>

                  <div
                    style={{
                      maxHeight: "100px",
                      overflow: "hidden",
                      lineHeight: "1.4",
                    }}
                    dangerouslySetInnerHTML={{
                      __html:
                        announcement.content.substring(0, 150) +
                        (announcement.content.length > 150 ? "..." : ""),
                    }}
                  />

                  <Flex gap="2" mt="auto">
                    <Button
                      size="1"
                      variant="soft"
                      onClick={() => handleEdit(announcement)}
                    >
                      <Edit size="12" />
                      Edit
                    </Button>
                    <Button
                      size="1"
                      variant="soft"
                      color="red"
                      onClick={() => handleDelete(announcement.id)}
                    >
                      <Trash size="12" />
                      Delete
                    </Button>
                  </Flex>
                </Flex>
              </Card>
            ))}
          </Grid>
        )}
      </Flex>

      <Dialog.Root open={showForm} onOpenChange={setShowForm}>
        <Dialog.Content style={{ maxWidth: 800 }}>
          <Dialog.Title>
            {editingAnnouncement ? "Edit Announcement" : "Add New Announcement"}
          </Dialog.Title>

          <Flex direction="column" gap="4" mt="4">
            <div>
              <Text size="2" weight="medium" mb="2">
                Title
              </Text>
              <TextField.Root
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter announcement title"
              />
            </div>

            <div>
              <Text size="2" weight="medium" mb="2">
                Content
              </Text>
              <WYSIWYGEditor
                value={formData.content}
                onChange={(value) => handleInputChange("content", value)}
                placeholder="Enter announcement content"
              />
            </div>

            <div>
              <Text size="2" weight="medium" mb="2">
                Status
              </Text>
              <Flex direction="column" gap="2">
                <Flex align="center" gap="2">
                  <Checkbox
                    checked={formData.is_active}
                    onCheckedChange={(checked) =>
                      handleInputChange("is_active", checked === true)
                    }
                  />
                  <Text size="2">Active</Text>
                </Flex>
                <Flex align="center" gap="2">
                  <Checkbox
                    checked={!formData.is_active}
                    onCheckedChange={(checked) =>
                      handleInputChange("is_active", !checked)
                    }
                  />
                  <Text size="2">Inactive</Text>
                </Flex>
              </Flex>
            </div>

            <Flex gap="3" justify="end" mt="4">
              <Button variant="soft" onClick={handleCloseForm}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Announcement"}
              </Button>
            </Flex>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
};
