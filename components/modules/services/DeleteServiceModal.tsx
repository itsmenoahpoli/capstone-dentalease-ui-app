"use client";

import { AlertDialog, Button, Flex, Text } from "@radix-ui/themes";
import { AlertTriangle } from "lucide-react";
import { OfferedService } from "@/services/offered-services.service";

interface DeleteServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  service?: OfferedService;
  isLoading?: boolean;
}

export const DeleteServiceModal: React.FC<DeleteServiceModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  service,
  isLoading = false,
}) => {
  const handleConfirm = async () => {
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  return (
    <AlertDialog.Root open={isOpen} onOpenChange={onClose}>
      <AlertDialog.Content style={{ maxWidth: 450 }}>
        <AlertDialog.Title>
          <Flex align="center" gap="2">
            <AlertTriangle size={20} color="red" />
            Delete Service
          </Flex>
        </AlertDialog.Title>
        <AlertDialog.Description size="2" mb="4">
          Are you sure you want to delete{" "}
          <Text weight="bold">{service?.name}</Text>? This action cannot be
          undone.
        </AlertDialog.Description>

        <Flex gap="3" justify="end">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button color="red" onClick={handleConfirm} disabled={isLoading}>
              {isLoading ? "Deleting..." : "Delete Service"}
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
};
