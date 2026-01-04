import provincesEn from "../data/provinces/en.json";
import provincesNp from "../data/provinces/np.json";

import districtsEn from "../data/districts/en.json";
import districtsNp from "../data/districts/np.json";

import municipalitiesEn from "../data/alldataset/en.json"; // municipalities with wards
import municipalitiesNp from "../data/alldataset/np.json";

import categoriesEn from "../data/categories/en.json";
import categoriesNp from "../data/categories/np.json";

export type Lang = "en" | "np";

export function getData(
  type: "provinces" | "districts" | "municipalities" | "categories",
  lang: Lang
) {
  switch (type) {
    case "provinces": return lang === "np" ? provincesNp : provincesEn;
    case "districts": return lang === "np" ? districtsNp : districtsEn;
    case "municipalities": return lang === "np" ? municipalitiesNp : municipalitiesEn;
    case "categories": return lang === "np" ? categoriesNp : categoriesEn;
    default: return [];
  }
}
