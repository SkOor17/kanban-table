"use client";

import { ColInt } from "@/lib/dico";
import ColumnKanban from "../components/ColumnKanban";
import AddColumn from "../components/AddColumn";
import { useState } from "react";

export default function Page() {
  const datasInit: Array<ColInt> = [
    {
      id: 0,
      title: "Pro",
      color: "red",
      cards: [
        {
          id: 1,
          title: "Postuler",
          nbCol: 0
        },
        {
          id: 2,
          title: "Faire devoirs",
          nbCol: 0
        },
        {
          id: 3,
          title: "Ranger",
          nbCol: 0
        },
      ],
    },
    {
      id: 1,
      title: "Perso",
      color: "blue",
      cards: [
        {
          id: 4,
          title: "Cuisiner",
          nbCol: 1
        },
        {
          id: 5,
          title: "poubelles",
          nbCol: 1
        },
      ],
    },
  ];

  const [datas, setDatas] = useState(datasInit);

  return (
    <div className='p-6 w-screen h-screen min-h-fit flex gap-4'>
      {datas.map((col, i) => {
        return (
          <ColumnKanban
            key={i}
            cards={col.cards}
            color={col.color}
            title={col.title}
            id={col.id}
            setDatas={setDatas}
          />
        );
      })}
      <AddColumn setDatas={setDatas} />
    </div>
  );
}
