"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  getData,
  Lang,
  Province,
  District,
  Municipality,
  DatasetProvince,
  DatasetDistrict,
  DatasetMunicipality,
  RawWard,
} from "../lib/data";

type WardItem = {
  id: string;
  name: string;
};

type SelectProps = {
  label: string;
  value: number | string | null;
  onChange: (value: string | null) => void;
  options: Array<{ value: string; label: string }>;
  disabled?: boolean;
  helper?: string;
};

type StatCardProps = {
  label: string;
  value: string | number;
  hint: string;
};

type InfoCardProps = {
  title: string;
  subtitle: string;
  area?: string;
  website?: string;
  headquarters?: string;
};

type ApiDoc = {
  title: string;
  endpoint: string;
  description: string;
  howToUse: string;
};

type MapDoc = {
  title: string;
  value: string;
  description: string;
};

function getDistrictList(province: DatasetProvince): DatasetDistrict[] {
  return Array.isArray(province.districts)
    ? province.districts
    : Object.values(province.districts);
}

function getMunicipalityList(district: DatasetDistrict): DatasetMunicipality[] {
  return Array.isArray(district.municipalities)
    ? district.municipalities
    : Object.values(district.municipalities);
}

function normalizeWard(ward: RawWard, index: number): WardItem {
  if (typeof ward === "number" || typeof ward === "string") {
    const id = String(ward);
    return { id, name: `Ward ${id}` };
  }

  const id = ward.id != null ? String(ward.id) : String(index + 1);
  const name = ward.wardName || ward.name || `Ward ${id}`;
  return { id, name };
}

function toEnglishDigits(value: string): string {
  const map: Record<string, string> = {
    "०": "0",
    "१": "1",
    "२": "2",
    "३": "3",
    "४": "4",
    "५": "5",
    "६": "6",
    "७": "7",
    "८": "8",
    "९": "9",
  };

  return value.replace(/[०-९]/g, (digit) => map[digit] ?? digit);
}

function parseArea(area?: string): number {
  if (!area) return 0;
  const normalized = toEnglishDigits(area).replace(/,/g, "").trim();
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function Select({ label, value, onChange, options, disabled = false, helper }: SelectProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold tracking-wide text-slate-700">{label}</label>
        {helper ? <span className="text-xs text-slate-500">{helper}</span> : null}
      </div>
      <select
        value={value ?? ""}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value || null)}
        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-900 disabled:cursor-not-allowed disabled:bg-slate-100"
      >
        <option value="">-- Select {label} --</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <div className="glass-card rounded-2xl p-3 sm:p-4 min-h-[118px]">
      <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-1.5 text-2xl font-bold text-slate-900 sm:text-3xl">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{hint}</p>
    </div>
  );
}

function InfoCard({ title, subtitle, area, website, headquarters }: InfoCardProps) {
  return (
    <article className="glass-card rounded-2xl p-3 sm:p-4">
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
      <div className="mt-3 space-y-1 text-xs text-slate-600">
        {area ? <p>Area: {area}</p> : null}
        {headquarters ? <p>Headquarter: {headquarters}</p> : null}
        {website ? (
          <a
            href={website}
            target="_blank"
            rel="noreferrer"
            className="inline-block text-slate-900 underline decoration-slate-400 underline-offset-2"
          >
            Official website
          </a>
        ) : null}
      </div>
    </article>
  );
}

export default function Home() {
  const [lang, setLang] = useState<Lang>("en");
  const [provinceId, setProvinceId] = useState<number | null>(null);
  const [districtId, setDistrictId] = useState<number | null>(null);
  const [municipalityId, setMunicipalityId] = useState<number | null>(null);
  const [selectedWardId, setSelectedWardId] = useState<string | null>(null);
  const [mapRefreshKey, setMapRefreshKey] = useState(0);

  const provinces = getData("provinces", lang);
  const districtsData = getData("districts", lang);
  const municipalitiesData = getData("municipalities", lang);
  const categories = getData("categories", lang);
  const allDataset = getData("alldataset", lang);

  const categoryById = useMemo(() => {
    const lookup = new Map<number, string>();
    categories.forEach((category) => {
      lookup.set(category.id, category.name);
    });
    return lookup;
  }, [categories]);

  const selectedProvince = useMemo<Province | undefined>(
    () => provinces.find((item) => item.id === provinceId),
    [provinces, provinceId]
  );

  const districts = useMemo<District[]>(() => {
    if (provinceId == null) return [];
    return districtsData.filter((district) => district.province_id === provinceId);
  }, [provinceId, districtsData]);

  const selectedDistrict = useMemo<District | undefined>(
    () => districts.find((item) => item.id === districtId),
    [districts, districtId]
  );

  const municipalities = useMemo<Municipality[]>(() => {
    if (districtId == null) return [];
    return municipalitiesData.filter((municipality) => municipality.district_id === districtId);
  }, [districtId, municipalitiesData]);

  const selectedMunicipality = useMemo<Municipality | undefined>(
    () => municipalities.find((item) => item.id === municipalityId),
    [municipalities, municipalityId]
  );

  const wards = useMemo<WardItem[]>(() => {
    if (provinceId == null || districtId == null || municipalityId == null) return [];

    const province = allDataset.find((item) => item.id === provinceId);
    if (!province) return [];

    const district = getDistrictList(province).find((item) => item.id === districtId);
    if (!district) return [];

    const municipality = getMunicipalityList(district).find((item) => item.id === municipalityId);
    if (!municipality) return [];

    return municipality.wards.map(normalizeWard);
  }, [provinceId, districtId, municipalityId, allDataset]);

  const selectedWard = useMemo<WardItem | undefined>(
    () => wards.find((ward) => ward.id === selectedWardId),
    [wards, selectedWardId]
  );

  const completionScore = useMemo(() => {
    let score = 0;
    if (provinceId != null) score += 25;
    if (districtId != null) score += 25;
    if (municipalityId != null) score += 25;
    if (selectedWardId != null) score += 25;
    return score;
  }, [provinceId, districtId, municipalityId, selectedWardId]);

  const topMunicipalities = useMemo(() => {
    return [...municipalities]
      .sort((a, b) => parseArea(b.area_sq_km) - parseArea(a.area_sq_km))
      .slice(0, 6);
  }, [municipalities]);

  const provinceOptions = useMemo<Array<{ value: string; label: string }>>(
    () => provinces.map((province) => ({ value: String(province.id), label: province.name })),
    [provinces]
  );

  const districtOptions = useMemo<Array<{ value: string; label: string }>>(
    () => districts.map((district) => ({ value: String(district.id), label: district.name })),
    [districts]
  );

  const municipalityOptions = useMemo<Array<{ value: string; label: string }>>(
    () =>
      municipalities.map((municipality) => ({
        value: String(municipality.id),
        label: `${municipality.name} (${categoryById.get(municipality.category_id) ?? ""})`,
      })),
    [municipalities, categoryById]
  );

  const wardOptions = useMemo<Array<{ value: string; label: string }>>(
    () => wards.map((ward) => ({ value: ward.id, label: ward.name })),
    [wards]
  );

  const selectedAddress = useMemo(() => {
    const parts = [
      selectedWard?.name,
      selectedMunicipality?.name,
      selectedDistrict?.name,
      selectedProvince?.name,
      "Nepal",
    ]
      .filter(Boolean)
      .join(", ");

    return parts || "Nepal";
  }, [selectedWard, selectedMunicipality, selectedDistrict, selectedProvince]);

  const mapEmbedUrl = useMemo(
    () =>
      `https://www.google.com/maps?q=${encodeURIComponent(selectedAddress)}&output=embed&refresh=${mapRefreshKey}`,
    [selectedAddress, mapRefreshKey]
  );

  const mapExternalUrl = useMemo(
    () => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedAddress)}`,
    [selectedAddress]
  );

  const provinceParam = provinceId ?? "{provinceId}";
  const districtParam = districtId ?? "{districtId}";
  const municipalityParam = municipalityId ?? "{municipalityId}";

  const apiDocs: ApiDoc[] = [
    {
      title: "Provinces",
      endpoint: `/api/provinces/${lang}`,
      description: "Returns all provinces in the selected language.",
      howToUse: "Call directly when your app starts to populate the province dropdown.",
    },
    {
      title: "Districts",
      endpoint: `/api/districts/${lang}?province=${provinceParam}`,
      description: "Returns districts and can filter by province id using the province query param.",
      howToUse: "Send selected province id to load only related districts.",
    },
    {
      title: "Municipalities",
      endpoint: `/api/municipalities/${lang}?district=${districtParam}`,
      description: "Returns municipalities and can filter by district id using the district query param.",
      howToUse: "Send selected district id to load only related municipalities.",
    },
    {
      title: "Wards",
      endpoint: `/api/wards/${lang}?province=${provinceParam}&district=${districtParam}&municipality=${municipalityParam}`,
      description: "Returns normalized wards for the selected municipality.",
      howToUse: "Send province, district, and municipality ids together to get ward list for map focus.",
    },
    {
      title: "All Dataset",
      endpoint: `/api/alldataset/${lang}`,
      description: "Returns complete nested dataset (province -> district -> municipality -> wards).",
      howToUse: "Use for advanced analytics pages or offline caching in one request.",
    },
  ];

  const mapDocs: MapDoc[] = [
    {
      title: "Map Embed URL",
      value: mapEmbedUrl,
      description: "Iframe URL that auto-focuses your selected address.",
    },
    {
      title: "Open Map URL",
      value: mapExternalUrl,
      description: "External Google Maps URL for full navigation mode.",
    },
    {
      title: "Focus Source",
      value: selectedAddress,
      description: "Ward is highest priority, then municipality, district, and province.",
    },
  ];

  return (
    <main className="mx-auto max-w-6xl px-3 py-5 sm:px-4 sm:py-7 md:px-6 md:py-10">
      <section className="hero-panel rounded-2xl p-4 sm:rounded-3xl sm:p-6 md:p-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-700">Nepal Public Data Portal</p>
            <h1 className="mt-2 text-2xl font-bold leading-tight text-slate-900 sm:text-3xl md:text-5xl">
              Administrative Intelligence Dashboard
            </h1>
            <p className="mt-3 max-w-3xl text-sm text-slate-700 md:text-base">
              Explore verified location datasets with map-ready selections and public APIs.
            </p>
          </div>

          <div className="grid w-full grid-cols-2 rounded-2xl border border-slate-300 bg-white/80 p-1 shadow-sm sm:inline-flex sm:w-auto">
            {(["en", "np"] as Lang[]).map((language) => (
              <button
                key={language}
                onClick={() => {
                  setLang(language);
                  setProvinceId(null);
                  setDistrictId(null);
                  setMunicipalityId(null);
                  setSelectedWardId(null);
                }}
                className={`w-full rounded-xl px-4 py-2 text-sm font-medium transition ${
                  lang === language
                    ? "bg-slate-900 text-white"
                    : "bg-transparent text-slate-700 hover:bg-slate-100"
                }`}
              >
                {language === "en" ? "English" : "नेपाली"}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-5 sm:hidden">
        <div className="glass-card rounded-2xl p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Location Summary</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
              <p className="text-[11px] uppercase tracking-[0.08em] text-slate-500">Provinces</p>
              <p className="mt-1 text-xl font-bold text-slate-900">{provinces.length}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
              <p className="text-[11px] uppercase tracking-[0.08em] text-slate-500">Districts</p>
              <p className="mt-1 text-xl font-bold text-slate-900">{districts.length}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
              <p className="text-[11px] uppercase tracking-[0.08em] text-slate-500">Municipalities</p>
              <p className="mt-1 text-xl font-bold text-slate-900">{municipalities.length}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
              <p className="text-[11px] uppercase tracking-[0.08em] text-slate-500">Wards</p>
              <p className="mt-1 text-xl font-bold text-slate-900">{wards.length}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 hidden gap-3 sm:grid sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Provinces" value={provinces.length} hint="Total available" />
        <StatCard label="Districts" value={districts.length} hint="In selected province" />
        <StatCard label="Municipalities" value={municipalities.length} hint="In selected district" />
        <StatCard label="Wards" value={wards.length} hint="In selected municipality" />
      </section>

      <section className="mt-5 grid gap-4 sm:mt-6 sm:gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="glass-card rounded-2xl p-4 sm:rounded-3xl sm:p-5 md:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Explorer</h2>
            <span className="rounded-full bg-slate-900 px-3 py-1 text-xs text-white">Selection Flow</span>
          </div>

          <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
            <Select
              label="Province"
              value={provinceId}
              onChange={(value) => {
                setProvinceId(value ? Number(value) : null);
                setDistrictId(null);
                setMunicipalityId(null);
                setSelectedWardId(null);
              }}
              options={provinceOptions}
              helper={`${provinces.length} options`}
            />

            <Select
              label="District"
              value={districtId}
              disabled={provinceId == null}
              onChange={(value) => {
                setDistrictId(value ? Number(value) : null);
                setMunicipalityId(null);
                setSelectedWardId(null);
              }}
              options={districtOptions}
              helper={`${districts.length} options`}
            />

            <Select
              label="Municipality"
              value={municipalityId}
              disabled={districtId == null}
              onChange={(value) => {
                setMunicipalityId(value ? Number(value) : null);
                setSelectedWardId(null);
              }}
              options={municipalityOptions}
              helper={`${municipalities.length} options`}
            />

            <Select
              label="Ward (Map Focus)"
              value={selectedWardId}
              disabled={wards.length === 0}
              onChange={setSelectedWardId}
              options={wardOptions}
              helper={`${wards.length} options`}
            />
          </div>

          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:mt-5 sm:p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-800">Selection Completion</p>
              <p className="text-sm font-semibold text-slate-900">{completionScore}%</p>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full rounded-full bg-slate-900 transition-all" style={{ width: `${completionScore}%` }} />
            </div>
            <p className="mt-2 text-xs text-slate-600">
              Complete all levels for most accurate map highlight and ward-level detail.
            </p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 sm:rounded-3xl sm:p-5 md:p-6">
          <h2 className="text-xl font-semibold text-slate-900">Top Municipalities by Area</h2>
          <p className="mt-2 text-sm text-slate-600">Ranked from your currently selected district.</p>

          {topMunicipalities.length > 0 ? (
            <div className="mt-3 space-y-2.5 sm:mt-4 sm:space-y-3">
              {topMunicipalities.map((municipality, index) => {
                const maxArea = parseArea(topMunicipalities[0]?.area_sq_km);
                const width = maxArea > 0 ? (parseArea(municipality.area_sq_km) / maxArea) * 100 : 0;

                return (
                  <div key={municipality.id} className="rounded-xl border border-slate-200 bg-white p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-900">
                        {index + 1}. {municipality.name}
                      </p>
                      <span className="text-xs text-slate-600">{municipality.area_sq_km} sq.km</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-slate-200">
                      <div className="h-2 rounded-full bg-sky-600" style={{ width: `${width}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-600">Select a district to view top municipalities by area.</p>
          )}
        </div>
      </section>

      <section className="mt-5 grid gap-3 sm:mt-6 sm:gap-4 md:grid-cols-3">
        <InfoCard
          title={selectedProvince?.name ?? "Province"}
          subtitle={selectedProvince ? "Current province selection" : "Choose a province to see metadata"}
          area={selectedProvince?.area_sq_km}
          website={selectedProvince?.website}
          headquarters={selectedProvince?.headquarter}
        />

        <InfoCard
          title={selectedDistrict?.name ?? "District"}
          subtitle={selectedDistrict ? "Current district selection" : "Choose a district to see metadata"}
          area={selectedDistrict?.area_sq_km}
          website={selectedDistrict?.website}
          headquarters={selectedDistrict?.headquarter}
        />

        <InfoCard
          title={selectedMunicipality?.name ?? "Municipality"}
          subtitle={
            selectedMunicipality
              ? `Category: ${categoryById.get(selectedMunicipality.category_id) ?? "Unknown"}`
              : "Choose a municipality to see metadata"
          }
          area={selectedMunicipality?.area_sq_km}
          website={selectedMunicipality?.website}
        />
      </section>

      <section className="mt-5 glass-card rounded-2xl p-4 sm:mt-6 sm:rounded-3xl sm:p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Location Map</h2>
            <p className="mt-1 text-sm text-slate-600">Map updates from your dropdown selections.</p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <button
              onClick={() => setMapRefreshKey((value) => value + 1)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 hover:bg-slate-100"
            >
              Reload Map
            </button>
            <a
              href={mapExternalUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 hover:bg-slate-100"
            >
              Open in Google Maps
            </a>
          </div>
        </div>

        <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-700">Highlighted Area</p>
          <p className="mt-1 text-sm font-medium text-amber-900">{selectedAddress}</p>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <iframe
            title="Selected location map"
            src={mapEmbedUrl}
            className="h-[300px] w-full sm:h-[360px] lg:h-[420px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      <section className="mt-5 glass-card rounded-2xl p-4 sm:mt-6 sm:rounded-3xl sm:p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Public API Guide</h2>
            <p className="mt-1 text-sm text-slate-600">Beginner-friendly reference for using this site as a public data API.</p>
          </div>
          <span className="rounded-full bg-slate-900 px-3 py-1 text-xs text-white">Language: {lang.toUpperCase()}</span>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {apiDocs.map((api) => (
            <article key={api.title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-base font-semibold text-slate-900">{api.title}</h3>
              <p className="mt-2 rounded-lg bg-slate-100 px-3 py-2 font-mono text-xs text-slate-800">{api.endpoint}</p>
              <p className="mt-3 text-sm text-slate-700">{api.description}</p>
              <p className="mt-2 text-xs text-slate-600">
                <span className="font-semibold text-slate-800">How to use:</span> {api.howToUse}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <h3 className="text-sm font-semibold text-emerald-900">Map Guide (for new users)</h3>
          <div className="mt-3 space-y-3">
            {mapDocs.map((item) => (
              <article key={item.title} className="rounded-xl border border-emerald-200 bg-white p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-800">{item.title}</p>
                <p className="mt-1 break-all rounded-md bg-emerald-100 px-2 py-1 font-mono text-xs text-emerald-900">{item.value}</p>
                <p className="mt-2 text-xs text-emerald-900">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="mt-6 rounded-2xl border border-slate-200 bg-white px-4 py-5 shadow-sm sm:mt-8 sm:rounded-3xl sm:px-5 sm:py-6">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <Image
              src="/devminlogo.png"
              alt="DevMind Solutions Logo"
              width={48}
              height={48}
              className="h-12 w-12 rounded-xl border border-slate-200 object-contain bg-white p-1"
            />
            <div>
              <p className="text-sm font-semibold text-slate-900">DevMind Solutions</p>
              <p className="text-xs text-slate-600">
                Building reliable digital products with clean, scalable engineering.
              </p>
            </div>
          </div>

          <div className="text-sm text-slate-700">
            <p className="font-medium text-slate-900">Contact</p>
            <a
              href="https://gyanendrasah.com.np"
              target="_blank"
              rel="noreferrer"
              className="text-slate-700 underline decoration-slate-400 underline-offset-2"
            >
              gyanendrasah.com.np
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
