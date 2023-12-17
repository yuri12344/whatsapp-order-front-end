import { MoveHorizontal } from "lucide-react";
import React, { Dispatch, SetStateAction } from "react";
import { Input } from "./ui/input";
import { Filters } from "./data-table-d";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { ColumnTypes } from "./data-table";

interface FilterRangeProps {
  filters: Filters;
  setFilters: Dispatch<SetStateAction<Filters>>;
  filter: string;
  filterName: string;
  type?: ColumnTypes;
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
          min,
          max,
        },
      };
    } else {
      newValue = { ...filters, [field]: { min, max } };
    }
    setFilters(newValue);
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Enable/disable filter */}
      <div className="flex gap-2 items-center">
        <Checkbox
          checked={!!(filters as any)?.[filter]}
          onCheckedChange={(checked) => {
            console.log(checked);
            if (checked) {
              if (type == "number" || type == "currency") {
                setFilterMinMax(filter, 0, 0);
              } else {
                const { start, end } = handleBadgeClick("today");
                setFilterMinMax(filter, start, end);
              }
            } else {
              setFilters((old) => {
                delete (old as any)?.[filter];
                return { ...old };
              });
            }
          }}
        />
        Filtrar por "{filterName}"
      </div>

      {/* If filter has number type */}
      {typeof (filters as any)?.[filter]?.max === "number" &&
        typeof (filters as any)?.[filter]?.min === "number" && (
          <>
            {(filters as any)?.[filter] && (
              <div className="flex gap-2 w-full items-center">
                <Input
                  type="number"
                  placeholder="Min"
                  value={
                    ((filters as any)?.[filter]?.min as number) > 0
                      ? ((filters as any)?.[filter]?.min as number)
                      : " "
                  }
                  onChange={(e) => {
                    setFilterMinMax(
                      filter,
                      parseInt(e.target.value),
                      (filters as any)?.[filter]?.max || 0
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
                    ((filters as any)?.[filter]?.max as number) > 0
                      ? ((filters as any)?.[filter]?.max as number)
                      : " "
                  }
                  onChange={(e) => {
                    setFilterMinMax(
                      filter,
                      (filters as any)?.[filter]?.min || 0,
                      parseInt(e.target.value)
                    );
                  }}
                  className="px-2 py-1 w-full h-auto"
                />
              </div>
            )}
          </>
        )}

      {/* If filter has date type */}
      {typeof (filters as any)?.[filter]?.max === "object" &&
        typeof (filters as any)?.[filter]?.min === "object" && (
          <>
            <div className="flex gap-2 w-full items-center">
              <Input
                type="date"
                placeholder="Min"
                value={
                  formatDateToLocalInputString(
                    (filters as any)?.[filter]?.min as Date
                  ) || ""
                }
                onChange={(e) => {
                  setFilterMinMax(
                    filter,
                    new Date(e.target.value),
                    (filters as any)?.[filter]?.max || 0
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
                    (filters as any)?.[filter]?.max as Date
                  ) || ""
                }
                onChange={(e) => {
                  setFilterMinMax(
                    filter,
                    (filters as any)?.[filter]?.min || 0,
                    new Date(e.target.value)
                  );
                }}
                className="px-2 py-1 w-full h-auto"
              />
            </div>
            <div className="flex flex-wrap gap-1">
              {timePresets.map((e) => {
                return (
                  <Badge
                    key={e.value}
                    variant={(() => {
                      const { start, end } = handleBadgeClick(e.value);
                      return start.getTime() ===
                        (filters as any)?.[filter]?.min?.getTime() &&
                        end.getTime() ===
                          (filters as any)?.[filter]?.max?.getTime()
                        ? "default"
                        : "outline";
                    })()}
                    onClick={() => {
                      const { start, end } = handleBadgeClick(e.value);
                      setFilterMinMax(filter, start, end);
                    }}
                    className="cursor-pointer uppercase"
                  >
                    {e.label}
                  </Badge>
                );
              })}
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

const timePresets = [
  {
    label: "Hoje",
    value: "today",
  },
  {
    label: "Últimos 7 dias",
    value: "1week",
  },
  {
    label: "Esta semana",
    value: "week",
  },
  {
    label: "Este mês",
    value: "month",
  },
  {
    label: "Últimos 3 meses",
    value: "3months",
  },
  {
    label: "Este ano",
    value: "year",
  },
];

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
    case "1week":
      start.setDate(start.getDate() - 6);
      start.setHours(0, 0, 0, 0);
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
