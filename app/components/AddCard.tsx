"use client";
import { CardInt, ColInt } from "@/lib/dico";
import React, { Dispatch, SetStateAction } from "react";

export default function AddCard({
  setDatas,
  column,
}: {
  setDatas: Dispatch<SetStateAction<ColInt[]>>;
  column: number;
}) {
  const handleClick = () => {
    console.log("add card sur col", column);
    const newCard: CardInt = {
      id: Date.now(),
      title: "Nouvelle carte",
      nbCol: column
    };

    setDatas((prevDatas) =>
      prevDatas.map((col) => {
        if (col.id === column) {
          return {
            ...col,
            cards: [...col.cards, newCard], // Ajouter la nouvelle carte
          };
        }
        return col; // Laisser les autres colonnes inchangées
      })
    );
  };

  return (
    <div
      className='flex items-center w-full min-h-[50px] h-fit rounded border border-gray-300 py-2 px-3 text-wrap cursor-pointer relative hover:bg-gray-100'
      onClick={handleClick}
    >
      <p className='text-gray-400'>+ New</p>
    </div>
  );
}
