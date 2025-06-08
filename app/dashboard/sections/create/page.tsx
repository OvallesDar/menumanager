"use client";
import { SectionsContext } from "@/app/context/section-context";
import Loading from "@/components/loading";
import { Button, Label } from "@/components/ui";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useFormInput } from "@/hooks/use-form-input";
import { useFormSubmit } from "@/hooks/use-form-submit";
import { Section } from "@/types/section";
import Link from "next/link";
import { useContext } from "react";

const INITIAL_SECTION = {
  title: {
    es: "",
    en: "",
    fr: "",
  },
  isactive: false,
};

export default function CreateSection() {
  const { addSection } = useContext(SectionsContext);
  const { data: section, handleChange } = useFormInput(INITIAL_SECTION);
  const { loading, error, handleSubmit } = useFormSubmit<Section>();

  const submitSection = handleSubmit({
    data: section,
    url: "/api/sections",
    onSuccess: addSection,
    redirectTo: "/dashboard/sections",
  });

  if (loading) return <Loading />;
  if (section == null) return;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0 ">
      <div className="flex items-center gap-3 px-4">
        <div className="bg-muted/50 flex-1 rounded-xl p-5 max-w-screen overflow-x-auto">
          <h2 className="first-letter:uppercase pb-3 text-center">
            crear sección
          </h2>

          <form className="flex flex-col w-full gap-3" onSubmit={submitSection}>
            <Label>
              título español
              <Textarea
                className="resize-none"
                placeholder="Aguas / Refrescos"
                name="es"
                value={section.title.es}
                onChange={(e) => handleChange(e, "es")}
                required
              />
            </Label>
            <Label>
              título inglés
              <Textarea
                className="resize-none"
                placeholder="Waters / Soft Drinks"
                name="en"
                value={section.title.en}
                onChange={(e) => handleChange(e, "en")}
                required
              />
            </Label>
            <Label>
              título francés
              <Textarea
                className="resize-none"
                placeholder="Eaux / Sodas"
                name="fr"
                value={section.title.fr}
                onChange={(e) => handleChange(e, "fr")}
                required
              />
            </Label>
            <Label className="flex flex-row justify-center items-center gap-1">
              activo
              <Switch
                checked={section.isactive}
                onCheckedChange={(e) => handleChange(e, "isactive")}
                className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
              />
            </Label>
            <div className="flex justify-center gap-3">
              <Button variant={"outline"} type="submit">
                crear
              </Button>
              <Link href="/dashboard/sections">
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
