"use client";

import { Table, Card, Text, Flex, Checkbox, Button } from "@radix-ui/themes";
import { Eye, Trash, MoreVertical, Plus, Loader } from "lucide-react";
import { useState, useMemo, useCallback, useEffect } from "react";
import { AppBadge } from "../../app/AppBadge";
import ServicesFilters from "./filters/ServicesFilters";
import { IconButton, DropdownMenu } from "@radix-ui/themes";
import { formatDateToWords } from "@/utils/helper.utils";
import {
  OfferedService,
  CreateOfferedServicePayload,
  UpdateOfferedServicePayload,
} from "@/services/offered-services.service";
import offeredServicesService from "@/services/offered-services.service";
import { OfferedServiceFormModal } from "./OfferedServiceFormModal";
import { DeleteServiceModal } from "./DeleteServiceModal";
import { toast } from "react-toastify";

interface ServicesManageListProps {
  services?: OfferedService[];
}

export const ServicesManageList: React.FC<ServicesManageListProps> = ({
  services,
}) => {
  const [selectedServices, setSelectedServices] = useState<Set<number>>(
    new Set()
  );
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<
    OfferedService | undefined
  >();
  const [isLoading, setIsLoading] = useState(false);
  const [servicesList, setServicesList] = useState<OfferedService[]>(
    services || []
  );
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      if (!services || services.length === 0) {
        setIsFetching(true);
        try {
          const fetchedServices = await offeredServicesService.getAll();
          console.log("Fetched services:", fetchedServices);
          if (Array.isArray(fetchedServices)) {
            setServicesList(fetchedServices);
          } else {
            console.error("API did not return an array:", fetchedServices);
            setServicesList([]);
            toast.warning("No services found or invalid data received", {
              position: "top-center",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
          }
        } catch (error) {
          console.error("Error fetching services:", error);
          setServicesList([]);
          toast.error("Failed to load services. Please refresh the page.", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        } finally {
          setIsFetching(false);
        }
      }
    };

    fetchServices();
  }, [services]);

  const filteredServices = useMemo(() => {
    if (!Array.isArray(servicesList)) {
      return [];
    }
    return servicesList.filter((service) => {
      const categoryMatch =
        !categoryFilter || service.category === categoryFilter;
      const statusMatch = !statusFilter || service.status === statusFilter;
      return categoryMatch && statusMatch;
    });
  }, [servicesList, categoryFilter, statusFilter]);

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
    (serviceId: number, checked: boolean) => {
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

  const handleCreateService = async (payload: CreateOfferedServicePayload) => {
    setIsLoading(true);
    try {
      const newService = await offeredServicesService.create(payload);
      setServicesList((prev) => [...prev, newService]);
      toast.success("Service created successfully!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error("Error creating service:", error);
      toast.error("Failed to create service. Please try again.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateService = async (payload: UpdateOfferedServicePayload) => {
    if (!selectedService) return;

    setIsLoading(true);
    try {
      const updatedService = await offeredServicesService.update(
        selectedService.id,
        payload
      );
      setServicesList((prev) =>
        prev.map((service) =>
          service.id === selectedService.id ? updatedService : service
        )
      );
      toast.success("Service updated successfully!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error("Error updating service:", error);
      toast.error("Failed to update service. Please try again.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteService = async () => {
    if (!selectedService) return;

    setIsLoading(true);
    try {
      await offeredServicesService.delete(selectedService.id);
      setServicesList((prev) =>
        prev.filter((service) => service.id !== selectedService.id)
      );
      toast.success("Service deleted successfully!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error("Error deleting service:", error);
      toast.error("Failed to delete service. Please try again.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditService = (service: OfferedService) => {
    setSelectedService(service);
    setIsFormModalOpen(true);
  };

  const handleDeleteClick = (service: OfferedService) => {
    setSelectedService(service);
    setIsDeleteModalOpen(true);
  };

  const handleAddNewService = () => {
    setSelectedService(undefined);
    setIsFormModalOpen(true);
  };

  return (
    <Card>
      <Flex direction="column" gap="4">
        <Flex justify="between" align="center">
          <ServicesFilters
            services={servicesList}
            onCategoryChange={setCategoryFilter}
            onStatusChange={setStatusFilter}
          />
          <Button onClick={handleAddNewService}>
            <Plus size={16} />
            Add Service
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
            {isFetching ? (
              <Table.Row>
                <Table.Cell colSpan={9}>
                  <Flex
                    direction="column"
                    align="center"
                    justify="center"
                    className="py-12 px-6"
                    gap="3"
                  >
                    <Loader className="animate-spin" size={32} />
                    <Text size="3" weight="medium" color="gray">
                      Loading services...
                    </Text>
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ) : filteredServices.length === 0 ? (
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
                  <Table.Cell>SV{service.id}</Table.Cell>
                  <Table.Cell>{service.category}</Table.Cell>
                  <Table.Cell>{service.name}</Table.Cell>
                  <Table.Cell>PHP {service.price}</Table.Cell>
                  <Table.Cell>
                    {formatDateToWords(service.created_at)}
                  </Table.Cell>
                  <Table.Cell>
                    {formatDateToWords(service.updated_at)}
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
                        <DropdownMenu.Item
                          onClick={() => handleEditService(service)}
                        >
                          <Eye size={15} style={{ marginRight: 8 }} /> Edit
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                          color="red"
                          onClick={() => handleDeleteClick(service)}
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

      <OfferedServiceFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={selectedService ? handleUpdateService : handleCreateService}
        service={selectedService}
        isLoading={isLoading}
      />

      <DeleteServiceModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteService}
        service={selectedService}
        isLoading={isLoading}
      />
    </Card>
  );
};
