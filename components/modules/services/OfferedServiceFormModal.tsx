"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  Flex,
  Button,
  TextField,
  Select,
  Text,
  Checkbox,
} from "@radix-ui/themes";
import {
  OfferedService,
  CreateOfferedServicePayload,
  UpdateOfferedServicePayload,
} from "@/services/offered-services.service";

interface OfferedServiceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    payload: CreateOfferedServicePayload | UpdateOfferedServicePayload
  ) => Promise<void>;
  service?: OfferedService;
  isLoading?: boolean;
}

const CATEGORIES = [
  "Dental Cleaning",
  "Preventive Care",
  "Restoration Procedure",
  "Cosmetic Dentistry",
  "Specialized Treatment",
  "Emergency Care",
];

const STATUS_OPTIONS = [
  { value: "offered", label: "Offered" },
  { value: "not_offered", label: "Not Offered" },
];

export const OfferedServiceFormModal: React.FC<
  OfferedServiceFormModalProps
> = ({ isOpen, onClose, onSubmit, service, isLoading = false }) => {
  const [formData, setFormData] = useState<CreateOfferedServicePayload>({
    category: "",
    name: "",
    price: 0,
    status: "offered",
  });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditMode = !!service;

  useEffect(() => {
    if (service) {
      setFormData({
        category: service.category,
        name: service.name,
        price: parseFloat(service.price),
        status: service.status,
      });
      setSelectedCategories([service.category]);
    } else {
      setFormData({
        category: "",
        name: "",
        price: 0,
        status: "offered",
      });
      setSelectedCategories([]);
    }
    setErrors({});
  }, [service, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Service name is required";
    }

    if (formData.price <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleInputChange = (
    field: keyof CreateOfferedServicePayload,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title>
          {isEditMode ? "Edit Service" : "Add New Service"}
        </Dialog.Title>
        <Dialog.Description size="2" mb="4">
          {isEditMode
            ? "Update the service information below."
            : "Fill in the service information below."}
        </Dialog.Description>

        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="3">
            <div>
              <Text as="div" size="2" mb="1" weight="bold">
                Category
              </Text>
              <Flex direction="column" gap="2">
                {CATEGORIES.map((category) => (
                  <Flex key={category} gap="2" align="center">
                    <Checkbox
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedCategories([
                            ...selectedCategories,
                            category,
                          ]);
                          handleInputChange("category", category);
                        } else {
                          setSelectedCategories(
                            selectedCategories.filter((c) => c !== category)
                          );
                          if (selectedCategories.length === 1) {
                            handleInputChange("category", "");
                          }
                        }
                      }}
                    />
                    <Text size="2">{category}</Text>
                  </Flex>
                ))}
              </Flex>
              {errors.category && (
                <Text size="1" color="red" mt="1">
                  {errors.category}
                </Text>
              )}
            </div>

            <div>
              <Text as="div" size="2" mb="1" weight="bold">
                Service Name
              </Text>
              <TextField.Root
                placeholder="Enter service name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
              {errors.name && (
                <Text size="1" color="red" mt="1">
                  {errors.name}
                </Text>
              )}
            </div>

            <div>
              <Text as="div" size="2" mb="1" weight="bold">
                Price (PHP)
              </Text>
              <TextField.Root
                type="number"
                placeholder="0.00"
                value={formData.price}
                onChange={(e) =>
                  handleInputChange("price", parseFloat(e.target.value) || 0)
                }
                min="0"
                step="0.01"
              />
              {errors.price && (
                <Text size="1" color="red" mt="1">
                  {errors.price}
                </Text>
              )}
            </div>

            <div>
              <Text as="div" size="2" mb="1" weight="bold">
                Status
              </Text>
              <Select.Root
                value={formData.status}
                onValueChange={(value) =>
                  handleInputChange(
                    "status",
                    value as "offered" | "not_offered"
                  )
                }
              >
                <Select.Trigger className="w-full" />
                <Select.Content>
                  {STATUS_OPTIONS.map((option) => (
                    <Select.Item key={option.value} value={option.value}>
                      {option.label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </div>

            <Flex gap="3" mt="4">
              <Dialog.Close>
                <Button variant="soft" color="gray">
                  Cancel
                </Button>
              </Dialog.Close>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "Saving..."
                  : isEditMode
                  ? "Update Service"
                  : "Create Service"}
              </Button>
            </Flex>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
};
