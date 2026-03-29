import provincesEn from "../data/provinces/en.json";
import provincesNp from "../data/provinces/np.json";
import districtsEn from "../data/districts/en.json";
import districtsNp from "../data/districts/np.json";
import municipalitiesEn from "../data/municipalities/en.json";
import municipalitiesNp from "../data/municipalities/np.json";
import allDatasetEn from "../data/alldataset/en.json";
import allDatasetNp from "../data/alldataset/np.json";
import categoriesEn from "../data/categories/en.json";
import categoriesNp from "../data/categories/np.json";

export type Lang = "en" | "np";

export type Province = {
  id: number;
  name: string;
  area_sq_km: string;
  website: string;
  headquarter: string;
};

export type District = {
  id: number;
  province_id: number;
  name: string;
  area_sq_km: string;
  website: string;
  headquarter: string;
};

export type Municipality = {
  id: number;
  district_id: number;
  category_id: number;
  name: string;
  area_sq_km: string;
  website: string;
  wards: string;
};

export type Category = {
  id: number;
  name: string;
  short_code: string;
};

export type RawWard =
  | number
  | string
  | {
      id?: number | string;
      name?: string;
      wardName?: string;
    };

export type DatasetMunicipality = {
  id: number;
  district_id: number;
  category_id: number;
  name: string;
  area_sq_km: string;
  website: string;
  wards: RawWard[];
};

export type DatasetDistrict = District & {
  municipalities: DatasetMunicipality[] | Record<string, DatasetMunicipality>;
};

export type DatasetProvince = Province & {
  districts: DatasetDistrict[] | Record<string, DatasetDistrict>;
};

export type AllDataset = DatasetProvince[];

const DATA = {
  provinces: {
    en: provincesEn as Province[],
    np: provincesNp as Province[],
  },
  districts: {
    en: districtsEn as District[],
    np: districtsNp as District[],
  },
  municipalities: {
    en: municipalitiesEn as Municipality[],
    np: municipalitiesNp as Municipality[],
  },
  categories: {
    en: categoriesEn as Category[],
    np: categoriesNp as Category[],
  },
  alldataset: {
    en: allDatasetEn as AllDataset,
    np: allDatasetNp as AllDataset,
  },
} as const;

export function getData(type: "provinces", lang: Lang): Province[];
export function getData(type: "districts", lang: Lang): District[];
export function getData(type: "municipalities", lang: Lang): Municipality[];
export function getData(type: "categories", lang: Lang): Category[];
export function getData(type: "alldataset" | "wards", lang: Lang): AllDataset;
export function getData(
  type: "provinces" | "districts" | "municipalities" | "categories" | "wards" | "alldataset",
  lang: Lang
) {
  switch (type) {
    case "provinces":
      return DATA.provinces[lang];
    case "districts":
      return DATA.districts[lang];
    case "municipalities":
      return DATA.municipalities[lang];
    case "categories":
      return DATA.categories[lang];
    case "alldataset":
    case "wards":
      return DATA.alldataset[lang];
    default:
      return [];
  }
}
