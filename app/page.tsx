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

  const [selectedProvince, setSelectedProvince] = useState<number | "">("");
  const [selectedDistrict, setSelectedDistrict] = useState<number | "">("");
  const [selectedMunicipality, setSelectedMunicipality] = useState<number | "">("");

  // Fetch provinces
  useEffect(() => {
    fetch(`/api/provinces/${lang}`)
      .then(res => res.json())
      .then(setProvinces);

    // Reset selections
    setSelectedProvince("");
    setSelectedDistrict("");
    setSelectedMunicipality("");
    setDistricts([]);
    setMunicipalities([]);
    setWards([]);
  }, [lang]);

  // Fetch districts when province changes
  useEffect(() => {
    if (selectedProvince !== "") {
      fetch(`/api/districts/${lang}?province=${selectedProvince}`)
        .then(res => res.json())
        .then(setDistricts);

      setSelectedDistrict("");
      setSelectedMunicipality("");
      setMunicipalities([]);
      setWards([]);
    } else {
      setDistricts([]);
      setSelectedDistrict("");
      setMunicipalities([]);
      setWards([]);
    }
  }, [selectedProvince, lang]);

  // Fetch municipalities when district changes
  useEffect(() => {
    if (selectedDistrict !== "") {
      fetch(`/api/municipalities/${lang}?district=${selectedDistrict}`)
        .then(res => res.json())
        .then(setMunicipalities);

      setSelectedMunicipality("");
      setWards([]);
    } else {
      setMunicipalities([]);
      setSelectedMunicipality("");
      setWards([]);
    }
  }, [selectedDistrict, lang]);

  // Fetch wards when municipality changes
  useEffect(() => {
    if (selectedMunicipality !== "") {
      fetch(`/api/wards/${lang}?municipality=${selectedMunicipality}`)
        .then(res => res.json())
        .then(setWards);
    } else {
      setWards([]);
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
  value={selectedProvince} // this can be number or ""
  onChange={(e) => setSelectedProvince(Number(e.target.value))}
>
  {provinces.map(p => (
    <option key={p.code} value={p.code}>{p.name}</option>
  ))}
</select>
      </div>

      {/* District Selector */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">District:</label>
        <select
          value={selectedDistrict}
          onChange={(e) => {
            const val = Number(e.target.value);
            setSelectedDistrict(isNaN(val) ? "" : val);
          }}
          className="border p-2 rounded w-full"
          disabled={districts.length === 0}
        >
          <option value="">-- Select District --</option>
          {districts.map((d, idx) => (
            <option key={d.code ?? idx} value={d.code}>{d.name}</option>
          ))}
        </select>
      </div>

      {/* Municipality Selector */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Municipality:</label>
        <select
          value={selectedMunicipality}
          onChange={(e) => {
            const val = Number(e.target.value);
            setSelectedMunicipality(isNaN(val) ? "" : val);
          }}
          className="border p-2 rounded w-full"
          disabled={municipalities.length === 0}
        >
          <option value="">-- Select Municipality --</option>
          {municipalities.map((m, idx) => (
            <option key={m.id ?? idx} value={m.id}>{m.name}</option>
          ))}
        </select>
      </div>

      {/* Wards */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Wards:</label>
        <select
          className="border p-2 rounded w-full"
          disabled={wards.length === 0}
        >
          <option value="">-- Select Ward --</option>
          {wards.map((w, idx) => (
            <option key={w.id ?? idx} value={w.id}>{w.name}</option>
          ))}
        </select>
      </div>
    </main>
  );
}
