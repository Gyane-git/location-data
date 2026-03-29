"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
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

type SelectOption = {
  value: number;
  label: string;
};

type WardItem = {
  id: string;
  name: string;
};

type SelectProps = {
  label: string;
  value: number | null;
  onChange: (value: number | null) => void;
  options: SelectOption[];
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
        onChange={(event) =>
          onChange(event.target.value ? Number(event.target.value) : null)
        }
        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-900 disabled:cursor-not-allowed disabled:bg-slate-100"
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
    <div className="glass-card rounded-2xl p-4">
      <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{hint}</p>
    </div>
  );
}

function InfoCard({ title, subtitle, area, website, headquarters }: InfoCardProps) {
  return (
    <article className="glass-card rounded-2xl p-4">
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

  const [districtQuery, setDistrictQuery] = useState("");
  const [municipalityQuery, setMunicipalityQuery] = useState("");
  const [wardQuery, setWardQuery] = useState("");

  const provinces = getData("provinces", lang);
  const districtsData = getData("districts", lang);
  const municipalitiesData = getData("municipalities", lang);
  const categories = getData("categories", lang);
  const allDataset = getData("alldataset", lang);

  const selectedProvince = useMemo<Province | undefined>(
    () => provinces.find((item) => item.id === provinceId),
    [provinces, provinceId]
  );

  const districts = useMemo<District[]>(() => {
    if (provinceId == null) {
      return [];
    }

    return districtsData.filter((district) => district.province_id === provinceId);
  }, [provinceId, districtsData]);

  const filteredDistricts = useMemo<District[]>(() => {
    const query = districtQuery.trim().toLowerCase();
    if (!query) {
      return districts;
    }

    return districts.filter((district) => district.name.toLowerCase().includes(query));
  }, [districts, districtQuery]);

  const selectedDistrict = useMemo<District | undefined>(
    () => districts.find((item) => item.id === districtId),
    [districts, districtId]
  );

  const municipalities = useMemo<Municipality[]>(() => {
    if (districtId == null) {
      return [];
    }

    return municipalitiesData.filter((municipality) => municipality.district_id === districtId);
  }, [districtId, municipalitiesData]);

  const filteredMunicipalities = useMemo<Municipality[]>(() => {
    const query = municipalityQuery.trim().toLowerCase();
    if (!query) {
      return municipalities;
    }

    return municipalities.filter((municipality) => municipality.name.toLowerCase().includes(query));
  }, [municipalities, municipalityQuery]);

  const selectedMunicipality = useMemo<Municipality | undefined>(
    () => municipalities.find((item) => item.id === municipalityId),
    [municipalities, municipalityId]
  );

  const wards = useMemo<WardItem[]>(() => {
    if (provinceId == null || districtId == null || municipalityId == null) {
      return [];
    }

    const province = allDataset.find((item) => item.id === provinceId);
    if (!province) {
      return [];
    }

    const district = getDistrictList(province).find((item) => item.id === districtId);
    if (!district) {
      return [];
    }

    const municipality = getMunicipalityList(district).find(
      (item) => item.id === municipalityId
    );
    if (!municipality) {
      return [];
    }

    return municipality.wards.map(normalizeWard);
  }, [provinceId, districtId, municipalityId, allDataset]);

  const filteredWards = useMemo<WardItem[]>(() => {
    const query = wardQuery.trim().toLowerCase();
    if (!query) {
      return wards;
    }

    return wards.filter((ward) => ward.name.toLowerCase().includes(query));
  }, [wards, wardQuery]);

  const selectedWard = useMemo<WardItem | undefined>(
    () => wards.find((ward) => ward.id === selectedWardId),
    [wards, selectedWardId]
  );

  const categoryById = useMemo(() => {
    const lookup = new Map<number, string>();
    categories.forEach((category) => {
      lookup.set(category.id, category.name);
    });
    return lookup;
  }, [categories]);

  const provinceOptions = useMemo<SelectOption[]>(
    () => provinces.map((province) => ({ value: province.id, label: province.name })),
    [provinces]
  );

  const districtOptions = useMemo<SelectOption[]>(
    () => filteredDistricts.map((district) => ({ value: district.id, label: district.name })),
    [filteredDistricts]
  );

  const municipalityOptions = useMemo<SelectOption[]>(
    () =>
      filteredMunicipalities.map((municipality) => ({
        value: municipality.id,
        label: `${municipality.name} (${categoryById.get(municipality.category_id) ?? ""})`,
      })),
    [filteredMunicipalities, categoryById]
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
      description:
        "Returns normalized wards for the selected municipality. Handles mixed ward data shapes internally.",
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
      description:
        "This URL is used inside the iframe. It auto-focuses the selected province, district, municipality, and optional ward.",
    },
    {
      title: "Open Map URL",
      value: mapExternalUrl,
      description:
        "This URL opens the same selected area in full Google Maps view in a new tab.",
    },
    {
      title: "Focus Source",
      value: selectedAddress,
      description:
        "Selected ward has highest priority, then municipality, district, and province. The highlighted area panel shows the exact focus text.",
    },
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-10">
      <section className="hero-panel rounded-3xl p-6 md:p-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-700">Nepal Public Data Portal</p>
            <h1 className="mt-2 text-3xl font-bold leading-tight text-slate-900 md:text-5xl">
              Administrative Intelligence Dashboard
            </h1>
            <p className="mt-3 max-w-3xl text-sm text-slate-700 md:text-base">
              Browse provinces, districts, municipalities, and wards with bilingual support,
              live filtering, and structured detail panels.
            </p>
          </div>

          <div className="inline-flex rounded-2xl border border-slate-300 bg-white/80 p-1 shadow-sm">
            {(["en", "np"] as Lang[]).map((language) => (
              <button
                key={language}
                onClick={() => {
                  setLang(language);
                  setProvinceId(null);
                  setDistrictId(null);
                  setMunicipalityId(null);
                  setSelectedWardId(null);
                  setDistrictQuery("");
                  setMunicipalityQuery("");
                  setWardQuery("");
                }}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
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

      <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Provinces" value={provinces.length} hint="Total available" />
        <StatCard label="Districts" value={districts.length} hint="In selected province" />
        <StatCard label="Municipalities" value={municipalities.length} hint="In selected district" />
        <StatCard label="Wards" value={wards.length} hint="In selected municipality" />
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="glass-card rounded-3xl p-5 md:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Explorer</h2>
            <span className="rounded-full bg-slate-900 px-3 py-1 text-xs text-white">Interactive</span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Select
              label="Province"
              value={provinceId}
              onChange={(value) => {
                setProvinceId(value);
                setDistrictId(null);
                setMunicipalityId(null);
                setSelectedWardId(null);
                setDistrictQuery("");
                setMunicipalityQuery("");
                setWardQuery("");
              }}
              options={provinceOptions}
              helper={`${provinces.length} options`}
            />

            <div className="space-y-2">
              <label className="text-sm font-semibold tracking-wide text-slate-700">Filter Districts</label>
              <input
                value={districtQuery}
                onChange={(event) => setDistrictQuery(event.target.value)}
                placeholder="Type district name"
                disabled={provinceId == null}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-900 disabled:cursor-not-allowed disabled:bg-slate-100"
              />
            </div>

            <Select
              label="District"
              value={districtId}
              disabled={provinceId == null}
              onChange={(value) => {
                setDistrictId(value);
                setMunicipalityId(null);
                setSelectedWardId(null);
                setMunicipalityQuery("");
                setWardQuery("");
              }}
              options={districtOptions}
              helper={`${filteredDistricts.length} shown`}
            />

            <div className="space-y-2">
              <label className="text-sm font-semibold tracking-wide text-slate-700">Filter Municipalities</label>
              <input
                value={municipalityQuery}
                onChange={(event) => setMunicipalityQuery(event.target.value)}
                placeholder="Type municipality name"
                disabled={districtId == null}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-900 disabled:cursor-not-allowed disabled:bg-slate-100"
              />
            </div>

            <Select
              label="Municipality"
              value={municipalityId}
              disabled={districtId == null}
              onChange={(value) => {
                setMunicipalityId(value);
                setSelectedWardId(null);
                setWardQuery("");
              }}
              options={municipalityOptions}
              helper={`${filteredMunicipalities.length} shown`}
            />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold tracking-wide text-slate-700">Ward (Map Focus)</label>
                <span className="text-xs text-slate-500">{wards.length} options</span>
              </div>
              <select
                value={selectedWardId ?? ""}
                disabled={wards.length === 0}
                onChange={(event) => setSelectedWardId(event.target.value || null)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-900 disabled:cursor-not-allowed disabled:bg-slate-100"
              >
                <option value="">-- Select Ward (Optional) --</option>
                {wards.map((ward) => (
                  <option key={ward.id} value={ward.id}>
                    {ward.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold tracking-wide text-slate-700">Filter Wards</label>
              <input
                value={wardQuery}
                onChange={(event) => setWardQuery(event.target.value)}
                placeholder="Type ward name"
                disabled={wards.length === 0}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-900 disabled:cursor-not-allowed disabled:bg-slate-100"
              />
            </div>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-5 md:p-6">
          <h2 className="text-xl font-semibold text-slate-900">API Snapshot</h2>
          <p className="mt-2 text-sm text-slate-600">Quick endpoint references for current language and filters.</p>
          <div className="mt-4 space-y-2 text-xs text-slate-700">
            <p className="rounded-lg bg-slate-100 px-3 py-2 font-mono">/api/provinces/{lang}</p>
            <p className="rounded-lg bg-slate-100 px-3 py-2 font-mono">/api/districts/{lang}?province={provinceId ?? "{id}"}</p>
            <p className="rounded-lg bg-slate-100 px-3 py-2 font-mono">/api/municipalities/{lang}?district={districtId ?? "{id}"}</p>
            <p className="rounded-lg bg-slate-100 px-3 py-2 font-mono">
              /api/wards/{lang}?province={provinceId ?? "{id}"}&district={districtId ?? "{id}"}&municipality={municipalityId ?? "{id}"}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
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

      <section className="mt-6 glass-card rounded-3xl p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-slate-900">Ward Directory</h2>
          <span className="rounded-full bg-slate-900 px-3 py-1 text-xs text-white">
            {filteredWards.length} visible
          </span>
        </div>

        {filteredWards.length > 0 ? (
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {filteredWards.map((ward) => (
              <div
                key={ward.id}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm"
              >
                {ward.name}
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-600">
            No wards to display yet. Choose province, district, and municipality.
          </p>
        )}
      </section>

      <section className="mt-6 glass-card rounded-3xl p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Location Map</h2>
            <p className="mt-1 text-sm text-slate-600">Map updates from your dropdown selections.</p>
          </div>
          <div className="flex items-center gap-2">
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

        <p className="mt-3 text-sm text-slate-700">Current location: {selectedAddress}</p>
        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <iframe
            title="Selected location map"
            src={mapEmbedUrl}
            className="h-[360px] w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      <section className="mt-6 glass-card rounded-3xl p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Public API Guide</h2>
            <p className="mt-1 text-sm text-slate-600">
              Beginner-friendly reference for using this site as a public data API.
            </p>
          </div>
          <span className="rounded-full bg-slate-900 px-3 py-1 text-xs text-white">
            Language: {lang.toUpperCase()}
          </span>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {apiDocs.map((api) => (
            <article key={api.title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-base font-semibold text-slate-900">{api.title}</h3>
              <p className="mt-2 rounded-lg bg-slate-100 px-3 py-2 font-mono text-xs text-slate-800">
                {api.endpoint}
              </p>
              <p className="mt-3 text-sm text-slate-700">{api.description}</p>
              <p className="mt-2 text-xs text-slate-600">
                <span className="font-semibold text-slate-800">How to use:</span> {api.howToUse}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-4 rounded-2xl border border-sky-200 bg-sky-50 p-4">
          <h3 className="text-sm font-semibold text-sky-900">How this works (simple flow)</h3>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-sky-900">
            <li>Load provinces, then user selects one.</li>
            <li>Use selected province id to fetch districts.</li>
            <li>Use selected district id to fetch municipalities.</li>
            <li>Use province + district + municipality ids to fetch wards.</li>
            <li>Selected location text is sent to map search to focus/highlight that area.</li>
          </ol>
        </div>

        <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <h3 className="text-sm font-semibold text-emerald-900">Map Guide (for new users)</h3>
          <div className="mt-3 space-y-3">
            {mapDocs.map((item) => (
              <article key={item.title} className="rounded-xl border border-emerald-200 bg-white p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-800">
                  {item.title}
                </p>
                <p className="mt-1 break-all rounded-md bg-emerald-100 px-2 py-1 font-mono text-xs text-emerald-900">
                  {item.value}
                </p>
                <p className="mt-2 text-xs text-emerald-900">{item.description}</p>
              </article>
            ))}
          </div>
          <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-emerald-900">
            <li>Choose Province, then District, then Municipality.</li>
            <li>Optionally choose a Ward to zoom focus more precisely.</li>
            <li>Use Reload Map if map tile does not refresh instantly.</li>
            <li>Use Open in Google Maps for full navigation mode.</li>
          </ol>
        </div>
      </section>

      <footer className="mt-8 rounded-3xl border border-slate-200 bg-white px-5 py-6 shadow-sm">
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
