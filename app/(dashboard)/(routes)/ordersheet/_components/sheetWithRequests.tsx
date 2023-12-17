"use client";

import { useState } from "react";
import { Column, DataTable } from "@/components/data-table";

interface SheetWithRequestsProps {
  colums: Column[];
  data: any[];
  requestData?: any[];
}

export function SheetWithRequests({
  colums,
  data,
  requestData,
}: SheetWithRequestsProps) {
  const [requests, setRequests] = useState(requestData || []);

  return (
    <>
      <h1 className="text-3xl font-semibold">Folha de Pedidos</h1>
      <p className="opacity-80 mb-4">Total de pedidos neste mês.</p>
      <DataTable
        colums={colums}
        startData={data}
        options={{
          buttons: ["newRequest", "resume"],
          searchText: "Pesquise pelo produto, fornecedor ou estado.",
          setRequests: setRequests,
          defaultSorter: {
            column: "product",
            type: "asc",
          },
        }}
      />
      <h1 className="text-2xl mt-8 font-semibold">Solicitações</h1>
      <p className="opacity-80 mb-4">Solicitações para outros forncededores.</p>
      <DataTable
        colums={colums}
        startData={requests}
        options={{
          buttons: ["newRequest", "resume"],
          searchText: "Pesquise pelo produto, fornecedor ou estado.",
          setRequests: setRequests,
          defaultSorter: {
            column: "product",
            type: "asc",
          },
        }}
      />
    </>
  );
}
