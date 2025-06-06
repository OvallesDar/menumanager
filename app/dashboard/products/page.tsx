"use client";
import { Button, Label } from "@/components/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilePenLine, FilePlus2 } from "lucide-react";
import React, { useContext, useState } from "react";
import Link from "next/link";
import { SectionsContext } from "@/app/context/sectionContext";
import { Category } from "@/types/category";
import { Product } from "@/types/product";

export default function Products() {
  const { categories } = useContext(SectionsContext);

  const [filters, setFilters] = useState({
    category: "all",
  });

  const filteredCategories = categories.filter(
    (category: Category) => filters.category === "all" || category.id === filters.category
  );

  const handleChange = (value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      category: value,
    }));
    window.scrollTo(0, 0);
  };

  return (
    <div className="flex flex-col">
      <form className="p-4">
        <Label className="flex-row items-center">
          filtrar por categoría:
          <Select
            name="category"
            onValueChange={handleChange}
            defaultValue={filters.category}
          >
            <SelectTrigger className="w-[250px] capitalize" name="category">
              <SelectValue placeholder="Filter by categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="capitalize" value="all">todas las categorías</SelectItem>
              {categories.map((category: Category) => (
                <SelectItem
                  className="capitalize"
                  key={category.id}
                  value={category.id!}
                >
                  {category.title.es}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Label>
      </form>
      <div className="flex items-center self-end gap-3 px-4">
        <Label className="flex-row items-center font-normal">
          crear producto
          <Link href={`/dashboard/products/create`}>
            <Button variant={"outline"} size={"icon"}>
              <FilePlus2 />
            </Button>
          </Link>
        </Label>
      </div>
      {filteredCategories.map((category: Category) => (
        <section key={category.id} className="flex flex-col gap-4">
          <h2
            className={`text-lg pl-4 first-letter:uppercase ${
              category.isactive ? "text-black" : "text-red-600"
            }`}
          >
            {category.title.es}
          </h2>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="bg-muted/50 flex-1 max-w-screen overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>título</TableHead>
                    <TableHead>precio</TableHead>
                    <TableHead>status</TableHead>
                    <TableHead>acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {category.products?.map((product: Product) => (
                    <TableRow key={product.id}>
                      <TableCell className="w-full break-words whitespace-normal first-letter:uppercase">
                        {product.title.es}
                      </TableCell>
                      <TableCell className="text-right ">
                        {product.price + "€"}
                      </TableCell>
                      <TableCell className="relative">
                        <div
                          className={`w-3 h-3 absolute inset-0 m-auto rounded-full ${
                            product.isactive ? "bg-green-500" : "bg-red-500"
                          }`}
                        ></div>
                      </TableCell>
                      <TableCell>
                        <Link href={`/dashboard/products/${product.id}`}>
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
        </section>
      ))}
    </div>
  );
}
