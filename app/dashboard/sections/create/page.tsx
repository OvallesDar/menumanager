"use client";
import { SectionsContext } from "@/app/context/sectionContext";
import Loading from "@/components/loading";
import { Button, Label } from "@/components/ui";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";

export default function CreateSection() {
  const { addSection } = useContext(SectionsContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [section, setSection] = useState({
    title: {
      es: "",
      en: "",
      fr: "",
    },
    isactive: false,
  });

  const router = useRouter();

  const handleChange = (
    event: React.ChangeEvent<HTMLTextAreaElement> | boolean,
    name: string
  ) => {
    const value = typeof event === "boolean" ? event : event.target.value;
    setSection((prevData) => {
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
      const res = await fetch("/api/sections", {
        method: "post",
        body: JSON.stringify(section),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }
      addSection(data);
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

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0 ">
      <div className="flex items-center gap-3 px-4">
        <div className="bg-muted/50 flex-1 rounded-xl p-5 max-w-screen overflow-x-auto">
          <h2 className="capitalize pb-3 text-center">crear sección</h2>

          <form className="flex flex-col w-full gap-3" onSubmit={handleSubmit}>
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
              <Button variant={"outline"}>crear</Button>
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
