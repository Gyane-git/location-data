import { NextResponse } from "next/server";
import { getData, Lang } from "../../../../lib/data";

interface Params {
  params: { lang: string };
}

export async function GET(req: Request, { params }: Params) {
  const langParam = params.lang as Lang;
  const lang: Lang = langParam === "np" ? "np" : "en";

  const url = new URL(req.url);
  const province = url.searchParams.get("province");

  let districts = getData("districts", lang);

  if (province && !isNaN(Number(province))) {
    districts = districts.filter((d: any) => d.province_code === Number(province));
  }

  return NextResponse.json(districts);
}
