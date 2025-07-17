import React from "react";
import { Table, Card } from "@radix-ui/themes";
import { MoreHorizontal } from "lucide-react";
import dayjs from "dayjs";

const appointments = [
  {
    name: "John Doe",
    email: "john.doe@example.com",
    contact: "123-456-7890",
    date: "2025-07-10",
    status: "pending",
  },
  {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    contact: "987-654-3210",
    date: "2025-07-11",
    status: "pending",
  },
  {
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    contact: "555-123-4567",
    date: "2025-07-12",
    status: "cancelled",
  },
];

export const DashboardNearAppointments: React.FC = () => {
  return (
    <Card className="p-0 bg-white rounded-lg w-full">
      <div className="!p-2 border-b border-gray-200">
        <h1 className="font-bold text-lg text-gray-600">
          Upcoming Appointments
        </h1>
      </div>
      <Table.Root className="min-w-[700px] w-full">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell className="px-4 py-3 text-left !text-xs text-gray-500">
              Patient Name
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="px-4 py-3 text-left !text-xs text-gray-500">
              Email & Contact
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="px-4 py-3 text-left !text-xs text-gray-500">
              Appointment Date
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="px-4 py-3 text-left !text-xs text-gray-500">
              Status
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="px-4 py-3 text-center"></Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {appointments.map((appt, idx) => (
            <Table.Row key={idx}>
              <Table.RowHeaderCell className="px-4 py-3 text-sm text-gray-900 font-normal">
                {appt.name}
              </Table.RowHeaderCell>
              <Table.Cell className="px-4 py-3 text-xs text-gray-700">
                {appt.email}
                <br />
                {appt.contact}
              </Table.Cell>
              <Table.Cell className="px-4 py-3 text-sm text-gray-700">
                {dayjs(appt.date).format("MMMM D, YYYY")}
                <span className="inline-block ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-800 border border-blue-300">
                  {dayjs(appt.date).diff(dayjs(), "day")}d
                </span>
              </Table.Cell>
              <Table.Cell className="px-4 py-3 text-sm">
                <span
                  className={`px-3 py-1 rounded-full font-medium text-[10px] border
                    ${
                      appt.status === "cancelled"
                        ? "bg-red-50 text-red-500 border-red-200"
                        : appt.status === "pending"
                        ? "bg-yellow-50 text-yellow-600 border-yellow-200"
                        : "bg-gray-50 text-gray-500 border-gray-200"
                    }
                  `}
                >
                  {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                </span>
              </Table.Cell>
              <Table.Cell className="px-4 py-3 text-center">
                <MoreHorizontal size={18} className="mx-auto text-gray-400" />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Card>
  );
};
