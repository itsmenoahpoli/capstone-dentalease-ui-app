import React from "react";
import { Flex } from "@radix-ui/themes";

type PageHeaderProps = {
  title: string;
  description: string;
  children?: React.ReactNode;
};

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <Flex justify="between" className="mb-4">
      <Flex direction="column">
        <h1 className="text-xl text-gray-900 font-bold">{title}</h1>
        <p className="text-sm text-gray-500">{description}</p>
      </Flex>
      {children}
    </Flex>
  );
};
