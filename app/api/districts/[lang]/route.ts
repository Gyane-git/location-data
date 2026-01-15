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

  const url = new URL(request.url);
  const provinceId = Number(url.searchParams.get("province"));

  let districts = getData("districts", language);
  if (!isNaN(provinceId)) {
    districts = districts.filter((d) => d.province_id === provinceId);
  }

  return NextResponse.json(districts);
}
