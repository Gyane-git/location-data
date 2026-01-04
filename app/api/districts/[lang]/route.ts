import { NextResponse } from "next/server";
import { getData, Lang } from "../../../../lib/data";

export async function GET(req: Request, context: { params: { lang: string } | Promise<{ lang: string }> }) {
  const { lang } = await context.params;
  const language: Lang = lang === "np" ? "np" : "en";

  const url = new URL(req.url);
  const provinceId = Number(url.searchParams.get("province"));

  let districts = getData("districts", language);
  if (!isNaN(provinceId)) {
    districts = districts.filter(d => d.province_id === provinceId);
  }

  return NextResponse.json(districts);
}
