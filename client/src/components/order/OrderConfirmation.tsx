import { Link } from "wouter";

export default function OrderConfirmation() {
  return (
    <div className="max-w-3xl mx-auto p-6 text-center">
      <h2 className="text-3xl font-bold text-green-600 mb-4">Thank You for Your Order!</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-6">
        We've received your order and it's being processed. You'll receive a confirmation email shortly.
      </p>
      <div className="bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-2">Order Summary</h3>
        <p>Order ID: <strong>#AVE-001234</strong></p>
        <p>Total: <strong>$559.97</strong></p>
        <p>Shipping: <strong>FREE</strong></p>
      </div>
      <div className="mt-6 space-x-4">
        <Link href="/" className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded transition-colors">
          Continue Shopping
        </Link>
        <Link href="/orders" className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded transition-colors">
          View My Orders
        </Link>
      </div>
    </div>
  );
}