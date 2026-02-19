export function CheckoutLoading() {
  return (
    <div className="checkout-page">
      <div className="container" style={{ maxWidth: '900px', padding: 'var(--spacing-xl) 0' }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          gap: '24px'
        }}>
          {/* Loader Spinner */}
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid #f0f0f0',
            borderTop: '4px solid #333',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: '600',
              margin: '0 0 12px 0',
              color: '#333'
            }}>
              Processing Your Order
            </h2>
            <p style={{ 
              fontSize: '16px',
              color: '#666',
              margin: 0,
              lineHeight: '1.5'
            }}>
              Please wait while we process your payment and confirm your order...
            </p>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
