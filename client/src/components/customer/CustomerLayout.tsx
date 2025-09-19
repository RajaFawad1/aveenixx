import MainEcommerceLayout from "@/components/layout/MainEcommerceLayout";
import CustomerSidebar from "@/components/customer/CustomerSidebar";

interface CustomerLayoutProps {
  children: React.ReactNode;
}

export default function CustomerLayout({ children }: CustomerLayoutProps) {
  return (
    <MainEcommerceLayout subtitle="Account" customSubNavContent={null}>
      <div className="min-h-[70vh] bg-transparent">
        <div className="grid grid-cols-1 lg:grid-cols-[256px_1fr] gap-6">
          <div className="lg:sticky lg:top-[180px] h-full">
            <CustomerSidebar />
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            {children}
          </div>
        </div>
      </div>
    </MainEcommerceLayout>
  );
}


