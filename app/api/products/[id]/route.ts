import { prisma } from "@/lib/db";
import { editProductScheme } from "@/lib/zod";
import { Prisma } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import type { UploadApiResponse } from "cloudinary";

const secret = process.env.AUTH_SECRET;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function PUT(req: NextRequest) {
  const token = await getToken({
    req,
    secret,
    ...(process.env.NODE_ENV === "production"
      ? { cookieName: "__Secure-authjs.session-token" }
      : {}),
  });
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let url;
  try {
    const formData = await req.formData();
    const productForm = {
      id: formData.get("id"),
      title: {
        es: formData.get("es"),
        en: formData.get("en"),
        fr: formData.get("fr"),
      },
      price: formData.get("price"),
      isactive: formData.get("isactive") === "true",
      categoryid: formData.get("categoryid"),
    };
    const image = formData.get("image");
    const { id, title, price, isactive, categoryid } =
      await editProductScheme.parseAsync(productForm);

    if (!image) {
      throw new Error("image is required");
    }
    const product = await prisma.products.findUnique({
      where: {
        id,
      },
    });

    if (!product) {
      throw new Error("product does not exist");
    }

    const category = await prisma.categories.findUnique({
      where: {
        id: categoryid,
      },
    });

    if (!category) {
      throw new Error("category does not exist");
    }

    if (image instanceof File) {
      if (image.type !== "image/png") {
        throw new Error("image format invalid");
      }

      if (image.size > 0.5 * 1024 * 1024) {
        throw new Error("image exceeds the maximum allowed size");
      }
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const result: UploadApiResponse = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              upload_preset: "usersPictures",
              resource_type: "image",
              folder: "products/",
              public_id: id,
            },
            (error, result) => {
              if (error) reject(new Error("error uploading image"));
              else resolve(result!);
            }
          )
          .end(buffer);
      });
      url = result.secure_url;
    } else {
      url = image;
    }

    const lowerCaseTitle = {
      es: title.es.toLowerCase(),
      en: title.en.toLowerCase(),
      fr: title.fr.toLowerCase(),
    };

    const updateProduct = {
      title: lowerCaseTitle,
      price: Number(price),
      image: url,
      isactive,
      categoryid,
    };

    const updatedProduct = await prisma.products.update({
      where: {
        id,
      },
      data: updateProduct,
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
