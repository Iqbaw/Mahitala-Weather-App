import { useState, useEffect } from "react";

const useCurrentTimestamp = () => {
  const [timestamp, setTimestamp] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimestamp(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formattedTimestamp = () => {
    const currentDate = new Date(timestamp);

    const day = currentDate.toLocaleString("id-ID", { weekday: "long" });
    const date = currentDate.toLocaleString("id-ID", { day: "numeric" });
    const month = currentDate.toLocaleString("id-ID", { month: "long" });
    const year = currentDate.getFullYear();
    const hours = String(currentDate.getHours()).padStart(2, "0");
    const minutes = String(currentDate.getMinutes()).padStart(2, "0");
    const time = `${hours}:${minutes}`;

    return {
      day,
      date,
      month,
      year,
      time,
    };
  };

  return formattedTimestamp();
};

export default useCurrentTimestamp;
