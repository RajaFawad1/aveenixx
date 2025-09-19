import VendorProductList from "@/components/vendor/VendorProductList";
import VendorLayout from "@/components/vendor/VendorLayout";

export default function VendorProducts() {
  return (
    <VendorLayout>
      <div className="p-6">
        <VendorProductList />
      </div>
    </VendorLayout>
  );
}