"use client";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import {
  MdOutlineSportsTennis,
  MdSportsCricket,
  MdSportsSoccer,
} from "react-icons/md";
export default function CardsPlay() {
  return (
    <div className="max-w-xl mx-auto pt-20 gap-3 grid ">
      <Card className="relative overflow-hidden p-0 max-h-[300px]">
        <Image
          src="/turf-image.jpg"
          alt="Turf Image"
          height={300}
          width={300}
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-neutral-900/30 w-full h-full">
          <CardHeader className="p-0">
            <div className="flex flex-col justify-center gap-2 bg-neutral-900/40 dark:bg-neutral-100/20 border border-neutral-600 w-fit rounded-br-xl p-2">
              <MdSportsCricket className="size-10 text-neutral-300 dark:text-neutral-700" />
              <MdSportsSoccer className="size-10 text-neutral-300 dark:text-neutral-700" />
              <MdOutlineSportsTennis className="size-10 text-neutral-300 dark:text-neutral-700" />
            </div>
            <button className="absolute cursor-pointer top-2 right-2 p-1 bg-black/40 rounded-full flex items-center justify-center shadow-md border border-neutral-200/30">
              <ChevronRight className="text-lime-400 size-10" />
            </button>
          </CardHeader>
          <CardFooter>
            <CardTitle className="absolute bottom-0 [noise:10%] left-0 text-3xl text-center text-neutral-400 bg-primary-foreground/10 px-3 py-1 rounded-b-xl w-full">
              Victory Turf
            </CardTitle>
          </CardFooter>
        </div>
      </Card>
      <Card className="relative overflow-hidden p-0 max-h-[300px]">
        <Image
          src="/turf-image.jpg"
          alt="Turf Image"
          height={300}
          width={300}
          className="object-cover w-full h-full"
        />
      </Card>
    </div>
  );
}
