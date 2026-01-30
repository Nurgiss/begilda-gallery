export function ShippingInfo() {
  return (
    <div style={{
      backgroundColor: '#e3f2fd',
      padding: '20px 28px',
      marginBottom: 'var(--spacing-xl)',
      borderRadius: '8px',
      borderLeft: '4px solid #2196f3'
    }}>
      <h2 style={{
        fontSize: '16px',
        marginBottom: '12px',
        color: '#1565c0',
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span>Shipping Information</span>
      </h2>
      <p style={{ margin: 0, fontSize: '14px', color: '#1976d2', lineHeight: '1.6' }}>
        The amount shown above excludes shipping cost. Shipping will be calculated
        individually after order placement based on your location and delivery method.
      </p>
    </div>
  );
}
