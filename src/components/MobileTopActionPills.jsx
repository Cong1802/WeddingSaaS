import React from 'react';
import { LayoutGrid, Download } from 'lucide-react';

export default function MobileTopActionPills({ onOpenTemplateModal, onExportHTML }) {
  return (
    <div 
      className="mobile-only"
      style={{
        position: 'fixed',
        top: '12px',
        right: '12px',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        pointerEvents: 'none'
      }}
    >
      <button
        onClick={onOpenTemplateModal}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          padding: '6px 12px',
          borderRadius: '20px',
          border: '1px solid #fecdd3',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          color: '#e11d48',
          fontSize: '11px',
          fontWeight: '700',
          boxShadow: '0 4px 15px rgba(225, 29, 72, 0.15)',
          cursor: 'pointer',
          pointerEvents: 'auto'
        }}
      >
        <LayoutGrid size={13} color="#e11d48" /> Mẫu
      </button>

      <button
        onClick={onExportHTML}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          padding: '6px 12px',
          borderRadius: '20px',
          border: 'none',
          background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
          color: '#ffffff',
          fontSize: '11px',
          fontWeight: '700',
          boxShadow: '0 4px 15px rgba(244, 63, 94, 0.35)',
          cursor: 'pointer',
          pointerEvents: 'auto'
        }}
      >
        <Download size={13} /> Xuất Thiệp
      </button>
    </div>
  );
}
