import { NextResponse } from "next/server";
import { getData, Lang } from "../../../../lib/data";

export async function GET(req: Request, context: { params: { lang: string } }) {
  const lang: Lang = context.params.lang === "np" ? "np" : "en";
  const data = getData("provinces", lang);
  return NextResponse.json(data);
}
