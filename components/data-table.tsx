"use client";

import {
  FilterType,
  Filters,
  Sorter,
  SorterType,
} from "@/components/data-table-d";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Order } from "@/app/(dashboard)/(routes)/orders/page";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Filter, MoveDown, MoveHorizontal, MoveUp, Trash2 } from "lucide-react";
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
  access: SorterType;
}

interface DataTableProps {
  colums: Column[];
  startData: Order[];
}

export function DataTable({ colums, startData }: DataTableProps) {
  const [data, setData] = useState<Order[]>(startData);
  const [filters, setFilters] = useState<Filters>({});
  const [query, setQuery] = useState<string>("");
  const [sorter, setSorter] = useState<Sorter>({
    column: "client",
    type: "desc",
  });

  function changeSorter(newSorter: SorterType) {
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

  function applyFilters(): Order[] {
    let filtered = [...data];
    Object.keys(filters).forEach((e: unknown) => {
      const min = filters[e as FilterType]?.min || 0;
      const max = filters[e as FilterType]?.max || 0;

      if (typeof min === "number" && typeof max === "number") {
        filtered = filtered.filter(
          (j) =>
            (j?.[e as FilterType] as number) <= max &&
            (j?.[e as FilterType] as number) >= min &&
            j?.[e as FilterType]
        );
      } else {
        filtered = filtered.filter((j) => {
          console.log(
            (j?.[e as FilterType] as Date).toLocaleString(),
            (j?.[e as FilterType] as Date).toLocaleString(),
            (max as Date).toLocaleString(),
            (min as Date).toLocaleString()
          );

          return (
            j?.[e as FilterType] &&
            (j?.[e as FilterType] as Date)?.getTime() <=
              (max as Date)?.getTime() &&
            (j?.[e as FilterType] as Date)?.getTime() >=
              (min as Date)?.getTime()
          );
        });
      }
    });
    return filtered;
  }

  function deleteSelected() {
    const newData = [...data].filter((e) => !e.selected);
    setData(newData);
  }

  function sortOrders(a: Order, b: Order) {
    const prop = sorter.column;
    const valorA =
      typeof a?.[prop] === "string"
        ? (a?.[prop] as string).toUpperCase()
        : a?.[prop];
    const valorB =
      typeof b?.[prop] === "string"
        ? (b?.[prop] as string).toUpperCase()
        : b?.[prop];

    if (valorA < valorB) {
      return sorter.type === "asc" ? -1 : 1;
    }
    if (valorA > valorB) {
      return sorter.type === "desc" ? 1 : -1;
    }
    return 0;
  }

  const filteredData = applyFilters();

  const toBRL = Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className={cn(
                "bg-red-500 hover:bg-red-400 overflow-hidden ease-in-out duration-200 transition-all",
                filteredData.some((e) => e.selected)
                  ? "w-16 mr-2"
                  : "w-0 p-[0rem]"
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
          placeholder="Busque por clientes, valores ou datas"
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
            {/* Total */}
            <FilterRange
              filters={filters}
              setFilters={setFilters}
              filter="total"
              filterName="Total"
            />

            {/* Pago */}
            <FilterRange
              filters={filters}
              setFilters={setFilters}
              filter="paid"
              filterName="Pago"
            />

            {/* A pagar */}
            <FilterRange
              filters={filters}
              setFilters={setFilters}
              filter="remaining"
              filterName="A pagar"
            />

            {/* Pago em */}
            <FilterRange
              filters={filters}
              setFilters={setFilters}
              filter="paidAt"
              filterName="Pago em"
              type="date"
            />

            {/* Criado em */}
            <FilterRange
              filters={filters}
              setFilters={setFilters}
              filter="createdAt"
              filterName="Criado em"
              type="date"
            />

            {/* Solicitar filtrado */}
            <Button className="w-full h-8">ENVIAR</Button>
          </PopoverContent>
        </Popover>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="overflow-hidden w-max">
                <Checkbox
                  checked={
                    data.length > 0 ? data.every((e) => e.selected) : false
                  }
                  onCheckedChange={(c) => {
                    const newData = [...data].map((e) => {
                      let newValue = { ...e };
                      newValue.selected = !!c;
                      console.log(newValue);
                      return newValue;
                    });
                    setData(newData);
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
              {filteredData
                .filter((e) => {
                  return (
                    e.client.toUpperCase().includes(query.toUpperCase()) ||
                    e.total.toString().startsWith(query) ||
                    e.remaining.toString().startsWith(query) ||
                    e.paid.toString().startsWith(query) ||
                    e.paidAt
                      .toLocaleDateString()
                      .toUpperCase()
                      .includes(query.toUpperCase()) ||
                    e.createdAt
                      .toLocaleDateString()
                      .toUpperCase()
                      .includes(query.toUpperCase())
                  );
                })
                .sort(sortOrders)
                .map((e, i) => {
                  return (
                    <TableRow key={e.id}>
                      <TableCell>
                        <Checkbox
                          className="overflow-hidden"
                          checked={e.selected}
                          onCheckedChange={(c) => {
                            let newData = [...data];
                            newData[i].selected = !newData[i].selected;
                            setData(newData);
                          }}
                        />
                      </TableCell>
                      <TableCell>{e.client}</TableCell>
                      <TableCell className="w-28">
                        {toBRL.format(e.total)}
                      </TableCell>
                      <TableCell className="w-28">
                        {toBRL.format(e.paid)}
                      </TableCell>
                      <TableCell className="w-28">
                        {toBRL.format(e.remaining)}
                      </TableCell>
                      <TableCell className="w-28">
                        {e.paidAt.toLocaleDateString()}
                      </TableCell>
                      <TableCell className="w-28">
                        {e.createdAt.toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          )}
        </Table>
        {!(filteredData.length > 0) && (
          <Table>
            <TableBody>
              <TableCell>
                <div className="w-full h-full flex items-center justify-center">
                  Nenhum pedido encontrado...
                </div>
              </TableCell>
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
