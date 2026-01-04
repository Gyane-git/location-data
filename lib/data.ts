import provincesEn from "../data/provinces/en.json";
import provincesNp from "../data/provinces/np.json";

import districtsEn from "../data/districts/en.json";
import districtsNp from "../data/districts/np.json";

import municipalitiesEn from "../data/municipalities/en.json"; // municipalities with wards
import municipalitiesNp from "../data/municipalities/np.json";


import mwardNp from "../data/alldataset/np.json";
import mwardEn from "../data/alldataset/en.json";

import categoriesEn from "../data/categories/en.json";
import categoriesNp from "../data/categories/np.json";

export type Lang = "en" | "np";

export function getData(
  type: "provinces" | "districts" | "municipalities" | "categories" | "wards",
  lang: Lang
) {
  switch (type) {
    case "provinces": return lang === "np" ? provincesNp : provincesEn;
    case "districts": return lang === "np" ? districtsNp : districtsEn;
    case "municipalities": return lang === "np" ? municipalitiesNp : municipalitiesEn;
    case "categories": return lang === "np" ? categoriesNp : categoriesEn;
    case "wards": return lang === "np" ? mwardNp : mwardEn;
    default: return [];
  }
}
