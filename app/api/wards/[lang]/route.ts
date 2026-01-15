import { NextResponse } from "next/server";

type RouteParams = {
  lang: string;
};

export async function GET(
  request: Request,
  context: { params: Promise<RouteParams> }
) {
  const { lang } = await context.params;

  // 👉 Your existing logic / DB query goes here
  // example:
  // const data = await getWardsByLang(lang);

  return NextResponse.json({
    success: true,
    lang,
    // data,
  });
}
