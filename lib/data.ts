import provincesEn from "../data/provinces/en.json";
import provincesNp from "../data/provinces/np.json";

import districtsEn from "../data/districts/en.json";
import districtsNp from "../data/districts/np.json";

import municipalitiesEn from "../data/municipalities/en.json";
import municipalitiesNp from "../data/municipalities/np.json";

import categoriesEn from "../data/categories/en.json";
import categoriesNp from "../data/categories/np.json";

import alldatasetEn from "../data/alldataset/en.json";
import alldatasetNp from "../data/alldataset/np.json";

export type Lang = "en" | "np";

export const getData = (type: string, lang: Lang = "en") => {
  switch (type) {
    case "provinces":
      return lang === "np" ? provincesNp : provincesEn;
    case "districts":
      return lang === "np" ? districtsNp : districtsEn;
    case "municipalities":
      return lang === "np" ? municipalitiesNp : municipalitiesEn;
    case "categories":
      return lang === "np" ? categoriesNp : categoriesEn;
    case "alldataset":
      return lang === "np" ? alldatasetNp : alldatasetEn;
    default:
      return [];
  }
};
