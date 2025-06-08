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
import React, { useContext, useEffect } from "react";
import { SectionsContext } from "@/app/context/section-context";
import { usePathname } from "next/navigation";
import { Section } from "@/types/section";
import { Category } from "@/types/category";
import Loading from "@/components/loading";
import { useFormInput } from "@/hooks/use-form-input";
import { useFormSubmit } from "@/hooks/use-form-submit";

export default function EditCategory() {
  const { sections, categories, updateCategory } = useContext(SectionsContext);
  const {
    data: categoryUpdate,
    setData: setCategoryUpdate,
    handleChange,
  } = useFormInput<Category>(null);
  const { loading, error, handleSubmit, setLoading } =
    useFormSubmit<Category>();
  const id = usePathname().split("/").at(-1);

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
  }, [id, categories, setCategoryUpdate, setLoading]);

  const submitCategory = handleSubmit({
    data: categoryUpdate,
    url: `/api/categories/${id}`,
    method: "put",
    onSuccess: updateCategory,
    redirectTo: "/dashboard/categories",
  });

  if (loading) return <Loading />;

  if (categoryUpdate == null) {
    return <h2>No existe</h2>;
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0 ">
      <div className="flex items-center gap-3 px-4">
        <div className="bg-muted/50 flex-1 rounded-xl p-5 max-w-screen overflow-x-auto">
          <form
            className="flex flex-col w-full gap-3"
            onSubmit={submitCategory}
          >
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
              <Button variant={"outline"} type="submit">
                actualizar
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
