import { NextResponse } from "next/server";

type Params = {
  lang: string;
};

export async function GET(
  request: Request,
  { params }: { params: Promise<Params> }
) {
  const { lang } = await params;

  // 👉 Your logic goes here
  // Example response
  return NextResponse.json({
    success: true,
    language: lang,
  });
}
