import { PayPalButtons } from "@paypal/react-paypal-js";
import { useToast } from "@/hooks/use-toast";

interface PayPalButtonProps {
  amount: string;
  onSuccess?: (details: any) => void;
  onError?: (error: any) => void;
}

export default function PayPalButton({ amount, onSuccess, onError }: PayPalButtonProps) {
  const { toast } = useToast();

  return (
    <div className="w-full">
      <PayPalButtons
        style={{ 
          layout: "vertical",
          color: "gold",
          shape: "rect",
          label: "paypal"
        }}
        createOrder={(data, actions) => {
          return actions.order?.create({
            purchase_units: [{ 
              amount: { 
                currency_code: "USD",
                value: amount
              }
            }],
          }) || Promise.reject('Failed to create order');
        }}
        onApprove={(data, actions) => {
          return actions.order?.capture().then((details) => {
            toast({
              title: "Payment Successful!",
              description: `Transaction completed by ${details.payer?.name?.given_name || 'Unknown'}`,
            });
            
            if (onSuccess) {
              onSuccess(details);
            }
          }) || Promise.reject('Failed to capture payment');
        }}
        onError={(error) => {
          console.error("PayPal error:", error);
          toast({
            title: "Payment Failed",
            description: "There was an error processing your PayPal payment. Please try again.",
            variant: "destructive",
          });
          
          if (onError) {
            onError(error);
          }
        }}
      />
    </div>
  );
}