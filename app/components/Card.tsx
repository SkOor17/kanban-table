"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import EditIcon from "./icons/EditIcon";
import TrashIcon from "./icons/TrashIcon";
import { CardInt, ColInt } from "@/lib/dico";

export default function Card({
  card,
  setDatas,
}: {
  card: CardInt;
  setDatas: Dispatch<SetStateAction<ColInt[]>>;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(card.title);

  const handleDelete = () => {
    setDatas((prevDatas) =>
      prevDatas.map((col) => {
        if (col.id === card.nbCol) {
          return {
            ...col,
            cards: col.cards.filter((c) => c.id !== card.id), // Supprime la carte avec l'ID correspondant
          };
        }
        return col;
      })
    );
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setDatas((prevDatas) =>
      prevDatas.map((col) => {
        if (col.id === card.nbCol) {
          return {
            ...col,
            cards: col.cards.map((c) =>
              c.id === card.id ? { ...c, title: newTitle } : c
            ),
          };
        }
        return col;
      })
    );
    setIsEditing(false);
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    card: CardInt
  ) => {
    e.dataTransfer.setData("cardId", card.id.toString());
  };

  return (
    <div
      className='flex items-center w-full min-h-[50px] h-fit rounded border py-2 px-3 text-wrap cursor-pointer relative bg-white drop-shadow hover:bg-gray-100'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDragStart={(e) => handleDragStart(e, card)}
      draggable
    >
      <div
        className={`absolute right-3 top-2 flex rounded-md transition-opacity duration-200 ease-in-out ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          className='w-8 h-8 p-1 rounded-md bg-white flex justify-center items-center border hover:bg-gray-100'
          onClick={handleEdit}
        >
          <EditIcon />
        </div>
        <div
          className='w-8 h-8 p-1 rounded-md bg-white flex justify-center items-center border hover:bg-gray-100'
          onClick={handleDelete}
        >
          <TrashIcon />
        </div>
      </div>

      {isEditing ? (
        <input
          type='text'
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onBlur={handleSave} // Sauvegarde lorsqu'on sort du champ
          onKeyDown={(e) => e.key === "Enter" && handleSave()} // Sauvegarde avec Entrée
          autoFocus
          className='appearance-none border-none outline-none bg-transparent p-0 m-0 w-full'
        />
      ) : (
        <p>{card.title}</p>
      )}
    </div>
  );
}
