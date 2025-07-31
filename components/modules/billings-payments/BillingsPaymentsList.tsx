"use client";

import { Table, Card, Text, Flex, Checkbox, Button } from "@radix-ui/themes";
import { Eye, Trash, MoreVertical, Plus, Loader } from "lucide-react";
import { useState, useMemo, useCallback } from "react";
import { AppBadge } from "../../app/AppBadge";
import { IconButton, DropdownMenu } from "@radix-ui/themes";
import { formatDateToWords } from "@/utils/helper.utils";

interface BillingPayment {
  id: number;
  billing_id: string;
  patient_name: string;
  service_name: string;
  amount: number;
  payment_status: "paid" | "pending" | "overdue";
  payment_method: string;
  due_date: string;
  paid_date?: string;
  created_at: string;
  updated_at: string;
}

interface BillingsPaymentsListProps {
  billings?: BillingPayment[];
}

export const BillingsPaymentsList: React.FC<BillingsPaymentsListProps> = ({
  billings = [],
}) => {
  const [selectedBillings, setSelectedBillings] = useState<Set<number>>(
    new Set()
  );
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [billingsList, setBillingsList] = useState<BillingPayment[]>(billings);

  const filteredBillings = useMemo(() => {
    return billingsList.filter((billing) => {
      const statusMatch =
        !statusFilter || billing.payment_status === statusFilter;
      return statusMatch;
    });
  }, [billingsList, statusFilter]);

  const filteredBillingIds = useMemo(() => {
    return new Set(filteredBillings.map((billing) => billing.id));
  }, [filteredBillings]);

  const selectedFilteredBillings = useMemo(() => {
    return new Set(
      Array.from(selectedBillings).filter((id) => filteredBillingIds.has(id))
    );
  }, [selectedBillings, filteredBillingIds]);

  const isAllSelected = useMemo(() => {
    return (
      filteredBillings.length > 0 &&
      selectedFilteredBillings.size === filteredBillings.length
    );
  }, [filteredBillings.length, selectedFilteredBillings.size]);

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedBillings(
          new Set([...selectedBillings, ...filteredBillingIds])
        );
      } else {
        const newSelected = new Set(selectedBillings);
        filteredBillingIds.forEach((id) => newSelected.delete(id));
        setSelectedBillings(newSelected);
      }
    },
    [selectedBillings, filteredBillingIds]
  );

  const handleSelectBilling = useCallback(
    (billingId: number, checked: boolean) => {
      setSelectedBillings((prev) => {
        const newSelected = new Set(prev);
        if (checked) {
          newSelected.add(billingId);
        } else {
          newSelected.delete(billingId);
        }
        return newSelected;
      });
    },
    []
  );

  const handleEditBilling = (billing: BillingPayment) => {
    console.log("Edit billing:", billing);
  };

  const handleDeleteClick = (billing: BillingPayment) => {
    console.log("Delete billing:", billing);
  };

  const handleAddNewBilling = () => {
    console.log("Add new billing");
  };

  return (
    <Card>
      <Flex direction="column" gap="4">
        <Flex justify="between" align="center">
          <Flex gap="2">
            <Button
              size="1"
              variant={statusFilter === "paid" ? "solid" : "soft"}
              onClick={() =>
                setStatusFilter(statusFilter === "paid" ? null : "paid")
              }
            >
              Paid
            </Button>
            <Button
              size="1"
              variant={statusFilter === "pending" ? "solid" : "soft"}
              onClick={() =>
                setStatusFilter(statusFilter === "pending" ? null : "pending")
              }
            >
              Pending
            </Button>
            <Button
              size="1"
              variant={statusFilter === "overdue" ? "solid" : "soft"}
              onClick={() =>
                setStatusFilter(statusFilter === "overdue" ? null : "overdue")
              }
            >
              Overdue
            </Button>
          </Flex>
          <Button onClick={handleAddNewBilling}>
            <Plus size={16} />
            Add Billing
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
              <Table.ColumnHeaderCell>Billing ID</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Patient Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Service</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Amount</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Payment Status</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Payment Method</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Due Date</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Date Created</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {filteredBillings.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={10}>
                  <Flex
                    direction="column"
                    align="center"
                    justify="center"
                    className="py-12 px-6"
                    gap="3"
                  >
                    <Text size="5" weight="medium" color="gray">
                      No billing records found
                    </Text>
                    <Text size="2" color="gray">
                      Add your first billing record to get started
                    </Text>
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ) : (
              filteredBillings.map((billing) => (
                <Table.Row key={billing.id}>
                  <Table.Cell>
                    <Checkbox
                      checked={selectedBillings.has(billing.id)}
                      onCheckedChange={(checked) =>
                        handleSelectBilling(billing.id, checked as boolean)
                      }
                    />
                  </Table.Cell>
                  <Table.Cell>B{billing.billing_id}</Table.Cell>
                  <Table.Cell>{billing.patient_name}</Table.Cell>
                  <Table.Cell>{billing.service_name}</Table.Cell>
                  <Table.Cell>PHP {billing.amount.toLocaleString()}</Table.Cell>
                  <Table.Cell>
                    <AppBadge status={billing.payment_status}>
                      {billing.payment_status === "paid"
                        ? "Paid"
                        : billing.payment_status === "pending"
                        ? "Pending"
                        : "Overdue"}
                    </AppBadge>
                  </Table.Cell>
                  <Table.Cell>{billing.payment_method}</Table.Cell>
                  <Table.Cell>{billing.due_date}</Table.Cell>
                  <Table.Cell>
                    {formatDateToWords(billing.created_at)}
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
                          onClick={() => handleEditBilling(billing)}
                        >
                          <Eye size={15} style={{ marginRight: 8 }} /> Edit
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                          color="red"
                          onClick={() => handleDeleteClick(billing)}
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
