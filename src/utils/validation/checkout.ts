import type { CheckoutFormData, CheckoutFormErrors } from '@/types/forms';
import { DELIVERY_TYPES } from '@/types/common/DeliveryType';
import { validateEmail } from './email';
import { validatePhone } from './phone';

export interface ValidationResult {
  isValid: boolean;
  errors: CheckoutFormErrors;
}

export function validateCheckoutForm(data: CheckoutFormData): ValidationResult {
  const errors: CheckoutFormErrors = {};

  if (!data.fullName.trim()) {
    errors.fullName = 'Please enter your full name';
  }

  if (!data.email.trim()) {
    errors.email = 'Please enter your email';
  } else if (!validateEmail(data.email)) {
    errors.email = 'Please enter a valid email';
  }

  if (!data.phone.trim()) {
    errors.phone = 'Please enter your phone number';
  } else if (!validatePhone(data.phone)) {
    errors.phone = 'Phone number must contain at least 10 digits';
  }

  if (data.deliveryType === DELIVERY_TYPES.PICKUP) {
    if (!data.pickupPoint) {
      errors.pickupPoint = 'Please select a pickup point';
    }
  }

  if (data.deliveryType === DELIVERY_TYPES.DELIVERY) {
    if (!data.countryCode) errors.country = 'Please select a country';
    if (!data.postalCode.trim()) errors.postalCode = 'Please enter postal code';
    if (!data.city.trim()) errors.city = 'Please enter a city';
    if (!data.address.trim()) errors.address = 'Please enter address';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
