"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [lang, setLang] = useState<"en" | "np">("en");
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [municipalities, setMunicipalities] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);

  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedMunicipality, setSelectedMunicipality] = useState<string>("");

  // Fetch provinces
  useEffect(() => {
    fetch(`/api/provinces/${lang}`).then(r => r.json()).then(setProvinces);
    setSelectedProvince(""); setSelectedDistrict(""); setSelectedMunicipality("");
    setDistricts([]); setMunicipalities([]); setWards([]);
  }, [lang]);

  // Fetch districts
  useEffect(() => {
    if (selectedProvince) {
      fetch(`/api/districts/${lang}?province=${selectedProvince}`)
        .then(r => r.json())
        .then(setDistricts);
    } else setDistricts([]);
    setSelectedDistrict(""); setSelectedMunicipality("");
    setMunicipalities([]); setWards([]);
  }, [selectedProvince, lang]);

  // Fetch municipalities
  useEffect(() => {
    if (selectedDistrict) {
      fetch(`/api/municipalities/${lang}?district=${selectedDistrict}`)
        .then(r => r.json())
        .then(setMunicipalities);
    } else setMunicipalities([]);
    setSelectedMunicipality(""); setWards([]);
  }, [selectedDistrict, lang]);

  // Fetch wards
  useEffect(() => {
    if (selectedMunicipality) {
      fetch(`/api/wards/${lang}?municipality=${selectedMunicipality}`)
        .then(r => r.json())
        .then(setWards);
    } else setWards([]);
  }, [selectedMunicipality, lang]);

  return (
    <main className="p-6 max-w-4xl mx-auto space-y-4">
      <h1 className="text-3xl font-bold text-center">Nepal Administrative Data</h1>

      {/* Language */}
      <select value={lang} onChange={e => setLang(e.target.value as "en" | "np")}>
        <option value="en">English</option>
        <option value="np">Nepali</option>
      </select>

      {/* Province */}
      <select value={selectedProvince} onChange={e => setSelectedProvince(e.target.value)}>
        <option value="">-- Select Province --</option>
        {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
      </select>

      {/* District */}
      <select value={selectedDistrict} onChange={e => setSelectedDistrict(e.target.value)} disabled={!districts.length}>
        <option value="">-- Select District --</option>
        {districts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
      </select>

      {/* Municipality */}
      <select value={selectedMunicipality} onChange={e => setSelectedMunicipality(e.target.value)} disabled={!municipalities.length}>
        <option value="">-- Select Municipality --</option>
        {municipalities.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
      </select>

      {/* Wards */}
      <select disabled={!wards.length}>
        <option value="">-- Select Ward --</option>
        {wards.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
      </select>
    </main>
  );
}
