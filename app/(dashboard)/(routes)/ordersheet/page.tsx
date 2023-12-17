import { Column, DataTable } from "@/components/data-table";
import { SheetWithRequests } from "@/app/(dashboard)/(routes)/ordersheet/_components/sheetWithRequests";

export type Order = {
  id: number;
  selected: boolean;
  client: string;
  total: number;
  paid: number;
  remaining: number;
  paidAt: Date;
  createdAt: Date;
};

async function getData(): Promise<any[]> {
  // Fetch data from your API here.
  return [
    {
      id: 1,
      selected: false,
      product: "Biscoito",
      supplier: "Fornecedor 1",
      amount: 50,
      received: 20,
      remainingOrder: 30,
      status: "A solicitar",
    },
    {
      id: 2,
      selected: false,
      product: "Chocolates",
      supplier: "Fornecedor 2",
      amount: 100,
      received: 50,
      remainingOrder: 50,
      status: "Solicitado",
    },
    {
      id: 3,
      selected: false,
      product: "Refrigerante",
      supplier: "Fornecedor 2",
      amount: 30,
      received: 10,
      remainingOrder: 20,
      status: "Recebido",
    },
    {
      id: 4,
      selected: false,
      product: "Café",
      supplier: "Fornecedor 2",
      amount: 80,
      received: 30,
      remainingOrder: 50,
      status: "Solicitado",
    },
    {
      id: 5,
      selected: false,
      product: "Batata Chips",
      supplier: "Fornecedor 2",
      amount: 75,
      received: 25,
      remainingOrder: 50,
      status: "A solicitar",
    },
    {
      id: 6,
      selected: false,
      product: "Água Mineral",
      supplier: "Fornecedor 2",
      amount: 120,
      received: 60,
      remainingOrder: 60,
      status: "Recebido",
    },
    {
      id: 7,
      selected: false,
      product: "Sabonete",
      supplier: "Fornecedor 7",
      amount: 40,
      received: 15,
      remainingOrder: 25,
      status: "A solicitar",
    },
    {
      id: 8,
      selected: false,
      product: "Canetas",
      supplier: "Fornecedor 8",
      amount: 60,
      received: 30,
      remainingOrder: 30,
      status: "Recebido",
    },
    {
      id: 9,
      selected: false,
      product: "Lápis",
      supplier: "Fornecedor 8",
      amount: 25,
      received: 10,
      remainingOrder: 15,
      status: "A solicitar",
    },
    {
      id: 10,
      selected: false,
      product: "Papel A4",
      supplier: "Fornecedor 8",
      amount: 90,
      received: 45,
      remainingOrder: 45,
      status: "Solicitado",
    },
  ];
}

async function getRequest(): Promise<any[]> {
  // Fetch data from your API here.
  return [];
}

export default async function OrderSheet() {
  const data = await getData();
  const requests = await getRequest();

  const colums: Column[] = [
    { name: "Produto", access: "product", valueType: "string" },
    { name: "Estado", access: "status", valueType: "string" },
    { name: "Quantidade", access: "amount", valueType: "number" },
    { name: "Fornecedor", access: "supplier", valueType: "string" },
    { name: "Recebido", access: "received", valueType: "number" },
    { name: "Falta pedir", access: "remainingOrder", valueType: "number" },
  ];

  return (
    <div className="container mx-auto py-4">
      <SheetWithRequests colums={colums} data={data} requestData={requests} />
    </div>
  );
}
