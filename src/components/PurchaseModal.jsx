import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, Check, CreditCard, ArrowLeft, ChevronRight } from 'lucide-react';
import FeatureText from './FeatureText';
import './PurchaseModal.css';

export default function PurchaseModal({ isOpen, onClose, token, onPurchaseSuccess, onSuccess, templateCode, templateName, initialPackage = 'pro' }) {
  const [selectedPackage, setSelectedPackage] = useState('pro'); // 'pro' | 'vip'
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [copiedContent, setCopiedContent] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [plans, setPlans] = useState([]);
  const [catalogError, setCatalogError] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [catalogLoading, setCatalogLoading] = useState(false);
  const dialogRef = useRef(null);
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    const previousFocus = document.activeElement;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();
    const key = event => {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab') return;
      const buttons = [...(dialogRef.current?.querySelectorAll('button:not(:disabled), a[href]') || [])].filter(item => item.getClientRects().length);
      const first = buttons[0], last = buttons[buttons.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', key);
    return () => { document.body.style.overflow = previous; document.removeEventListener('keydown', key); previousFocus?.focus(); };
  }, [isOpen, onClose]);
  useEffect(() => {
    if (!isOpen) return;
    let active = true;
    setOrderData(null); setConfirmed(false); setCatalogError(''); setPaymentStatus('pending'); setPlans([]); setCatalogLoading(true);
    fetch('/api/public/plans', { headers: { Accept: 'application/json' } })
      .then(response => { if (!response.ok) throw new Error('Không tải được gói cước.'); return response.json(); })
      .then(data => {
        if (!active) return;
        const available = (data.plans || []).filter(plan => Number(plan.price) >= 10000);
        setPlans(available);
        setSelectedPackage(available.find(plan => plan.code === initialPackage)?.code || available[0]?.code || '');
      })
      .catch(error => { if (active) { setPlans([]); setCatalogError(error.message); } })
      .finally(() => { if (active) setCatalogLoading(false); });
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
      className="app-modal-overlay purchase-modal-overlay animate-fade-in"
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
        className="app-modal-container purchase-modal" ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="purchase-title"
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
        <div className="purchase-modal-handle" />
        {/* Header */}
        <div className="purchase-modal-header" style={{
          background: 'linear-gradient(135deg, #f43f5e 0%, #ec4899 50%, #8b5cf6 100%)',
          padding: '24px 20px',
          textAlign: 'center',
          color: '#ffffff',
          position: 'relative'
        }}>
          <button className="purchase-modal-back" aria-label="Quay lại chọn mẫu" onClick={onClose}><ArrowLeft size={22} /></button>
          <button
            className="purchase-modal-close" aria-label="Đóng thanh toán"
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
            <CreditCard size={25} />
          </div>
          <h2 id="purchase-title" style={{ fontSize: '20px', fontWeight: '800', margin: 0 }}>
            {orderData ? 'Thanh toán VietQR' : 'Chọn gói thiệp'}
          </h2>
          <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.85)', margin: '4px 0 0 0' }}>
            {templateName || 'Chọn mẫu trước khi thanh toán'} · Quyền sử dụng mẫu trong 6 tháng
          </p>
        </div>

        {/* Content Body */}
        <div className="purchase-modal-body" style={{ padding: '24px' }}>
          <div className="purchase-mobile-context"><span>Bước {orderData ? '2' : '1'} / 2 · {orderData ? 'Thanh toán' : 'Chọn gói'}</span><h3>{templateName || 'Chọn mẫu trước khi thanh toán'}</h3><p>Quyền sử dụng mẫu trong 6 tháng</p></div>
          
          {paymentStatus === 'cancelled' && <p role="alert" style={{ color: '#dc2626' }}>Đơn đã bị hủy. Đóng cửa sổ và tạo đơn mới nếu muốn mua mẫu.</p>}
          {!orderData ? (
            /* Step 1: Package Selection */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#334155', margin: 0 }}>
                1. Chọn Gói Thiệp Cưới Của Bạn:
              </h3>

              <div className="purchase-plans" role="group" aria-label="Gói thiệp cưới">
                {plans.map(plan => <button className="purchase-plan" aria-pressed={selectedPackage === plan.code} key={plan.code} type="button" onClick={() => setSelectedPackage(plan.code)}>
                  <span className="purchase-plan-top"><strong>{plan.name}</strong>{plan.is_popular && <span className="purchase-plan-popular">Phổ biến</span>}<span className="purchase-plan-radio">{selectedPackage === plan.code && <Check size={15} />}</span></span>
                  {plan.subtitle && <span className="purchase-plan-subtitle">{plan.subtitle}</span>}
                  <span className="purchase-plan-price">{Number(plan.price).toLocaleString('vi-VN')} đ <small>{plan.period}</small></span>
                  {plan.description && <span className="purchase-plan-description">{plan.description}</span>}
                  {!!plan.features?.length && <ul className="purchase-plan-features">{plan.features.map((feature, index) => <li key={index}><Check size={16} /><span><FeatureText text={feature} /></span></li>)}</ul>}
                </button>)}
              </div>
              {catalogLoading && <p role="status">Đang tải gói thiệp…</p>}
              {!catalogLoading && !catalogError && !plans.length && <p role="status">Chưa có gói trả phí đang mở bán.</p>}
              {catalogError && <p role="alert">{catalogError}</p>}

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
        {!orderData && <footer className="purchase-modal-footer">
          <div className="purchase-selected-summary"><span>{plans.find(plan => plan.code === selectedPackage)?.name || 'Chọn gói phù hợp'}</span><strong>{plans.some(plan => plan.code === selectedPackage) ? `${Number(plans.find(plan => plan.code === selectedPackage).price).toLocaleString('vi-VN')} đ` : '—'}</strong></div>
          <button className="purchase-continue" onClick={() => handleCreateOrder(selectedPackage)} disabled={loading || !templateCode || !plans.some(plan => plan.code === selectedPackage)}>{loading ? 'Đang tạo mã VietQR…' : <>Tiếp tục thanh toán <ChevronRight size={19} /></>}</button>
        </footer>}
      </div>
    </div>
  );
}
