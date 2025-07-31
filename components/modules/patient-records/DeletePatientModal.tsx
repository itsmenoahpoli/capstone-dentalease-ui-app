"use client";

import { Dialog, Flex, Text, Button } from "@radix-ui/themes";
import { AlertTriangle } from "lucide-react";
import { Patient } from "@/services/patients.service";

interface DeletePatientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient?: Patient;
  onConfirm: () => Promise<void>;
  isLoading?: boolean;
}

export const DeletePatientModal: React.FC<DeletePatientModalProps> = ({
  open,
  onOpenChange,
  patient,
  onConfirm,
  isLoading = false,
}) => {
  const handleConfirm = async () => {
    try {
      await onConfirm();
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting patient:", error);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content style={{ maxWidth: 400 }}>
        <Dialog.Title>
          <Flex align="center" gap="2">
            <AlertTriangle size={20} color="#ef4444" />
            Delete Patient
          </Flex>
        </Dialog.Title>

        <Flex direction="column" gap="4">
          <Text size="3">
            Are you sure you want to delete{" "}
            <Text weight="bold">{patient?.name}</Text>? This action cannot be
            undone.
          </Text>

          <Text size="2" color="gray">
            This will permanently remove the patient record and all associated
            data.
          </Text>

          <Flex gap="3" justify="end">
            <Button
              variant="soft"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button color="red" onClick={handleConfirm} disabled={isLoading}>
              {isLoading ? "Deleting..." : "Delete Patient"}
            </Button>
          </Flex>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};
