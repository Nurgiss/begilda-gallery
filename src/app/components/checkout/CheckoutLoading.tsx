export function CheckoutLoading() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        padding: '60px 80px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '40px',
        maxWidth: '500px',
        width: '90%',
        animation: 'fadeIn 0.3s ease-in-out'
      }}>
        {/* Loader Spinner - более заметный */}
        <div style={{
          width: '80px',
          height: '80px',
          border: '6px solid #f0f0f0',
          borderTop: '6px solid #333',
          borderRadius: '50%',
          animation: 'spin-loader 0.8s linear infinite'
        }} />
        
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: '700',
            margin: '0 0 16px 0',
            color: '#1a1a1a',
            letterSpacing: '-0.5px',
            textTransform: 'uppercase'
          }}>
            Processing Your Order
          </h2>
          <p style={{ 
            fontSize: '15px',
            fontWeight: '400',
            color: '#666',
            margin: '0 0 8px 0',
            lineHeight: '1.6'
          }}>
            Please wait while we process your payment and confirm your order...
          </p>
          <p style={{
            fontSize: '13px',
            color: '#999',
            margin: 0,
            fontStyle: 'italic'
          }}>
            This usually takes 30-60 seconds
          </p>
        </div>
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
