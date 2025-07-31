import { Badge } from "@radix-ui/themes";

interface AppBadgeProps {
  status:
    | "offered"
    | "not_offered"
    | "active"
    | "inactive"
    | "pending"
    | "completed"
    | "new"
    | "in_progress"
    | "resolved"
    | "closed"
    | "low"
    | "medium"
    | "high"
    | "urgent"
    | "paid"
    | "overdue"
    | "published"
    | "draft"
    | "archived"
    | "services"
    | "contact"
    | "general"
    | "policies"
    | "service"
    | "technology"
    | "facility"
    | "staff"
    | "in_stock"
    | "low_stock"
    | "out_of_stock"
    | "discontinued"
    | "training"
    | "maintenance";
  children: React.ReactNode;
}

export const AppBadge = ({ status, children }: AppBadgeProps) => {
  const getBadgeStyles = () => {
    switch (status) {
      case "offered":
      case "active":
      case "resolved":
      case "completed":
      case "paid":
      case "published":
      case "in_stock":
        return {
          backgroundColor: "#dcfce7",
          border: "1px solid #dcfce7",
          color: "#166534",
        };
      case "not_offered":
      case "inactive":
      case "closed":
      case "archived":
      case "out_of_stock":
      case "discontinued":
        return {
          backgroundColor: "#f3f4f6",
          border: "1px solid #f3f4f6",
          color: "#6b7280",
        };
      case "pending":
      case "new":
      case "draft":
      case "low":
        return {
          backgroundColor: "#fef3c7",
          border: "1px solid #fef3c7",
          color: "#92400e",
        };
      case "in_progress":
      case "medium":
      case "training":
        return {
          backgroundColor: "#dbeafe",
          border: "1px solid #dbeafe",
          color: "#1e40af",
        };
      case "high":
      case "urgent":
        return {
          backgroundColor: "#fef2f2",
          border: "1px solid #fef2f2",
          color: "#dc2626",
        };
      case "low_stock":
      case "maintenance":
        return {
          backgroundColor: "#fef3c7",
          border: "1px solid #fef3c7",
          color: "#92400e",
        };
      default:
        return {
          backgroundColor: "#f3f4f6",
          border: "1px solid #f3f4f6",
          color: "#6b7280",
        };
    }
  };

  const getBadgeColor = () => {
    switch (status) {
      case "offered":
      case "active":
      case "resolved":
      case "completed":
      case "paid":
      case "published":
      case "in_stock":
        return "green";
      case "not_offered":
      case "inactive":
      case "closed":
      case "archived":
      case "out_of_stock":
      case "discontinued":
        return "gray";
      case "pending":
      case "new":
      case "draft":
      case "low":
      case "low_stock":
      case "maintenance":
        return "yellow";
      case "in_progress":
      case "medium":
      case "training":
        return "blue";
      case "high":
      case "urgent":
        return "red";
      default:
        return "gray";
    }
  };

  return (
    <Badge color={getBadgeColor()} variant="soft" style={getBadgeStyles()}>
      {children}
    </Badge>
  );
};
