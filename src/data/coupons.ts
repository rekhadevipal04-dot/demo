export interface Coupon {
  code: string;
  title: string;
  description: string;
  discountType: 'flat' | 'percentage';
  discountValue: number;
  minOrderAmount: number;
  maxDiscount?: number;
}

export const AVAILABLE_COUPONS: Coupon[] = [
  {
    code: 'VIKAS50',
    title: 'Flat ₹50 OFF',
    description: 'Flat ₹50 discount on orders above ₹250',
    discountType: 'flat',
    discountValue: 50,
    minOrderAmount: 250,
  },
  {
    code: 'FIRST10',
    title: '10% OFF Welcome Offer',
    description: '10% discount on orders above ₹150 (up to ₹80)',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 150,
    maxDiscount: 80,
  },
  {
    code: 'CHINESE20',
    title: '20% Mega Schezwan Feast',
    description: '20% discount on orders above ₹400 (up to ₹120)',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 400,
    maxDiscount: 120,
  },
  {
    code: 'FEAST100',
    title: 'Flat ₹100 Family Pack',
    description: 'Flat ₹100 discount on orders above ₹550',
    discountType: 'flat',
    discountValue: 100,
    minOrderAmount: 550,
  },
  {
    code: 'SCHZWN30',
    title: 'Flat ₹30 Quick Bite',
    description: 'Flat ₹30 discount on orders above ₹180',
    discountType: 'flat',
    discountValue: 30,
    minOrderAmount: 180,
  },
];

export interface ValidateCouponResult {
  isValid: boolean;
  error?: string;
  coupon?: Coupon;
  discount: number;
}

export function calculateCouponDiscount(coupon: Coupon, subtotal: number): number {
  if (subtotal < coupon.minOrderAmount) {
    return 0;
  }
  if (coupon.discountType === 'flat') {
    return Math.min(coupon.discountValue, subtotal);
  }
  if (coupon.discountType === 'percentage') {
    const rawDiscount = Math.round((subtotal * coupon.discountValue) / 100);
    return coupon.maxDiscount ? Math.min(rawDiscount, coupon.maxDiscount) : rawDiscount;
  }
  return 0;
}

export function validateCoupon(code: string, subtotal: number): ValidateCouponResult {
  const cleanCode = code.trim().toUpperCase();
  if (!cleanCode) {
    return { isValid: false, error: 'Please enter a coupon code.', discount: 0 };
  }

  const coupon = AVAILABLE_COUPONS.find(c => c.code.toUpperCase() === cleanCode);
  if (!coupon) {
    return {
      isValid: false,
      error: `Coupon "${cleanCode}" is invalid. Try VIKAS50, FIRST10, or CHINESE20.`,
      discount: 0,
    };
  }

  if (subtotal < coupon.minOrderAmount) {
    const needed = coupon.minOrderAmount - subtotal;
    return {
      isValid: false,
      error: `Add items worth ₹${needed} more to apply ${coupon.code} (Min order ₹${coupon.minOrderAmount}).`,
      discount: 0,
      coupon,
    };
  }

  const discount = calculateCouponDiscount(coupon, subtotal);

  return {
    isValid: true,
    coupon,
    discount,
  };
}
