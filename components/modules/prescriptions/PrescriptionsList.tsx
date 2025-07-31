"use client";

import { Table, Card, Text, Flex, Checkbox, Button } from "@radix-ui/themes";
import { Eye, Trash, MoreVertical, Plus, Loader } from "lucide-react";
import { useState, useMemo, useCallback } from "react";
import { AppBadge } from "../../app/AppBadge";
import { IconButton, DropdownMenu } from "@radix-ui/themes";
import { formatDateToWords } from "@/utils/helper.utils";

interface Prescription {
  id: number;
  prescription_id: string;
  patient_name: string;
  doctor_name: string;
  medication_name: string;
  dosage: string;
  frequency: string;
  duration: string;
  status: "active" | "completed" | "discontinued";
  prescribed_date: string;
  expiry_date?: string;
  created_at: string;
  updated_at: string;
}

interface PrescriptionsListProps {
  prescriptions?: Prescription[];
}

export const PrescriptionsList: React.FC<PrescriptionsListProps> = ({
  prescriptions = [],
}) => {
  const [selectedPrescriptions, setSelectedPrescriptions] = useState<
    Set<number>
  >(new Set());
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [prescriptionsList, setPrescriptionsList] =
    useState<Prescription[]>(prescriptions);

  const filteredPrescriptions = useMemo(() => {
    return prescriptionsList.filter((prescription) => {
      const statusMatch = !statusFilter || prescription.status === statusFilter;
      return statusMatch;
    });
  }, [prescriptionsList, statusFilter]);

  const filteredPrescriptionIds = useMemo(() => {
    return new Set(
      filteredPrescriptions.map((prescription) => prescription.id)
    );
  }, [filteredPrescriptions]);

  const selectedFilteredPrescriptions = useMemo(() => {
    return new Set(
      Array.from(selectedPrescriptions).filter((id) =>
        filteredPrescriptionIds.has(id)
      )
    );
  }, [selectedPrescriptions, filteredPrescriptionIds]);

  const isAllSelected = useMemo(() => {
    return (
      filteredPrescriptions.length > 0 &&
      selectedFilteredPrescriptions.size === filteredPrescriptions.length
    );
  }, [filteredPrescriptions.length, selectedFilteredPrescriptions.size]);

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedPrescriptions(
          new Set([...selectedPrescriptions, ...filteredPrescriptionIds])
        );
      } else {
        const newSelected = new Set(selectedPrescriptions);
        filteredPrescriptionIds.forEach((id) => newSelected.delete(id));
        setSelectedPrescriptions(newSelected);
      }
    },
    [selectedPrescriptions, filteredPrescriptionIds]
  );

  const handleSelectPrescription = useCallback(
    (prescriptionId: number, checked: boolean) => {
      setSelectedPrescriptions((prev) => {
        const newSelected = new Set(prev);
        if (checked) {
          newSelected.add(prescriptionId);
        } else {
          newSelected.delete(prescriptionId);
        }
        return newSelected;
      });
    },
    []
  );

  const handleEditPrescription = (prescription: Prescription) => {
    console.log("Edit prescription:", prescription);
  };

  const handleDeleteClick = (prescription: Prescription) => {
    console.log("Delete prescription:", prescription);
  };

  const handleAddNewPrescription = () => {
    console.log("Add new prescription");
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
              variant={statusFilter === "completed" ? "solid" : "soft"}
              onClick={() =>
                setStatusFilter(
                  statusFilter === "completed" ? null : "completed"
                )
              }
            >
              Completed
            </Button>
            <Button
              size="1"
              variant={statusFilter === "discontinued" ? "solid" : "soft"}
              onClick={() =>
                setStatusFilter(
                  statusFilter === "discontinued" ? null : "discontinued"
                )
              }
            >
              Discontinued
            </Button>
          </Flex>
          <Button onClick={handleAddNewPrescription}>
            <Plus size={16} />
            Add Prescription
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
              <Table.ColumnHeaderCell>Prescription ID</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Patient Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Doctor Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Medication</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Dosage</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Frequency</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Duration</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Prescribed Date</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {filteredPrescriptions.length === 0 ? (
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
                      No prescriptions found
                    </Text>
                    <Text size="2" color="gray">
                      Add your first prescription to get started
                    </Text>
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ) : (
              filteredPrescriptions.map((prescription) => (
                <Table.Row key={prescription.id}>
                  <Table.Cell>
                    <Checkbox
                      checked={selectedPrescriptions.has(prescription.id)}
                      onCheckedChange={(checked) =>
                        handleSelectPrescription(
                          prescription.id,
                          checked as boolean
                        )
                      }
                    />
                  </Table.Cell>
                  <Table.Cell>P{prescription.prescription_id}</Table.Cell>
                  <Table.Cell>{prescription.patient_name}</Table.Cell>
                  <Table.Cell>{prescription.doctor_name}</Table.Cell>
                  <Table.Cell>{prescription.medication_name}</Table.Cell>
                  <Table.Cell>{prescription.dosage}</Table.Cell>
                  <Table.Cell>{prescription.frequency}</Table.Cell>
                  <Table.Cell>{prescription.duration}</Table.Cell>
                  <Table.Cell>
                    <AppBadge status={prescription.status}>
                      {prescription.status === "active"
                        ? "Active"
                        : prescription.status === "completed"
                        ? "Completed"
                        : "Discontinued"}
                    </AppBadge>
                  </Table.Cell>
                  <Table.Cell>{prescription.prescribed_date}</Table.Cell>
                  <Table.Cell>
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger>
                        <IconButton variant="ghost" size="1">
                          <MoreVertical size={16} />
                        </IconButton>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Content>
                        <DropdownMenu.Item
                          onClick={() => handleEditPrescription(prescription)}
                        >
                          <Eye size={15} style={{ marginRight: 8 }} /> Edit
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                          color="red"
                          onClick={() => handleDeleteClick(prescription)}
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
