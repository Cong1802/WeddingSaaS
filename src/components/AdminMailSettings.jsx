import { useState } from 'react';

const fieldStyle = { width: '100%', padding: 12, borderRadius: 12, background: '#090d16', border: '1px solid #1e293b', color: '#fff', boxSizing: 'border-box' };
export default function AdminMailSettings({ settings, setSettings, token }) {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const change = (key, value) => setSettings(previous => ({ ...previous, [key]: value }));
  const test = async () => {
    setBusy(true); setResult(null);
    try {
      const response = await fetch('/api/admin/settings/test-mail', {
        method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          email,
          mail_enabled: settings.mail_enabled,
          mail_host: settings.mail_host,
          mail_port: settings.mail_port,
          mail_username: settings.mail_username,
          mail_password: settings.mail_password,
          mail_encryption: settings.mail_encryption,
          mail_from_address: settings.mail_from_address,
          mail_from_name: settings.mail_from_name,
        }),
      });
      const data = await response.json();
      setResult({ ok: response.ok, message: Object.values(data.errors || {}).flat()[0] || data.message || 'Không gửi được email thử.' });
    } catch { setResult({ ok: false, message: 'Không kết nối được máy chủ. Vui lòng thử lại.' }); }
    finally { setBusy(false); }
  };
  return <section style={{ background: '#0f172a', padding: 28, borderRadius: 8, border: '1px solid #1e293b', display: 'grid', gap: 18 }}>
    <h4 style={{ margin: 0, color: '#fff' }}>6. Cấu hình email & lấy lại mật khẩu</h4>
    <label style={{ color: '#cbd5e1' }}><input type="checkbox" checked={settings.mail_enabled === '1'} onChange={event => change('mail_enabled', event.target.checked ? '1' : '0')} /> Bật gửi email qua SMTP</label>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
      {[
        ['mail_host', 'Máy chủ SMTP', 'text', 'smtp.gmail.com'],
        ['mail_port', 'Cổng SMTP', 'number', '587'],
        ['mail_username', 'Tài khoản SMTP', 'text', 'you@example.com'],
        ['mail_password', 'Mật khẩu SMTP / App Password', 'password', 'Nhập mật khẩu ứng dụng'],
        ['mail_from_address', 'Email người gửi', 'email', 'you@example.com'],
        ['mail_from_name', 'Tên người gửi', 'text', 'WeddingSaaS'],
      ].map(([key, label, type, placeholder]) => <label key={key} style={{ color: '#94a3b8', fontSize: 12, display: 'grid', gap: 8 }}>{label}<input type={type} autoComplete={type === 'password' ? 'new-password' : 'off'} value={(key === 'mail_password' && settings.mail_password_configured && !settings.mail_password) ? '********' : (settings[key] || '')} placeholder={placeholder} style={fieldStyle} onChange={event => change(key, event.target.value)} /></label>)}
      <label style={{ color: '#94a3b8', fontSize: 12, display: 'grid', gap: 8 }}>Bảo mật kết nối<select value={settings.mail_encryption || 'tls'} onChange={event => change('mail_encryption', event.target.value)} style={fieldStyle}><option value="tls">STARTTLS — thường dùng cổng 587</option><option value="ssl">SSL/TLS — thường dùng cổng 465</option><option value="none">Không mã hóa — máy chủ nội bộ</option></select></label>
    </div>
    <p style={{ margin: 0, color: '#94a3b8', fontSize: 13 }}>Lưu cấu hình bằng nút "Cập nhật" ở góc phải phía trên trước khi gửi thử. Cấu hình này dùng để gửi liên kết lấy lại mật khẩu. Với Gmail, sử dụng mật khẩu ứng dụng.</p>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}><input type="email" aria-label="Email nhận thư thử" placeholder="Email nhận thư thử" value={email} onChange={event => setEmail(event.target.value)} style={{ ...fieldStyle, flex: '1 1 240px' }} /><button type="button" disabled={busy || !email} onClick={test} style={{ padding: '12px 20px', border: 0, borderRadius: 12, background: '#9333ea', color: '#fff', cursor: busy ? 'wait' : 'pointer' }}>{busy ? 'Đang gửi...' : 'Gửi email thử'}</button></div>
    {result && <p role="status" style={{ margin: 0, color: result.ok ? '#4ade80' : '#fb7185' }}>{result.message}</p>}
  </section>;
}
