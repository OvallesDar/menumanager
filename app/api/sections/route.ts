import { prisma } from "@/lib/db";
import { createSectionScheme } from "@/lib/zod";
import { Prisma } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
const secret = process.env.AUTH_SECRET;

export async function GET() {
  try {
    const sections = await prisma.sections.findMany({
      include: {
        categories: {
          include: {
            products: true,
          },
        },
      },
    });
    return NextResponse.json(sections);
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

export async function POST(req: NextRequest) {
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

  try {
    const { title, isactive } = await createSectionScheme.parseAsync(
      await req.json()
    );

    const lowerCaseTitle = {
      es: title.es.toLowerCase(),
      en: title.en.toLowerCase(),
      fr: title.fr.toLowerCase(),
    };

    const newSection = await prisma.sections.create({
      data: {
        title: lowerCaseTitle,
        isactive,
      },
    });

    return NextResponse.json(newSection);
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
