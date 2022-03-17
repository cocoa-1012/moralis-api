import { useEffect, useState } from "react";

export const InputComponent = () => {
  const [collection, setCollection] = useState("");
  const [expDate, setExpDate] = useState("");
  const [expTime, setExpTime] = useState("");
  useEffect(() => {
    console.log("Date", expDate);
    console.log("Time", expTime);
    console.log("Collection", collection);
  });
  return (
    <>
      <div className="flex justify-center w-full items-center pt-16">
        <p className="text-white text-2xl font-semibold w-[300px]">
          Select Date and Time: &nbsp;
        </p>
        <input
          type="date"
          className="px-2 outline-none rounded"
          onChange={(e) => setExpDate(e.target.value)}
        />
        <input
          type="time"
          className="px-2 mx-2 outline-none rounded"
          onChange={(e) => setExpTime(e.target.value)}
        />
        <button className="text-white bg-red-400 w-20 rounded">Set</button>
      </div>
      <div className="flex justify-center w-full items-center py-4">
        <p className="text-white text-2xl font-semibold w-[300px]">
          Input Collestion: &nbsp;
        </p>
        <input
          type="text"
          className="px-2 outline-none rounded w-[310px] mr-2"
          onChange={(e) => setCollection(e.target.value)}
        />
        <button className="text-white bg-red-400 w-20 rounded">Filter</button>
      </div>
    </>
  );
};
