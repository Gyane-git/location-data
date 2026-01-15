import { NextResponse } from "next/server";
import { getData, Lang } from "../../../../lib/data";

type RouteParams = {
  lang: string;
};

export async function GET(
  request: Request,
  context: { params: Promise<RouteParams> }
) {
  const { lang } = await context.params;

  const language: Lang = lang === "np" ? "np" : "en";

  const data = getData("categories", language);
  return NextResponse.json(data);
}
