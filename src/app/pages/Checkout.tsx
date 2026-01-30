import { useNavigate } from 'react-router-dom';
import { useCheckout } from '../hooks/useCheckout';
import { DELIVERY_TYPES } from '@/types/common/DeliveryType';
import { MIN_SHOP_DELIVERY_AMOUNT_USD } from '@/constants/checkout';
import {
  OrderSummary,
  ShippingInfo,
  MinimumOrderProgress,
  ContactFields,
  DeliveryTypeSelector,
  PickupPointSelector,
  DeliveryAddressFields,
  OrderSuccess,
  CheckoutLoading,
  EmptyCart,
} from '../components/checkout';

export function Checkout() {
  const navigate = useNavigate();
  const { state, actions, computed, cart } = useCheckout();

  if (state.processing || state.loading) {
    return <CheckoutLoading />;
  }

  if (state.submitted) {
    return <OrderSuccess orderId={state.orderId} formData={state.formData} />;
  }

  if (cart.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="checkout-page">
      <div className="container" style={{ maxWidth: '900px', padding: 'var(--spacing-xl) 0' }}>
        <button
          className="btn btn-secondary"
          onClick={() => navigate('/cart')}
          style={{ marginBottom: 'var(--spacing-lg)' }}
        >
          Back to Cart
        </button>

        <h1 className="page-title" style={{ marginBottom: 'var(--spacing-md)' }}>
          Checkout
        </h1>

        <OrderSummary cart={cart} totalAmount={computed.totalAmount} />
        <ShippingInfo />

        {computed.needsMinimum && (
          <MinimumOrderProgress
            totalAmount={computed.totalAmount}
            meetsMinimum={computed.meetsMinimum}
            progressPercent={computed.progressPercent}
          />
        )}

        <form onSubmit={actions.submitOrder}>
          <ContactFields
            formData={state.formData}
            errors={state.errors}
            onUpdateField={actions.updateField}
            onUpdatePhone={actions.updatePhone}
          />

          <h2 className="section-title" style={{ fontSize: '20px', margin: 'var(--spacing-lg) 0 var(--spacing-md)', textAlign: 'left' }}>
            Delivery Method and Address
          </h2>

          <DeliveryTypeSelector
            value={state.formData.deliveryType}
            onChange={actions.setDeliveryType}
          />

          {state.formData.deliveryType === DELIVERY_TYPES.PICKUP ? (
            <PickupPointSelector
              pickupPoints={state.pickupPoints}
              value={state.formData.pickupPoint}
              onChange={(value) => actions.updateField('pickupPoint', value)}
              required
            />
          ) : (
            <DeliveryAddressFields
              formData={state.formData}
              errors={state.errors}
              onUpdateField={actions.updateField}
            />
          )}

          <button
            type="submit"
            className="btn"
            disabled={!computed.canSubmit}
            style={{
              width: '100%',
              marginTop: 'var(--spacing-md)',
              opacity: computed.canSubmit ? 1 : 0.6,
              cursor: computed.canSubmit ? 'pointer' : 'not-allowed'
            }}
          >
            {state.loading
              ? 'Processing order...'
              : !computed.meetsMinimum
                ? `Minimum $${MIN_SHOP_DELIVERY_AMOUNT_USD} for delivery`
                : 'Place Order'}
          </button>
        </form>
      </div>
    </div>
  );
}
