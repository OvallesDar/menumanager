"use client";
import { Button, Label } from "@/components/ui";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { SectionsContext } from "@/app/context/sectionContext";
import { Section } from "@/types/section";
import Loading from "@/components/loading";

export default function EditSection() {
  const { sections, updateSection } = useContext(SectionsContext);
  const [sectionUpdate, setSectionUpdate] = useState<Section | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);
  const params = usePathname();
  const id = params.split("/").at(-1);
  const router = useRouter();

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
  }, [id, sections]);

  const handleChange = (
    event: React.ChangeEvent<HTMLTextAreaElement> | boolean,
    name: string
  ) => {
    const value = typeof event === "boolean" ? event : event.target.value;

    if (!sectionUpdate) return;

    setSectionUpdate((prevData) => {
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setLoading(true);

      const res = await fetch(`/api/sections/${id}`, {
        method: "put",
        body: JSON.stringify(sectionUpdate),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }
      updateSection(data);
      router.push("/dashboard/sections");
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

  if (sectionUpdate == null) {
    return <h2>No existe</h2>;
  }
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0 ">
      <div className="flex items-center gap-3 px-4">
        <div className="bg-muted/50 flex-1 rounded-xl p-5 max-w-screen overflow-x-auto">
          <form className="flex flex-col w-full gap-3" onSubmit={handleSubmit}>
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
              <Button variant={"outline"}>actualizar</Button>
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
