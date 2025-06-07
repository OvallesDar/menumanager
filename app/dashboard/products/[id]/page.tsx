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
import React, { useContext, useEffect, useState } from "react";
import { ImagePlus } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { SectionsContext } from "@/app/context/section-context";
import { Category } from "@/types/category";
import { Product } from "@/types/product";
import Loading from "@/components/loading";

export default function EditProduct() {
  const { categories, products, updateProduct } = useContext(SectionsContext);
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState(true);
  const [productUpdate, setProductUpdate] = useState<Product | null>(null);
  const params = usePathname();
  const id = params.split("/").at(-1);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    if (id && products.length === 0) {
      setProductUpdate(null);
      setLoading(false);
      return;
    }

    const product: Product = products.find(
      (product: Product) => product.id === id
    );
    if (product) {
      setProductUpdate(product);
    } else {
      setProductUpdate(null);
    }
    setLoading(false);
  }, [id, products]);

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
      | boolean
      | string,
    name: string
  ) => {
    const value =
      typeof event === "string" || typeof event === "boolean"
        ? event
        : event.target instanceof HTMLInputElement &&
          event.target.type === "file"
        ? event.target.files?.[0]
        : event.target.value;

    setProductUpdate((prevData) => {
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
      if (!productUpdate) return;

      const formData = new FormData();
      formData.append("id", productUpdate.id!);
      formData.append("es", productUpdate.title.es);
      formData.append("en", productUpdate.title.en);
      formData.append("fr", productUpdate.title.fr);
      formData.append("price", productUpdate.price);
      formData.append("isactive", productUpdate.isactive ? "true" : "false");
      formData.append("categoryid", productUpdate.categoryid);
      formData.append("image", productUpdate.image!);

      const res = await fetch(`/api/products/${id}`, {
        method: "put",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }
      updateProduct(data);
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

  if (productUpdate == null) return <h1>No existe</h1>;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0 ">
      <div className="flex items-center gap-3 px-4">
        <div className="bg-muted/50 flex-1 rounded-xl p-5 max-w-screen overflow-x-auto">
          <form className="flex flex-col w-full gap-3" onSubmit={handleSubmit}>
            <Select
              value={productUpdate.categoryid}
              onValueChange={(e) => handleChange(e, "categoryid")}
              required
              name="categoryid"
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
                value={productUpdate.title.es}
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
                value={productUpdate.title.en}
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
                value={productUpdate.title.fr}
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
                value={productUpdate.price}
                onChange={(e) => handleChange(e, "price")}
                required
              />
            </Label>
             {typeof productUpdate.image === "string" ? (
              <Label>
                Image
                <small className="lowercase break-words">{productUpdate.image.split("/").at(-1)}</small>
              </Label>
            ) : null}
            <Button asChild variant={"outline"}>
              <Label className="flex-row">
                <ImagePlus />
                {productUpdate.image instanceof File ? "imagen cargada ✅" : "cambiar imagen"}
                <Input
                  type="file"
                  name="image"
                  className="hidden"
                  onChange={(e) => handleChange(e, "image")}
                />
              </Label>
            </Button>
            <Label className="flex flex-row justify-center items-center gap-1">
              activo
              <Switch
                checked={productUpdate.isactive}
                onCheckedChange={(e) => handleChange(e, "isactive")}
                className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
              />
            </Label>
            <div className="flex justify-center gap-3">
              <Button variant={"outline"} type="submit">
                actualizar
              </Button>
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
