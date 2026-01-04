// "use client";

// import { useState, useEffect } from "react";

// type Province = { id: number; name: string };
// type District = { id: number; name: string; province_id: number };
// type Category = { id: number; name: string; short_code: string };
// type Municipality = {
//   id: number;
//   name: string;
//   district_id: number;
//   category_id: number;
//   wards: number[];
// };
// type Ward = number;

// export default function Home() {
//   const [lang, setLang] = useState<"en" | "np">("en");

//   const [provinces, setProvinces] = useState<Province[]>([]);
//   const [districts, setDistricts] = useState<District[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
//   const [wards, setWards] = useState<Ward[]>([]);

//   const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
//   const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);
//   const [selectedMunicipality, setSelectedMunicipality] = useState<
//     number | null
//   >(null);

//   // Helper to convert select value to number
//   const handleSelectNumber =
//     (setter: any) => (e: React.ChangeEvent<HTMLSelectElement>) => {
//       const val = e.target.value;
//       setter(val ? Number(val) : null);
//     };

//   // Fetch provinces & categories
//   useEffect(() => {
//     fetch(`/api/provinces/${lang}`)
//       .then((r) => r.json())
//       .then(setProvinces);
//     fetch(`/api/categories/${lang}`)
//       .then((r) => r.json())
//       .then(setCategories);

//     // Reset selections when language changes
//     setSelectedProvince(null);
//     setSelectedDistrict(null);
//     setSelectedMunicipality(null);
//     setDistricts([]);
//     setMunicipalities([]);
//     setWards([]);
//   }, [lang]);

//   // Fetch districts when province changes
//   useEffect(() => {
//     if (selectedProvince !== null) {
//       fetch(`/api/districts/${lang}?province=${selectedProvince}`)
//         .then((r) => r.json())
//         .then(setDistricts);

//       setSelectedDistrict(null);
//       setSelectedMunicipality(null);
//       setMunicipalities([]);
//       setWards([]);
//     } else {
//       setDistricts([]);
//     }
//   }, [selectedProvince, lang]);

//   // Fetch municipalities when district changes
//   useEffect(() => {
//     if (selectedDistrict !== null) {
//       fetch(`/api/municipalities/${lang}?district=${selectedDistrict}`)
//         .then((r) => r.json())
//         .then((data) => {
//           // Ensure district_id is a number
//           const filtered = data.filter(
//             (m: any) => Number(m.district_id) === selectedDistrict
//           );
//           setMunicipalities(filtered);
//         });

//       setSelectedMunicipality(null);
//       setWards([]);
//     } else {
//       setMunicipalities([]);
//     }
//   }, [selectedDistrict, lang]);

//   // Update wards when municipality changes
//   useEffect(() => {
//     if (selectedMunicipality !== null) {
//       const muni = municipalities.find((m) => m.id === selectedMunicipality);
//       setWards(muni ? muni.wards : []);
//     } else {
//       setWards([]);
//     }
//   }, [selectedMunicipality, municipalities]);

//   // Get category name for a municipality
//   const getCategoryName = (categoryId: number) => {
//     const cat = categories.find((c) => c.id === categoryId);
//     return cat ? cat.name : "";
//   };

//   return (
//     <main className="p-6 max-w-4xl mx-auto">
//       <h1 className="text-3xl font-bold mb-6 text-center">
//         Nepal Administrative Data
//       </h1>

//       {/* Language Switcher */}
//       <div className="mb-6 text-center">
//         <label className="mr-2 font-medium">Select Language:</label>
//         <select
//           value={lang}
//           onChange={(e) => setLang(e.target.value as "en" | "np")}
//           className="border p-2 rounded"
//         >
//           <option value="en">English</option>
//           <option value="np">Nepali</option>
//         </select>
//       </div>

//       {/* Province */}
//       <div className="mb-4">
//         <label className="block mb-1 font-medium">Province:</label>
//         <select
//           value={selectedProvince ?? ""}
//           onChange={handleSelectNumber(setSelectedProvince)}
//           className="border p-2 rounded w-full"
//         >
//           <option value="">-- Select Province --</option>
//           {provinces.map((p) => (
//             <option key={p.id} value={p.id}>
//               {p.name}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* District */}
//       {districts.length > 0 && (
//         <div className="mb-4">
//           <label className="block mb-1 font-medium">District:</label>
//           <select
//             value={selectedDistrict ?? 0}
//             onChange={handleSelectNumber(setSelectedDistrict)}
//             className="border p-2 rounded w-full"
//           >
//             <option value="">-- Select District --</option>
//             {districts.map((d) => (
//               <option key={d.id} value={d.id}>
//                 {d.name}
//               </option>
//             ))}
//           </select>
//         </div>
//       )}

//       {/* Municipality */}
//       {municipalities.length > 0 && (
//         <div className="mb-4">
//           <label className="block mb-1 font-medium">Municipality:</label>
//           <select
//             value={selectedMunicipality ?? 0}
//             onChange={(e) => setSelectedMunicipality(Number(e.target.value))}
//             className="border p-2 rounded w-full"
//           >
//             <option value="">-- Select Municipality --</option>
//             {municipalities.map((m) => (
//               <option key={m.id} value={m.id}>
//                 {m.name} ({getCategoryName(Number(m.category_id))})
//               </option>
//             ))}
//           </select>
//         </div>
//       )}

//       {/* Wards */}
//       {wards.length > 0 && (
//         <div className="mt-4">
//           <h2 className="font-semibold mb-2">Wards:</h2>
//           <ul className="list-disc pl-5">
//             {wards.map((w) => (
//               <li key={w}>Ward {w}</li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </main>
//   );
// }
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
