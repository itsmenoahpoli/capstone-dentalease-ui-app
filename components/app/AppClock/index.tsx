"use client";

import React, { useState, useEffect } from "react";
import dayjs from "dayjs";

const format = "MMMM D, YYYY";

export const AppClock: React.FC = () => {
  const [now, setNow] = useState(dayjs().format(format));

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(dayjs().format(format));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <p className="text-xs text-gray-500">{now}</p>;
};
