export interface Teacher {
  id: number;
  name: string;
  kuerzel: string;
  eigenschaften: {
    glatze: boolean;
    halbglatze: boolean;
    brille: boolean;
    kuerzel_enthaelt_a: boolean;
    kuerzel_enthaelt_e: boolean;
    "Mag. oder Ing.": boolean;
    geschlecht: string;
    hauptfach: boolean;
    technisches_fach: boolean;
    abteilung: string;
  };
} 