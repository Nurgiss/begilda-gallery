import { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import { createOrder, getPickupPoints } from '@/api/client';
import { validateCheckoutForm, formatPhoneNumber } from '@/utils/validation';
import { MIN_SHOP_DELIVERY_AMOUNT_USD } from '@/constants/checkout';
import { DELIVERY_TYPES, type DeliveryType } from '@/types/common/DeliveryType';
import type { PickupPoint } from '@/types/models/PickupPoint';
import type { CartItem } from '@/types/models/Cart';
import type { CheckoutFormData, CheckoutFormErrors } from '@/types/forms';
import type { OrderItem } from '@/types/models/Order';

const INITIAL_FORM_DATA: CheckoutFormData = {
  fullName: '',
  email: '',
  phone: '',
  deliveryType: DELIVERY_TYPES.DELIVERY,
  pickupPoint: '',
  countryCode: '',
  country: '',
  postalCode: '',
  city: '',
  address: '',
};

export interface UseCheckoutState {
  formData: CheckoutFormData;
  errors: CheckoutFormErrors;
  pickupPoints: PickupPoint[];
  loading: boolean;
  processing: boolean;
  submitted: boolean;
  orderId: string | null;
}

export interface UseCheckoutActions {
  updateField: <K extends keyof CheckoutFormData>(field: K, value: CheckoutFormData[K]) => void;
  updatePhone: (value: string) => void;
  setDeliveryType: (type: DeliveryType) => void;
  submitOrder: (e: React.FormEvent) => Promise<void>;
}

export interface UseCheckoutComputed {
  totalAmount: number;
  hasShopItems: boolean;
  isDelivery: boolean;
  needsMinimum: boolean;
  meetsMinimum: boolean;
  progressPercent: number;
  canSubmit: boolean;
}

export interface UseCheckoutReturn {
  state: UseCheckoutState;
  actions: UseCheckoutActions;
  computed: UseCheckoutComputed;
  cart: CartItem[];
}

export function useCheckout(): UseCheckoutReturn {
  const { cart, clearCart } = useAppContext();

  const [formData, setFormData] = useState<CheckoutFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<CheckoutFormErrors>({});
  const [pickupPoints, setPickupPoints] = useState<PickupPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    async function loadPickupPoints() {
      try {
        const data = await getPickupPoints();
        setPickupPoints(data.filter((p: PickupPoint) => p.isActive));
      } catch (error) {
        console.error('Error loading pickup points:', error);
      }
    }
    loadPickupPoints();
  }, []);

  const totalAmount = cart.reduce((sum, { item, quantity }) => {
    const price = item.priceUSD || item.price || 0;
    return sum + price * quantity;
  }, 0);

  const hasShopItems = cart.some(({ type }) => type === 'shop');
  const isDelivery = formData.deliveryType === DELIVERY_TYPES.DELIVERY;
  const needsMinimum = hasShopItems && isDelivery;
  const meetsMinimum = !needsMinimum || totalAmount >= MIN_SHOP_DELIVERY_AMOUNT_USD;
  const progressPercent = needsMinimum
    ? Math.min((totalAmount / MIN_SHOP_DELIVERY_AMOUNT_USD) * 100, 100)
    : 100;
  const canSubmit = !loading && meetsMinimum;

  const updateField = useCallback(<K extends keyof CheckoutFormData>(
    field: K,
    value: CheckoutFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof CheckoutFormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const updatePhone = useCallback((value: string) => {
    const formatted = formatPhoneNumber(value);
    setFormData(prev => ({ ...prev, phone: formatted }));
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: undefined }));
    }
  }, [errors.phone]);

  const setDeliveryType = useCallback((type: DeliveryType) => {
    setFormData(prev => ({ ...prev, deliveryType: type }));
  }, []);

  const submitOrder = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateCheckoutForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    if (isDelivery && hasShopItems && totalAmount < MIN_SHOP_DELIVERY_AMOUNT_USD) {
      alert(`Minimum order amount for Shop items delivery is $${MIN_SHOP_DELIVERY_AMOUNT_USD}.`);
      return;
    }

    setLoading(true);

    try {
      const items: OrderItem[] = cart.map(({ item, type, quantity }) => ({
        itemId: typeof item.id === 'number' ? item.id : parseInt(String(item.id), 10),
        itemType: type,
        title: item.title,
        price: item.priceUSD || item.price,
        quantity,
      }));

      const orderData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        deliveryType: formData.deliveryType,
        pickupPoint: formData.deliveryType === DELIVERY_TYPES.PICKUP ? formData.pickupPoint : undefined,
        country: formData.deliveryType === DELIVERY_TYPES.DELIVERY ? formData.country : undefined,
        postalCode: formData.deliveryType === DELIVERY_TYPES.DELIVERY ? formData.postalCode : undefined,
        city: formData.deliveryType === DELIVERY_TYPES.DELIVERY ? formData.city : undefined,
        address: formData.deliveryType === DELIVERY_TYPES.DELIVERY ? formData.address : undefined,
        items,
        totalAmount,
        status: 'pending' as const,
      };

      const created = await createOrder(orderData);
      setOrderId(created?.id ? String(created.id) : null);
      setLoading(false);
      setProcessing(true);

      setTimeout(() => {
        setProcessing(false);
        setSubmitted(true);
        clearCart();
      }, 2000);
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Error placing order. Please try again.');
      setLoading(false);
    }
  }, [formData, cart, totalAmount, isDelivery, hasShopItems, clearCart]);

  return {
    state: {
      formData,
      errors,
      pickupPoints,
      loading,
      processing,
      submitted,
      orderId,
    },
    actions: {
      updateField,
      updatePhone,
      setDeliveryType,
      submitOrder,
    },
    computed: {
      totalAmount,
      hasShopItems,
      isDelivery,
      needsMinimum,
      meetsMinimum,
      progressPercent,
      canSubmit,
    },
    cart,
  };
}
