"use client";

import { CardInt, ColInt } from "@/lib/dico";
import React, { Dispatch, SetStateAction } from "react";
import Card from "./Card";
import AddCard from "./AddCard";

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
  // Set color
  let mainColor = "";
  let secondaryColor = "";
  switch (color) {
    case "blue":
      mainColor = `bg-blue-200/70`;
      secondaryColor = "bg-blue-50";
      break;
    case "red":
      mainColor = "bg-red-200/70";
      secondaryColor = "bg-red-50";
      break;
    case "green":
      mainColor = "bg-green-200/70";
      secondaryColor = "bg-green-50";
      break;

    default:
      break;
  }

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
  };

  const handleDragEnd = () => {
    removeOpacityIndicators();
  };

  return (
    <div
      className={`min-w-[300px] min-h-fit h-full flex flex-col py-2 px-3 gap-2 ${secondaryColor} rounded-md`}
      onDragEnter={(e) => handleEnter(e)}
      onDragOver={(e) => handleDragOver(e)}
      onDragEnd={handleDragEnd}
      onDrop={(e) => handleDrop(e, id.toString())}
    >
      <p className={`rounded-md ${mainColor} px-3 py-1 w-fit`}>{title}</p>
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
