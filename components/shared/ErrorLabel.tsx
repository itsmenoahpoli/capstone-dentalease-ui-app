import React from "react";

type ErrorLabelProps = {
  message?: string;
};

export const ErrorLabel: React.FC<ErrorLabelProps> = ({ message }) => {
  if (!message) return null;
  return <p className="text-xs text-red-500">{message}</p>;
};
