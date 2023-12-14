import { MoveHorizontal } from "lucide-react";
import React, { Dispatch, SetStateAction } from "react";
import { Input } from "./ui/input";
import { FilterType, Filters } from "./data-table-d";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";

interface FilterRangeProps {
  filters: Filters;
  setFilters: Dispatch<SetStateAction<Filters>>;
  filter: FilterType;
  filterName: string;
  type?: "number" | "date";
}

export default function FilterRange({
  filters,
  setFilters,
  filter,
  filterName,
  type = "number",
}: FilterRangeProps) {
  function setFilterMinMax(
    field: string,
    min: number | Date,
    max: number | Date
  ) {
    let newValue;
    if (typeof min === "number" && typeof max === "number") {
      newValue = {
        ...filters,
        [field]: {
          min: Math.max(Math.min(min, max), 0),
          max: Math.max(min, max, 0),
        },
      };
    } else {
      newValue = { ...filters, [field]: { min, max } };
    }
    setFilters(newValue);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 items-center">
        <Checkbox
          checked={!!filters?.[filter]}
          onCheckedChange={(checked) => {
            console.log(checked);
            if (checked) {
              if (type == "number") {
                setFilterMinMax(filter, 0, 0);
              } else {
                setFilterMinMax(filter, new Date(), new Date());
              }
            } else {
              setFilters((old) => {
                delete old?.[filter];
                return { ...old };
              });
            }
          }}
        />
        Filtrar por "{filterName}"
      </div>
      {typeof filters?.[filter]?.max === "number" &&
        typeof filters?.[filter]?.min === "number" && (
          <>
            {filters?.[filter] && (
              <div className="flex gap-2 w-full items-center">
                <Input
                  type="number"
                  placeholder="Min"
                  value={
                    (filters?.[filter]?.min as number) > 0
                      ? (filters?.[filter]?.min as number)
                      : " "
                  }
                  onChange={(e) => {
                    setFilterMinMax(
                      filter,
                      parseInt(e.target.value),
                      filters?.[filter]?.max || 0
                    );
                  }}
                  className="px-2 py-1 w-full h-auto"
                />
                <MoveHorizontal
                  className="opacity-50 flex-shrink-0"
                  size={18}
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={
                    (filters?.[filter]?.max as number) > 0
                      ? (filters?.[filter]?.max as number)
                      : " "
                  }
                  onChange={(e) => {
                    setFilterMinMax(
                      filter,
                      filters?.[filter]?.min || 0,
                      parseInt(e.target.value)
                    );
                  }}
                  className="px-2 py-1 w-full h-auto"
                />
              </div>
            )}
          </>
        )}

      {typeof filters?.[filter]?.max === "object" &&
        typeof filters?.[filter]?.min === "object" && (
          <>
            <div className="flex gap-2 w-full items-center">
              <Input
                type="date"
                placeholder="Min"
                value={
                  formatDateToLocalInputString(
                    filters?.[filter]?.min as Date
                  ) || ""
                }
                onChange={(e) => {
                  setFilterMinMax(
                    filter,
                    new Date(e.target.value),
                    filters?.[filter]?.max || 0
                  );
                }}
                className="px-2 py-1 w-full h-auto"
              />
              <MoveHorizontal className="opacity-50 flex-shrink-0" size={18} />
              <Input
                type="date"
                placeholder="Max"
                value={
                  formatDateToLocalInputString(
                    filters?.[filter]?.max as Date
                  ) || ""
                }
                onChange={(e) => {
                  setFilterMinMax(
                    filter,
                    filters?.[filter]?.min || 0,
                    new Date(e.target.value)
                  );
                }}
                className="px-2 py-1 w-full h-auto"
              />
            </div>
            <div className="flex flex-wrap gap-1">
              <Badge
                variant="outline"
                onClick={() => {
                  const { start, end } = handleBadgeClick("today");
                  setFilterMinMax(filter, start, end);
                }}
                className="cursor-pointer"
              >
                HOJE
              </Badge>
              <Badge
                variant="outline"
                onClick={() => {
                  const { start, end } = handleBadgeClick("week");
                  setFilterMinMax(filter, start, end);
                }}
                className="cursor-pointer"
              >
                ESTA SEMANA
              </Badge>
              <Badge
                variant="outline"
                onClick={() => {
                  const { start, end } = handleBadgeClick("month");
                  setFilterMinMax(filter, start, end);
                }}
                className="cursor-pointer"
              >
                ESTE MES
              </Badge>
              <Badge
                variant="outline"
                onClick={() => {
                  const { start, end } = handleBadgeClick("3months");
                  setFilterMinMax(filter, start, end);
                }}
                className="cursor-pointer"
              >
                ÚLTIMOS 3 MESES
              </Badge>
              <Badge
                variant="outline"
                onClick={() => {
                  const { start, end } = handleBadgeClick("year");
                  setFilterMinMax(filter, start, end);
                }}
                className="cursor-pointer"
              >
                ÚLTIMO ANO
              </Badge>
            </div>
          </>
        )}
    </div>
  );
}

const formatDateToLocalInputString = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const handleBadgeClick = (interval: string) => {
  let start = new Date();
  let end = new Date();

  switch (interval) {
    case "today":
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case "week":
      start.setDate(start.getDate() - start.getDay());
      start.setHours(0, 0, 0, 0);
      end.setDate(end.getDate() + (6 - end.getDay()));
      end.setHours(23, 59, 59, 999);
      break;
    case "month":
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(start.getMonth() + 1);
      end.setDate(0);
      end.setHours(23, 59, 59, 999);
      break;
    case "3months":
      start.setMonth(start.getMonth() - 2);
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case "year":
      start.setFullYear(start.getFullYear(), 0, 1);
      start.setHours(0, 0, 0, 0);
      end.setFullYear(start.getFullYear(), 11, 31);
      end.setHours(23, 59, 59, 999);
      break;
    default:
      break;
  }

  return { start, end };
};
