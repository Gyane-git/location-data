import { NextResponse } from "next/server";
import { getData, Lang } from "../../../../lib/data";

export async function GET(req: Request, context: { params: { lang: string } }) {
  const lang: Lang = context.params.lang === "np" ? "np" : "en";
  const url = new URL(req.url);
  const district = url.searchParams.get("district");

  let municipalities = getData("municipalities", lang);
  if (district && !isNaN(Number(district))) {
    municipalities = municipalities.filter(m => m.district_id === Number(district));
  }
  return NextResponse.json(municipalities);
}
