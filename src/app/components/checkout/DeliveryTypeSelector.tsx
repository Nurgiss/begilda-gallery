import { DELIVERY_TYPES, type DeliveryType } from '@/types/common/DeliveryType';

interface DeliveryTypeSelectorProps {
  value: DeliveryType;
  onChange: (type: DeliveryType) => void;
}

export function DeliveryTypeSelector({ value, onChange }: DeliveryTypeSelectorProps) {
  return (
    <div className="form-group">
      <label className="form-label">Delivery Type *</label>
      <div className="segmented-control">
        <button
          type="button"
          className={`segmented-option ${value === DELIVERY_TYPES.PICKUP ? 'active' : ''}`}
          onClick={() => onChange(DELIVERY_TYPES.PICKUP)}
        >
          Pickup
        </button>
        <button
          type="button"
          className={`segmented-option ${value === DELIVERY_TYPES.DELIVERY ? 'active' : ''}`}
          onClick={() => onChange(DELIVERY_TYPES.DELIVERY)}
        >
          Delivery
        </button>
      </div>
    </div>
  );
}
