import React, { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function PurchaseModal({ isOpen, onClose, token, onPurchaseSuccess, onSuccess, templateCode, templateName, initialPackage = 'pro' }) {
  const [selectedPackage, setSelectedPackage] = useState('pro'); // 'pro' | 'vip'
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [copiedContent, setCopiedContent] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [plans, setPlans] = useState([]);
  const [catalogError, setCatalogError] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('pending');
  useEffect(() => {
    if (!isOpen) return;
    let active = true;
    setOrderData(null); setConfirmed(false); setCatalogError(''); setPaymentStatus('pending');
    fetch('/api/public/plans', { headers: { Accept: 'application/json' } })
      .then(response => { if (!response.ok) throw new Error('Không tải được gói cước.'); return response.json(); })
      .then(data => {
        if (!active) return;
        const available = (data.plans || []).filter(plan => Number(plan.price) >= 10000);
        setPlans(available);
        setSelectedPackage(available.find(plan => plan.code === initialPackage)?.code || available[0]?.code || '');
      })
      .catch(error => { if (active) { setPlans([]); setCatalogError(error.message); } });
    return () => { active = false; };
  }, [isOpen, initialPackage, templateCode]);

  useEffect(() => {
    if (!isOpen || !orderData?.order?.id || paymentStatus !== 'pending') return;
    let active = true;
    let pending = false;
    const check = async () => {
      if (pending) return;
      pending = true;
      try {
        const response = await fetch('/api/orders/my-orders', { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } });
        if (!response.ok) return;
        const data = await response.json();
        const order = data.orders?.find(item => item.id === orderData.order.id);
        if (!active || !order) return;
        if (order.status === 'cancelled') setPaymentStatus('cancelled');
        if (order.status === 'completed') {
          setPaymentStatus('completed');
          (onPurchaseSuccess || onSuccess)?.();
        }
      } catch { /* A connection failure never grants access. */ }
      finally { pending = false; }
    };
    check();
    const interval = setInterval(check, 4000);
    return () => { active = false; clearInterval(interval); };
  }, [isOpen, orderData?.order?.id, token, paymentStatus, onPurchaseSuccess, onSuccess]);

  if (!isOpen) return null;

  const handleCreateOrder = async (pkgType) => {
    setSelectedPackage(pkgType);
    setLoading(true);
    setOrderData(null);
    setConfirmed(false);

    try {
      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({ plan_code: pkgType, template_code: templateCode })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOrderData(data);
      } else {
        alert(data.message || 'Lỗi khi tạo đơn hàng');
      }
    } catch (err) {
      alert(err.message || 'Lỗi kết nối máy chủ');
    } finally {
      setLoading(false);
    }
  };

  const copyTransferContent = (content) => {
    navigator.clipboard.writeText(content);
    setCopiedContent(true);
    setTimeout(() => setCopiedContent(false), 2000);
  };

  return (
    <div 
      className="app-modal-overlay animate-fade-in"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(3, 7, 18, 0.8)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 100000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        boxSizing: 'border-box'
      }} 
      onClick={onClose}
    >
      <div
        className="app-modal-container"
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '520px',
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          position: 'relative',
          color: '#0f172a',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        {/* Mobile Drag Handle */}
        <div className="mobile-only" style={{ width: '36px', height: '4px', borderRadius: '2px', backgroundColor: 'rgba(255, 255, 255, 0.3)', margin: '10px auto 4px auto', flexShrink: 0 }} />
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #f43f5e 0%, #ec4899 50%, #8b5cf6 100%)',
          padding: '24px 20px',
          textAlign: 'center',
          color: '#ffffff',
          position: 'relative'
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: '#ffffff',
              fontSize: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ✕
          </button>

          <div style={{
            width: '48px',
            height: '48px',
            margin: '0 auto 8px auto',
            borderRadius: '16px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            backdropFilter: 'blur(6px)'
          }}>
            💳
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', fontFamily: "'Playfair Display', serif", margin: 0 }}>
            Thanh Toán Mua Thiệp Cưới
          </h2>
          <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.85)', margin: '4px 0 0 0' }}>
            {templateName || 'Chọn mẫu trước khi thanh toán'} · Quyền sử dụng mẫu trong 6 tháng
          </p>
        </div>

        {/* Content Body */}
        <div style={{ padding: '24px' }}>
          
          {paymentStatus === 'cancelled' && <p role="alert" style={{ color: '#dc2626' }}>Đơn đã bị hủy. Đóng cửa sổ và tạo đơn mới nếu muốn mua mẫu.</p>}
          {!orderData ? (
            /* Step 1: Package Selection */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#334155', margin: 0 }}>
                1. Chọn Gói Thiệp Cưới Của Bạn:
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {plans.map(plan => <button key={plan.code} type="button" onClick={() => setSelectedPackage(plan.code)} style={{ padding: 16, borderRadius: 16, textAlign: 'left', border: selectedPackage === plan.code ? '2px solid #f43f5e' : '1px solid #cbd5e1', background: selectedPackage === plan.code ? '#fff1f2' : '#f8fafc', cursor: 'pointer' }}>
                  <h4 style={{ fontSize: 16, color: '#0f172a', margin: '4px 0' }}>{plan.name}</h4>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#f43f5e' }}>{Number(plan.price).toLocaleString('vi-VN')} VND</div>
                  <p style={{ fontSize: 11, color: '#64748b' }}>{plan.description}</p>
                </button>)}
              </div>
              {catalogError && <p role="alert">{catalogError}</p>}

              <button
                onClick={() => handleCreateOrder(selectedPackage)}
                disabled={loading || !templateCode || !plans.some(plan => plan.code === selectedPackage)}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #f43f5e 0%, #ec4899 100%)',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: '700',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(244, 63, 94, 0.35)',
                  marginTop: '8px'
                }}
              >
                {loading ? 'Đang tạo mã VietQR thanh toán...' : '👉 Tiếp Tục Thanh Toán VietQR'}
              </button>
            </div>
          ) : (
            /* Step 2: VietQR Checkout Display */
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', textAlign: 'center' }}>
              
              <div style={{ backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', padding: '10px 14px', borderRadius: '12px', width: '100%', boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={20} color="#059669" />
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#047857' }}>
                  Đã tạo đơn hàng thành công! Mã đơn: <strong style={{ color: '#0f172a' }}>{orderData.order.order_code}</strong>
                </span>
              </div>

              {/* QR Image Box */}
              <div style={{
                backgroundColor: '#f8fafc',
                padding: '16px',
                borderRadius: '20px',
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
                boxSizing: 'border-box'
              }}>
                <img
                  src={orderData.qr_url}
                  alt="Mã QR Chuyển Khoản Ngân Hàng"
                  style={{ width: '220px', height: '220px', borderRadius: '12px' }}
                />
                <span style={{ fontSize: '11px', color: '#64748b' }}>Quét mã QR bằng App Ngân hàng (MB, Vietcombank, Techcombank, VPBank...)</span>
              </div>

              {/* Transfer Details Table */}
              <div style={{
                width: '100%',
                backgroundColor: '#f1f5f9',
                borderRadius: '14px',
                padding: '14px',
                fontSize: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                boxSizing: 'border-box',
                textAlign: 'left'
              }}>
                <div style={{ display: 'flex', justifyBetween: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Ngân hàng:</span>
                  <span style={{ fontWeight: '700', color: '#0f172a' }}>{orderData.bank_info.bank_name}</span>
                </div>
                <div style={{ display: 'flex', justifyBetween: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Số tài khoản:</span>
                  <span style={{ fontWeight: '800', color: '#f43f5e', fontFamily: 'monospace', fontSize: '14px' }}>{orderData.bank_info.account_no}</span>
                </div>
                <div style={{ display: 'flex', justifyBetween: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Chủ tài khoản:</span>
                  <span style={{ fontWeight: '700', color: '#0f172a' }}>{orderData.bank_info.account_name}</span>
                </div>
                <div style={{ display: 'flex', justifyBetween: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Số tiền:</span>
                  <span style={{ fontWeight: '800', color: '#16a34a', fontSize: '15px' }}>{orderData.bank_info.amount.toLocaleString()} đ</span>
                </div>
                <div style={{ display: 'flex', justifyBetween: 'space-between', alignItems: 'center', paddingTop: '6px', borderTop: '1px solid #cbd5e1' }}>
                  <span style={{ color: '#64748b' }}>Nội dung chuyển:</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontWeight: '800', color: '#2563eb', fontFamily: 'monospace', fontSize: '13px' }}>{orderData.bank_info.transfer_content}</span>
                    <button
                      onClick={() => copyTransferContent(orderData.bank_info.transfer_content)}
                      style={{ padding: '4px 8px', borderRadius: '6px', border: 'none', backgroundColor: copiedContent ? '#16a34a' : '#2563eb', color: '#fff', fontSize: '11px', cursor: 'pointer' }}
                    >
                      {copiedContent ? 'Đã chép' : 'Chép'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Confirmation */}
              {confirmed ? (
                <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '12px', borderRadius: '12px', color: '#16a34a', fontSize: '12px', fontWeight: '700', width: '100%' }}>
                  Đang chờ admin xác nhận thanh toán. Mẫu chỉ được kích hoạt sau khi đơn được duyệt; cửa sổ này sẽ tự cập nhật.
                </div>
              ) : (
                <button
                  onClick={() => setConfirmed(true)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '12px',
                    backgroundColor: '#16a34a',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: '700',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  ✅ Tôi Đã Chuyển Khoản - Xác Nhận
                </button>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
