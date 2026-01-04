import { NextResponse } from "next/server";
import { getData, Lang } from "../../../../lib/data";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ lang: string }> } // note Promise
) {
  // await the params
  const resolvedParams = await params;
  const langParam = resolvedParams.lang as Lang;
  const lang: Lang = langParam === "np" ? "np" : "en";

  const data = getData("provinces", lang);
  return NextResponse.json(data);
}
