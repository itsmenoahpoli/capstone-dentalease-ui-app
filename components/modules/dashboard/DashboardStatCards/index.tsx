import { Card, Flex } from "@radix-ui/themes";
import {
  User,
  Calendar,
  FileText,
  DollarSign,
  ArrowDownCircle,
  Package,
  PackageMinus,
  PackageX,
  Users,
  UserCircle,
  Mail,
} from "lucide-react";

const stats = [
  { title: "Total Patients", icon: User, value: 0 },
  { title: "Total Appointments", icon: Calendar, value: 0 },
  { title: "Total Prescriptions", icon: FileText, value: 0 },
  { title: "Total Income", icon: DollarSign, value: 0 },
  { title: "Total Expense", icon: ArrowDownCircle, value: 0 },
  { title: "Total Inventory", icon: Package, value: 0 },
  { title: "Inventory (Low)", icon: PackageMinus, value: 0 },
  { title: "Inventory (Out of Stock)", icon: PackageX, value: 0 },
  { title: "Total Staff Accounts", icon: Users, value: 0 },
  { title: "Total Patient Accounts", icon: UserCircle, value: 0 },
  { title: "Total Contact Us Entries", icon: Mail, value: 0 },
];

export const DashboardStatCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
      {stats.map((stat) => (
        <Card key={stat.title} className="bg-white">
          <Flex align="center" gap="4" className="p-4 min-h-[90px]">
            <Flex
              align="center"
              justify="center"
              className="w-12 h-12 rounded-full bg-indigo-50"
            >
              <stat.icon size={28} className="text-indigo-500" />
            </Flex>
            <Flex direction="column">
              <span className="text-xs text-gray-500 font-medium">
                {stat.title}
              </span>
              <span className="text-2xl font-bold text-gray-900">
                {stat.value}
              </span>
            </Flex>
          </Flex>
        </Card>
      ))}
    </div>
  );
};
