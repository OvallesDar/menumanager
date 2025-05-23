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
import React, { useContext, useState } from "react";
import { SectionsContext } from "@/app/context/sectionContext";
import { Section } from "@/types/section";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading";

export default function CreateCategory() {
  const { sections, addCategory } = useContext(SectionsContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [category, setCategory] = useState({
    title: {
      es: "",
      en: "",
      fr: "",
    },
    isactive: false,
    sectionid: "",
  });

  const router = useRouter();

  const handleChange = (
    event: React.ChangeEvent<HTMLTextAreaElement> | boolean | string,
    name: string
  ) => {
    const value =
      typeof event === "string" || typeof event === "boolean"
        ? event
        : event.target.value;
    setCategory((prevData) => {
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
        [name]: event,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/categories", {
        method: "post",
        body: JSON.stringify(category),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }
      addCategory(data);
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

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0 ">
      <div className="flex items-center gap-3 px-4">
        <div className="bg-muted/50 flex-1 rounded-xl p-5 max-w-screen overflow-x-auto">
          <h2 className="capitalize pb-3 text-center">crear categoría</h2>

          <form className="flex flex-col w-full gap-3" onSubmit={handleSubmit}>
            <Select
              required
              name="sectionid"
              onValueChange={(e) => handleChange(e, "sectionid")}
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
                value={category.title.es}
                onChange={(e) => handleChange(e, "es")}
                
              />
            </Label>
            <Label>
              título inglés
              <Textarea
                className="resize-none"
                placeholder="Water"
                name="en"
                value={category.title.en}
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
                value={category.title.fr}
                onChange={(e) => handleChange(e, "fr")}
                required
              />
            </Label>
            <Label className="flex flex-row justify-center items-center gap-1 capitalize">
              activo
              <Switch
                checked={category.isactive}
                onCheckedChange={(e) => handleChange(e, "isactive")}
                className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
              />
            </Label>
            <div className="flex justify-center gap-3">
              <Button variant={"outline"} type="submit">crear</Button>
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
