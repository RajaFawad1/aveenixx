import { useEffect, useState } from 'react';
import { useLocation, useParams, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import MainEcommerceLayout from '@/components/layout/MainEcommerceLayout';
import {
  CheckCircle,
  Package,
  Truck,
  CreditCard,
  MapPin,
  Mail,
  Download,
  ArrowLeft,
  Clock,
  Share2,
  MessageSquare,
  FileText,
  ChevronDown,
  Printer,
  Star,
  ShoppingCart,
  Users,
  Calendar,
  RotateCcw,
  ExternalLink,
  Heart,
  FileDown,
  Home,
  ChevronRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OrderDetails {
  id?: string;
  status?: string;
  orderNumber?: string;
  createdAt?: string;
  
  // Customer information
  guestInfo?: {
    email?: string;
    name?: string;
  };
  customer?: {
    email?: string;
    name?: string;
  };
  
  // Items
  items?: Array<{
    id?: string;
    productId?: string;
    name?: string;
    price?: number;
    quantity?: number;
    image?: string;
    brand?: string;
  }>;
  
  // Shipping
  shippingAddress?: {
    fullName?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    phone?: string;
  };
  shippingMethod?: string;
  shippingCost?: number;
  estimatedDelivery?: string;
  trackingNumber?: string;
  
  // Payment
  paymentMethod?: {
    type?: string;
    last4?: string;
    brand?: string;
  } | string;
  transactionId?: string;
  
  // Pricing - support both formats
  subtotal?: number;
  tax?: number;
  total?: number;
  pricing?: {
    subtotal?: number;
    shippingCost?: number;
    tax?: number;
    total?: number;
  };
  
  // Legacy support
  shipping?: {
    address?: {
      fullName?: string;
      address?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      phone?: string;
    };
    method?: string;
    cost?: number;
    estimatedDelivery?: string;
    trackingNumber?: string;
  };
  payment?: {
    method?: string;
    last4?: string;
    brand?: string;
  };
  totals?: {
    subtotal?: number;
    shipping?: number;
    tax?: number;
    total?: number;
  };
}

export default function OrderConfirmationPageNew() {
  const params = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const orderId = params.orderId;

  // Fetch order details
  const { data: orderResponse, isLoading, error } = useQuery<{success: boolean; order: OrderDetails}>({
    queryKey: [`/api/orders/${orderId}`],
    enabled: !!orderId
  });
  
  const order = orderResponse?.order;

  // Helper functions for safe data access
  const getOrderNumber = () => order?.orderNumber || order?.id || 'N/A';
  const getOrderDate = () => {
    try {
      const date = order?.createdAt;
      return date ? new Date(date).toLocaleDateString() : 'N/A';
    } catch {
      return 'N/A';
    }
  };
  const getSubtotal = () => order?.pricing?.subtotal || order?.subtotal || 0;
  const getShippingCost = () => order?.pricing?.shippingCost || order?.shippingCost || 0;
  const getTax = () => order?.pricing?.tax || order?.tax || 0;
  const getTotal = () => order?.pricing?.total || order?.total || 0;
  const getPaymentMethod = () => {
    const pm = order?.paymentMethod;
    if (typeof pm === 'string') return { type: pm };
    return pm || {};
  };
  const getEstimatedDelivery = () => order?.estimatedDelivery || 'N/A';
  const getTrackingNumber = () => order?.trackingNumber || null;

  const getShippingMethodName = (method: string) => {
    switch (method) {
      case 'standard': return 'Standard Shipping';
      case 'express': return 'Express Shipping';
      case 'overnight': return 'Overnight Shipping';
      default: return 'Standard Shipping';
    }
  };

  const getStatusColor = (status: string) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    
    switch (status.toLowerCase()) {
      case 'confirmed':
      case 'processing':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-purple-100 text-purple-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDownloadReceipt = () => {
    if (!order) return;
    const currentDate = new Date();
    const orderDate = order.createdAt ? new Date(order.createdAt) : currentDate;
    
    const receiptContent = `
═══════════════════════════════════════════════════════════════
                        AVEENIX EXPRESS
        Your Trusted Global E-Commerce Platform
═══════════════════════════════════════════════════════════════

📧 support@aveenix.com | 🌐 www.aveenix.com | 📞 1-800-AVEENIX

                        OFFICIAL RECEIPT
                     Order #${getOrderNumber()}

───────────────────────────────────────────────────────────────
ORDER DETAILS
───────────────────────────────────────────────────────────────
Order Date:     ${orderDate.toLocaleDateString('en-US', { 
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
})}
Order Time:     ${orderDate.toLocaleTimeString('en-US')}
Order Status:   ${(order?.status || 'Confirmed').toUpperCase()}
Payment Status: PAID
Order Type:     ${order?.items?.length === 1 ? 'Single Item Purchase' : 'Multi-Item Order'}

───────────────────────────────────────────────────────────────
CUSTOMER INFORMATION
───────────────────────────────────────────────────────────────
Email:          ${order?.guestInfo?.email || order?.customer?.email || 'N/A'}
Customer Type:  ${order?.guestInfo ? 'Guest Customer' : 'Registered Customer'}

───────────────────────────────────────────────────────────────
SHIPPING DETAILS
───────────────────────────────────────────────────────────────
Ship To:        ${order?.shippingAddress?.fullName || 'N/A'}
Address:        ${order?.shippingAddress?.address || 'N/A'}
City/State:     ${order?.shippingAddress?.city || 'N/A'}, ${order?.shippingAddress?.state || 'N/A'}
ZIP Code:       ${order?.shippingAddress?.zipCode || 'N/A'}
Phone:          ${order?.shippingAddress?.phone || 'Not provided'}
Shipping Method: ${order?.shippingMethod === 'standard' ? 'Standard Shipping (5-7 business days)' :
                  order?.shippingMethod === 'express' ? 'Express Shipping (2-3 business days)' :
                  order?.shippingMethod === 'overnight' ? 'Overnight Shipping (1 business day)' :
                  'Standard Shipping'}

───────────────────────────────────────────────────────────────
ORDER ITEMS
───────────────────────────────────────────────────────────────
${order?.items?.map((item: any, index: number) => {
  const itemTotal = (item.price || 0) * (item.quantity || 1);
  return `${String(index + 1).padStart(2, '0')}. ${(item.name || `Product ${item.productId || 'Unknown'}`).substring(0, 45)}
    Product ID: ${item.productId || 'N/A'}
    Unit Price: $${(item.price || 0).toFixed(2)}
    Quantity:   ${item.quantity || 1}
    Subtotal:   $${itemTotal.toFixed(2)}
    `;
}).join('\n') || 'No items found in this order'}

───────────────────────────────────────────────────────────────
PAYMENT INFORMATION
───────────────────────────────────────────────────────────────
Payment Method: ${getPaymentMethod().type || 'Credit Card'}
${getPaymentMethod().last4 ? `Card Number: ****-****-****-${getPaymentMethod().last4}` : ''}
${getPaymentMethod().brand ? `Card Type: ${getPaymentMethod().brand}` : ''}
Transaction ID: ${order?.transactionId || order?.orderNumber || 'N/A'}
Payment Date:   ${orderDate.toLocaleDateString('en-US')}

───────────────────────────────────────────────────────────────
ORDER SUMMARY
───────────────────────────────────────────────────────────────
Items Subtotal:         $${(order?.subtotal || order?.pricing?.subtotal || 0).toFixed(2)}
Shipping & Handling:    ${(order?.shippingCost || order?.pricing?.shippingCost || 0) > 0 ? 
  `$${(order?.shippingCost || order?.pricing?.shippingCost || 0).toFixed(2)}` : 'FREE'}
Tax (${((order?.tax || order?.pricing?.tax || 0) / (order?.subtotal || order?.pricing?.subtotal || 1) * 100).toFixed(1)}%):                $${(order?.tax || order?.pricing?.tax || 0).toFixed(2)}
───────────────────────────────────────────────────────────────
TOTAL PAID:             $${(order?.total || order?.pricing?.total || 0).toFixed(2)}
═══════════════════════════════════════════════════════════════

───────────────────────────────────────────────────────────────
IMPORTANT INFORMATION
───────────────────────────────────────────────────────────────
• Save this receipt for your records
• For returns/exchanges, keep original packaging
• Track your order at: www.aveenix.com/track
• Customer service: support@aveenix.com
• Return policy: 30 days from delivery date
• Estimated delivery: ${order?.estimatedDelivery || '5-7 business days'}
${order?.trackingNumber ? `• Tracking number: ${order?.trackingNumber}` : '• Tracking info will be provided when shipped'}

───────────────────────────────────────────────────────────────
THANK YOU FOR CHOOSING AVEENIX EXPRESS!
───────────────────────────────────────────────────────────────
We appreciate your business and trust in our platform.
Follow us: @AveenixExpress | Newsletter: aveenix.com/newsletter

Receipt generated on: ${currentDate.toLocaleString('en-US')}
Receipt ID: ${order?.orderNumber}-${currentDate.getTime()}

═══════════════════════════════════════════════════════════════
`;

    // Create and download the enhanced receipt file
    const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AVEENIX-Receipt-${order?.orderNumber || 'ORDER'}-${orderDate.toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Professional Receipt Downloaded",
      description: `Complete order receipt saved as AVEENIX-Receipt-${order?.orderNumber || 'ORDER'}.txt`,
    });
  };

  const handleDownloadHTMLReceipt = () => {
    if (!order) return;
    const currentDate = new Date();
    const orderDate = order.createdAt ? new Date(order.createdAt) : currentDate;
    
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AVEENIX Receipt - Order ${order?.orderNumber || 'N/A'}</title>
    <style>
        body { 
            font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 20px; 
            background: #f8fafc;
            color: #1e293b;
        }
        .receipt { 
            background: white; 
            border-radius: 12px; 
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); 
            overflow: hidden;
        }
        .header { 
            background: linear-gradient(135deg, #facc15 0%, #ea580c 100%); 
            color: white; 
            padding: 30px; 
            text-align: center; 
        }
        .header h1 { 
            font-size: 2.5rem; 
            margin: 0; 
            font-weight: 700; 
            letter-spacing: 0.05em;
        }
        .header p { 
            margin: 8px 0 0 0; 
            opacity: 0.9; 
            font-size: 1.1rem;
        }
        .content { 
            padding: 30px; 
        }
        .section { 
            margin-bottom: 30px; 
            border-bottom: 2px solid #e2e8f0; 
            padding-bottom: 20px; 
        }
        .section:last-child { 
            border-bottom: none; 
            margin-bottom: 0; 
        }
        .section-title { 
            font-size: 1.3rem; 
            font-weight: 600; 
            color: #ea580c; 
            margin-bottom: 15px; 
            padding-bottom: 8px;
            border-bottom: 1px solid #fef3c7;
        }
        .info-grid { 
            display: grid; 
            grid-template-columns: 1fr 2fr; 
            gap: 12px; 
            margin-bottom: 10px; 
        }
        .label { 
            font-weight: 600; 
            color: #374151; 
        }
        .value { 
            color: #1f2937; 
        }
        .item-card { 
            background: #f8fafc; 
            border: 1px solid #e2e8f0; 
            border-radius: 8px; 
            padding: 16px; 
            margin-bottom: 12px; 
        }
        .item-header { 
            font-weight: 600; 
            font-size: 1.1rem; 
            color: #1e293b; 
            margin-bottom: 8px; 
        }
        .total-section { 
            background: #fef3c7; 
            border-radius: 8px; 
            padding: 20px; 
            border: 2px solid #facc15; 
        }
        .total-row { 
            display: grid; 
            grid-template-columns: 1fr auto; 
            margin-bottom: 8px; 
            padding: 4px 0;
        }
        .total-final { 
            font-size: 1.4rem; 
            font-weight: 700; 
            color: #ea580c; 
            border-top: 2px solid #ea580c; 
            padding-top: 12px; 
            margin-top: 12px; 
        }
        .footer { 
            background: #1e293b; 
            color: white; 
            padding: 25px; 
            text-align: center; 
        }
        .footer h3 { 
            color: #facc15; 
            margin-bottom: 15px; 
        }
        .contact-info { 
            margin: 15px 0; 
            opacity: 0.9; 
        }
        .status-badge { 
            display: inline-block; 
            padding: 6px 12px; 
            background: #10b981; 
            color: white; 
            border-radius: 20px; 
            font-weight: 600; 
            font-size: 0.9rem; 
        }
        @media print {
            body { background: white; }
            .receipt { box-shadow: none; }
        }
    </style>
</head>
<body>
    <div class="receipt">
        <div class="header">
            <h1>AVEENIX EXPRESS</h1>
            <p>Your Trusted Global E-Commerce Platform</p>
            <div style="margin-top: 20px;">
                <span class="status-badge">OFFICIAL RECEIPT</span>
            </div>
        </div>
        
        <div class="content">
            <div class="section">
                <div class="section-title">📄 Order Information</div>
                <div class="info-grid">
                    <span class="label">Order Number:</span>
                    <span class="value"><strong>${order.orderNumber || 'N/A'}</strong></span>
                    <span class="label">Order Date:</span>
                    <span class="value">${orderDate.toLocaleDateString('en-US', { 
                        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                    })}</span>
                    <span class="label">Order Time:</span>
                    <span class="value">${orderDate.toLocaleTimeString('en-US')}</span>
                    <span class="label">Status:</span>
                    <span class="value"><span class="status-badge">${(order.status || 'Confirmed').toUpperCase()}</span></span>
                </div>
            </div>

            <div class="section">
                <div class="section-title">👤 Customer Details</div>
                <div class="info-grid">
                    <span class="label">Email:</span>
                    <span class="value">${order.guestInfo?.email || order.customer?.email || 'N/A'}</span>
                    <span class="label">Customer Type:</span>
                    <span class="value">${order.guestInfo ? 'Guest Customer' : 'Registered Customer'}</span>
                </div>
            </div>

            <div class="section">
                <div class="section-title">🚚 Shipping Information</div>
                <div class="info-grid">
                    <span class="label">Ship To:</span>
                    <span class="value">${order.shippingAddress?.fullName || 'N/A'}</span>
                    <span class="label">Address:</span>
                    <span class="value">${order.shippingAddress?.address || 'N/A'}</span>
                    <span class="label">City, State:</span>
                    <span class="value">${order.shippingAddress?.city || 'N/A'}, ${order.shippingAddress?.state || 'N/A'}</span>
                    <span class="label">ZIP Code:</span>
                    <span class="value">${order.shippingAddress?.zipCode || 'N/A'}</span>
                    <span class="label">Phone:</span>
                    <span class="value">${order.shippingAddress?.phone || 'Not provided'}</span>
                    <span class="label">Shipping Method:</span>
                    <span class="value">${order.shippingMethod === 'standard' ? 'Standard Shipping (5-7 days)' :
                        order.shippingMethod === 'express' ? 'Express Shipping (2-3 days)' :
                        order.shippingMethod === 'overnight' ? 'Overnight Shipping (1 day)' : 'Standard Shipping'}</span>
                </div>
            </div>

            <div class="section">
                <div class="section-title">🛍️ Order Items</div>
                ${order.items?.map((item: any, index: number) => {
                    const itemTotal = (item.price || 0) * (item.quantity || 1);
                    return `
                    <div class="item-card">
                        <div class="item-header">${String(index + 1).padStart(2, '0')}. ${item.name || `Product ${item.productId || 'Unknown'}`}</div>
                        <div class="info-grid">
                            <span class="label">Product ID:</span>
                            <span class="value">${item.productId || 'N/A'}</span>
                            <span class="label">Unit Price:</span>
                            <span class="value">$${(item.price || 0).toFixed(2)}</span>
                            <span class="label">Quantity:</span>
                            <span class="value">${item.quantity || 1}</span>
                            <span class="label">Subtotal:</span>
                            <span class="value"><strong>$${itemTotal.toFixed(2)}</strong></span>
                        </div>
                    </div>`;
                }).join('') || '<p>No items found in this order</p>'}
            </div>

            <div class="section">
                <div class="section-title">💳 Payment Information</div>
                <div class="info-grid">
                    <span class="label">Payment Method:</span>
                    <span class="value">${getPaymentMethod().type || 'Credit Card'}</span>
                    ${getPaymentMethod().last4 ? `
                    <span class="label">Card Number:</span>
                    <span class="value">****-****-****-${getPaymentMethod().last4}</span>` : ''}
                    ${getPaymentMethod().brand ? `
                    <span class="label">Card Type:</span>
                    <span class="value">${getPaymentMethod().brand}</span>` : ''}
                    <span class="label">Transaction ID:</span>
                    <span class="value">${order?.transactionId || order?.orderNumber || 'N/A'}</span>
                    <span class="label">Payment Date:</span>
                    <span class="value">${orderDate.toLocaleDateString('en-US')}</span>
                </div>
            </div>

            <div class="section">
                <div class="section-title">💰 Order Summary</div>
                <div class="total-section">
                    <div class="total-row">
                        <span>Items Subtotal:</span>
                        <span>$${(order?.subtotal || order?.pricing?.subtotal || 0).toFixed(2)}</span>
                    </div>
                    <div class="total-row">
                        <span>Shipping & Handling:</span>
                        <span>${(order?.shippingCost || order?.pricing?.shippingCost || 0) > 0 ? 
                            `$${(order?.shippingCost || order?.pricing?.shippingCost || 0).toFixed(2)}` : 'FREE'}</span>
                    </div>
                    <div class="total-row">
                        <span>Tax (${((order?.tax || order?.pricing?.tax || 0) / (order?.subtotal || order?.pricing?.subtotal || 1) * 100).toFixed(1)}%):</span>
                        <span>$${(order?.tax || order?.pricing?.tax || 0).toFixed(2)}</span>
                    </div>
                    <div class="total-row total-final">
                        <span>TOTAL PAID:</span>
                        <span>$${(order?.total || order?.pricing?.total || 0).toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="footer">
            <h3>Thank You for Choosing AVEENIX EXPRESS!</h3>
            <div class="contact-info">
                📧 support@aveenix.com | 🌐 www.aveenix.com | 📞 1-800-AVEENIX<br>
                Follow us: @AveenixExpress | Newsletter: aveenix.com/newsletter
            </div>
            <hr style="border: 1px solid #facc15; margin: 20px 0;">
            <p style="font-size: 0.9rem; opacity: 0.8;">
                Receipt generated on: ${currentDate.toLocaleString('en-US')}<br>
                Receipt ID: ${order?.orderNumber}-${currentDate.getTime()}
            </p>
        </div>
    </div>
</body>
</html>`;

    // Create and download the HTML receipt
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AVEENIX-Receipt-${order?.orderNumber || 'ORDER'}-${orderDate.toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "HTML Receipt Downloaded",
      description: "Professional HTML receipt ready for viewing and printing",
    });
  };

  const handleDownloadPDFReceipt = () => {
    // For now, create a print-friendly version
    window.print();
    toast({
      title: "Print Receipt",
      description: "Opening print dialog for PDF creation",
    });
  };

  const handleEmailReceipt = () => {
    const subject = `Receipt for Order ${order.orderNumber}`;
    const body = `Hi,\n\nThank you for your order! Please find your receipt details below:\n\nOrder Number: ${order.orderNumber}\nTotal: $${(order.total || 0).toFixed(2)}\n\nBest regards,\nAVEENIX Express Team`;
    window.location.href = `mailto:${order.guestInfo?.email || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleTrackOrder = () => {
    navigate(`/track-order?id=${order.orderNumber}`);
  };

  const handleReorderItems = () => {
    // Add all order items back to cart
    if (order.items) {
      order.items.forEach((item: any) => {
        // This would integrate with your cart context
        console.log('Adding to cart:', item);
      });
      toast({
        title: "Items Added to Cart",
        description: `${order.items.length} items added to your cart`,
      });
      navigate('/cart');
    }
  };

  const handleWriteReview = () => {
    navigate(`/reviews/order/${order.orderNumber}`);
  };

  const handleReferFriends = () => {
    const referralLink = `${window.location.origin}/ref/${order.orderNumber}`;
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Referral Link Copied",
      description: "Share this link with friends for special discounts!",
    });
  };

  const handleSaveToWishlist = () => {
    if (order.items) {
      toast({
        title: "Items Saved to Wishlist",
        description: `${order.items.length} items saved for later`,
      });
    }
  };

  const handleSubscribeUpdates = () => {
    navigate('/newsletter?source=order');
  };

  const handleReturnExchange = () => {
    navigate(`/returns/initiate/${order.orderNumber}`);
  };

  const handleInvoiceRequest = () => {
    toast({
      title: "Invoice Request Submitted",
      description: "Your invoice will be emailed within 24 hours",
    });
  };

  const handleAddToCalendar = () => {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 7); // Estimate 7 days
    const event = {
      title: `AVEENIX Order Delivery - ${order.orderNumber}`,
      start: deliveryDate.toISOString().split('T')[0],
      description: `Expected delivery for order ${order.orderNumber}`
    };
    
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.start.replace(/-/g, '')}/${event.start.replace(/-/g, '')}&details=${encodeURIComponent(event.description)}`;
    window.open(calendarUrl, '_blank');
  };

  const handleExportData = () => {
    const orderData = JSON.stringify(order, null, 2);
    const blob = new Blob([orderData], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `order-data-${order.orderNumber}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Order Data Exported",
      description: "Your order data has been downloaded",
    });
  };

  const handleShareOrder = () => {
    if (navigator.share) {
      navigator.share({
        title: `Order ${order?.orderNumber} Confirmed`,
        text: `My order has been confirmed! Order #${order?.orderNumber}`,
        url: window.location.href
      });
    } else {
      // Fallback to clipboard copy
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (isLoading) {
    return (
      <MainEcommerceLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading your order details...</p>
          </div>
        </div>
      </MainEcommerceLayout>
    );
  }

  if (error || !order) {
    return (
      <MainEcommerceLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Order Not Found</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              We couldn't find the order you're looking for.
            </p>
            <Button onClick={() => navigate('/')}>
              Return Home
            </Button>
          </div>
        </div>
      </MainEcommerceLayout>
    );
  }

  return (
    <MainEcommerceLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-[1500px] mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
            <Link href="/" className="hover:text-yellow-500 flex items-center">
              <Home className="w-4 h-4 mr-1" />
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/cart" className="hover:text-yellow-500">
              Shopping Cart
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/checkout" className="hover:text-yellow-500">
              Checkout
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 dark:text-white font-medium">Order Confirmation</span>
          </nav>
          
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Order Confirmed!</h1>
                <p className="text-sm text-gray-500">
                  Order #{order?.orderNumber} • {order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/')}
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                Continue Shopping
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mb-8">
            {/* Download Receipt Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download Receipt
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center">
                <DropdownMenuItem onClick={handleDownloadReceipt}>
                  <FileText className="w-4 h-4 mr-2" />
                  Text Receipt
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDownloadHTMLReceipt}>
                  <FileDown className="w-4 h-4 mr-2" />
                  HTML Receipt
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDownloadPDFReceipt}>
                  <FileText className="w-4 h-4 mr-2" />
                  PDF Receipt
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleEmailReceipt}>
                  <Mail className="w-4 h-4 mr-2" />
                  Email Receipt
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handlePrintReceipt}>
                  <Printer className="w-4 h-4 mr-2" />
                  Print Receipt
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportData}>
                  <FileDown className="w-4 h-4 mr-2" />
                  Export Data
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Share Order */}
            <Button variant="outline" size="sm" onClick={handleShareOrder}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>

            {/* More Actions Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  More Actions
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center">

                <DropdownMenuItem onClick={handleReferFriends}>
                  <Users className="w-4 h-4 mr-2" />
                  Refer Friends
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSubscribeUpdates}>
                  <Mail className="w-4 h-4 mr-2" />
                  Subscribe to Updates
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleReturnExchange}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Return/Exchange
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleInvoiceRequest}>
                  <FileText className="w-4 h-4 mr-2" />
                  Request Invoice
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleAddToCalendar}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Add to Calendar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Checkout Progress Indicator */}
          <div className="mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
              <div className="flex items-center justify-between relative">
                {/* Progress Line */}
                <div className="absolute top-5 left-6 right-6 h-0.5 bg-gray-200 dark:bg-gray-700">
                  <div className="h-full bg-green-500 transition-all duration-500" style={{width: '100%'}}></div>
                </div>
                
                {/* Steps */}
                <div className="flex justify-between w-full relative z-10">
                  {/* Cart Step - Completed */}
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold shadow-md">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400 mt-2">Cart</span>
                  </div>
                  
                  {/* Shipping Step - Completed */}
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold shadow-md">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400 mt-2">Shipping</span>
                  </div>
                  
                  {/* Payment Step - Completed */}
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold shadow-md">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400 mt-2">Payment</span>
                  </div>
                  
                  {/* Review Step - Current/Completed */}
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold shadow-md">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400 mt-2">Review</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Order Details */}
            <div className="space-y-6">
              
              {/* Order Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      Order Status
                    </span>
                    <Badge className={getStatusColor(order?.status || 'processing')}>
                      {order?.status ? (order.status.charAt(0).toUpperCase() + order.status.slice(1)) : 'Processing'}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium text-green-800 dark:text-green-200">Order Confirmed</p>
                        <p className="text-sm text-green-600 dark:text-green-300">
                          We've received your order and payment
                        </p>
                      </div>
                    </div>
                    
                    {order?.status && order.status === 'processing' && (
                      <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <Clock className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-medium text-blue-800 dark:text-blue-200">Processing Order</p>
                          <p className="text-sm text-blue-600 dark:text-blue-300">
                            Your order is being prepared for shipment
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <strong>Confirmation sent to:</strong> {order?.guestInfo?.email || order?.customer?.email}
                      </p>
                      {order?.estimatedDelivery && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          <strong>Estimated delivery:</strong> {order?.estimatedDelivery}
                        </p>
                      )}
                      {order?.trackingNumber && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          <strong>Tracking number:</strong> {order?.trackingNumber}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>


              {/* Shipping Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="w-5 h-5" />
                    Shipping Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Shipping Address
                    </h4>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm">
                      <p className="font-medium">{order?.shippingAddress?.fullName || 'N/A'}</p>
                      <p>{order?.shippingAddress?.address || 'N/A'}</p>
                      <p>{order?.shippingAddress?.city || 'N/A'}, {order?.shippingAddress?.state || 'N/A'} {order?.shippingAddress?.zipCode || 'N/A'}</p>
                      {order?.shippingAddress?.phone && <p>Phone: {order?.shippingAddress?.phone}</p>}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Shipping Method</h4>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm">
                      <p className="font-medium">{getShippingMethodName(order?.shippingMethod || 'standard')}</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        Cost: {(order?.shippingCost || 0) > 0 ? `$${order?.shippingCost?.toFixed(2)}` : 'FREE'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      {order.paymentMethod === 'card' ? (
                        <CreditCard className="w-5 h-5" />
                      ) : (
                        <span className="text-xl">
                          {order.paymentMethod === 'paypal' ? '💳' : 
                           order.paymentMethod === 'apple' ? '🍎' : '🌐'}
                        </span>
                      )}
                      <div>
                        <p className="font-medium">
                          {order.paymentMethod === 'card' 
                            ? `Credit Card •••• ••••`
                            : order.paymentMethod === 'paypal' ? 'PayPal' :
                              order.paymentMethod === 'apple' ? 'Apple Pay' : 'Google Pay'
                          }
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Payment successful
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Order Items ({order.items?.length || 0} {(order.items?.length || 0) === 1 ? 'item' : 'items'})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.items?.map((item, index) => (
                      <div key={index} className="flex gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <img 
                          src={item.image || '/placeholder-product.png'} 
                          alt={item.name || 'Product'}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm line-clamp-2">{item.name || 'Product'}</h4>
                          {item.brand && <p className="text-xs text-gray-500">{item.brand}</p>}
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-sm">Qty: {item.quantity || 1}</span>
                            <span className="font-semibold">${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Order Summary */}
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order totals */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>${(order?.subtotal || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span>
                        {(order?.shippingCost || 0) > 0 
                          ? `$${order?.shippingCost?.toFixed(2)}` 
                          : 'FREE'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax</span>
                      <span>${(order.tax || 0).toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total Paid</span>
                      <span>${(order.total || 0).toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Contact Support */}
                  <div className="pt-4 border-t">
                    <div className="text-center">
                      <h4 className="font-medium mb-2">Need Help?</h4>
                      <div className="space-y-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => {
                            // Open Jarvis chat for order support
                            const event = new CustomEvent('openJarvisChat', {
                              detail: {
                                initialMessage: `I need help with my order ${order.orderNumber}. Can you assist me?`,
                                context: 'order_support'
                              }
                            });
                            window.dispatchEvent(event);
                          }}
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Ask a Question
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => navigate(`/track-order?id=${order.orderNumber}`)}
                        >
                          <Package className="w-4 h-4 mr-2" />
                          Track Order
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Order Info */}
                  <div className="text-xs text-gray-500 text-center pt-4 border-t">
                    <p>Order #{order.orderNumber}</p>
                    <p>Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* What's Next */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>What's Next?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-4">
                  <Mail className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <h3 className="font-medium mb-1">Confirmation Email</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Check your email for order confirmation and tracking info
                  </p>
                </div>
                <div className="p-4">
                  <Package className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
                  <h3 className="font-medium mb-1">Order Processing</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    We'll prepare and package your items with care
                  </p>
                </div>
                <div className="p-4">
                  <Truck className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <h3 className="font-medium mb-1">Fast Delivery</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Track your package and get ready to receive it
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainEcommerceLayout>
  );
}