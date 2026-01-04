// import { NextResponse } from "next/server";
// import { getData, Lang } from "../../../../lib/data";

// interface Params {
//   params: { lang: string };
// }

// export async function GET(req: Request, context: Params) {
//   const langParam = context.params.lang as Lang;
//   const lang: Lang = langParam === "np" ? "np" : "en";

//   const url = new URL(req.url);
//   const municipality = url.searchParams.get("municipality"); // ?municipality=ID

//   let wards = getData("alldataset", lang); // your wards are inside alldataset

//   if (municipality) {
//     wards = wards
//       .filter((m: any) => m.id === Number(municipality))
//       .flatMap((m: any) => m.wards.map((w: any) => ({ ...w, municipality_id: m.id })));
//   }

//   return NextResponse.json(wards);
// }
