// lib/data.ts
import provincesEn from "../data/provinces/en.json";
import provincesNp from "../data/provinces/np.json";

import districtsEn from "../data/districts/en.json";
import districtsNp from "../data/districts/np.json";

import municipalitiesEn from "../data/municipalities/en.json";
import municipalitiesNp from "../data/municipalities/np.json";

import wardsEn from "../data/alldataset/en.json"; // using your alldataset for wards
import wardsNp from "../data/alldataset/np.json";

export type Lang = "en" | "np";

export function getData(
  type: "provinces" | "districts" | "municipalities" | "wards",
  lang: Lang
) {
  switch (type) {
    case "provinces":
      return lang === "np" ? provincesNp : provincesEn;
    case "districts":
      return lang === "np" ? districtsNp : districtsEn;
    case "municipalities":
      return lang === "np" ? municipalitiesNp : municipalitiesEn;
    case "wards":
      return lang === "np" ? wardsNp : wardsEn;
    default:
      return [];
  }
}
