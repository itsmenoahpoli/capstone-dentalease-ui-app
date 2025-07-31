"use client";

import { Table, Card, Text, Flex, Checkbox, Button } from "@radix-ui/themes";
import { Eye, Trash, MoreVertical, Plus, Loader } from "lucide-react";
import { useState, useMemo, useCallback } from "react";
import { AppBadge } from "../../app/AppBadge";
import { IconButton, DropdownMenu } from "@radix-ui/themes";
import { formatDateToWords } from "@/utils/helper.utils";

interface PatientRecord {
  id: number;
  patient_id: string;
  full_name: string;
  date_of_birth: string;
  contact_number: string;
  email: string;
  address: string;
  medical_history: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

interface PatientRecordsListProps {
  patients?: PatientRecord[];
}

export const PatientRecordsList: React.FC<PatientRecordsListProps> = ({
  patients = [],
}) => {
  const [selectedPatients, setSelectedPatients] = useState<Set<number>>(
    new Set()
  );
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [patientsList, setPatientsList] = useState<PatientRecord[]>(patients);

  const filteredPatients = useMemo(() => {
    return patientsList.filter((patient) => {
      const statusMatch = !statusFilter || patient.status === statusFilter;
      return statusMatch;
    });
  }, [patientsList, statusFilter]);

  const filteredPatientIds = useMemo(() => {
    return new Set(filteredPatients.map((patient) => patient.id));
  }, [filteredPatients]);

  const selectedFilteredPatients = useMemo(() => {
    return new Set(
      Array.from(selectedPatients).filter((id) => filteredPatientIds.has(id))
    );
  }, [selectedPatients, filteredPatientIds]);

  const isAllSelected = useMemo(() => {
    return (
      filteredPatients.length > 0 &&
      selectedFilteredPatients.size === filteredPatients.length
    );
  }, [filteredPatients.length, selectedFilteredPatients.size]);

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedPatients(
          new Set([...selectedPatients, ...filteredPatientIds])
        );
      } else {
        const newSelected = new Set(selectedPatients);
        filteredPatientIds.forEach((id) => newSelected.delete(id));
        setSelectedPatients(newSelected);
      }
    },
    [selectedPatients, filteredPatientIds]
  );

  const handleSelectPatient = useCallback(
    (patientId: number, checked: boolean) => {
      setSelectedPatients((prev) => {
        const newSelected = new Set(prev);
        if (checked) {
          newSelected.add(patientId);
        } else {
          newSelected.delete(patientId);
        }
        return newSelected;
      });
    },
    []
  );

  const handleEditPatient = (patient: PatientRecord) => {
    console.log("Edit patient:", patient);
  };

  const handleDeleteClick = (patient: PatientRecord) => {
    console.log("Delete patient:", patient);
  };

  const handleAddNewPatient = () => {
    console.log("Add new patient");
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
          </Flex>
          <Button onClick={handleAddNewPatient}>
            <Plus size={16} />
            Add Patient
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
              <Table.ColumnHeaderCell>Patient ID</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Full Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Date of Birth</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Contact Number</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Date Added</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {filteredPatients.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={9}>
                  <Flex
                    direction="column"
                    align="center"
                    justify="center"
                    className="py-12 px-6"
                    gap="3"
                  >
                    <Text size="5" weight="medium" color="gray">
                      No patient records found
                    </Text>
                    <Text size="2" color="gray">
                      Add your first patient record to get started
                    </Text>
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ) : (
              filteredPatients.map((patient) => (
                <Table.Row key={patient.id}>
                  <Table.Cell>
                    <Checkbox
                      checked={selectedPatients.has(patient.id)}
                      onCheckedChange={(checked) =>
                        handleSelectPatient(patient.id, checked as boolean)
                      }
                    />
                  </Table.Cell>
                  <Table.Cell>P{patient.patient_id}</Table.Cell>
                  <Table.Cell>{patient.full_name}</Table.Cell>
                  <Table.Cell>{patient.date_of_birth}</Table.Cell>
                  <Table.Cell>{patient.contact_number}</Table.Cell>
                  <Table.Cell>{patient.email}</Table.Cell>
                  <Table.Cell>
                    <AppBadge status={patient.status}>
                      {patient.status === "active" ? "Active" : "Inactive"}
                    </AppBadge>
                  </Table.Cell>
                  <Table.Cell>
                    {formatDateToWords(patient.created_at)}
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
                          onClick={() => handleEditPatient(patient)}
                        >
                          <Eye size={15} style={{ marginRight: 8 }} /> Edit
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                          color="red"
                          onClick={() => handleDeleteClick(patient)}
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
