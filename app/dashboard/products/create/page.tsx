"use client";
import { Button, Input, Label } from "@/components/ui";
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
import { ImagePlus } from "lucide-react";
import { Product } from "@/types/product";
import { SectionsContext } from "@/app/context/sectionContext";
import { Category } from "@/types/category";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading";

export default function CreateProduct() {
  const { categories, addProduct } = useContext(SectionsContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [product, setProduct] = useState<Product>({
    title: {
      es: "",
      en: "",
      fr: "",
    },
    price: "",
    isactive: false,
    categoryid: "",
    image: null,
  });

  const router = useRouter();

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | string
      | boolean,
    name: string
  ) => {
    const value =
      typeof event === "string" || typeof event === "boolean"
        ? event
        : event.target instanceof HTMLInputElement &&
          event.target.type === "file"
        ? event.target.files?.[0]
        : event.target.value;

    setProduct((prevData) => {
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
      const formData = new FormData();
      formData.append("es", product.title.es);
      formData.append("en", product.title.en);
      formData.append("fr", product.title.fr);
      formData.append("price", product.price);
      formData.append("isactive", product.isactive ? "true" : "false");
      formData.append("categoryid", product.categoryid);
      formData.append("image", product.image!);

      const res = await fetch("/api/products", {
        method: "post",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }
      addProduct(data);
      router.push("/dashboard/products");
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
          <h2 className="first-letter:uppercase pb-3 text-center">crear producto</h2>

          <form className="flex flex-col w-full gap-3" onSubmit={handleSubmit}>
            <Select
              required
              name="categoryid"
              onValueChange={(e) => handleChange(e, "categoryid")}
            >
              <SelectTrigger className="w-full capitalize">
                <SelectValue placeholder="categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category: Category) => {
                  return (
                    <SelectItem
                      key={category.id}
                      value={category.id!}
                      className="capitalize"
                    >
                      {category.title.es}
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
                value={product.title.es}
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
                value={product.title.en}
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
                value={product.title.fr}
                onChange={(e) => handleChange(e, "fr")}
                required
              />
            </Label>
            <Label>
              precio
              <Input
                type="number"
                inputMode="decimal"
                placeholder="1"
                name="price"
                value={product.price}
                onChange={(e) => handleChange(e, "price")}
                required
              />
            </Label>
            <Button asChild variant={"outline"}>
              <Label className="flex-row">
                <ImagePlus />
                {product.image ? "imagen cargada ✅" : "agregar imagen ❌"}{" "}
                <Input
                  type="file"
                  name="image"
                  className="hidden"
                  required
                  onChange={(e) => handleChange(e, "image")}
                />
              </Label>
            </Button>
            <Label className="flex flex-row justify-center items-center gap-1">
              activo
              <Switch
                checked={product.isactive}
                onCheckedChange={(e) => handleChange(e, "isactive")}
                className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
              />
            </Label>
            <div className="flex justify-center gap-3">
              <Button variant={"outline"} type="submit">crear</Button>
              <Link href="/dashboard/products">
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
