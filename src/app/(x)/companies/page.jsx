// app/(x)/service-requests/page.js (Server Component)
import { Suspense } from "react";
import { Spinner } from "@nextui-org/react";
import CompaniesTable from "./CompaniesTable";

export default function ServiceRequestsPage() {
  return (
    <Suspense fallback={<Spinner color="primary" />}>
      <CompaniesTable />
    </Suspense>
  );
}
