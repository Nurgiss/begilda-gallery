export const DELIVERY_TYPES = {
  PICKUP: 'pickup',
  DELIVERY: 'delivery',
} as const;

export type DeliveryType = typeof DELIVERY_TYPES[keyof typeof DELIVERY_TYPES];
