export type FilterType =
  | "total"
  | "remaining"
  | "paid"
  | "paidAt"
  | "createdAt";

export interface Filters {
  total?: {
    min: number;
    max: number;
  };
  remaining?: {
    min: number;
    max: number;
  };
  paid?: {
    min: number;
    max: number;
  };
  paidAt?: {
    min: Date;
    max: Date;
  };
  createdAt?: {
    min: Date;
    max: Date;
  };
}

export type SorterType =
  | "client"
  | "total"
  | "remaining"
  | "paid"
  | "paidAt"
  | "createdAt";

export interface Sorter {
  column: SorterType;
  type: "asc" | "desc";
}
