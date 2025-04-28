// app/(x)/service-requests/page.js (Server Component)
import { Suspense } from "react";
import { Spinner } from "@nextui-org/react";
import ProvidersTable from "./ProvidersTable";

export default function ProvidersPage() {
  return (
    <Suspense fallback={<Spinner color="primary" />}>
      <ProvidersTable />
    </Suspense>
  );
}
