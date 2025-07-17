import { Badge } from "@radix-ui/themes";

interface AppBadgeProps {
  status:
    | "offered"
    | "not_offered"
    | "active"
    | "inactive"
    | "pending"
    | "completed";
  children: React.ReactNode;
}

export const AppBadge = ({ status, children }: AppBadgeProps) => {
  const getBadgeStyles = () => {
    switch (status) {
      case "offered":
      case "active":
        return {
          backgroundColor: "#dcfce7",
          border: "1px solid #dcfce7",
          color: "#166534",
        };
      case "not_offered":
      case "inactive":
        return {
          backgroundColor: "#f3f4f6",
          border: "1px solid #f3f4f6",
          color: "#6b7280",
        };
      case "pending":
        return {
          backgroundColor: "#fef3c7",
          border: "1px solid #fef3c7",
          color: "#92400e",
        };
      case "completed":
        return {
          backgroundColor: "#dbeafe",
          border: "1px solid #dbeafe",
          color: "#1e40af",
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
        return "green";
      case "not_offered":
      case "inactive":
        return "gray";
      case "pending":
        return "yellow";
      case "completed":
        return "blue";
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
