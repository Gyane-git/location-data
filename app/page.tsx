
"use client";

import { useState, useMemo } from "react";
import { getData, Lang } from "../lib/data";

export default function Home() {
  const [lang, setLang] = useState<Lang>("en");

  const [provinceId, setProvinceId] = useState<number | null>(null);
  const [districtId, setDistrictId] = useState<number | null>(null);
  const [municipalityId, setMunicipalityId] = useState<number | null>(null);

  const provinces = getData("provinces", lang);
  const districtsData = getData("districts", lang);
  const municipalitiesData = getData("municipalities", lang);
  const categories = getData("categories", lang);
  const allData = getData("wards", lang); 

  /* ✅ FILTER — THIS IS THE FIX */
  const districts = useMemo(() => {
    if (!provinceId) return [];
    return districtsData.filter(
      (d: any) => Number(d.province_id) === provinceId
    );
  }, [provinceId, districtsData]);

  const municipalities = useMemo(() => {
    if (!districtId) return [];
    return municipalitiesData.filter(
      (m: any) => Number(m.district_id) === districtId
    );
  }, [districtId, municipalitiesData]);

  const selectedMunicipality = municipalities.find(
    (m: any) => m.id === municipalityId
  );

//  const wards = useMemo(() => {
//     if (!selectedMunicipality) return [];
//     return allData.filter((w: any) =>
//       selectedMunicipality.wards.includes(w.id)
//     );
//   }, [selectedMunicipality, allData]);

const wards = useMemo(() => {
  if (!provinceId || !districtId || !municipalityId) return [];
  if (!Array.isArray(allData)) return [];

  const province = allData.find(
    (p: any) => p?.id === provinceId && Array.isArray(p.districts)
  );
  if (!province) return [];

  const district = province.districts.find(
    (d: any) => d?.id === districtId && d?.municipalities
  );
  if (!district) return [];

  // 🔥 THIS IS THE FIX
  const municipalitiesArray = Array.isArray(district.municipalities)
    ? district.municipalities
    : Object.values(district.municipalities);

  const municipality = municipalitiesArray.find(
    (m: any) => m?.id === municipalityId && Array.isArray(m.wards)
  );
  if (!municipality) return [];

  return municipality.wards.map((w: any) =>
    typeof w === "number"
      ? { id: w, name: `Ward ${w}` }
      : { id: w.id, name: w.wardName || `Ward ${w.id}` }
  );
}, [provinceId, districtId, municipalityId, allData]);

console.log(
  "Municipalities type:",
  typeof municipalitiesData,wards
);


  const getCategoryName = (id: number) =>
    categories.find((c: any) => c.id === id)?.name ?? "";

//  const wards =
//     selectedMunicipality?.wards?.map((w: any) =>
//       typeof w === "number" ? { id: w } : w
//     ) ?? []; 

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">
        Nepal Administrative Data
      </h1>

      {/* Language */}
      <div className="flex justify-center gap-2">
        {(["en", "np"] as Lang[]).map((l) => (
          <button
            key={l}
            onClick={() => {
              setLang(l);
              setProvinceId(null);
              setDistrictId(null);
              setMunicipalityId(null);
            }}
            className={`px-4 py-2 rounded border ${
              lang === l ? "bg-black text-white" : "bg-white"
            }`}
          >
            {l === "en" ? "English" : "नेपाली"}
          </button>
        ))}
      </div>

      {/* Province */}
      <Select
        label="Province"
        value={provinceId}
        onChange={(v) => {
          setProvinceId(v);
          setDistrictId(null);
          setMunicipalityId(null);
        }}
        options={provinces.map((p: any) => ({
          value: p.id,
          label: p.name,
        }))}
      />

      {/* ✅ District NOW WORKS */}
      <Select
        label="District"
        value={districtId}
        disabled={!provinceId}
        onChange={(v) => {
          setDistrictId(v);
          setMunicipalityId(null);
        }}
        options={districts.map((d: any) => ({
          value: d.id,
          label: d.name,
        }))}
      />

      {/* Municipality */}
      <Select
        label="Municipality"
        value={municipalityId}
        disabled={!districtId}
        onChange={setMunicipalityId}
        options={municipalities.map((m: any) => ({
          value: m.id,
          label: `${m.name} (${getCategoryName(m.category_id)})`,
        }))}
      />

      {/* Wards */}
      {wards.length > 0 && (
        <div className="bg-gray-50 border rounded p-4">
          <h2 className="font-semibold mb-2">Wards</h2>
          <div className="grid grid-cols-3 gap-2">
            {wards.map((w: any) => (
              <div key={w.id} className="border rounded px-3 py-2 bg-white">
                {w.name ?? `Ward ${w.id}`}
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}

/* ---------- reusable select ---------- */

function Select({ label, value, onChange, options, disabled = false }: any) {
  return (
    <div className="space-y-1">
      <label className="font-medium">{label}</label>
      <select
        value={value ?? ""}
        disabled={disabled}
        onChange={(e) =>
          onChange(e.target.value ? Number(e.target.value) : null)
        }
        className="w-full border rounded px-3 py-2 disabled:bg-gray-100"
      >
        <option value="">-- Select {label} --</option>
        {options.map((o: any) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
