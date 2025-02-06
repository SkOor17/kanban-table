"use client";

import { CardInt, ColInt } from "@/lib/dico";
import React, { Dispatch, SetStateAction, useState } from "react";
import Card from "./Card";
import AddCard from "./AddCard";
import EditIcon from "./icons/EditIcon";
import TrashIcon from "./icons/TrashIcon";
import clsx from "clsx";

export default function ColumnKanban({
  cards,
  color,
  title,
  id,
  setDatas,
}: {
  cards: Array<CardInt>;
  color: "blue" | "red" | "green";
  title: string;
  id: number;
  setDatas: Dispatch<SetStateAction<ColInt[]>>;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditPopupVisible, setIsEditPopupVisible] = useState(false);
  const [selectedColor, setSelectedColor] = useState(color);  

  const getIndicators = () => {
    return Array.from(
      document.querySelectorAll("[id=indicators]")
    ) as HTMLElement[];
  };

  const getColumnIndicators = () => {
    const indicators = getIndicators();
    const filteredIndicators = indicators.filter((ind) => {
      return ind.getAttribute("data-column") === id.toString();
    });
    return filteredIndicators;
  };

  const getNearestIndicator = (posY: number) => {
    const filteredIndicators = getColumnIndicators();

    const nearestIndicator = filteredIndicators.reduce<HTMLElement | null>(
      (closest, ind) => {
        const indicatorPosY = ind.getBoundingClientRect().top;
        const diff = Math.abs(indicatorPosY - posY);

        if (
          !closest ||
          diff < Math.abs(closest.getBoundingClientRect().top - posY)
        ) {
          return ind;
        }

        return closest;
      },
      null
    );

    return nearestIndicator;
  };

  const removeOpacityIndicators = () => {
    const indicators = getIndicators();
    indicators.forEach((ind) => {
      ind.style.opacity = "0";
    });
  };

  const handleEnter = (e: React.DragEvent<HTMLDivElement>) => {
    // Get nearest indicator
    const posY = e.clientY;
    const nearestIndicator = getNearestIndicator(posY);

    // Apply opacity
    removeOpacityIndicators();
    if (nearestIndicator) nearestIndicator.style.opacity = "100";
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, newColNb: string) => {
    e.preventDefault();
    removeOpacityIndicators();

    const posY = e.clientY;
    const nearestIndicator = getNearestIndicator(posY);
    const idIndicator = nearestIndicator?.getAttribute("data-id");

    const cardId = e.dataTransfer.getData("cardId");
    console.log(
      cardId,
      "laché sur colonne: ",
      newColNb,
      "avec indicateur",
      idIndicator
    );

    setDatas((prev) => {
      let isGoingUp = false;
      let currentCard: CardInt|null = null;
      let currentColIndex: number;
      let currentIndex: number

      const res = prev.map((col) => {
        // On cherche la card pour stocker son ancienne colonne et son ancienne place 
        const card = col.cards.find((c) => c.id === +cardId);
        if (card) {
          currentCard = card;
          currentColIndex = col.id;
          currentIndex = col.cards.findIndex((c) => c.id === card.id);
        }

        // Supprimer la carte de sa colonne d'origine
        return {
          ...col,
          cards: col.cards.filter((c) => c.id !== +cardId),
        };
      });
    
      if (!currentCard || !idIndicator) return prev;
    
      // On insert la card à sa nouvelle place
      return res.map((col) => {
        if (col.id === +newColNb && currentCard) {
          // On -1 dans le seul cas où on monte dans la même colonne
          // On doit donc vérifier si il monte et si il change de colonne
          isGoingUp = currentColIndex === col.id && currentIndex < +idIndicator;
          const index = isGoingUp ? +idIndicator - 1 : +idIndicator;
          
          // On insert la card à index
          const updatedCards = [...col.cards];
          updatedCards.splice(index, 0, currentCard);
          return {
            ...col,
            cards: updatedCards,
          };
        }
        return col;
      });
    });
  };

  const handleDragEnd = () => {
    removeOpacityIndicators();
  };

  function handleDelete(): void {
    setDatas((prevDatas) => {
      const res = prevDatas.filter((col) => {
        return col.id !== id
      }) 
      return res;
    });
    console.log(color);
  }

  function handleEdit(): void {
    setIsEditPopupVisible(true);
  }

  const handleColorChange = (color: "green" | "red" | "blue") => {
    setSelectedColor(color);
    setIsEditPopupVisible(false);
  };

  return (
    <div
      className={clsx(
        "min-w-[300px] min-h-fit h-full flex flex-col py-2 px-3 gap-2 rounded-md relative",
        {
          "bg-red-50": selectedColor === "red",
          "bg-blue-50": selectedColor === "blue",
          "bg-green-50": selectedColor === "green",
        }
      )}
      onDragEnter={(e) => handleEnter(e)}
      onDragOver={(e) => handleDragOver(e)}
      onDragEnd={handleDragEnd}
      onDrop={(e) => handleDrop(e, id.toString())}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Actions icons */}
      <div
        className={`absolute right-3 top-2 flex rounded-md transition-opacity duration-200 ease-in-out ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          className='w-8 h-8 p-1 rounded-md bg-white flex justify-center items-center border hover:bg-gray-100 cursor-pointer'
          onClick={handleEdit}
        >
          <EditIcon />
        </div>
        <div
          className='w-8 h-8 p-1 rounded-md bg-white flex justify-center items-center border hover:bg-gray-100 cursor-pointer'
          onClick={handleDelete}
        >
          <TrashIcon />
        </div>
      </div>

      {isEditPopupVisible && (
        <div className='fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-white p-4 rounded-md'>
            <h2>Select a color</h2>
            <div className='flex gap-2 mt-2'>
              <button
                className='bg-red-200 w-8 h-8'
                onClick={() => handleColorChange("red")}
              ></button>
              <button
                className='bg-blue-200 w-8 h-8'
                onClick={() => handleColorChange("blue")}
              ></button>
              <button
                className='bg-green-200 w-8 h-8'
                onClick={() => handleColorChange("green")}
              ></button>
            </div>
          </div>
        </div>
      )}

      <p
        className={clsx("rounded-md px-3 py-1 w-fit", {
          "bg-red-200": selectedColor === "red",
          "bg-blue-200": selectedColor === "blue",
          "bg-green-200": selectedColor === "green",
        })}
      >
        {title}
      </p>
      <div>
        {cards.map((c, index) => {
          return (
            <div key={c.id}>
              <Card
                card={c}
                setDatas={setDatas}
              />
              <div
                id='indicators'
                data-id={index + 1}
                data-column={id}
                className='w-full h-1 my-1 bg-blue-200 opacity-0'
              ></div>
            </div>
          );
        })}
        {cards.length === 0 && (
          <div
            id='indicators'
            data-id={0}
            data-column={id}
            className='w-full h-1 my-1 bg-blue-200 opacity-0'
          ></div>
        )}
        <AddCard
          setDatas={setDatas}
          column={id}
        />
      </div>
    </div>
  );
}
