import { Column, DataTable } from "@/components/data-table";

export type Order = {
  id: number;
  selected: boolean;
  client: string;
  total: number;
  paid: number;
  remaining: number;
  paidAt: Date;
  createdAt: Date;
  // status: "pending" | "processing" | "success" | "failed"
  // email: string
};

async function getData(): Promise<Order[]> {
  // Fetch data from your API here.
  return [
    {
      id: 1,
      selected: false,
      client: "Nando Martin",
      paid: 40,
      remaining: 10,
      total: 50,
      createdAt: new Date(),
      paidAt: new Date(),
    },
    {
      id: 2,
      selected: false,
      client: "Pablo Scobar",
      paid: 50,
      remaining: 20,
      total: 70,
      createdAt: new Date(),
      paidAt: new Date(),
    },
    {
      id: 3,
      selected: false,
      client: "Varia Loca",
      paid: 50,
      remaining: 70,
      total: 120,
      createdAt: new Date("12/12/2005"),
      paidAt: new Date("12/12/2005"),
    },
    // ...
  ];
}

export default async function DemoPage() {
  const data = await getData();

  const colums: Column[] = [
    { name: "Cliente", access: "client" },
    { name: "Total", access: "total" },
    { name: "Pago", access: "paid" },
    { name: "A pagar", access: "remaining" },
    { name: "Pago em", access: "paidAt" },
    { name: "Criado em", access: "createdAt" },
  ];

  return (
    <div className="container mx-auto py-4">
      <h1 className="text-3xl mb-4 font-semibold">Seus Pedidos</h1>
      <DataTable colums={colums} startData={data} />
    </div>
  );
}
