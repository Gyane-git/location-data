import { NextResponse } from "next/server";
import { getData, Lang } from "../../../../lib/data";

export async function GET(req: Request, context: { params: { lang: string } | Promise<{ lang: string }> }) {
  const { lang } = await context.params; // unwrap promise
  const language: Lang = lang === "np" ? "np" : "en";
  const data = getData("provinces", language);
  return NextResponse.json(data);
}
