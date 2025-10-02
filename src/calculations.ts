import { CartItem, GroupDiscount } from './types';

export function calculateTotals(
  cart: CartItem[],
  groupDiscounts: GroupDiscount[],
  taxRate: number,
  payments: { amount: number }[]
) {
  // Calculate subtotal with item-level discounts
  let subtotal = 0;
  for (const item of cart) {
    const itemTotal = item.product.price * item.quantity;
    const discountAmt = itemTotal * (item.discount / 100);
    subtotal += itemTotal - discountAmt;
  }

  // Apply group discounts
  let groupDiscount = 0;
  for (const discount of groupDiscounts) {
    let groupTotal = 0;
    for (const item of cart) {
      if (discount.productIds.includes(item.id)) {
        const itemTotal = item.product.price * item.quantity;
        const discountAmt = itemTotal * (item.discount / 100);
        groupTotal += itemTotal - discountAmt;
      }
    }
    groupDiscount += groupTotal * (discount.percentage / 100);
  }

  const afterDiscount = subtotal - groupDiscount;
  const tax = afterDiscount * (taxRate / 100);
  const total = afterDiscount + tax;
  const paid = payments.reduce((sum, p) => sum + p.amount, 0);
  const remaining = Math.max(0, total - paid);

  return { subtotal, groupDiscount, tax, total, paid, remaining };
}