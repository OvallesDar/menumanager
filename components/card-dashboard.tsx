import Link from "next/link";
import { Button } from "./ui";
import { Table, TableBody, TableCell, TableRow } from "./ui/table";
import { FilePenLine } from "lucide-react";
import { Section } from "@/types/section";
import { Category } from "@/types/category";
import { Product } from "@/types/product";

type CardDashboardProps = {
  items: (Section | Category | Product)[];
  title: string;
  basepath: string;
};

export default function CardDashboard({
  items,
  title,
  basepath,
}: CardDashboardProps) {
  return (
    <div className="flex flex-col gap-1 bg-muted/50 rounded-xl p-5">
      <h2 className="first-letter:uppercase text-xl">{title}</h2>
      <Table className="min-w-full">
        <TableBody>
          {items.slice(-4).map((item) => (
            <TableRow key={item.id}>
              <TableCell className="w-full break-words whitespace-normal first-letter:uppercase">
                {item.title.es}
              </TableCell>
              <TableCell>
                <Link href={`/dashboard/${basepath}/${item.id}`}>
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
        href={`/dashboard/${basepath}`}
        className="p-0 m-0 self-end mt-auto"
      >
        <Button variant={"link"} size={"sm"} className="cursor-pointer">
          mostrar más...
        </Button>
      </Link>
    </div>
  );
}
