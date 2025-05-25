"use client";
import { Button } from "@/components/ui";
import Link from "next/link";
import { FilePenLine } from "lucide-react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useContext } from "react";
import { SectionsContext } from "../context/sectionContext";
import { Product } from "@/types/product";
import { Category } from "@/types/category";
import { Section } from "@/types/section";
import Loading from "@/components/loading";

export default function Page() {
  const { sections, categories, products, loading, error } =
    useContext(SectionsContext);

  if (loading) return <Loading />;

  if (error) return <h2>{error}</h2>;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col gap-3 bg-muted/50 rounded-xl p-5">
          <h2 className="first-letter:uppercase text-xl">secciones</h2>
          <Table className="min-w-full">
            <TableBody>
              {sections.slice(0, 4).map((section: Section) => (
                <TableRow key={section.id}>
                  <TableCell className="w-full break-words whitespace-normal first-letter:uppercase">
                    {section.title.es}
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

          <Link
            href={"/dashboard/sections"}
            className="p-0 m-0 self-end mt-auto"
          >
            <Button variant={"link"} size={"sm"} className="cursor-pointer">
              mostrar más...
            </Button>
          </Link>
        </div>
        <div className="flex flex-col gap-1 bg-muted/50 rounded-xl p-5">
          <h2 className="first-letter:uppercase text-xl">categorías</h2>
          <Table className="min-w-full">
            <TableBody>
              {categories.slice(-4).map((category: Category) => (
                <TableRow key={category.id}>
                  <TableCell className="w-full break-words whitespace-normal first-letter:uppercase">
                    {category.title.es}
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

          <Link
            href={"/dashboard/categories"}
            className="p-0 m-0 self-end mt-auto"
          >
            <Button variant={"link"} size={"sm"} className="cursor-pointer">
              mostrar más...
            </Button>
          </Link>
        </div>
        <div className="flex flex-col gap-1 bg-muted/50 rounded-xl p-5">
          <h2 className="first-letter:uppercase text-xl">productos</h2>
          <Table className="min-w-full">
            <TableBody>
              {products.slice(-4).map((product: Product) => (
                <TableRow key={product.id}>
                  <TableCell className="w-full break-words whitespace-normal first-letter:uppercase">
                    {product.title.es}
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
          <Link
            href={"/dashboard/products"}
            className="p-0 m-0 self-end mt-auto"
          >
            <Button variant={"link"} size={"sm"} className="cursor-pointer">
              mostrar más...
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
