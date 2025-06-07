"use client";
import { SectionsContext } from "@/app/context/section-context";
import { Button, Label } from "@/components/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Section } from "@/types/section";
import { FilePenLine, FilePlus2 } from "lucide-react";
import Link from "next/link";
import { useContext } from "react";

export default function Sections() {
  const { sections } = useContext(SectionsContext);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0 ">
      <div className="flex items-center self-end gap-3 px-4">
        <Label className="flex-row items-center font-normal">
          crear sección
          <Link href={`/dashboard/sections/create`}>
            <Button variant={"outline"} size={"icon"}>
              <FilePlus2 />
            </Button>
          </Link>
        </Label>
      </div>
      <div className="bg-muted/50 flex-1 rounded-xl p-5 max-w-screen overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead>título</TableHead>
              <TableHead>status</TableHead>
              <TableHead>acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sections.map((section: Section) => (
              <TableRow key={section.id}>
                <TableCell className="w-full break-words whitespace-normal first-letter:uppercase">
                  {section.title.es}
                </TableCell>
                <TableCell className="relative">
                  <div
                    className={`w-3 h-3 absolute inset-0 m-auto rounded-full ${
                      section.isactive ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></div>
                </TableCell>
                <TableCell>
                  <Link href={`/dashboard/sections/${section.id}`}>
                    <Button size={"icon"} variant={"outline"}>
                      <FilePenLine />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
