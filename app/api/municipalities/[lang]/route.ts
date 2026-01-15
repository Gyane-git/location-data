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
  const districtId = Number(url.searchParams.get("district"));

  let municipalities = getData("municipalities", language);
  if (!isNaN(districtId)) {
    municipalities = municipalities.filter(
      (m) => m.district_id === districtId
    );
  }

  return NextResponse.json(municipalities);
}
