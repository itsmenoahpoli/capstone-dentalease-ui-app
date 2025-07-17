"use client";

import { Table, Card, Text, Button, Flex, Checkbox } from "@radix-ui/themes";
import { EyeOpenIcon, TrashIcon } from "@radix-ui/react-icons";
import { useState, useMemo, useCallback } from "react";
import { AppBadge } from "../../app/AppBadge";
import { TablePagination } from "../../shared/table/TablePagination";
import ServicesFilters from "./filters/ServicesFilters";
import { IconButton, DropdownMenu } from "@radix-ui/themes";
import { MoreVertical } from "lucide-react";
import { formatDateToWords } from "@/utils/helper.utils";

interface Service {
  id: string;
  category: string;
  name: string;
  price: number;
  status: "offered" | "not_offered";
  dateAdded: string;
  lastUpdated: string;
}

interface ServicesManageListProps {
  services?: Service[];
}

const dummyServices: Service[] = [
  {
    id: "SVC001",
    category: "Preventive Care",
    name: "Dental Cleaning",
    price: 120,
    status: "offered",
    dateAdded: "2024-05-01T10:00:00Z",
    lastUpdated: "2024-05-10T15:30:00Z",
  },
  {
    id: "SVC002",
    category: "Preventive Care",
    name: "Dental Exam",
    price: 85,
    status: "offered",
    dateAdded: "2024-05-02T11:00:00Z",
    lastUpdated: "2024-05-11T16:00:00Z",
  },
  {
    id: "SVC003",
    category: "Restoration Procedure",
    name: "Cavity Filling",
    price: 150,
    status: "offered",
    dateAdded: "2024-05-03T12:00:00Z",
    lastUpdated: "2024-05-12T17:00:00Z",
  },
  {
    id: "SVC004",
    category: "Restoration Procedure",
    name: "Root Canal",
    price: 1200,
    status: "offered",
    dateAdded: "2024-05-04T13:00:00Z",
    lastUpdated: "2024-05-13T18:00:00Z",
  },
  {
    id: "SVC005",
    category: "Cosmetic Dentistry",
    name: "Teeth Whitening",
    price: 300,
    status: "offered",
    dateAdded: "2024-05-05T14:00:00Z",
    lastUpdated: "2024-05-14T19:00:00Z",
  },
  {
    id: "SVC006",
    category: "Specialized Treatment",
    name: "Braces Consultation",
    price: 200,
    status: "not_offered",
    dateAdded: "2024-05-06T15:00:00Z",
    lastUpdated: "2024-05-15T20:00:00Z",
  },
  {
    id: "SVC007",
    category: "Specialized Treatment",
    name: "Wisdom Tooth Extraction",
    price: 450,
    status: "offered",
    dateAdded: "2024-05-07T16:00:00Z",
    lastUpdated: "2024-05-16T21:00:00Z",
  },
  {
    id: "SVC008",
    category: "Cosmetic Dentistry",
    name: "Veneers",
    price: 1200,
    status: "not_offered",
    dateAdded: "2024-05-08T17:00:00Z",
    lastUpdated: "2024-05-17T22:00:00Z",
  },
];

export const ServicesManageList: React.FC<ServicesManageListProps> = ({
  services = dummyServices,
}) => {
  const [selectedServices, setSelectedServices] = useState<Set<string>>(
    new Set()
  );
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const categoryMatch =
        !categoryFilter || service.category === categoryFilter;
      const statusMatch = !statusFilter || service.status === statusFilter;
      return categoryMatch && statusMatch;
    });
  }, [services, categoryFilter, statusFilter]);

  const filteredServiceIds = useMemo(() => {
    return new Set(filteredServices.map((service) => service.id));
  }, [filteredServices]);

  const selectedFilteredServices = useMemo(() => {
    return new Set(
      Array.from(selectedServices).filter((id) => filteredServiceIds.has(id))
    );
  }, [selectedServices, filteredServiceIds]);

  const isAllSelected = useMemo(() => {
    return (
      filteredServices.length > 0 &&
      selectedFilteredServices.size === filteredServices.length
    );
  }, [filteredServices.length, selectedFilteredServices.size]);

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedServices(
          new Set([...selectedServices, ...filteredServiceIds])
        );
      } else {
        const newSelected = new Set(selectedServices);
        filteredServiceIds.forEach((id) => newSelected.delete(id));
        setSelectedServices(newSelected);
      }
    },
    [selectedServices, filteredServiceIds]
  );

  const handleSelectService = useCallback(
    (serviceId: string, checked: boolean) => {
      setSelectedServices((prev) => {
        const newSelected = new Set(prev);
        if (checked) {
          newSelected.add(serviceId);
        } else {
          newSelected.delete(serviceId);
        }
        return newSelected;
      });
    },
    []
  );

  return (
    <Card>
      <Flex direction="column" gap="4">
        <ServicesFilters
          services={services}
          onCategoryChange={setCategoryFilter}
          onStatusChange={setStatusFilter}
        />
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                />
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Service Category</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Service Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Price</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Date Added</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Last Updated</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {filteredServices.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={7}>
                  <Flex
                    direction="column"
                    align="center"
                    justify="center"
                    className="py-12 px-6"
                    gap="3"
                  >
                    <Text size="5" weight="medium" color="gray">
                      No services found
                    </Text>
                    <Text size="2" color="gray">
                      Add your first service to get started
                    </Text>
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ) : (
              filteredServices.map((service) => (
                <Table.Row key={service.id}>
                  <Table.Cell>
                    <Checkbox
                      checked={selectedServices.has(service.id)}
                      onCheckedChange={(checked) =>
                        handleSelectService(service.id, checked as boolean)
                      }
                    />
                  </Table.Cell>
                  <Table.Cell>{service.id}</Table.Cell>
                  <Table.Cell>{service.category}</Table.Cell>
                  <Table.Cell>{service.name}</Table.Cell>
                  <Table.Cell>PHP {service.price.toFixed(2)}</Table.Cell>
                  <Table.Cell>
                    {formatDateToWords(service.dateAdded)}
                  </Table.Cell>
                  <Table.Cell>
                    {formatDateToWords(service.lastUpdated)}
                  </Table.Cell>
                  <Table.Cell>
                    <AppBadge status={service.status}>
                      {service.status === "offered" ? "Offered" : "Not Offered"}
                    </AppBadge>
                  </Table.Cell>
                  <Table.Cell>
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger>
                        <IconButton variant="ghost" size="1">
                          <MoreVertical size={16} />
                        </IconButton>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Content>
                        <DropdownMenu.Item>
                          <EyeOpenIcon style={{ marginRight: 8 }} /> Edit
                        </DropdownMenu.Item>
                        <DropdownMenu.Item color="red">
                          <TrashIcon style={{ marginRight: 8 }} /> Delete
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Root>
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table.Root>
        <TablePagination
          currentPage={1}
          totalPages={25}
          onPageChange={() => null}
        />
      </Flex>
    </Card>
  );
};
