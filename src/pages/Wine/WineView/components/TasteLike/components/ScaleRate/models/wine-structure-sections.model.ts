import { WineStructure } from "../../../../../../models/wine.model";

export interface WineStructureSection {
  min: string;
  max: keyof WineStructure;
  decrease: Array<string>;
  increase: Array<string>;
}
