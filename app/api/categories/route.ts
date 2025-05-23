import { prisma } from "@/lib/db";
import { createCategoryScheme } from "@/lib/zod";
import { Prisma } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

const secret = process.env.AUTH_SECRET;

export async function POST(req: NextRequest) {
  const token = await getToken({req, secret, cookieName: "__Secure-authjs.session-token"})
  if (!token) return NextResponse.redirect(new URL("/", req.url));
  try {
    const { title, isactive, sectionid } =
      await createCategoryScheme.parseAsync(await req.json());

    const section = await prisma.sections.findUnique({
      where: {
        id: sectionid,
      },
    });

    if (!section) {
      throw new Error("section does not exist");
    }
    const lowerCaseTitle = {
      es: title.es.toLowerCase(),
      en: title.en.toLowerCase(),
      fr: title.fr.toLowerCase(),
    };

    const newCategory = await prisma.categories.create({
      data: {
        title: lowerCaseTitle,
        isactive,
        sectionid,
      },
    });

    return NextResponse.json(newCategory);
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
