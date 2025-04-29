import { Page } from "@/components/Page.tsx";
import { SalesAnalytics } from "@/modules/sales/components/SalesAnalytics.tsx";

export const DashboardPage = () => {
  return (
    <Page width="full">
      <SalesAnalytics />
    </Page>
  );
};
