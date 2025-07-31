"use client";

import { useState, useEffect } from "react";
import {
  Card,
  Text,
  Flex,
  Button,
  TextField,
  Checkbox,
} from "@radix-ui/themes";
import { Save, Loader } from "lucide-react";
import { cmsService, CMSContent, CreateCMSData } from "@/services/cms.service";
import { WYSIWYGEditor } from "./WYSIWYGEditor";

interface CMSFormProps {
  category: string;
  categoryDisplay: string;
}

export const CMSForm: React.FC<CMSFormProps> = ({
  category,
  categoryDisplay,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [content, setContent] = useState<CMSContent | null>(null);
  const [formData, setFormData] = useState<CreateCMSData>({
    category,
    title: "",
    content: "",
    metadata: {},
    is_active: true,
  });

  useEffect(() => {
    loadContent();
  }, [category]);

  const loadContent = async () => {
    setIsLoading(true);
    try {
      const contentResponse = await cmsService.getCMSContentByCategory(
        category
      );

      let existingContent = null;

      if (Array.isArray(contentResponse)) {
        if (contentResponse.length > 0) {
          existingContent = contentResponse[0];
        }
      } else if (contentResponse && typeof contentResponse === "object") {
        existingContent = contentResponse;
      }

      if (existingContent) {
        setContent(existingContent);
        setFormData({
          category,
          title: existingContent.title || "",
          content: existingContent.content || "",
          metadata: existingContent.metadata || {},
          is_active: existingContent.is_active ?? true,
        });
      } else {
        setContent(null);
        setFormData({
          category,
          title: "",
          content: "",
          metadata: {},
          is_active: true,
        });
      }
    } catch (error) {
      console.error("Error loading content:", error);
      setContent(null);
      setFormData({
        category,
        title: "",
        content: "",
        metadata: {},
        is_active: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (content) {
        await cmsService.updateCMSContent({
          id: content.id,
          ...formData,
        });
      } else {
        await cmsService.createCMSContent(formData);
      }
      await loadContent();
    } catch (error) {
      console.error("Error saving content:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (
    field: keyof CreateCMSData,
    value: string | boolean | Record<string, unknown>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (isLoading) {
    return (
      <Card>
        <Flex justify="center" align="center" p="6">
          <Loader className="animate-spin" />
          <Text>Loading {categoryDisplay}...</Text>
        </Flex>
      </Card>
    );
  }

  return (
    <Card>
      <Flex direction="column" gap="4">
        <Text size="5" weight="bold">
          {categoryDisplay}
        </Text>

        <Flex direction="column" gap="3">
          <div>
            <Text size="2" weight="medium" mb="2">
              Title
            </Text>
            <TextField.Root
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder={`Enter ${categoryDisplay.toLowerCase()} title`}
            />
          </div>

          <div>
            <Text size="2" weight="medium" mb="2">
              Content
            </Text>
            <WYSIWYGEditor
              value={formData.content}
              onChange={(value) => handleInputChange("content", value)}
              placeholder={`Enter ${categoryDisplay.toLowerCase()} content`}
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

          <Flex justify="end" mt="4">
            <Button onClick={handleSave} disabled={isSaving} size="2">
              {isSaving ? (
                <>
                  <Loader className="animate-spin" size="16" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size="16" />
                  Save Changes
                </>
              )}
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
};
