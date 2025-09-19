// Sales utility functions for Aveenix
export const uid = (prefix = 'ID') => `${prefix}_${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
export const now = () => new Date();
export function cents(n: number) { return Math.round(n); }

// Settings - integrate with existing Aveenix settings later
export const SalesSettings = {
  currency: 'USD',
  tax: { mode: 'flat', rate: 0.07 }, // 7% flat tax
  shipping: { 
    mode: 'flat', 
    rates: [{ name: 'Standard', cents: 799 }, { name: 'Express', cents: 1599 }] 
  },
  payments: { providers: ['stripe', 'paypal'] },
  returns: { windowDays: 30 },
};

// Calculate order totals with voucher logic (vouchers apply to dropship only)
export function calculateCartTotals(
  lines: Array<{ qty: number, priceCents: number, type?: string }>, 
  voucherCents = 0
) {
  const dropshipSubtotal = lines
    .filter(l => (l.type || 'dropship') === 'dropship')
    .reduce((a, l) => a + l.qty * l.priceCents, 0);
  
  const otherSubtotal = lines
    .filter(l => (l.type || 'dropship') !== 'dropship')
    .reduce((a, l) => a + l.qty * l.priceCents, 0);
  
  const subtotal = dropshipSubtotal + otherSubtotal;

  // Apply voucher to dropship lines only
  const discountCents = Math.min(voucherCents || 0, dropshipSubtotal);

  const shipping = SalesSettings.shipping.rates[0]?.cents || 0;
  const taxable = subtotal - discountCents + shipping;
  const tax = SalesSettings.tax.mode === 'flat' ? Math.floor(taxable * SalesSettings.tax.rate) : 0;
  const total = taxable + tax;

  return {
    dropshipSubtotalCents: dropshipSubtotal,
    otherSubtotalCents: otherSubtotal,
    subtotalCents: subtotal,
    discountCents,
    shippingCents: shipping,
    taxCents: tax,
    totalCents: total
  };
}