"use client";

import { useState, useEffect } from "react";

type Province = { code: number; name: string };
type District = { code: number; name: string; province_code: number };
type Municipality = { id: number; name: string; district_id: number };
type Ward = { id: number; name: string; municipality_id: number };

export default function Home() {
  const [lang, setLang] = useState<"en" | "np">("en");
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);
  const [selectedMunicipality, setSelectedMunicipality] = useState<number | null>(null);

  // Fetch provinces
  useEffect(() => {
    fetch(`/api/provinces/${lang}`)
      .then(res => res.json())
      .then(setProvinces);
    
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
        .then(res => res.json())
        .then(setDistricts);
      
      setSelectedDistrict(null);
      setSelectedMunicipality(null);
      setMunicipalities([]);
      setWards([]);
    }
  }, [selectedProvince, lang]);

  // Fetch municipalities when district changes
  useEffect(() => {
    if (selectedDistrict !== null) {
      fetch(`/api/municipalities/${lang}?district=${selectedDistrict}`)
        .then(res => res.json())
        .then(setMunicipalities);
      
      setSelectedMunicipality(null);
      setWards([]);
    }
  }, [selectedDistrict, lang]);

  // Fetch wards when municipality changes
  useEffect(() => {
    if (selectedMunicipality !== null) {
      fetch(`/api/wards/${lang}?municipality=${selectedMunicipality}`)
        .then(res => res.json())
        .then(setWards);
    }
  }, [selectedMunicipality, lang]);

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Nepal Administrative Data</h1>

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

      {/* Province Selector */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Province:</label>
        <select
          value={selectedProvince ?? ""}
          onChange={(e) => setSelectedProvince(Number(e.target.value))}
          className="border p-2 rounded w-full"
        >
          <option value="">-- Select Province --</option>
          {provinces.map(p => (
            <option key={p.code} value={p.code}>{p.name}</option>
          ))}
        </select>
      </div>

      {/* District Selector */}
      {districts.length > 0 && (
        <div className="mb-4">
          <label className="block mb-1 font-medium">District:</label>
          <select
            value={selectedDistrict ?? ""}
            onChange={(e) => setSelectedDistrict(Number(e.target.value))}
            className="border p-2 rounded w-full"
          >
            <option value="">-- Select District --</option>
            {districts.map(d => (
              <option key={d.code} value={d.code}>{d.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Municipality Selector */}
      {municipalities.length > 0 && (
        <div className="mb-4">
          <label className="block mb-1 font-medium">Municipality:</label>
          <select
            value={selectedMunicipality ?? ""}
            onChange={(e) => setSelectedMunicipality(Number(e.target.value))}
            className="border p-2 rounded w-full"
          >
            <option value="">-- Select Municipality --</option>
            {municipalities.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Wards */}
      {wards.length > 0 && (
        <div className="mt-4">
          <h2 className="font-semibold mb-2">Wards:</h2>
          <ul className="list-disc pl-5">
            {wards.map(w => (
              <li key={w.id}>{w.name}</li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
