"use client";

import { Table, Card, Text, Flex, Checkbox, Button } from "@radix-ui/themes";
import { Eye, Trash, MoreVertical, Plus, Loader } from "lucide-react";
import { useState, useMemo, useCallback, useEffect } from "react";
import { AppBadge } from "../../app/AppBadge";
import { IconButton, DropdownMenu } from "@radix-ui/themes";
import { formatDateToWords } from "@/utils/helper.utils";
import {
  Patient,
  patientsService,
  CreatePatientData,
  UpdatePatientData,
} from "@/services/patients.service";
import { PatientFormModal } from "./PatientFormModal";
import { DeletePatientModal } from "./DeletePatientModal";

export const PatientRecordsList: React.FC = () => {
  const [selectedPatients, setSelectedPatients] = useState<Set<number>>(
    new Set()
  );
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [patientsList, setPatientsList] = useState<Patient[]>([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    setIsLoading(true);
    try {
      const patients = await patientsService.getAllPatients();
      setPatientsList(patients);
    } catch (error) {
      console.error("Error loading patients:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsFormModalOpen(true);
  };

  const handleDeleteClick = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsDeleteModalOpen(true);
  };

  const handleAddNewPatient = () => {
    setSelectedPatient(undefined);
    setIsFormModalOpen(true);
  };

  const handleSubmitPatient = async (
    data: CreatePatientData | UpdatePatientData
  ) => {
    setIsSubmitting(true);
    try {
      if ("id" in data) {
        await patientsService.updatePatient(data);
      } else {
        await patientsService.createPatient(data);
      }
      await loadPatients();
    } catch (error) {
      console.error("Error saving patient:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePatient = async () => {
    if (!selectedPatient) return;

    setIsSubmitting(true);
    try {
      await patientsService.deletePatient(selectedPatient.id);
      await loadPatients();
    } catch (error) {
      console.error("Error deleting patient:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
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
                  setStatusFilter(
                    statusFilter === "inactive" ? null : "inactive"
                  )
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
                <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Contact</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Gender</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Birthdate</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Citizenship</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Date Added</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {isLoading ? (
                <Table.Row>
                  <Table.Cell colSpan={9}>
                    <Flex
                      direction="column"
                      align="center"
                      justify="center"
                      className="py-12 px-6"
                      gap="3"
                    >
                      <Loader className="animate-spin" size={24} />
                      <Text size="3" color="gray">
                        Loading patients...
                      </Text>
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ) : filteredPatients.length === 0 ? (
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
                    <Table.Cell>{patient.name}</Table.Cell>
                    <Table.Cell>{patient.email}</Table.Cell>
                    <Table.Cell>{patient.contact}</Table.Cell>
                    <Table.Cell>
                      <Text size="2" style={{ textTransform: "capitalize" }}>
                        {patient.gender}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>{patient.birthdate}</Table.Cell>
                    <Table.Cell>{patient.citizenship}</Table.Cell>
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
                            <Trash size={15} style={{ marginRight: 8 }} />{" "}
                            Delete
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

      <PatientFormModal
        open={isFormModalOpen}
        onOpenChange={setIsFormModalOpen}
        patient={selectedPatient}
        onSubmit={handleSubmitPatient}
        isLoading={isSubmitting}
      />

      <DeletePatientModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        patient={selectedPatient}
        onConfirm={handleDeletePatient}
        isLoading={isSubmitting}
      />
    </>
  );
};
