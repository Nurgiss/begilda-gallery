import { useMemo } from 'react';
import { getAllCountries, getCitiesOfCountry, type ICountry, type ICity } from '@/utils/location';
import { Autocomplete } from '../ui/Autocomplete';
import type { CheckoutFormData, CheckoutFormErrors } from '@/types/forms';

interface DeliveryAddressFieldsProps {
  formData: CheckoutFormData;
  errors: CheckoutFormErrors;
  onUpdateField: <K extends keyof CheckoutFormData>(field: K, value: CheckoutFormData[K]) => void;
}

export function DeliveryAddressFields({
  formData,
  errors,
  onUpdateField
}: DeliveryAddressFieldsProps) {
  const countries = useMemo(() => getAllCountries(), []);

  const cities = useMemo(() => {
    if (!formData.countryCode) return [];
    return getCitiesOfCountry(formData.countryCode);
  }, [formData.countryCode]);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const countryCode = e.target.value;
    const country = countries.find(c => c.isoCode === countryCode);
    onUpdateField('countryCode', countryCode);
    onUpdateField('country', country?.name || '');
    onUpdateField('city', '');
  };

  const handleCityChange = (value: string) => {
    onUpdateField('city', value);
  };

  return (
    <>
      <div className="form-group">
        <label className="form-label" htmlFor="country">Country *</label>
        <select
          id="country"
          className="form-select"
          value={formData.countryCode}
          onChange={handleCountryChange}
          required
          style={{ borderColor: errors.country ? '#dc3545' : undefined }}
        >
          <option value="">Select country</option>
          {countries.map((country: ICountry) => (
            <option key={country.isoCode} value={country.isoCode}>
              {country.name}
            </option>
          ))}
        </select>
        {errors.country && (
          <p style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            {errors.country}
          </p>
        )}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="postalCode">Postal Code *</label>
        <input
          id="postalCode"
          type="text"
          className="form-input"
          value={formData.postalCode}
          onChange={(e) => onUpdateField('postalCode', e.target.value)}
          required
          style={{ borderColor: errors.postalCode ? '#dc3545' : undefined }}
        />
        {errors.postalCode && (
          <p style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            {errors.postalCode}
          </p>
        )}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="city">City *</label>
        <Autocomplete<ICity>
          id="city"
          options={cities}
          value={formData.city}
          onChange={handleCityChange}
          getOptionLabel={(city) => city.name}
          getOptionKey={(city) => `${city.name}-${city.stateCode}`}
          placeholder={formData.countryCode ? "Type to search or enter city" : "Select country first"}
          disabled={!formData.countryCode}
          error={!!errors.city}
          required
        />
        {errors.city && (
          <p style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            {errors.city}
          </p>
        )}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="address">Address *</label>
        <input
          id="address"
          type="text"
          className="form-input"
          value={formData.address}
          onChange={(e) => onUpdateField('address', e.target.value)}
          required
          style={{ borderColor: errors.address ? '#dc3545' : undefined }}
        />
        {errors.address && (
          <p style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            {errors.address}
          </p>
        )}
      </div>
    </>
  );
}
