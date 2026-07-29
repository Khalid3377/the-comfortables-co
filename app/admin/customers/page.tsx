import { getCustomers } from "@/lib/data/customers";
import { getOrders } from "@/lib/data/orders";
import { CustomersClient } from "./customers-client";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Customers Profile | The Comfortable Co.",
};

export default async function AdminCustomersPage() {
  const customers = await getCustomers();
  const allOrders = await getOrders();
  return <CustomersClient customers={customers} allOrders={allOrders} />;
}
