export function CheckoutLoading() {
  return (
    <div className="checkout-page" style={{ backgroundColor: '#fafafa' }}>
      <div className="container" style={{ maxWidth: '900px', padding: 'var(--spacing-xl) var(--spacing-md)' }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '70vh',
          gap: '32px',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          padding: '60px 40px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
        }}>
          {/* Loader Spinner - larger and more visible */}
          <div style={{
            width: '80px',
            height: '80px',
            border: '5px solid #e8e8e8',
            borderTop: '5px solid #333',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
          }} />
          
          <div style={{ textAlign: 'center', maxWidth: '500px' }}>
            <h2 style={{ 
              fontSize: '28px', 
              fontWeight: '700',
              margin: '0 0 16px 0',
              color: '#1a1a1a',
              letterSpacing: '-0.5px'
            }}>
              Processing Your Order
            </h2>
            <p style={{ 
              fontSize: '16px',
              fontWeight: '500',
              color: '#555',
              margin: '0 0 12px 0',
              lineHeight: '1.6'
            }}>
              Please wait while we process your payment and confirm your order...
            </p>
            <p style={{
              fontSize: '14px',
              color: '#999',
              margin: 0,
              fontStyle: 'italic'
            }}>
              This usually takes 30-60 seconds
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
