import { NextResponse } from "next/server";
import { getData, Lang, RawWard, DatasetProvince, DatasetDistrict } from "../../../../lib/data";

type RouteParams = {
  lang: string;
};

type WardResponse = {
  id: string;
  name: string;
};

function normalizeWard(ward: RawWard, index: number): WardResponse {
  if (typeof ward === "number" || typeof ward === "string") {
    const label = String(ward);
    return { id: label, name: `Ward ${label}` };
  }

  const wardId = ward.id != null ? String(ward.id) : String(index + 1);
  const wardName = ward.wardName || ward.name || `Ward ${wardId}`;

  return { id: wardId, name: wardName };
}

function getDistrictList(province: DatasetProvince): DatasetDistrict[] {
  return Array.isArray(province.districts)
    ? province.districts
    : Object.values(province.districts);
}

export async function GET(
  request: Request,
  context: { params: Promise<RouteParams> }
) {
  const { lang } = await context.params;
  const language: Lang = lang === "np" ? "np" : "en";

  const url = new URL(request.url);
  const provinceId = Number(url.searchParams.get("province"));
  const districtId = Number(url.searchParams.get("district"));
  const municipalityId = Number(url.searchParams.get("municipality"));

  if (Number.isNaN(provinceId) || Number.isNaN(districtId) || Number.isNaN(municipalityId)) {
    return NextResponse.json([]);
  }

  const allData = getData("alldataset", language);
  const province = allData.find((item) => item.id === provinceId);
  if (!province) {
    return NextResponse.json([]);
  }

  const district = getDistrictList(province).find((item) => item.id === districtId);
  if (!district) {
    return NextResponse.json([]);
  }

  const municipalities = Array.isArray(district.municipalities)
    ? district.municipalities
    : Object.values(district.municipalities);

  const municipality = municipalities.find((item) => item.id === municipalityId);
  if (!municipality) {
    return NextResponse.json([]);
  }

  return NextResponse.json(municipality.wards.map(normalizeWard));
}
