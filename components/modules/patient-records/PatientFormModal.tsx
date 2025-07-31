"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  Flex,
  Text,
  TextField,
  TextArea,
  Select,
  Button,
} from "@radix-ui/themes";
import {
  Patient,
  CreatePatientData,
  UpdatePatientData,
} from "@/services/patients.service";

interface PatientFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient?: Patient;
  onSubmit: (data: CreatePatientData | UpdatePatientData) => Promise<void>;
  isLoading?: boolean;
}

export const PatientFormModal: React.FC<PatientFormModalProps> = ({
  open,
  onOpenChange,
  patient,
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<CreatePatientData>({
    name: "",
    email: "",
    contact: "",
    address: "",
    gender: "male",
    birthdate: "",
    citizenship: "",
    status: "active",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (patient) {
      setFormData({
        name: patient.name,
        email: patient.email,
        contact: patient.contact,
        address: patient.address,
        gender: patient.gender,
        birthdate: patient.birthdate,
        citizenship: patient.citizenship,
        status: patient.status,
      });
    } else {
      setFormData({
        name: "",
        email: "",
        contact: "",
        address: "",
        gender: "male",
        birthdate: "",
        citizenship: "",
        status: "active",
      });
    }
    setErrors({});
  }, [patient, open]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.contact.trim()) {
      newErrors.contact = "Contact number is required";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.birthdate) {
      newErrors.birthdate = "Birthdate is required";
    }

    if (!formData.citizenship.trim()) {
      newErrors.citizenship = "Citizenship is required";
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
      if (patient) {
        await onSubmit({ ...formData, id: patient.id });
      } else {
        await onSubmit(formData);
      }
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleInputChange = (field: keyof CreatePatientData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content style={{ maxWidth: 600 }}>
        <Dialog.Title>
          {patient ? "Edit Patient" : "Add New Patient"}
        </Dialog.Title>
        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="4">
            <Flex gap="3">
              <Flex direction="column" gap="2" style={{ flex: 1 }}>
                <Text size="2" weight="bold">
                  Name
                </Text>
                <TextField.Root
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <Text size="1" color="red">
                    {errors.name}
                  </Text>
                )}
              </Flex>
              <Flex direction="column" gap="2" style={{ flex: 1 }}>
                <Text size="2" weight="bold">
                  Email
                </Text>
                <TextField.Root
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <Text size="1" color="red">
                    {errors.email}
                  </Text>
                )}
              </Flex>
            </Flex>

            <Flex gap="3">
              <Flex direction="column" gap="2" style={{ flex: 1 }}>
                <Text size="2" weight="bold">
                  Contact Number
                </Text>
                <TextField.Root
                  placeholder="Enter contact number"
                  value={formData.contact}
                  onChange={(e) => handleInputChange("contact", e.target.value)}
                  className={errors.contact ? "border-red-500" : ""}
                />
                {errors.contact && (
                  <Text size="1" color="red">
                    {errors.contact}
                  </Text>
                )}
              </Flex>
              <Flex direction="column" gap="2" style={{ flex: 1 }}>
                <Text size="2" weight="bold">
                  Gender
                </Text>
                <Select.Root
                  value={formData.gender}
                  onValueChange={(value) =>
                    handleInputChange(
                      "gender",
                      value as "male" | "female" | "other"
                    )
                  }
                >
                  <Select.Trigger />
                  <Select.Content>
                    <Select.Item value="male">Male</Select.Item>
                    <Select.Item value="female">Female</Select.Item>
                    <Select.Item value="other">Other</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Flex>
            </Flex>

            <Flex direction="column" gap="2">
              <Text size="2" weight="bold">
                Address
              </Text>
              <TextArea
                placeholder="Enter complete address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className={errors.address ? "border-red-500" : ""}
              />
              {errors.address && (
                <Text size="1" color="red">
                  {errors.address}
                </Text>
              )}
            </Flex>

            <Flex gap="3">
              <Flex direction="column" gap="2" style={{ flex: 1 }}>
                <Text size="2" weight="bold">
                  Birthdate
                </Text>
                <TextField.Root
                  type="date"
                  value={formData.birthdate}
                  onChange={(e) =>
                    handleInputChange("birthdate", e.target.value)
                  }
                  className={errors.birthdate ? "border-red-500" : ""}
                />
                {errors.birthdate && (
                  <Text size="1" color="red">
                    {errors.birthdate}
                  </Text>
                )}
              </Flex>
              <Flex direction="column" gap="2" style={{ flex: 1 }}>
                <Text size="2" weight="bold">
                  Citizenship
                </Text>
                <TextField.Root
                  placeholder="Enter citizenship"
                  value={formData.citizenship}
                  onChange={(e) =>
                    handleInputChange("citizenship", e.target.value)
                  }
                  className={errors.citizenship ? "border-red-500" : ""}
                />
                {errors.citizenship && (
                  <Text size="1" color="red">
                    {errors.citizenship}
                  </Text>
                )}
              </Flex>
            </Flex>

            <Flex direction="column" gap="2">
              <Text size="2" weight="bold">
                Status
              </Text>
              <Select.Root
                value={formData.status}
                onValueChange={(value) =>
                  handleInputChange("status", value as "active" | "inactive")
                }
              >
                <Select.Trigger />
                <Select.Content>
                  <Select.Item value="active">Active</Select.Item>
                  <Select.Item value="inactive">Inactive</Select.Item>
                </Select.Content>
              </Select.Root>
            </Flex>

            <Flex gap="3" justify="end">
              <Button
                type="button"
                variant="soft"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "Saving..."
                  : patient
                  ? "Update Patient"
                  : "Add Patient"}
              </Button>
            </Flex>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
};
