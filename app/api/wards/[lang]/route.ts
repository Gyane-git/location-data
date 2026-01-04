import { NextResponse } from "next/server";
import { getData, Lang } from "../../../../lib/data";

export async function GET(req: Request, context: { params: { lang: string } }) {
  const lang: Lang = context.params.lang === "np" ? "np" : "en";
  const url = new URL(req.url);
  const municipality = url.searchParams.get("municipality");

  let wards = getData("wards", lang);
  if (municipality && !isNaN(Number(municipality))) {
    wards = wards.filter(w => w.municipality_id === Number(municipality));
  }
  return NextResponse.json(wards);
}
