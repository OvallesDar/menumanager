import { prisma } from "@/lib/db";
import { createProductScheme } from "@/lib/zod";
import { Prisma } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { v2 as cloudinary } from "cloudinary";
import type { UploadApiResponse } from "cloudinary";

const secret = process.env.AUTH_SECRET;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret });
  if (!token) return NextResponse.redirect(new URL("/", req.url));
  try {
    const formData = await req.formData();

    const productForm = {
      title: {
        es: formData.get("es"),
        en: formData.get("en"),
        fr: formData.get("fr"),
      },
      price: formData.get("price"),
      isactive: formData.get("isactive") === "true",
      categoryid: formData.get("categoryid"),
    };
    const image = formData.get("image") as File;

    const { title, price, isactive, categoryid } =
      await createProductScheme.parseAsync(productForm);

    if (!image || !(image instanceof File)) {
      throw new Error("image is required");
    }

    if (image.type !== "image/png") {
      throw new Error("image format invalid");
    }

    if (image.size > 0.5 * 1024 * 1024) {
      throw new Error("image exceeds the maximum allowed size");
    }

    const category = await prisma.categories.findUnique({
      where: {
        id: categoryid,
      },
    });

    if (!category) {
      throw new Error("category does not exist");
    }

    const lowerCaseTitle = {
      es: title.es.toLowerCase(),
      en: title.en.toLowerCase(),
      fr: title.fr.toLowerCase(),
    };

    const createProduct = {
      title: lowerCaseTitle,
      price: Number(price),
      image: "",
      isactive,
      categoryid,
    };

    const newProduct = await prisma.products.create({
      data: createProduct,
    });

    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result: UploadApiResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            upload_preset: "usersPictures",
            resource_type: "image",
            folder: `products/${category.id}`,
            public_id: newProduct.id,
          },
          (error, result) => {
            if (error) reject(new Error("error uploading image"));
            else resolve(result!);
          }
        )
        .end(buffer);
    });

    const updatedProduct = await prisma.products.update({
      where: {
        id: newProduct.id,
      },
      data: {
        image: result.secure_url,
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { error: `Error: Prisma${error.code}` },
        { status: 400 }
      );
    } else if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    } else {
      return NextResponse.json({ error: "Unknown error" }, { status: 500 });
    }
  }
}
