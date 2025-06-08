"use client";
import { usePathname } from "next/navigation";
import { useContext, useEffect } from "react";
import { SectionsContext } from "@/app/context/section-context";
import { useFormInput } from "@/hooks/use-form-input";
import { useFormSubmit } from "@/hooks/use-form-submit";
import { Section } from "@/types/section";
import Link from "next/link";
import Loading from "@/components/loading";
import { Button, Label } from "@/components/ui";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export default function EditSection() {
  const { sections, updateSection } = useContext(SectionsContext);
  const {
    data: sectionUpdate,
    setData: setSectionUpdate,
    handleChange,
  } = useFormInput<Section>(null);
  const { loading, error, handleSubmit, setLoading } = useFormSubmit<Section>();
  const id = usePathname().split("/").at(-1);

  useEffect(() => {
    setLoading(true);
    if (id && sections.length === 0) {
      setSectionUpdate(null);
      setLoading(false);
      return;
    }
    const section = sections.find((section: Section) => section.id === id);
    if (section) {
      setSectionUpdate(section);
    } else {
      setSectionUpdate(null);
    }
    setLoading(false);
  }, [id, sections, setSectionUpdate, setLoading]);

  const submitSection = handleSubmit({
    data: sectionUpdate,
    url: `/api/sections/${id}`,
    method: "put",
    onSuccess: updateSection,
    redirectTo: "/dashboard/sections",
  });

  if (loading) return <Loading />;

  if (sectionUpdate == null) {
    return <h2>No existe</h2>;
  }
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0 ">
      <div className="flex items-center gap-3 px-4">
        <div className="bg-muted/50 flex-1 rounded-xl p-5 max-w-screen overflow-x-auto">
          <form className="flex flex-col w-full gap-3" onSubmit={submitSection}>
            <Label>
              título español
              <Textarea
                className="resize-none"
                placeholder="Aguas / Refrescos"
                name="es"
                value={sectionUpdate.title.es}
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
                value={sectionUpdate.title.en}
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
                value={sectionUpdate.title.fr}
                onChange={(e) => handleChange(e, "fr")}
                required
              />
            </Label>
            <Label className="flex flex-row justify-center items-center gap-1">
              activo
              <Switch
                checked={sectionUpdate.isactive}
                onCheckedChange={(e) => handleChange(e, "isactive")}
                className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
              />
            </Label>
            <div className="flex justify-center gap-3">
              <Button variant={"outline"} type="submit">
                actualizar
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
