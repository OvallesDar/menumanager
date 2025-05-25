"use client";
import { Button, Label } from "@/components/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { SectionsContext } from "@/app/context/sectionContext";
import { usePathname, useRouter } from "next/navigation";
import { Section } from "@/types/section";
import { Category } from "@/types/category";
import Loading from "@/components/loading";

export default function EditCategory() {
  const { sections, categories, updateCategory } = useContext(SectionsContext);
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState(true);
  const [categoryUpdate, setCategoryUpdate] = useState<Category | null>(null);
  const params = usePathname();
  const id = params.split("/").at(-1);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    if (id && categories.length === 0) {
      setCategoryUpdate(null);
      setLoading(false);
      return;
    }

    const category = categories.find(
      (category: Category) => category.id === id
    );
    if (category) {
      setCategoryUpdate(category);
    } else {
      setCategoryUpdate(null);
    }
    setLoading(false);
  }, [id, categories]);

  const handleChange = (
    event: React.ChangeEvent<HTMLTextAreaElement> | boolean | string,
    name: string
  ) => {
    const value =
      typeof event === "string" || typeof event === "boolean"
        ? event
        : event.target.value;

    if (!categoryUpdate) return;

    setCategoryUpdate((prevData) => {
      if (!prevData) return prevData;
      if (name === "es" || name === "en" || name === "fr") {
        return {
          ...prevData,
          title: {
            ...prevData.title,
            [name]: value,
          },
        };
      }

      return {
        ...prevData,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch(`/api/categories/${id}`, {
        method: "put",
        body: JSON.stringify(categoryUpdate),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }
      updateCategory(data);
      router.push("/dashboard/categories");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Unknown Error");
      }
    } finally {
      setLoading(false);
    }
  };
  if (loading) return <Loading />;

  if (categoryUpdate == null) {
    return <h2>No existe</h2>;
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0 ">
      <div className="flex items-center gap-3 px-4">
        <div className="bg-muted/50 flex-1 rounded-xl p-5 max-w-screen overflow-x-auto">
          <form className="flex flex-col w-full gap-3" onSubmit={handleSubmit}>
            <Select
              value={categoryUpdate.sectionid}
              onValueChange={(e) => handleChange(e, "sectionid")}
              required
              name="sectionid"
            >
              <SelectTrigger className="w-full capitalize">
                <SelectValue placeholder="Sección" />
              </SelectTrigger>
              <SelectContent>
                {sections.map((section: Section) => {
                  return (
                    <SelectItem
                      key={section.id}
                      value={section.id!}
                      className="capitalize"
                    >
                      {section.title.es}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <Label>
              título español
              <Textarea
                className="resize-none"
                placeholder="Agua"
                name="es"
                value={categoryUpdate.title.es}
                onChange={(e) => handleChange(e, "es")}
                required
              />
            </Label>
            <Label>
              título inglés
              <Textarea
                className="resize-none"
                placeholder="Water"
                name="en"
                value={categoryUpdate.title.en}
                onChange={(e) => handleChange(e, "en")}
                required
              />
            </Label>
            <Label>
              título francés
              <Textarea
                className="resize-none"
                placeholder="Eaux"
                name="fr"
                value={categoryUpdate.title.fr}
                onChange={(e) => handleChange(e, "fr")}
                required
              />
            </Label>
            <Label className="flex flex-row justify-center items-center gap-1">
              activo
              <Switch
                checked={categoryUpdate.isactive}
                onCheckedChange={(e) => handleChange(e, "isactive")}
                className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
              />
            </Label>
            <div className="flex justify-center gap-3">
              <Button variant={"outline"} type="submit">actualizar</Button>
              <Link href="/dashboard/categories">
                <Button variant="destructive">cancel</Button>
              </Link>
            </div>
          </form>
          {error ? (
            <p className="text-red-500 text-center text-sm mt-3">{error}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
