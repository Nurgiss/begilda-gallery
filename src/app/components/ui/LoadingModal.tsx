export function LoadingModal() {
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
        padding: '50px 60px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '30px',
        maxWidth: '400px',
        width: '90%',
        animation: 'fadeIn 0.3s ease-in-out'
      }}>
        {/* Loader Spinner */}
        <div style={{
          width: '60px',
          height: '60px',
          border: '5px solid #f0f0f0',
          borderTop: '5px solid #333',
          borderRadius: '50%',
          animation: 'spin-loader 0.8s linear infinite'
        }} />
        
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: '600',
            margin: '0',
            color: '#1a1a1a',
            letterSpacing: '-0.5px',
            textTransform: 'uppercase'
          }}>
            Loading...
          </h2>
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
        
        @keyframes spin-loader {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
