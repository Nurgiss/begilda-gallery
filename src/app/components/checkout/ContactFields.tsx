import type { CheckoutFormData, CheckoutFormErrors } from '@/types/forms';

interface ContactFieldsProps {
  formData: CheckoutFormData;
  errors: CheckoutFormErrors;
  onUpdateField: <K extends keyof CheckoutFormData>(field: K, value: CheckoutFormData[K]) => void;
  onUpdatePhone: (value: string) => void;
}

export function ContactFields({
  formData,
  errors,
  onUpdateField,
  onUpdatePhone
}: ContactFieldsProps) {
  return (
    <>
      <h2 className="section-title" style={{ fontSize: '20px', marginBottom: 'var(--spacing-md)', textAlign: 'left' }}>
        Contact Information
      </h2>

      <div className="form-group">
        <label className="form-label" htmlFor="fullName">Full Name *</label>
        <input
          id="fullName"
          type="text"
          className="form-input"
          value={formData.fullName}
          onChange={(e) => onUpdateField('fullName', e.target.value)}
          required
          style={{ borderColor: errors.fullName ? '#dc3545' : undefined }}
        />
        {errors.fullName && (
          <p style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            {errors.fullName}
          </p>
        )}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="email">Email *</label>
        <input
          id="email"
          type="email"
          className="form-input"
          value={formData.email}
          onChange={(e) => onUpdateField('email', e.target.value)}
          required
          style={{ borderColor: errors.email ? '#dc3545' : undefined }}
        />
        {errors.email && (
          <p style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            {errors.email}
          </p>
        )}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="phone">Phone *</label>
        <input
          id="phone"
          type="tel"
          className="form-input"
          value={formData.phone}
          onChange={(e) => onUpdatePhone(e.target.value)}
          placeholder="+1 (234) 567-89-01"
          required
          style={{ borderColor: errors.phone ? '#dc3545' : undefined }}
        />
        {errors.phone && (
          <p style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            {errors.phone}
          </p>
        )}
      </div>
    </>
  );
}
