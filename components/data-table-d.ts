export type FilterType = string;

export interface Filters {
  [key: string]: {
    min: number | Date;
    max: number | Date;
  };
}

export interface Sorter {
  column: string;
  type: "asc" | "desc";
}
