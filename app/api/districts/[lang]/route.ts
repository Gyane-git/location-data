import { NextResponse } from "next/server";
import { getData, Lang } from "../../../../lib/data";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ lang: string }> }
) {
  const resolvedParams = await params;
  const langParam = resolvedParams.lang as Lang;
  const lang: Lang = langParam === "np" ? "np" : "en";

  const url = new URL(req.url);
  const province = url.searchParams.get("province");

  let districts = getData("districts", lang);

  if (province) {
    districts = districts.filter((d: any) => d.province_code === Number(province));
  }

  return NextResponse.json(districts);
}
