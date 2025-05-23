import { prisma } from "@/lib/db";
import { editCategoryScheme } from "@/lib/zod";
import { Prisma } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

const secret = process.env.AUTH_SECRET;

export async function PUT(req: NextRequest) {
  const token = await getToken({req, secret, cookieName: "__Secure-authjs.session-token"})
  if (!token) return NextResponse.redirect(new URL("/", req.url));
  try {
    const { id, title, isactive, sectionid } =
      await editCategoryScheme.parseAsync(await req.json());

    const category = await prisma.categories.findUnique({
      where: {
        id,
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

    const updateCategory = await prisma.categories.update({
      where: { id },
      data: {
        title: lowerCaseTitle,
        isactive,
        sectionid,
      },
      include: {
        products: true
      }
    });

    return NextResponse.json(updateCategory);
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
      console.error(error);
      return NextResponse.json({ error: "Unknown error" }, { status: 500 });
    }
  }
}
