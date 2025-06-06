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
import React, { useContext } from "react";
import { SectionsContext } from "@/app/context/sectionContext";
import Loading from "@/components/loading";
import { useFormInput } from "@/hooks/use-form-input";
import { useFormSubmit } from "@/hooks/use-form-submit";
import { Section } from "@/types/section";
import { Category } from "@/types/category";

const INITIAL_CATEGORY = {
  title: {
    es: "",
    en: "",
    fr: "",
  },
  isactive: false,
  sectionid: "",
};

export default function CreateCategory() {
  const { sections, addCategory } = useContext(SectionsContext);
  const { data: category, handleChange } = useFormInput(INITIAL_CATEGORY);
  const { loading, error, handleSubmit } = useFormSubmit<Category>();

  const submitCategory = handleSubmit({
    data: category,
    url: "/api/categories",
    onSuccess: addCategory,
    redirectTo: "/dashboard/categories",
  });

  if (loading) return <Loading />;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0 ">
      <div className="flex items-center gap-3 px-4">
        <div className="bg-muted/50 flex-1 rounded-xl p-5 max-w-screen overflow-x-auto">
          <h2 className="first-letter:uppercase pb-3 text-center">
            crear categoría
          </h2>

          <form
            className="flex flex-col w-full gap-3"
            onSubmit={submitCategory}
          >
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
            <Label className="flex flex-row justify-center items-center gap-1">
              activo
              <Switch
                checked={category.isactive}
                onCheckedChange={(e) => handleChange(e, "isactive")}
                className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
              />
            </Label>
            <div className="flex justify-center gap-3">
              <Button variant={"outline"} type="submit">
                crear
              </Button>
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
