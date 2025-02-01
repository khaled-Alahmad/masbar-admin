// app/(x)/service-requests/page.js (Server Component)
import { Suspense } from "react";
import ServicesRequestTable from "./ServicesRequestTable";
import { Spinner } from "@nextui-org/react";

export default function ServiceRequestsPage() {
  return (
    <Suspense fallback={<Spinner color="primary" />}>
      <ServicesRequestTable />
    </Suspense>
  );
}
