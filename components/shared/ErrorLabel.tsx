import React from "react";

type ErrorLabelProps = {
  message?: string;
};

export default function ErrorLabel({ message }: ErrorLabelProps) {
  if (!message) return null;
  return <p className="text-red-300">{message}</p>;
}
