import { WineStructureSection } from "../models/wine-structure-sections.model";

export const WINE_STRUCTURE_SECTIONS: Array<WineStructureSection> = [
  {
    min: "light",
    max: "bold",
    decrease: ["super light", "very light"],
    increase: [
      "super bold",
      "full bodied",
      "full bold",
      "full body",
      "very bold",
    ],
  },
  {
    min: "smooth",
    max: "tannic",
    decrease: ["smooth", "smoothy", "very smooth", "low tannic"],
    increase: ["soft tannic", "strong tannic", "harsh tannins"],
  },
  {
    min: "dry",
    max: "sweet",
    decrease: ["dry"],
    increase: ["bit sweet", "soft sweet", "light sweet"],
  },
  {
    min: "soft",
    max: "acidic",
    decrease: ["no acidic"],
    increase: ["very acidic", "acidity", "slightly acidic"],
  },
];
