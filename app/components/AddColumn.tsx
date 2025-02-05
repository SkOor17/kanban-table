"use client"
import { ColInt } from "@/lib/dico";
import React, { Dispatch, SetStateAction } from "react";

export default function AddColumn(
  {setDatas}:
  {setDatas: Dispatch<SetStateAction<ColInt[]>>;}
) {
  const handleClick = () => {
    console.log("add column");
    const newCol: ColInt = {
      id: Date.now(),
      title: "New",
      color: "green",
      cards: []
    }

    setDatas((prev) => {
      return [...prev, newCol]
    })
  };

  return (
    <div
      className='w-fit h-fit rounded-md border border-gray-300 py-1 px-4 cursor-pointer hover:bg-gray-100'
      onClick={handleClick}
    >
      <p className='text-gray-400'>+ New</p>
    </div>
  );
}
