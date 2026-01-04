import { NextResponse } from "next/server";
import { getData, Lang } from "../../../../lib/data";

export async function GET(req: Request, context: { params: { lang: string } | Promise<{ lang: string }> }) {
  const { lang } = await context.params;
  const language: Lang = lang === "np" ? "np" : "en";

  const url = new URL(req.url);
  const districtId = Number(url.searchParams.get("district"));

  let municipalities = getData("municipalities", language);
  if (!isNaN(districtId)) {
    municipalities = municipalities.filter(m => m.district_id === districtId);
  }

  return NextResponse.json(municipalities);
}
