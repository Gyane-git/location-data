"use client";

import { useState, useEffect } from "react";

type Province = { id: number; name: string };
type District = { id: number; name: string; province_id: number };
type Category = { id: number; name: string; short_code: string };
type Municipality = {
  id: number;
  name: string;
  district_id: number;
  category_id: number;
  wards: number[];
};
type Ward = number;

export default function Home() {
  const [lang, setLang] = useState<"en" | "np">("en");

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);
  const [selectedMunicipality, setSelectedMunicipality] = useState<
    number | null
  >(null);

  // Helper to convert select value to number
  const handleSelectNumber =
    (setter: any) => (e: React.ChangeEvent<HTMLSelectElement>) => {
      const val = e.target.value;
      setter(val ? Number(val) : null);
    };

  // Fetch provinces & categories
  useEffect(() => {
    fetch(`/api/provinces/${lang}`)
      .then((r) => r.json())
      .then(setProvinces);
    fetch(`/api/categories/${lang}`)
      .then((r) => r.json())
      .then(setCategories);

    // Reset selections when language changes
    setSelectedProvince(null);
    setSelectedDistrict(null);
    setSelectedMunicipality(null);
    setDistricts([]);
    setMunicipalities([]);
    setWards([]);
  }, [lang]);

  // Fetch districts when province changes
  useEffect(() => {
    if (selectedProvince !== null) {
      fetch(`/api/districts/${lang}?province=${selectedProvince}`)
        .then((r) => r.json())
        .then(setDistricts);

      setSelectedDistrict(null);
      setSelectedMunicipality(null);
      setMunicipalities([]);
      setWards([]);
    } else {
      setDistricts([]);
    }
  }, [selectedProvince, lang]);

  // Fetch municipalities when district changes
  useEffect(() => {
    if (selectedDistrict !== null) {
      fetch(`/api/municipalities/${lang}?district=${selectedDistrict}`)
        .then((r) => r.json())
        .then((data) => {
          // Ensure district_id is a number
          const filtered = data.filter(
            (m: any) => Number(m.district_id) === selectedDistrict
          );
          setMunicipalities(filtered);
        });

      setSelectedMunicipality(null);
      setWards([]);
    } else {
      setMunicipalities([]);
    }
  }, [selectedDistrict, lang]);

  // Update wards when municipality changes
  useEffect(() => {
    if (selectedMunicipality !== null) {
      const muni = municipalities.find((m) => m.id === selectedMunicipality);
      setWards(muni ? muni.wards : []);
    } else {
      setWards([]);
    }
  }, [selectedMunicipality, municipalities]);

  // Get category name for a municipality
  const getCategoryName = (categoryId: number) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat ? cat.name : "";
  };

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Nepal Administrative Data
      </h1>

      {/* Language Switcher */}
      <div className="mb-6 text-center">
        <label className="mr-2 font-medium">Select Language:</label>
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value as "en" | "np")}
          className="border p-2 rounded"
        >
          <option value="en">English</option>
          <option value="np">Nepali</option>
        </select>
      </div>

      {/* Province */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Province:</label>
        <select
          value={selectedProvince ?? ""}
          onChange={handleSelectNumber(setSelectedProvince)}
          className="border p-2 rounded w-full"
        >
          <option value="">-- Select Province --</option>
          {provinces.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* District */}
      {districts.length > 0 && (
        <div className="mb-4">
          <label className="block mb-1 font-medium">District:</label>
          <select
            value={selectedDistrict ?? ""}
            onChange={handleSelectNumber(setSelectedDistrict)}
            className="border p-2 rounded w-full"
          >
            <option value="">-- Select District --</option>
            {districts.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Municipality */}
      {municipalities.length > 0 && (
        <div className="mb-4">
          <label className="block mb-1 font-medium">Municipality:</label>
          <select
            value={selectedMunicipality ?? ""}
            onChange={(e) => setSelectedMunicipality(Number(e.target.value))}
            className="border p-2 rounded w-full"
          >
            <option value="">-- Select Municipality --</option>
            {municipalities.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({getCategoryName(Number(m.category_id))})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Wards */}
      {wards.length > 0 && (
        <div className="mt-4">
          <h2 className="font-semibold mb-2">Wards:</h2>
          <ul className="list-disc pl-5">
            {wards.map((w) => (
              <li key={w}>Ward {w}</li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
