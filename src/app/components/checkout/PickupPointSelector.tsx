import type { PickupPoint } from '@/types/models/PickupPoint';

interface PickupPointSelectorProps {
  pickupPoints: PickupPoint[];
  value: string;
  onChange: (value: string) => void;
  required: boolean;
}

export function PickupPointSelector({
  pickupPoints,
  value,
  onChange,
  required
}: PickupPointSelectorProps) {
  return (
    <div className="form-group">
      <label className="form-label">Pickup Point *</label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {pickupPoints.length === 0 ? (
          <p style={{ color: '#666', fontSize: '14px' }}>No pickup points available</p>
        ) : (
          pickupPoints.map((point) => (
            <label
              key={point.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '16px',
                border: value === String(point.id) ? '2px solid #000' : '1px solid #ddd',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: value === String(point.id) ? '#f8f9fa' : 'white',
                transition: 'all 0.2s'
              }}
            >
              <input
                type="radio"
                name="pickupPoint"
                value={point.id}
                checked={value === String(point.id)}
                onChange={(e) => onChange(e.target.value)}
                required={required}
                style={{ marginTop: '4px', cursor: 'pointer' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, marginBottom: '4px' }}>{point.name}</div>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '2px' }}>
                  {point.city}, {point.address}
                </div>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '2px' }}>
                  {point.phone}
                </div>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  {point.workingHours}
                </div>
              </div>
            </label>
          ))
        )}
      </div>
    </div>
  );
}
