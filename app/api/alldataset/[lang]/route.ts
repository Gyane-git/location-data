import { NextResponse } from "next/server";
import { getData, Lang } from "../../../../lib/data";

type Params = {
  lang: string;
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<Params> }
) {
  const { lang } = await params;
  const language: Lang = lang === "np" ? "np" : "en";

  return NextResponse.json(getData("alldataset", language));
}
