// app/(x)/service-requests/page.js (Server Component)
import { Suspense } from "react";
import { Spinner } from "@nextui-org/react";
import InvoicesTable from "./InvoicesTable";

export default function ServiceRequestsPage() {
  return (
    <Suspense fallback={<Spinner color="primary" />}>
      <InvoicesTable />
    </Suspense>
  );
}
  