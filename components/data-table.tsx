"use client";

import { FilterType, Filters, Sorter } from "@/components/data-table-d";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  ClipboardType,
  Filter,
  MoveDown,
  MoveUp,
  Repeat,
  Trash2,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import FilterRange from "./filter-range";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";

export interface Column {
  name: string;
  access: string;
  valueType: ColumnTypes;
}

export type ColumnTypes = "currency" | "string" | "number" | "date";

interface DataTableProps {
  colums: Column[];
  startData: any[];
  options?: {
    buttons?: string[];
    searchText?: string;
    setRequests?: Function;
    defaultSorter?: Sorter;
  };
}

export function DataTable({ colums, startData, options }: DataTableProps) {
  const [data, setData] = useState<any[]>(startData);
  const [selected, setSelected] = useState<number[]>([]);
  const [filters, setFilters] = useState<Filters>({});
  const [query, setQuery] = useState<string>("");
  const [sorter, setSorter] = useState<Sorter>(
    options?.defaultSorter || {
      column: "",
      type: "asc",
    }
  );

  function changeSorter(newSorter: string) {
    let _sorter = { ...sorter };
    if (_sorter.column == newSorter) {
      if (_sorter.type == "asc") {
        _sorter.type = "desc";
      } else if (_sorter.type == "desc") {
        _sorter.type = "asc";
      }
    } else {
      _sorter.column = newSorter;
    }
    setSorter(_sorter);
  }

  function applyFilters(data: any[]): any[] {
    let filtered = [...data];
    Object.keys(filters).forEach((e: string) => {
      let min = (filters as any)[e as FilterType]?.min || 0;
      let max = (filters as any)[e as FilterType]?.max || 0;
      if (max === 0) max = Infinity;
      console.log(min, max);

      const type = colums.find((n) => n.access === e)?.valueType;
      if (type === "number" || type == "currency") {
        filtered = filtered.filter((j) => {
          const value = getValueByPath(j, e);
          return (
            (value as number) <= max &&
            (value as number) >= min &&
            value !== undefined
          );
        });
      } else {
        filtered = filtered.filter((j) => {
          const value = getValueByPath(j, e);
          return (
            value &&
            new Date(value)?.getTime() <= (max as Date)?.getTime() &&
            new Date(value)?.getTime() >= (min as Date)?.getTime()
          );
        });
      }
    });

    filtered = filtered.filter((e) => {
      let valid = false;
      colums.forEach((col) => {
        if (col.valueType === "string") {
          const value: string = getValueByPath(e, col.access);
          valid =
            valid || value?.toUpperCase().includes(query?.toUpperCase() || "");
        }
      });
      return valid;
    });

    return filtered;
  }

  function deleteSelected() {
    const newData = [...data].filter((e) => !e.selected);
    setData(newData);
  }

  function sortItems(a: any, b: any) {
    const prop = sorter.column;
    let valueA = getValueByPath(a, prop);
    let valueB = getValueByPath(b, prop);

    if (typeof valueA === "undefined" || typeof valueB === "undefined") {
      return 0; // Handle undefined values
    }

    const type = colums.find((n) => n.access === sorter.column)?.valueType;

    switch (type) {
      case "string":
        return compareStrings(valueA, valueB, sorter.type);
      case "number":
        return sorter.type === "asc"
          ? parseFloat(valueA) - parseFloat(valueB)
          : parseFloat(valueB) - parseFloat(valueA);
      case "currency":
        return sorter.type === "asc"
          ? parseFloat(valueA) - parseFloat(valueB)
          : parseFloat(valueB) - parseFloat(valueA);
      case "date":
        return sorter.type === "asc"
          ? new Date(valueA).getTime() - new Date(valueB).getTime()
          : new Date(valueB).getTime() - new Date(valueA).getTime();
      default:
        throw new Error(`Unknown type: ${type}`);
    }
  }

  function compareStrings(a: string, b: string, direction: string) {
    const result = a.localeCompare(b);
    return direction === "asc" ? result : -result;
  }

  const filteredData = applyFilters(data).sort(sortItems);

  const toBRL = Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <div className="flex flex-col gap-2">
      {/* Delete, Search and Filters */}
      <div className="flex">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className={cn(
                "bg-red-500 hover:bg-red-400 overflow-hidden ease-in-out duration-200 transition-all",
                selected.length > 0 ? "w-16 mr-2" : "w-0 p-[0rem]"
              )}
            >
              <Trash2 size={18} />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Tem certeza que deseja excluir{" "}
                {filteredData.filter((e) => e.selected).length > 1
                  ? `${filteredData.filter((e) => e.selected).length} pedidos?`
                  : "esse pedido?"}
              </DialogTitle>
              <DialogDescription>
                Essa ação não pode ser desfeita e irá escluir permanentemente os
                pedidos selecionados.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex-row justify-end space-x-2">
              {/* <div className="flex justify-end gap-2"> */}
              <DialogClose>
                <Button className="px-4 py-2 h-auto " variant={"outline"}>
                  CANCELAR
                </Button>
              </DialogClose>
              <DialogClose>
                <Button
                  onClick={deleteSelected}
                  className="px-4 py-2 h-auto bg-red-500 hover:bg-red-400"
                >
                  EXCLUIR
                </Button>
              </DialogClose>
              {/* </div> */}
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Input
          placeholder={options?.searchText || "Barra de pesquisa"}
          onChange={(e) => setQuery(e.currentTarget.value)}
          className="mr-2"
        />
        <Popover>
          {/* Abrir filtros */}
          <PopoverTrigger asChild>
            <Button className="gap-2">
              <Filter size={18} />
              <p className="">Filtros</p>
            </Button>
          </PopoverTrigger>
          {/* Filtros */}
          <PopoverContent className="mr-8 flex flex-col gap-3 max-h-[50vh] overflow-auto">
            {colums.map((col) => {
              if (
                col.valueType === "currency" ||
                col.valueType === "number" ||
                col.valueType === "date"
              ) {
                return (
                  <FilterRange
                    key={col.access}
                    filters={filters}
                    setFilters={setFilters}
                    filter={col.access}
                    filterName={col.name}
                    type={col.valueType}
                  />
                );
              }
            })}

            {/* Solicitar filtrado */}
            {/* <Button className="w-full h-8">ENVIAR</Button> */}
          </PopoverContent>
        </Popover>
      </div>
      {/* Table */}
      <div className="rounded-md border max-h-80 overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="overflow-hidden w-max">
                <Checkbox
                  checked={
                    filteredData.length > 0
                      ? filteredData.every((e) => selected.includes(e.id))
                      : false
                  }
                  onCheckedChange={(c) => {
                    if (c) {
                      setSelected([...filteredData].map((e) => e.id));
                    } else {
                      setSelected([]);
                    }
                  }}
                />
              </TableHead>
              {colums.map((col, i) => {
                return (
                  <TableHead key={col.access} className={i > 0 ? "w-28" : ""}>
                    <div
                      onClick={() => changeSorter(col.access)}
                      className={"flex gap-1 cursor-pointer items-center"}
                    >
                      <p className="w-max whitespace-nowrap">{col.name}</p>
                      {sorter.column === col.access &&
                        (sorter.type === "desc" ? (
                          <MoveDown size={12} />
                        ) : (
                          <MoveUp size={12} />
                        ))}
                    </div>
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          {filteredData.length > 0 && (
            <TableBody>
              {filteredData.map((e, i) => {
                return (
                  <TableRow key={e.id}>
                    <TableCell className="p-3">
                      <Checkbox
                        className="overflow-hidden"
                        checked={selected.includes(e.id)}
                        onCheckedChange={(c) => {
                          if (selected.includes(e.id)) {
                            setSelected(selected.filter((id) => id !== e.id));
                          } else {
                            setSelected([...selected, e.id]);
                          }
                        }}
                      />
                    </TableCell>
                    {colums.map((j) => {
                      if (j.valueType === "currency") {
                        return (
                          <TableCell
                            key={j.access}
                            className="w-28 p-3 whitespace-nowrap"
                          >
                            {toBRL.format(getValueByPath(e, j.access))}
                          </TableCell>
                        );
                      } else if (j.valueType === "string") {
                        return (
                          <TableCell key={j.access} className=" p-3">
                            <p className="whitespace-nowrap max-w-[10rem] overflow-hidden overflow-ellipsis">
                              {getValueByPath(e, j.access)}
                            </p>
                          </TableCell>
                        );
                      } else if (j.valueType === "number") {
                        return (
                          <TableCell
                            key={j.access}
                            className="w-28 p-3 whitespace-nowrap"
                          >
                            {getValueByPath(e, j.access)}
                          </TableCell>
                        );
                      } else if (j.valueType === "date") {
                        return (
                          <TableCell
                            key={j.access}
                            className="w-28 p-3 whitespace-nowrap"
                          >
                            {new Date(getValueByPath(e, j.access))
                              .toLocaleString()
                              .replace(",", " às")}
                          </TableCell>
                        );
                      }
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          )}
        </Table>
        {!(filteredData.length > 0) && (
          <div className="w-full h-full p-4 flex items-center justify-center">
            Nenhum resultado encontrado...
          </div>
        )}
      </div>
      {/* Buttons */}
      {Object.keys(options || {}).length > 0 && (
        <div className={cn("flex gap-2")}>
          {options?.buttons?.includes("resume") && (
            <Button
              variant="outline"
              className={cn(
                data.some((e) => e.selected) ? "opacity-100" : "opacity-50",
                "ease-in-out duration-200 transition-all"
              )}
              disabled={!data.some((e) => e.selected)}
            >
              <ClipboardType size={20} />
            </Button>
          )}
          {options?.buttons?.includes("newRequest") && (
            <Button
              variant="outline"
              className={cn(
                data.some((e) => e.selected) ? "opacity-100" : "opacity-50",
                "gap-2 ease-in-out duration-200 transition-all"
              )}
              disabled={!data.some((e) => e.selected)}
            >
              <Repeat size={18} />
              SOLICITAR NOVAMENTE
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

type AnyObject = Record<string, any>;

function getValueByPath(obj: AnyObject, path: string): any {
  const keys = path.split(".");

  let currentObject: AnyObject | undefined = obj;

  for (const key of keys) {
    if (
      currentObject &&
      typeof currentObject === "object" &&
      key in currentObject
    ) {
      currentObject = currentObject[key];
    } else {
      return undefined; // Chave não encontrada
    }
  }

  return currentObject;
}
