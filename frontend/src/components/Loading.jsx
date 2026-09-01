import React from 'react';

export const Loading = ({ text = 'Loading...' }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 1rem',
        gap: '1rem',
      }}
    >
      <div
        style={{
          width: '44px',
          height: '44px',
          border: '3.5px solid #e2e8f0',
          borderTopColor: '#2563eb',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <p style={{ color: '#64748b', fontWeight: 500, fontSize: '0.95rem' }}>{text}</p>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export const ProductSkeleton = () => {
  return (
    <div
      className="product-card"
      style={{
        animation: 'pulse 1.5s ease-in-out infinite',
      }}
    >
      <div style={{ paddingTop: '75%', background: '#e2e8f0' }} />
      <div style={{ padding: '1.25rem' }}>
        <div style={{ height: '12px', width: '30%', background: '#e2e8f0', borderRadius: '4px', marginBottom: '8px' }} />
        <div style={{ height: '18px', width: '85%', background: '#cbd5e1', borderRadius: '4px', marginBottom: '14px' }} />
        <div style={{ height: '14px', width: '45%', background: '#e2e8f0', borderRadius: '4px', marginBottom: '16px' }} />
        <div style={{ height: '22px', width: '50%', background: '#cbd5e1', borderRadius: '4px', marginBottom: '14px' }} />
        <div style={{ height: '36px', width: '100%', background: '#e2e8f0', borderRadius: '8px' }} />
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default Loading;
