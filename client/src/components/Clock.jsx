import React, { useEffect, useState } from "react";

const Clock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // update every second

    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  const formattedTime = currentTime.toLocaleTimeString();
  const formattedDate = currentTime.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="text-center">
      <p className="text-[12px] font-semibold">{formattedDate}</p>
      <p className="text-1xl font-bold mt-1">{formattedTime}</p>
    </div>
  );
};

export default Clock;
