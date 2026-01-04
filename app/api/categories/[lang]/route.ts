import { NextResponse } from "next/server";
import { getData, Lang } from "../../../../lib/data";

export async function GET(req: Request, context: { params: { lang: string } | Promise<{ lang: string }> }) {
  const { lang } = await context.params;
  const language: Lang = lang === "np" ? "np" : "en";

  const data = getData("categories", language);
  return NextResponse.json(data);
}
