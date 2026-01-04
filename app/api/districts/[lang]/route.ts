import { NextResponse } from "next/server";
import { getData, Lang } from "../../../../lib/data";

export async function GET(req: Request, context: { params: { lang: string } }) {
  const lang: Lang = context.params.lang === "np" ? "np" : "en";
  const url = new URL(req.url);
  const province = url.searchParams.get("province");

  let districts = getData("districts", lang);
  if (province && !isNaN(Number(province))) {
    districts = districts.filter(d => d.province_code === Number(province));
  }
  return NextResponse.json(districts);
}
