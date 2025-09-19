import MainEcommerceLayout from "@/components/layout/MainEcommerceLayout";
import OrderConfirmation from "@/components/order/OrderConfirmation";

export default function ThankYouPage() {
  return (
    <MainEcommerceLayout>
      <OrderConfirmation />
    </MainEcommerceLayout>
  );
}