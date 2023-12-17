import { Column, DataTable } from "@/components/data-table";

interface Order {
  id: number | null;
  company: number | null;
  date_created: string | null;
  total: string | null;
  payment_method: string | null;
  amount_paid: string | null;
  amount_missing: string | null;
  status: string | null;
  paid_at: string | null;
  customer: Costumer | null;
  products: Product[] | null;
}
interface Costumer {
  id: number | null;
  company: number | null;
  date_created: string | null;
  name: string | null;
  whatsapp: string | null;
  street: string | null;
  number: string | null;
  complement: string | null;
  neighborhood: string | null;
  zip: string | null;
  city: string | null;
  state: string | null;
  region: string | null;
  email: string | null;
  birthday: string | null;
  score: number | null;
  age: string | null;
  gender: string | null;
  favorite_product: string | null;
  address: string | null;
}
interface Product {
  id: 531 | null;
  company: 1 | null;
  date_created: string | null;
  order: 139 | null;
  product: {
    id: 21 | null;
    date_created: string | null;
    name: string | null;
    price: string | null;
    description: string | null;
    retailer_id: string | null;
    whatsapp_meta_id: string | null;
    whatsapp_link: string | null;
    company: number | null;
  };
  quantity: number;
  status: string;
}

async function getData(): Promise<Order[]> {
  const response = (await (
    await fetch("https://backend.brconnect.click/api/v1/orders/", {
      headers: {
        Authorization: "Token 5535be397e6e1ef5ae4ac259a162af175dfaeb3d",
      },
    } as RequestInit)
  ).json()) as Order[];
  return response;
}

export default async function Orders() {
  const data = await getData();

  const colums: Column[] = [
    { name: "Cliente", access: "customer.name", valueType: "string" },
    { name: "Whatsapp", access: "customer.whatsapp", valueType: "string" },
    { name: "Estado", access: "status", valueType: "string" },
    { name: "Total", access: "total", valueType: "currency" },
    { name: "Pago", access: "amount_paid", valueType: "currency" },
    { name: "A pagar", access: "amount_missing", valueType: "currency" },
    { name: "Pago em", access: "paid_at", valueType: "date" },
    { name: "Criado em", access: "date_created", valueType: "date" },
  ];

  return (
    <div className="container mx-auto py-4">
      <h1 className="text-3xl font-semibold">Seus Pedidos</h1>
      <p className="opacity-80 mb-4">Pedidos de cada cliente.</p>
      <DataTable
        colums={colums}
        startData={data}
        options={{
          searchText: "Pesquise pelo cliente, Whatsapp ou estado.",
          defaultSorter: {
            column: "date_created",
            type: "desc",
          },
        }}
      />
    </div>
  );
}
