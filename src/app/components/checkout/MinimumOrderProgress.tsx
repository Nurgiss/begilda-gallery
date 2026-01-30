import { MIN_SHOP_DELIVERY_AMOUNT_USD } from '@/constants/checkout';

interface MinimumOrderProgressProps {
  totalAmount: number;
  meetsMinimum: boolean;
  progressPercent: number;
}

export function MinimumOrderProgress({
  totalAmount,
  meetsMinimum,
  progressPercent
}: MinimumOrderProgressProps) {
  const remaining = MIN_SHOP_DELIVERY_AMOUNT_USD - totalAmount;

  return (
    <div style={{
      backgroundColor: '#fff3cd',
      padding: '16px 24px',
      marginBottom: 'var(--spacing-xl)',
      borderLeft: '4px solid #ffc107'
    }}>
      <p style={{ margin: 0, marginBottom: '12px', fontSize: '14px', color: '#856404', fontWeight: 500 }}>
        Minimum amount for Shop items delivery: ${MIN_SHOP_DELIVERY_AMOUNT_USD}
      </p>
      <div style={{
        width: '100%',
        height: '8px',
        backgroundColor: '#e0e0e0',
        borderRadius: '4px',
        overflow: 'hidden',
        marginBottom: '8px'
      }}>
        <div style={{
          width: `${progressPercent}%`,
          height: '100%',
          backgroundColor: meetsMinimum ? '#28a745' : '#ffc107',
          transition: 'width 0.3s ease, background-color 0.3s ease'
        }} />
      </div>
      <p style={{ margin: 0, fontSize: '13px', color: '#856404' }}>
        {meetsMinimum
          ? 'Minimum reached'
          : `$${remaining.toFixed(2)} more to minimum`}
      </p>
    </div>
  );
}
