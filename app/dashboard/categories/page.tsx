"use client";
import { SectionsContext } from "@/app/context/sectionContext";
import { Button, Label } from "@/components/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Category } from "@/types/category";
import { FilePenLine, FilePlus2 } from "lucide-react";
import Link from "next/link";
import { useContext } from "react";

export default function Categories() {
  const { categories} = useContext(SectionsContext);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0 ">
      <div className="flex items-center self-end gap-3 px-4">
        <Label className="flex-row items-center font-normal">
          crear categoría
          <Link href={`/dashboard/categories/create`}>
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
            {categories.map((category: Category) => (
              <TableRow key={category.id}>
                <TableCell className="w-full break-words whitespace-normal capitalize">
                  {category.title.es}
                </TableCell>
                <TableCell className="relative">
                  <div
                    className={`w-3 h-3 absolute inset-0 m-auto rounded-full ${
                      category.isactive ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></div>
                </TableCell>
                <TableCell>
                  <Link href={`/dashboard/categories/${category.id}`}>
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
