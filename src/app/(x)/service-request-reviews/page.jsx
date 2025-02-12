// app/(x)/service-requests/page.js (Server Component)
import { Suspense } from "react";
import { Spinner } from "@nextui-org/react";
import ServiceRequestReviews from "./ServiceRequestReviews";

export default function ServiceRequestsPage() {
  return (
    <Suspense fallback={<Spinner color="primary" />}>
      <ServiceRequestReviews />
    </Suspense>
  );
}
