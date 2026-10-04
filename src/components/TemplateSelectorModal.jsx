import React, { useState } from 'react';
import { X, Check, ArrowLeft } from 'lucide-react';
import useTemplates from '../templates/useTemplates';

export default function TemplateSelectorModal({ isOpen, onClose, selectedTemplateId, onSelectTemplate }) {
  const templates = useTemplates();
  const [filterCategory, setFilterCategory] = useState('Tất Cả');

  if (!isOpen) return null;

  const categories = ['Tất Cả', ...new Set(templates.map(template => template.category))];

  const filteredTemplates = filterCategory === 'Tất Cả'
    ? templates
    : templates.filter(t => t.category === filterCategory);

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100vh',
        backgroundColor: '#ffffff',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        color: '#1e293b',
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        boxSizing: 'border-box'
      }}
    >
      {/* Top Navigation Header Bar */}
      <div style={{
        height: '52px',
        padding: '0 12px',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={onClose}
            style={{
              border: 'none',
              background: 'transparent',
              padding: '4px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#334155',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={20} />
          </button>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>
            Chọn Mẫu
          </h3>
        </div>

        <button
          onClick={onClose}
          style={{
            border: 'none',
            background: '#f1f5f9',
            borderRadius: '50%',
            width: '30px',
            height: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>
      </div>

      {/* Filter Categories sub-bar */}
      <div style={{
        padding: '8px 12px',
        backgroundColor: '#f8fafc',
        borderBottom: '1px solid #f1f5f9',
        display: 'flex',
        gap: '6px',
        overflowX: 'auto',
        flexShrink: 0
      }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            style={{
              padding: '5px 12px',
              borderRadius: '16px',
              border: 'none',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              background: filterCategory === cat ? '#2563eb' : '#e2e8f0',
              color: filterCategory === cat ? '#ffffff' : '#475569',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid Templates */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '12px',
        padding: '12px',
        alignContent: 'start'
      }}>
        {filteredTemplates.map(tpl => {
          const isSelected = selectedTemplateId === tpl.id;
          return (
            <div
              key={tpl.id}
              onClick={() => {
                onSelectTemplate(tpl);
                onClose();
              }}
              style={{
                borderRadius: '12px',
                backgroundColor: '#ffffff',
                border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                overflow: 'hidden',
                cursor: 'pointer',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ position: 'relative', width: '100%', height: '140px', backgroundColor: '#030712' }}>
                <img
                  src={tpl.thumbnail || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80'}
                  alt={tpl.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                />
                {isSelected && (
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: '#2563eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Check size={14} color="#ffffff" strokeWidth={3} />
                  </div>
                )}
              </div>
              <div style={{ padding: '8px 10px' }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: isSelected ? '#2563eb' : '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {tpl.name}
                </div>
                <div style={{ fontSize: '10px', color: '#64748b' }}>
                  {tpl.category}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
