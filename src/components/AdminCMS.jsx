import React, { useState, useEffect } from 'react';
import PlanFeaturesEditor from './PlanFeaturesEditor';
import FeatureText from './FeatureText';
import { adminModuleFromLocation } from '../navigation';
import toast, { Toaster } from 'react-hot-toast';
import defaultLogo from '../assets/logo.png';
import AdminMailSettings from './AdminMailSettings';
import { 
  Sparkles, Users, LayoutGrid, CreditCard, ShoppingBag, HeartHandshake, 
  Settings, LogOut, ArrowLeft, Plus, Search, CheckCircle, Clock, XCircle, 
  Edit3, Trash2, Shield, TrendingUp, Eye, RefreshCw, Layers, Check, FileText, Lock, Key, Music, Upload, Globe, Mail, Send,
  Crown, Phone, Calendar, User, ExternalLink, Save, Link, AlertTriangle, Image, Menu, X
} from 'lucide-react';

function ImageUploadField({ label, value, onChange, token, showNotification, accept = "image/png,image/jpeg,image/webp,image/gif,image/x-icon,.ico" }) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload/image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onChange(data.url);
        if (showNotification) showNotification('Đã tải ảnh lên thành công!');
      } else {
        if (showNotification) showNotification(data.message || 'Lỗi tải ảnh!', true);
      }
    } catch (err) {
      if (showNotification) showNotification('Có lỗi xảy ra khi tải ảnh lên.', true);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {label && <label style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', display: 'block' }}>{label}</label>}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {value && !value.includes('dicebear.com/7.x/shapes') && (
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            overflow: 'hidden',
            border: '1px solid #1e293b',
            backgroundColor: '#090d16',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <img src={value} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
          </div>
        )}

        <input
          type="file"
          accept={accept}
          onChange={handleFileChange}
          disabled={uploading}
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: '12px',
            backgroundColor: '#090d16',
            border: '1px solid #1e293b',
            color: '#94a3b8',
            fontSize: '13px',
            cursor: 'pointer',
            boxSizing: 'border-box'
          }}
        />
        {uploading && <span style={{ fontSize: '12px', color: '#c084fc', whiteSpace: 'nowrap' }}>⏳ Đang tải...</span>}
      </div>
    </div>
  );
}

export default function AdminCMS({ user, token, onAuthSuccess, onBackToSite, onLogout }) {
  const [activeModule, setActiveModule] = useState(() => adminModuleFromLocation());
  const navigateModule = (module) => {
    const path = `/admin/${module}`;
    if (window.location.pathname !== path) window.history.pushState({}, '', path);
    setActiveModule(module);
    setViewingUserDetail(null);
    setSearchQuery('');
    setIsMobileSidebarOpen(false);
  };
  useEffect(() => {
    const syncModule = () => {
      setActiveModule(adminModuleFromLocation());
      setViewingUserDetail(null);
      setSearchQuery('');
      setIsMobileSidebarOpen(false);
    };
    const path = `/admin/${adminModuleFromLocation()}`;
    if (window.location.pathname !== path || window.location.hash) window.history.replaceState({}, '', path);
    window.addEventListener('popstate', syncModule);
    window.addEventListener('hashchange', syncModule);
    return () => {
      window.removeEventListener('popstate', syncModule);
      window.removeEventListener('hashchange', syncModule);
    };
  }, []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Admin Auth Gate State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const adminFetch = async (...args) => {
    const response = await fetch(...args);
    if (response.status === 401 || response.status === 403) {
      onLogout?.();
      throw new Error('Phiên đăng nhập đã hết hạn hoặc quyền quản trị đã thay đổi. Vui lòng đăng nhập lại.');
    }
    return response;
  };
  const [brandLogo, setBrandLogo] = useState(defaultLogo);

  useEffect(() => {
    let active = true;
    fetch('/api/public/settings', { headers: { Accept: 'application/json' } })
      .then(response => response.json())
      .then(data => {
        if (active && data.success && data.settings?.site_logo) setBrandLogo(data.settings.site_logo);
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  // Data states
  const [stats, setStats] = useState({
    total_users: 0,
    total_cards: 0,
    total_views: 0,
    total_orders: 0,
    total_revenue: 0,
    pending_orders: 0,
    templates: [],
    recent_users: [],
    recent_orders: []
  });
  const [users, setUsers] = useState([]);
  const [templateDesigns, setTemplateDesigns] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [plans, setPlans] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cards, setCards] = useState([]);
  const [musicTracks, setMusicTracks] = useState([]);
  const [settings, setSettings] = useState({
    site_name: 'WeddingCard SaaS',
    site_title: 'Thiệp Cưới Online Thông Minh & Đẳng Cấp 2026',
    site_description: 'Nền tảng tạo thiệp cưới online cao cấp, thiết kế đẹp mắt, nhận mừng cưới tự động VietQR, gửi lời chúc & album ảnh cưới.',
    site_keywords: 'thiệp cưới online, tạo thiệp cưới, thiệp cưới số, vietqr mừng cưới',
    site_logo: '',
    site_favicon: '',
    contact_email: 'contact@weddingcardsaas.vn',
    contact_phone: '0987.654.321',
    contact_address: 'Tòa nhà Landmark 81, Bình Thạnh, TP. Hồ Chí Minh',
    social_facebook: 'https://facebook.com/weddingcardsaas',
    social_zalo: 'https://zalo.me/0987654321',
    vietqr_bank_bin: 'MB',
    vietqr_account_no: '0987654321',
    vietqr_account_name: 'DUONG QUANG TUAN',
    telegram_notify_bot_token: '',
    telegram_chat_id: '',
    google_client_id: '',
    google_client_secret: '',
    mail_enabled: '0', mail_host: '', mail_port: '587', mail_encryption: 'tls',
    mail_username: '', mail_password: '', mail_from_address: '', mail_from_name: 'WeddingSaaS'
  });

  // Modal states for CRUD operations
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUserDetail, setViewingUserDetail] = useState(null);
  const [loadingUserDetail, setLoadingUserDetail] = useState(false);
  const [userDetailTab, setUserDetailTab] = useState('cards'); // 'cards' | 'orders'
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [editingPlan, setEditingPlan] = useState(null);
  const [editingMusic, setEditingMusic] = useState(null);
  const [uploadingAudio, setUploadingAudio] = useState(false);

  // Music Form State
  const [musicForm, setMusicForm] = useState({
    id: null,
    title: '',
    artist: '',
    url: '',
    is_active: true,
    sort_order: 1
  });

  // Template Form State
  const [templateForm, setTemplateForm] = useState({
    id: null,
    code: '',
    name: '',
    category: 'Sang Trọng',
    tag: 'HOT',
    thumbnail: '',
    file_url: '/template.html',
    price: 99000,
    is_active: true,
    sort_order: 1
  });

  // Plan Form State
  const [planForm, setPlanForm] = useState({
    id: null,
    code: '',
    name: '',
    price: 99000,
    period: '1 thiệp',
    description: '',
    featuresInput: '',
    is_popular: false,
    is_active: true
  });

  // User Form State
  const [userForm, setUserForm] = useState({
    id: null,
    name: '',
    email: '',
    phone: '',
    paid_credits: 0
  });

  useEffect(() => {
    if (token && user && user.role === 'admin') {
      fetchModuleData();
    }
  }, [activeModule, token, user]);

  const fetchModuleData = async () => {
    if (!token || !user || user.role !== 'admin') return;
    setLoading(true);
    setError('');

    try {
      if (activeModule === 'dashboard') {
        const res = await adminFetch('/api/admin/stats', { headers: { 'Authorization': `Bearer ${token}` } });
        const data = await res.json();
        if (res.ok && data.success) setStats(data.stats);
        else throw new Error(data.message);
      } else if (activeModule === 'users') {
        const res = await adminFetch('/api/admin/users', { headers: { 'Authorization': `Bearer ${token}` } });
        const data = await res.json();
        if (res.ok && data.success) setUsers(data.users);
        else throw new Error(data.message);
      } else if (activeModule === 'templates') {
        const res = await adminFetch('/api/admin/templates', { headers: { 'Authorization': `Bearer ${token}` } });
        const data = await res.json();
        if (res.ok && data.success) { setTemplates(data.templates); setTemplateDesigns(data.designs || []); }
        else throw new Error(data.message);
      } else if (activeModule === 'plans') {
        const res = await adminFetch('/api/admin/plans', { headers: { 'Authorization': `Bearer ${token}` } });
        const data = await res.json();
        if (res.ok && data.success) setPlans(data.plans);
        else throw new Error(data.message);
      } else if (activeModule === 'orders') {
        const res = await adminFetch('/api/admin/orders', { headers: { 'Authorization': `Bearer ${token}` } });
        const data = await res.json();
        if (res.ok && data.success) setOrders(data.orders);
        else throw new Error(data.message);
      } else if (activeModule === 'cards') {
        const res = await adminFetch('/api/admin/cards', { headers: { 'Authorization': `Bearer ${token}` } });
        const data = await res.json();
        if (res.ok && data.success) setCards(data.cards);
        else throw new Error(data.message);
      } else if (activeModule === 'music') {
        const res = await adminFetch('/api/admin/music', { headers: { 'Authorization': `Bearer ${token}` } });
        const data = await res.json();
        if (res.ok && data.success) setMusicTracks(data.music);
        else throw new Error(data.message);
      } else if (activeModule === 'settings') {
        const res = await adminFetch('/api/admin/settings', { headers: { 'Authorization': `Bearer ${token}` } });
        const data = await res.json();
        if (res.ok && data.success) setSettings(prev => ({ ...prev, ...data.settings }));
        else throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message || 'Lỗi khi tải dữ liệu Admin');
    } finally {
      setLoading(false);
    }
  };

  // Admin Direct Login Handler
  const handleToggleUserRole = async (target) => {
    if (!window.confirm(`Đổi quyền tài khoản ${target.email}?`)) return;
    try {
      const response = await adminFetch(`/api/admin/users/${target.id}/toggle-role`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      await handleViewUserDetail(target.id);
      fetchModuleData();
      showNotification(data.message);
    } catch (error) { showNotification(error.message, true); }
  };

  // Admin Direct Login Handler
  const handleAdminLogin = async (e) => {
    if (e) e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await res.json();

      if (res.ok && data.success && data.user) {
        if (data.user.role !== 'admin') {
          setAuthError('Tài khoản này không có quyền Admin. Vui lòng sử dụng tài khoản Quản trị!');
          setAuthLoading(false);
          return;
        }
        if (onAuthSuccess) {
          onAuthSuccess(data.user, data.token);
        }
      } else {
        setAuthError(data.message || 'Email hoặc mật khẩu không chính xác!');
      }
    } catch (err) {
      setAuthError('Lỗi kết nối máy chủ Laravel.');
    } finally {
      setAuthLoading(false);
    }
  };

  const showNotification = (msg, isError = false) => {
    if (isError) {
      toast.error(msg, {
        style: {
          background: '#090d16',
          color: '#f87171',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: '600',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
        },
        iconTheme: {
          primary: '#f87171',
          secondary: '#090d16'
        }
      });
    } else {
      toast.success(msg, {
        style: {
          background: '#090d16',
          color: '#34d399',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: '600',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
        },
        iconTheme: {
          primary: '#34d399',
          secondary: '#090d16'
        }
      });
    }
  };

  // --- IF NOT LOGGED IN AS ADMIN: RENDER ADMIN LOGIN GATE ---
  if (!user || user.role !== 'admin') {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#030712',
        color: '#f3f4f6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        boxSizing: 'border-box',
        fontFamily: "'Plus Jakarta Sans', sans-serif"
      }}>
        <div style={{
          width: '100%',
          maxWidth: '460px',
          backgroundColor: '#090d16',
          borderRadius: '28px',
          border: '1px solid #1e293b',
          padding: '36px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          {/* Header Icon */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              background: 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}>
              <img src={brandLogo} alt="Logo website" style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={() => setBrandLogo(defaultLogo)} />
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#fff', margin: 0 }}>Trang Quản Trị Admin CMS</h2>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
              Khu vực yêu cầu tài khoản Quản trị viên (Admin) để quản lý toàn bộ hệ thống
            </p>
          </div>

          {authError && (
            <div style={{ padding: '12px 16px', backgroundColor: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '14px', color: '#f87171', fontSize: '12px', fontWeight: '600' }}>
              ⚠️ {authError}
            </div>
          )}



          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#475569', fontSize: '12px' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#1e293b' }}></div>
            <span>hoặc đăng nhập bằng tài khoản Admin</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#1e293b' }}></div>
          </div>

          {/* Standard Form */}
          <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600', marginBottom: '6px', display: 'block' }}>Email Admin</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', backgroundColor: '#0f172a', border: '1px solid #1e293b', color: '#fff', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600', marginBottom: '6px', display: 'block' }}>Mật khẩu</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', backgroundColor: '#0f172a', border: '1px solid #1e293b', color: '#fff', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              style={{ marginTop: '8px', padding: '14px', borderRadius: '14px', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#fff', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
            >
              Đăng Nhập Quản Trị
            </button>
          </form>

          <button
            onClick={onBackToSite}
            style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}
          >
            ← Quay về Trang Chủ Website
          </button>
        </div>
      </div>
    );
  }

  // --- TEMPLATE HANDLERS ---
  const handleSaveTemplate = async (e) => {
    e.preventDefault();
    try {
      const res = await adminFetch('/api/admin/templates', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify((( { code, price, ...fields }) => fields)(templateForm))
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showNotification(data.message);
        setEditingTemplate(null);
        window.dispatchEvent(new Event('templates-updated'));
        fetchModuleData();
      } else {
        showNotification(data.message, true);
      }
    } catch (err) {
      showNotification(err.message, true);
    }
  };

  const handleToggleTemplate = async (id) => {
    try {
      const res = await adminFetch(`/api/admin/templates/${id}/toggle`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showNotification(data.message);
        fetchModuleData();
      }
    } catch (err) {
      showNotification(err.message, true);
    }
  };

  const handleDeleteTemplate = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa mẫu thiệp này?')) return;
    try {
      const res = await adminFetch(`/api/admin/templates/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showNotification(data.message);
        fetchModuleData();
      }
    } catch (err) {
      showNotification(err.message, true);
    }
  };

  // --- PLAN HANDLERS ---
  const handleSavePlan = async (e) => {
    e.preventDefault();
    try {
      const featuresArr = planForm.featuresInput
        .split('\n')
        .map(f => f.trim())
        .filter(Boolean);

      const payload = {
        ...planForm,
        features: featuresArr
      };

      const res = await adminFetch('/api/admin/plans', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showNotification(data.message);
        setEditingPlan(null);
        fetchModuleData();
      } else {
        showNotification(data.message, true);
      }
    } catch (err) {
      showNotification(err.message, true);
    }
  };

  const handleTogglePlan = async (id) => {
    try {
      const res = await adminFetch(`/api/admin/plans/${id}/toggle`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showNotification(data.message);
        fetchModuleData();
      }
    } catch (err) {
      showNotification(err.message, true);
    }
  };

  const handleDeletePlan = async (id) => {
    if (!confirm('Bạn có chắc chắn muốn xóa gói cước này?')) return;
    try {
      const res = await adminFetch(`/api/admin/plans/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showNotification(data.message);
        fetchModuleData();
      }
    } catch (err) {
      showNotification(err.message, true);
    }
  };

  // --- USER HANDLERS ---
  const handleSaveUser = async (e) => {
    e.preventDefault();
    try {
      const res = await adminFetch(`/api/admin/users/${userForm.id}/update`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userForm)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showNotification(data.message);
        setEditingUser(null);
        if (viewingUserDetail && viewingUserDetail.id === userForm.id) {
          setViewingUserDetail(prev => ({ ...prev, ...userForm }));
        }
        fetchModuleData();
      } else {
        showNotification(data.message, true);
      }
    } catch (err) {
      showNotification(err.message, true);
    }
  };

  const handleViewUserDetail = async (userId) => {
    setLoadingUserDetail(true);
    try {
      const res = await adminFetch(`/api/admin/users/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setViewingUserDetail(data.user);
        setUserDetailTab('cards');
      } else {
        showNotification(data.message || 'Không thể tải chi tiết người dùng', true);
      }
    } catch (err) {
      showNotification(err.message, true);
    } finally {
      setLoadingUserDetail(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Hành động này sẽ xóa vĩnh viễn người dùng và toàn bộ thiệp cưới của họ! Tiếp tục?')) return;
    try {
      const res = await adminFetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showNotification(data.message);
        fetchModuleData();
      } else {
        showNotification(data.message || 'Không thể xóa người dùng này!', true);
      }
    } catch (err) {
      showNotification(err.message, true);
    }
  };

  // --- ORDER HANDLERS ---
  const handleApproveOrder = async (orderId, orderCode) => {
    if (!confirm(`Phê duyệt đơn hàng #${orderCode}?`)) return;
    try {
      const res = await adminFetch(`/api/admin/orders/${orderId}/approve`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showNotification(data.message);
        fetchModuleData();
      }
    } catch (err) {
      showNotification(err.message, true);
    }
  };

  const handleCancelOrder = async (orderId, orderCode) => {
    if (!confirm(`Bạn có chắc muốn hủy đơn hàng #${orderCode}?`)) return;
    try {
      const res = await adminFetch(`/api/admin/orders/${orderId}/cancel`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showNotification(data.message);
        fetchModuleData();
      }
    } catch (err) {
      showNotification(err.message, true);
    }
  };

  // --- CARD HANDLERS ---
  const handleDeleteCard = async (cardId) => {
    if (!confirm('Bạn có chắc muốn xóa thiệp cưới này?')) return;
    try {
      const res = await adminFetch(`/api/admin/cards/${cardId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showNotification(data.message);
        fetchModuleData();
      }
    } catch (err) {
      showNotification(err.message, true);
    }
  };

  // --- SETTINGS HANDLERS ---
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      const res = await adminFetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setBrandLogo(settings.site_logo || defaultLogo);
        setSettings(previous => ({ ...previous, mail_password: '', mail_password_configured: !!previous.mail_password || previous.mail_password_configured }));
        showNotification(data.message);
      } else {
        showNotification(Object.values(data.errors || {}).flat()[0] || data.message || 'Không lưu được cấu hình.', true);
      }
    } catch (err) {
      showNotification(err.message, true);
    }
  };

  // --- MUSIC HANDLERS ---
  const handleSaveMusicTrack = async (e) => {
    e.preventDefault();
    try {
      const res = await adminFetch('/api/admin/music', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(musicForm)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showNotification(data.message);
        setEditingMusic(null);
        fetchModuleData();
      } else {
        showNotification(data.message || 'Lỗi khi lưu bài hát', true);
      }
    } catch (err) {
      showNotification(err.message, true);
    }
  };

  const handleToggleMusicTrack = async (id) => {
    try {
      const res = await adminFetch(`/api/admin/music/${id}/toggle`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showNotification(data.message);
        fetchModuleData();
      }
    } catch (err) {
      showNotification(err.message, true);
    }
  };

  const handleDeleteMusicTrack = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa bài hát này khỏi kho nhạc nền?')) return;
    try {
      const res = await adminFetch(`/api/admin/music/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showNotification(data.message);
        fetchModuleData();
      }
    } catch (err) {
      showNotification(err.message, true);
    }
  };

  const handleUploadMP3 = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.match(/\.(mp3|wav|ogg|m4a)$/i)) {
      showNotification('Vui lòng chọn tệp âm thanh định dạng .mp3, .wav, .ogg, hoặc .m4a', true);
      return;
    }

    setUploadingAudio(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await adminFetch('/api/admin/music/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMusicForm(prev => ({
          ...prev,
          url: data.url,
          title: prev.title || file.name.replace(/\.[^/.]+$/, "")
        }));
        showNotification('Tải nhạc MP3 lên thành công!');
      } else {
        showNotification(data.message || 'Không thể tải file mp3 lên', true);
      }
    } catch (err) {
      showNotification('Lỗi khi tải file nhạc: ' + err.message, true);
    } finally {
      setUploadingAudio(false);
    }
  };

  const pendingOrdersCount = Array.isArray(orders) ? orders.filter(o => o?.status === 'pending').length : (stats?.pending_orders || 0);

  if (!token || !user || user.role !== 'admin') {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: '#030712',
        color: '#fff',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        padding: '20px',
        boxSizing: 'border-box'
      }}>
        <Toaster position="bottom-right" toastOptions={{ duration: 3500 }} />
        <div style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: '#0f172a',
          borderRadius: '20px',
          border: '1px solid #1e293b',
          padding: '36px 32px',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}>
              <img src={brandLogo} alt="Logo website" style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={() => setBrandLogo(defaultLogo)} />
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#fff', margin: 0 }}>Đăng Nhập Quản Trị Admin</h2>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>Vui lòng nhập Email & Mật khẩu Admin để tiếp tục</p>
          </div>

          {authError && (
            <div style={{ padding: '12px 16px', borderRadius: '12px', backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', fontSize: '13px', fontWeight: '600' }}>
              ⚠️ {authError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Email Admin</label>
              <input
                type="email"
                placeholder="admin@example.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', backgroundColor: '#090d16', border: '1px solid #1e293b', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Mật Khẩu</label>
              <input
                type="password"
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', backgroundColor: '#090d16', border: '1px solid #1e293b', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              style={{
                marginTop: '8px',
                padding: '14px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                color: '#fff',
                fontSize: '15px',
                fontWeight: '800',
                border: 'none',
                cursor: authLoading ? 'wait' : 'pointer',
                boxShadow: '0 8px 24px rgba(168, 85, 247, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {authLoading ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  <span>Đang xác thực...</span>
                </>
              ) : (
                <>
                  <Lock size={18} />
                  <span>Đăng Nhập Quản Trị</span>
                </>
              )}
            </button>
          </form>

          <button
            type="button"
            onClick={onBackToSite}
            style={{
              padding: '10px',
              borderRadius: '12px',
              backgroundColor: 'transparent',
              border: '1px solid #1e293b',
              color: '#94a3b8',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <ArrowLeft size={16} /> Quay Lại Trang Chủ Website
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      width: '100vw',
      height: '100vh',
      backgroundColor: '#030712',
      color: '#f3f4f6',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      overflow: 'hidden'
    }}>
      <Toaster position="bottom-right" toastOptions={{ duration: 3500 }} />

      {/* MOBILE SIDEBAR DRAWER OVERLAY */}
      {isMobileSidebarOpen && (
        <div 
          onClick={() => setIsMobileSidebarOpen(false)}
          className="mobile-only animate-fade-in"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(4px)',
            zIndex: 998
          }}
        />
      )}

      {/* --- SIDEBAR NAVIGATION (Desktop Panel & Mobile Drawer) --- */}
      <aside 
        style={{
          width: '280px',
          backgroundColor: '#090d16',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '24px 16px',
          boxSizing: 'border-box',
          flexShrink: 0
        }}
        className={`desktop-only ${isMobileSidebarOpen ? 'mobile-only animate-slide-in-left' : ''}`}
        {...(isMobileSidebarOpen ? {
          style: {
            position: 'fixed',
            top: 0,
            left: 0,
            bottom: 0,
            width: '280px',
            backgroundColor: '#090d16',
            zIndex: 999,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '24px 16px',
            boxSizing: 'border-box',
            boxShadow: '8px 0 25px rgba(0,0,0,0.5)'
          }
        } : {})}
      >
        {/* Top Logo & User Profile */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, minHeight: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #f43f5e 0%, #a855f7 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 20px rgba(244, 63, 94, 0.35)',
                flexShrink: 0
              }}>
                <Sparkles size={22} color="#fff" />
              </div>
              <div>
                <h1 style={{ fontSize: '16px', fontWeight: '800', color: '#fff', margin: 0, letterSpacing: '-0.3px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  CMS Admin <span style={{ fontSize: '10px', color: '#a855f7', padding: '2px 6px', background: 'rgba(168,85,247,0.15)', borderRadius: '6px', border: '1px solid rgba(168,85,247,0.3)' }}>PRO</span>
                </h1>
                <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>WeddingSaaS Control Center</p>
              </div>
            </div>

            {isMobileSidebarOpen && (
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="mobile-only"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Admin Profile Box */}
          <div style={{
            padding: '12px 14px',
            backgroundColor: '#0f172a',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexShrink: 0
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '12px',
              backgroundColor: 'rgba(168, 85, 247, 0.15)',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Crown size={18} color="#c084fc" />
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name || 'Quản Trị Viên'}</div>
              <span style={{ fontSize: '10px', color: '#fbbf24', fontWeight: '700', backgroundColor: 'rgba(245, 158, 11, 0.15)', padding: '2px 8px', borderRadius: '10px', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                Administrator
              </span>
            </div>
          </div>

          {/* Menu Links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto', flex: 1, paddingRight: '2px' }}>
            {[
              { id: 'dashboard', label: 'Thống Kê Tổng Quan', icon: TrendingUp, badge: null },
              { id: 'templates', label: 'Quản Lý Mẫu Thiệp', icon: LayoutGrid, badge: null },
              { id: 'users', label: 'Quản Lý Người Dùng', icon: Users, badge: null },
              { id: 'plans', label: 'Quản Lý Gói Cước', icon: CreditCard, badge: null },
              { id: 'orders', label: 'Quản Lý Đơn Hàng', icon: ShoppingBag, badge: pendingOrdersCount > 0 ? `${pendingOrdersCount} chờ` : null },
              { id: 'cards', label: 'Quản Lý Thiệp Cưới', icon: HeartHandshake, badge: null },
              { id: 'music', label: 'Quản Lý Nhạc Nền MP3', icon: Music, badge: musicTracks.length > 0 ? `${musicTracks.length} bài` : null },
              { id: 'settings', label: 'Cấu Hình Hệ Thống', icon: Settings, badge: null },
            ].map(item => {
              const IconComp = item.icon;
              const isActive = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { 
                    navigateModule(item.id);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '11px 14px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: isActive ? 'rgba(168, 85, 247, 0.15)' : 'transparent',
                    color: isActive ? '#c084fc' : '#94a3b8',
                    fontSize: '13px',
                    fontWeight: isActive ? '700' : '500',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxSizing: 'border-box'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <IconComp size={18} color={isActive ? '#c084fc' : '#64748b'} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span style={{ fontSize: '10px', fontWeight: '800', backgroundColor: '#f43f5e', color: '#fff', padding: '2px 8px', borderRadius: '10px' }}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', pt: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', marginTop: '12px', flexShrink: 0 }}>
          <button
            onClick={() => { setIsMobileSidebarOpen(false); onBackToSite(); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              width: '100%',
              padding: '11px',
              borderRadius: '12px',
              backgroundColor: '#0f172a',
              border: '1px solid #1e293b',
              color: '#e2e8f0',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <ArrowLeft size={16} /> Quay Lại Website
          </button>
          
          <button
            onClick={() => { setIsMobileSidebarOpen(false); onLogout(); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              width: '100%',
              padding: '11px',
              borderRadius: '12px',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              color: '#f87171',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <LogOut size={16} /> Đăng Xuất Admin
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#030712'
      }}>
        {/* Top Header Controls Bar */}
        <header style={{
          height: '64px',
          backgroundColor: '#090d16',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          flexShrink: 0
        }}>
          {/* Breadcrumb Title & Mobile Menu Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="mobile-only"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                backgroundColor: '#0f172a',
                border: '1px solid #1e293b',
                color: '#c084fc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              <Menu size={20} />
            </button>

            <div style={{ overflow: 'hidden' }}>
              <span className="desktop-only" style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>WEDDINGSAAS CMS CONTROL PANEL</span>
              <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#fff', margin: 0, textTransform: 'capitalize', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {activeModule === 'dashboard' && 'Thống Kê Tổng Quan'}
                {activeModule === 'templates' && 'Quản Lý Kho Mẫu Thiệp'}
                {activeModule === 'users' && 'Quản Lý Người Dùng'}
                {activeModule === 'plans' && 'Quản Lý Gói Cước'}
                {activeModule === 'orders' && 'Quản Lý Đơn Hàng'}
                {activeModule === 'cards' && 'Quản Lý Thiệp Cưới'}
                {activeModule === 'music' && 'Quản Lý Nhạc Nền MP3'}
                {activeModule === 'settings' && 'Cấu Hình Hệ Thống'}
              </h2>
            </div>
          </div>

          {/* Controls: Search & Refresh */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {['users', 'templates', 'orders', 'cards', 'plans', 'music'].includes(activeModule) && (
              <div style={{ position: 'relative', width: '280px' }}>
                <Search size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Tìm theo tên, email, sđt..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 36px',
                    borderRadius: '12px',
                    backgroundColor: '#0f172a',
                    border: '1px solid #1e293b',
                    color: '#fff',
                    fontSize: '12px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            )}

            <button
              onClick={fetchModuleData}
              title="Làm mới dữ liệu"
              style={{
                padding: '8px 14px',
                borderRadius: '12px',
                backgroundColor: '#0f172a',
                border: '1px solid #1e293b',
                color: '#cbd5e1',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span>Cập nhật</span>
            </button>
          </div>
        </header>

        {/* Main Content Dynamic Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px', boxSizing: 'border-box' }}>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', color: '#64748b', gap: '12px' }}>
              <RefreshCw size={32} className="animate-spin" color="#a855f7" />
              <span>Đang tải dữ liệu CMS...</span>
            </div>
          ) : error ? (
            <div style={{ padding: '20px', backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '16px', color: '#f87171' }}>
              ⚠️ {error}
            </div>
          ) : (
            <>
              {/* --- MODULE 1: DASHBOARD --- */}
              {activeModule === 'dashboard' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                  {/* Top 4 KPI Cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                    <div style={{ padding: '24px', backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #1e293b' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '13px', fontWeight: '600' }}>
                        <span>Doanh Thu</span>
                        <ShoppingBag size={20} color="#10b981" />
                      </div>
                      <div style={{ fontSize: '28px', fontWeight: '800', color: '#10b981', margin: '8px 0 4px 0' }}>
                        {(stats.total_revenue || 0).toLocaleString('vi-VN')}đ
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>Tổng thu qua VietQR Bank</div>
                    </div>

                    <div style={{ padding: '24px', backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #1e293b' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '13px', fontWeight: '600' }}>
                        <span>Người Dùng</span>
                        <Users size={20} color="#a855f7" />
                      </div>
                      <div style={{ fontSize: '28px', fontWeight: '800', color: '#fff', margin: '8px 0 4px 0' }}>{stats.total_users || 0}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>Tài khoản đã đăng ký</div>
                    </div>

                    <div style={{ padding: '24px', backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #1e293b' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '13px', fontWeight: '600' }}>
                        <span>Thiệp Đã Tạo</span>
                        <HeartHandshake size={20} color="#f43f5e" />
                      </div>
                      <div style={{ fontSize: '28px', fontWeight: '800', color: '#fff', margin: '8px 0 4px 0' }}>{stats.total_cards || 0}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>Thiệp cưới lưu trên server</div>
                    </div>

                    <div style={{ padding: '24px', backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #1e293b' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '13px', fontWeight: '600' }}>
                        <span>Lượt Xem</span>
                        <Eye size={20} color="#fbbf24" />
                      </div>
                      <div style={{ fontSize: '28px', fontWeight: '800', color: '#fff', margin: '8px 0 4px 0' }}>{stats.total_views || 0}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>Lượt truy cập từ khách mời</div>
                    </div>
                  </div>

                  {/* Template Usage Statistics */}
                  <div style={{ padding: '24px', backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #1e293b' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <LayoutGrid size={18} color="#a855f7" /> Phân Bổ Thiệp Theo Template
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                      {(stats.templates || []).length === 0 ? (
                        <div style={{ color: '#64748b', fontSize: '13px', fontStyle: 'italic' }}>Chưa có thống kê thiệp</div>
                      ) : (
                        stats.templates.map((t, idx) => (
                          <div key={idx} style={{ padding: '16px', backgroundColor: '#090d16', borderRadius: '16px', border: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '13px', color: '#c084fc', fontWeight: '600' }}>{t.template_id}</span>
                            <span style={{ fontSize: '12px', fontWeight: '800', backgroundColor: 'rgba(168,85,247,0.2)', color: '#a855f7', padding: '4px 12px', borderRadius: '12px' }}>
                              {t.count} thiệp
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* --- MODULE 2: TEMPLATE MANAGEMENT --- */}
              {activeModule === 'templates' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#fff', margin: 0 }}>Kho Mẫu Thiệp Cưới ({templates.length})</h3>
                    <button
                      onClick={() => {
                        setTemplateForm({ id: null, code: '', name: '', category: 'Sang Trọng', tag: 'HOT', thumbnail: '', file_url: '/template.html', price: 99000, is_active: true, sort_order: templates.length + 1 });
                        setEditingTemplate(true);
                      }}
                      style={{ padding: '10px 18px', borderRadius: '12px', background: 'linear-gradient(135deg, #a855f7 0%, #d946ef 100%)', color: '#fff', fontSize: '13px', fontWeight: '700', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Plus size={16} /> Thêm Mẫu Thiệp Mới
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                    {(templates || []).filter(t => (t?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || (t?.code || '').toLowerCase().includes(searchQuery.toLowerCase())).map(t => (
                      <div key={t.id} style={{ backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #1e293b', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div style={{ position: 'relative', height: '180px', backgroundColor: '#030712' }}>
                          <img src={t.thumbnail || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400'} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <span style={{ position: 'absolute', top: '12px', left: '12px', padding: '4px 10px', borderRadius: '12px', backgroundColor: t.is_active ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)', color: '#fff', fontSize: '10px', fontWeight: '800' }}>
                            {t.is_active ? 'ACTIVE' : 'OFFLINE'}
                          </span>
                        </div>
                        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <div>
                            <span style={{ fontSize: '11px', color: '#a855f7', fontWeight: '700' }}>{t.category}</span>
                            <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#fff', margin: '4px 0' }}>{t.name}</h4>
                          </div>
                          <div style={{ display: 'flex', gap: '8px', paddingTop: '12px', borderTop: '1px solid #1e293b' }}>
                            <button onClick={() => handleToggleTemplate(t.id)} style={{ flex: 1, padding: '8px', borderRadius: '10px', backgroundColor: '#1e293b', border: 'none', color: '#fff', fontSize: '12px', cursor: 'pointer' }}>{t.is_active ? 'Ẩn mẫu' : 'Bật mẫu'}</button>
                            <button onClick={() => { setTemplateForm(t); setEditingTemplate(true); }} style={{ padding: '8px 12px', borderRadius: '10px', backgroundColor: 'rgba(168,85,247,0.2)', border: 'none', color: '#c084fc', cursor: 'pointer' }}><Edit3 size={14} /></button>
                            <button onClick={() => handleDeleteTemplate(t.id)} style={{ padding: '8px 12px', borderRadius: '10px', backgroundColor: 'rgba(239,68,68,0.2)', border: 'none', color: '#f87171', cursor: 'pointer' }}><Trash2 size={14} /></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* --- MODULE 3: USER MANAGEMENT & USER DETAIL PAGE --- */}
              {activeModule === 'users' && (
                viewingUserDetail ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Top Action & Navigation */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                      <button
                        onClick={() => setViewingUserDetail(null)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '10px 18px',
                          borderRadius: '8px',
                          backgroundColor: '#0f172a',
                          border: '1px solid #1e293b',
                          color: '#c084fc',
                          fontSize: '13px',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        <ArrowLeft size={16} /> Quay Lại Danh Sách Người Dùng
                      </button>

                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          onClick={() => { setUserForm(viewingUserDetail); setEditingUser(true); }}
                          style={{ padding: '10px 16px', borderRadius: '8px', backgroundColor: 'rgba(168, 85, 247, 0.2)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.3)', fontSize: '13px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                          <Edit3 size={14} /> Sửa Thông Tin
                        </button>
                        {viewingUserDetail.id !== user.id && <button type="button" onClick={() => handleToggleUserRole(viewingUserDetail)} style={{ padding: '10px 16px', borderRadius: 8, border: '1px solid #334155', background: '#0f172a', color: '#cbd5e1', cursor: 'pointer' }}>{viewingUserDetail.role === 'admin' ? 'Chuyển thành người dùng' : 'Cấp quyền admin'}</button>}
                      </div>
                    </div>

                    {/* Top Profile Card */}
                    <div style={{ backgroundColor: '#0f172a', padding: '24px', borderRadius: '8px', border: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                      <div>
                        <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#fff', margin: 0 }}>{viewingUserDetail.name}</h2>
                        <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Mail size={13} color="#a855f7" /> {viewingUserDetail.email}</span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Phone size={13} color="#34d399" /> SĐT: {viewingUserDetail.phone || 'Chưa cập nhật'}</span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Calendar size={13} color="#60a5fa" /> Ngày đăng ký: {new Date(viewingUserDetail.created_at).toLocaleDateString('vi-VN')}</span>
                        </div>
                      </div>

                      {/* 3 Metric Mini Cards */}
                      <div style={{ display: 'flex', gap: '16px' }}>
                        <div style={{ backgroundColor: '#090d16', padding: '14px 20px', borderRadius: '8px', border: '1px solid #1e293b', minWidth: '120px' }}>
                          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '700' }}>TỔNG CHI TIÊU</div>
                          <div style={{ fontSize: '20px', fontWeight: '800', color: '#10b981', marginTop: '2px' }}>
                            {(viewingUserDetail.orders || []).filter(o => o.status === 'completed').reduce((sum, o) => sum + (o.amount || 0), 0).toLocaleString('vi-VN')}đ
                          </div>
                        </div>
                        <div style={{ backgroundColor: '#090d16', padding: '14px 20px', borderRadius: '8px', border: '1px solid #1e293b', minWidth: '120px' }}>
                          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '700' }}>THIỆP ĐÃ TẠO</div>
                          <div style={{ fontSize: '20px', fontWeight: '800', color: '#a855f7', marginTop: '2px' }}>{(viewingUserDetail.cards || []).length} thiệp</div>
                        </div>
                      </div>
                    </div>

                    {/* Dedicated Tabs Container */}
                    <div style={{ backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #1e293b', overflow: 'hidden' }}>
                      <div style={{ display: 'flex', borderBottom: '1px solid #1e293b', backgroundColor: '#090d16', padding: '0 16px' }}>
                        <button
                          onClick={() => setUserDetailTab('cards')}
                          style={{
                            padding: '16px 20px',
                            border: 'none',
                            background: 'none',
                            color: userDetailTab === 'cards' ? '#c084fc' : '#64748b',
                            fontWeight: userDetailTab === 'cards' ? '800' : '600',
                            borderBottom: userDetailTab === 'cards' ? '2px solid #a855f7' : '2px solid transparent',
                            cursor: 'pointer',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                        >
                          <HeartHandshake size={16} color={userDetailTab === 'cards' ? '#c084fc' : '#64748b'} /> Danh Sách Thiệp Cưới ({(viewingUserDetail.cards || []).length})
                        </button>

                        <button
                          onClick={() => setUserDetailTab('orders')}
                          style={{
                            padding: '16px 20px',
                            border: 'none',
                            background: 'none',
                            color: userDetailTab === 'orders' ? '#c084fc' : '#64748b',
                            fontWeight: userDetailTab === 'orders' ? '800' : '600',
                            borderBottom: userDetailTab === 'orders' ? '2px solid #a855f7' : '2px solid transparent',
                            cursor: 'pointer',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                        >
                          <CreditCard size={16} color={userDetailTab === 'orders' ? '#c084fc' : '#64748b'} /> Lịch Sử Thanh Toán & Đơn Hàng VietQR ({(viewingUserDetail.orders || []).length})
                        </button>
                      </div>

                      {/* Tab Content Body */}
                      <div style={{ padding: '24px' }}>
                        {userDetailTab === 'cards' && (
                          <div>
                            {(viewingUserDetail.cards || []).length === 0 ? (
                              <div style={{ textAlign: 'center', padding: '40px', color: '#64748b', fontSize: '14px' }}>
                                Khách hàng này chưa khởi tạo thiệp cưới nào.
                              </div>
                            ) : (
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
                                {viewingUserDetail.cards.map(card => (
                                  <div key={card.id} style={{ backgroundColor: '#090d16', padding: '20px', borderRadius: '8px', border: '1px solid #1e293b', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
                                    <div>
                                      <div style={{ fontSize: '16px', fontWeight: '800', color: '#fda4af', fontFamily: 'monospace' }}>
                                        /{card.slug}
                                      </div>
                                      <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px' }}>
                                        Mẫu thiệp: <span style={{ color: '#c084fc', fontWeight: '700' }}>{card.template_id}</span>
                                      </div>
                                      <div style={{ fontSize: '12px', color: '#10b981', marginTop: '4px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Eye size={14} color="#10b981" /> {card.views_count || 0} lượt xem từ khách mời
                                      </div>
                                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                                        Cập nhật: {new Date(card.updated_at).toLocaleString('vi-VN')}
                                      </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #1e293b', paddingTop: '14px' }}>
                                      <a
                                        href={`/?v=${card.slug}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        style={{ flex: 1, textAlign: 'center', padding: '8px', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34d399', textDecoration: 'none', fontSize: '12px', fontWeight: '700', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                                      >
                                        <ExternalLink size={13} /> Xem Thiệp
                                      </a>
                                      <button
                                        onClick={async () => {
                                          await handleDeleteCard(card.id);
                                          handleViewUserDetail(viewingUserDetail.id);
                                        }}
                                        style={{ padding: '8px 14px', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: 'none', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                                      >
                                        Xóa
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {userDetailTab === 'orders' && (
                          <div>
                            {(viewingUserDetail.orders || []).length === 0 ? (
                              <div style={{ textAlign: 'center', padding: '40px', color: '#64748b', fontSize: '14px' }}>
                                Chưa có lịch sử đơn hàng / thanh toán nào.
                              </div>
                            ) : (
                              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: '13px' }}>
                                <thead style={{ backgroundColor: '#090d16', color: '#64748b', fontSize: '11px', textTransform: 'uppercase' }}>
                                  <tr>
                                    <th style={{ padding: '14px 16px' }}>Mã Đơn Hàng</th>
                                    <th style={{ padding: '14px 16px' }}>Gói Cước</th>
                                    <th style={{ padding: '14px 16px' }}>Số Tiền</th>
                                    <th style={{ padding: '14px 16px' }}>Trạng Thái</th>
                                    <th style={{ padding: '14px 16px' }}>Thời Gian</th>
                                    <th style={{ padding: '14px 16px', textAlign: 'right' }}>Hành Động</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {viewingUserDetail.orders.map(order => (
                                    <tr key={order.id} style={{ borderTop: '1px solid #1e293b' }}>
                                      <td style={{ padding: '14px 16px', fontWeight: '800', color: '#fbbf24', fontFamily: 'monospace' }}>#{order.order_code}</td>
                                      <td style={{ padding: '14px 16px', color: '#c084fc', fontWeight: '600' }}>{order.package_name}</td>
                                      <td style={{ padding: '14px 16px', fontWeight: '800', color: '#10b981' }}>{(order.amount || 0).toLocaleString('vi-VN')}đ</td>
                                      <td style={{ padding: '14px 16px' }}>
                                        <span style={{ padding: '4px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: '800', backgroundColor: order.status === 'completed' ? 'rgba(16, 185, 129, 0.2)' : order.status === 'cancelled' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)', color: order.status === 'completed' ? '#34d399' : order.status === 'cancelled' ? '#f87171' : '#fbbf24', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                          {order.status === 'completed' ? <><CheckCircle size={12} /> Đã Phê Duyệt</> : order.status === 'cancelled' ? <><XCircle size={12} /> Đã Hủy</> : <><Clock size={12} /> Chờ Thanh Toán</>}
                                        </span>
                                      </td>
                                      <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '12px' }}>{new Date(order.created_at).toLocaleString('vi-VN')}</td>
                                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                                        {order.status === 'pending' && (
                                          <button
                                            onClick={async () => {
                                              await handleApproveOrder(order.id, order.order_code);
                                              handleViewUserDetail(viewingUserDetail.id);
                                            }}
                                            style={{ padding: '6px 12px', borderRadius: '8px', backgroundColor: '#10b981', color: '#fff', border: 'none', fontSize: '12px', fontWeight: '800', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                          >
                                            <Check size={14} /> Duyệt Đơn
                                          </button>
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #1e293b', overflow: 'hidden' }}>
                      <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: '13px' }}>
                        <thead style={{ backgroundColor: '#090d16', color: '#64748b', fontSize: '11px', textTransform: 'uppercase' }}>
                          <tr>
                            <th style={{ padding: '16px 20px', width: '60px' }}>STT</th>
                            <th style={{ padding: '16px 20px' }}>Người Dùng</th>
                            <th style={{ padding: '16px 20px' }}>Email</th>
                            <th style={{ padding: '16px 20px' }}>Số Điện Thoại</th>
                            <th style={{ padding: '16px 20px' }}>Số Thiệp</th>
                            <th style={{ padding: '16px 20px' }}>Ngày Đăng Ký</th>
                            <th style={{ padding: '16px 20px', textAlign: 'right' }}>Hành Động</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(users || [])
                            .filter(u => u?.role !== 'admin')
                            .filter(u => (u?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || (u?.email || '').toLowerCase().includes(searchQuery.toLowerCase()) || (u?.phone || '').includes(searchQuery))
                            .map((u, idx) => (
                            <tr
                              key={u.id}
                              onClick={() => handleViewUserDetail(u.id)}
                              style={{
                                borderTop: '1px solid #1e293b',
                                cursor: 'pointer',
                                transition: 'background-color 0.15s ease'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(168, 85, 247, 0.08)'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                              <td style={{ padding: '16px 20px', color: '#64748b', fontWeight: '700' }}>#{idx + 1}</td>
                              <td style={{ padding: '16px 20px', fontWeight: '700', color: '#c084fc' }}>
                                <span style={{ borderBottom: '1px dashed #a855f7' }}>{u.name}</span>
                              </td>
                              <td style={{ padding: '16px 20px', color: '#cbd5e1' }}>{u.email}</td>
                              <td style={{ padding: '16px 20px', color: '#94a3b8' }}>{u.phone || '—'}</td>
                              <td style={{ padding: '16px 20px', color: '#fff' }}>{u.cards_count || 0}</td>
                              <td style={{ padding: '16px 20px', color: '#64748b', fontSize: '12px' }}>{new Date(u.created_at).toLocaleDateString('vi-VN')}</td>
                              <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                                <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', position: 'relative', zIndex: 5 }}>
                                  <button type="button" onClick={(e) => { e.stopPropagation(); setUserForm(u); setEditingUser(true); }} style={{ padding: '6px 10px', borderRadius: '8px', backgroundColor: 'rgba(168, 85, 247, 0.2)', color: '#c084fc', border: 'none', cursor: 'pointer' }}><Edit3 size={14} style={{ pointerEvents: 'none' }} /></button>
                                  <button type="button" onClick={(e) => { e.stopPropagation(); handleDeleteUser(u.id); }} style={{ padding: '6px 10px', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: 'none', cursor: 'pointer' }}><Trash2 size={14} style={{ pointerEvents: 'none' }} /></button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )
              )}

              {/* --- MODULE 4: PLAN MANAGEMENT --- */}
              {activeModule === 'plans' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#fff', margin: 0 }}>Gói Dịch Vụ & Bảng Giá ({plans.length})</h3>
                    <button
                      onClick={() => {
                        setPlanForm({ id: null, code: `plan_${Date.now().toString(36)}`, name: '', price: 99000, period: '1 thiệp', description: '', featuresInput: '', is_popular: false, is_active: true });
                        setEditingPlan(true);
                      }}
                      style={{ padding: '10px 18px', borderRadius: '12px', background: 'linear-gradient(135deg, #a855f7 0%, #d946ef 100%)', color: '#fff', fontSize: '13px', fontWeight: '700', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Plus size={16} /> Tạo Gói Cước Mới
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                    {plans.map(p => (
                      <div key={p.id} style={{ padding: '28px', backgroundColor: '#0f172a', borderRadius: '8px', border: p.is_popular ? '2px solid #a855f7' : '1px solid #1e293b', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>
                        {p.is_popular && (
                          <span style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#a855f7', color: '#fff', fontSize: '10px', fontWeight: '800', padding: '2px 14px', borderRadius: '12px' }}>KHUYÊN DÙNG</span>
                        )}
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', margin: 0 }}>{p.name}</h4>
                              {p.subtitle && <span style={{ fontSize: '12px', color: '#a855f7', fontWeight: '600' }}>{p.subtitle}</span>}
                            </div>
                            <span style={{ fontSize: '11px', color: p.is_active ? '#34d399' : '#f87171' }}>{p.is_active ? 'ACTIVE' : 'OFFLINE'}</span>
                          </div>
                          <div style={{ fontSize: '32px', fontWeight: '800', color: '#10b981', margin: '12px 0' }}>
                            {p.price ? `${Number(p.price).toLocaleString('vi-VN')}đ` : '0đ'}
                            <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '500', marginLeft: '4px' }}>{p.period || (p.price > 0 ? '/thiệp' : '')}</span>
                          </div>
                          <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '16px' }}>{p.description}</p>
                          
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                            {(p.features || []).map((f, idx) => {
                              const isExcluded = typeof f === 'string' && (f.startsWith('- ') || f.startsWith('x ') || f.startsWith('X '));
                              const label = typeof f === 'string' && isExcluded ? f.slice(2).trim() : (typeof f === 'string' && f.startsWith('+ ') ? f.slice(2).trim() : f);
                              return (
                                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: isExcluded ? '#64748b' : '#cbd5e1' }}>
                                  {isExcluded ? <X size={14} color="#f87171" /> : <Check size={14} color="#10b981" />}
                                  <span style={{ textDecoration: isExcluded ? 'line-through' : 'none' }}><FeatureText text={label} /></span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '8px', marginTop: '28px' }}>
                          <button onClick={() => handleTogglePlan(p.id)} style={{ flex: 1, padding: '10px', borderRadius: '12px', backgroundColor: '#1e293b', border: 'none', color: '#fff', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>{p.is_active ? 'Tắt' : 'Bật'}</button>
                          <button onClick={() => { setPlanForm({ ...p, subtitle: p.subtitle || '', period: p.period || '/thiệp', action: p.action || 'Chọn Gói Ngay', featuresInput: (p.features || []).join('\n') }); setEditingPlan(true); }} style={{ padding: '10px 14px', borderRadius: '12px', backgroundColor: 'rgba(168,85,247,0.2)', border: 'none', color: '#c084fc', cursor: 'pointer' }}><Edit3 size={16} /></button>
                          <button onClick={() => handleDeletePlan(p.id)} style={{ padding: '10px 14px', borderRadius: '12px', backgroundColor: 'rgba(239,68,68,0.2)', border: 'none', color: '#f87171', cursor: 'pointer' }}><Trash2 size={16} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* --- MODULE 5: ORDERS MANAGEMENT --- */}
              {activeModule === 'orders' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #1e293b', overflow: 'hidden' }}>
                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: '13px' }}>
                      <thead style={{ backgroundColor: '#090d16', color: '#64748b', fontSize: '11px', textTransform: 'uppercase' }}>
                        <tr>
                          <th style={{ padding: '16px 20px' }}>Mã Đơn Hàng</th>
                          <th style={{ padding: '16px 20px' }}>Khách Hàng</th>
                          <th style={{ padding: '16px 20px' }}>Gói Cước</th>
                          <th style={{ padding: '16px 20px' }}>Số Tiền</th>
                          <th style={{ padding: '16px 20px' }}>Trạng Thái</th>
                          <th style={{ padding: '16px 20px' }}>Thời Gian</th>
                          <th style={{ padding: '16px 20px', textAlign: 'right' }}>Hành Động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(orders || []).filter(o => (o?.order_code || '').toLowerCase().includes(searchQuery.toLowerCase()) || (o?.user?.name || '').toLowerCase().includes(searchQuery.toLowerCase())).map(o => (
                          <tr key={o.id} style={{ borderTop: '1px solid #1e293b' }}>
                            <td style={{ padding: '16px 20px', fontWeight: '800', color: '#fbbf24', fontFamily: 'monospace' }}>#{o.order_code}</td>
                            <td style={{ padding: '16px 20px' }}>
                              <div style={{ fontWeight: '700', color: '#fff' }}>{o.user?.name}</div>
                              <div style={{ fontSize: '11px', color: '#64748b' }}>{o.user?.email}</div>
                            </td>
                            <td style={{ padding: '16px 20px', color: '#c084fc', fontWeight: '600' }}>{o.package_name}</td>
                            <td style={{ padding: '16px 20px', fontWeight: '800', color: '#10b981' }}>{o.amount.toLocaleString('vi-VN')}đ</td>
                            <td style={{ padding: '16px 20px' }}>
                              <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: '800', backgroundColor: o.status === 'completed' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)', color: o.status === 'completed' ? '#34d399' : '#fbbf24', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                {o.status === 'completed' ? <><CheckCircle size={12} /> Đã Phê Duyệt</> : <><Clock size={12} /> Chờ Thanh Toán</>}
                              </span>
                            </td>
                            <td style={{ padding: '16px 20px', color: '#64748b', fontSize: '12px' }}>{new Date(o.created_at).toLocaleString('vi-VN')}</td>
                            <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                              {o.status === 'pending' ? (
                                <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                                  <button onClick={() => handleApproveOrder(o.id, o.order_code)} style={{ padding: '8px 14px', borderRadius: '10px', backgroundColor: '#10b981', color: '#fff', border: 'none', fontSize: '12px', fontWeight: '800', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Check size={14} /> Duyệt Đơn</button>
                                  <button onClick={() => handleCancelOrder(o.id, o.order_code)} style={{ padding: '8px 12px', borderRadius: '10px', backgroundColor: 'rgba(239,68,68,0.2)', color: '#f87171', border: 'none', fontSize: '12px', cursor: 'pointer' }}>Hủy</button>
                                </div>
                              ) : (
                                <span style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic' }}>Đã hoàn tất</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* --- MODULE 6: CARDS MANAGEMENT --- */}
              {activeModule === 'cards' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #1e293b', overflow: 'hidden' }}>
                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: '13px' }}>
                      <thead style={{ backgroundColor: '#090d16', color: '#64748b', fontSize: '11px', textTransform: 'uppercase' }}>
                        <tr>
                          <th style={{ padding: '16px 20px' }}>Đường Dẫn / Slug</th>
                          <th style={{ padding: '16px 20px' }}>Template</th>
                          <th style={{ padding: '16px 20px' }}>Chủ Sở Hữu</th>
                          <th style={{ padding: '16px 20px' }}>Lượt Xem</th>
                          <th style={{ padding: '16px 20px' }}>Cập Nhật</th>
                          <th style={{ padding: '16px 20px', textAlign: 'right' }}>Hành Động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(cards || []).filter(c => (c?.slug || '').toLowerCase().includes(searchQuery.toLowerCase()) || (c?.user?.name || '').toLowerCase().includes(searchQuery.toLowerCase())).map(c => (
                          <tr key={c.id} style={{ borderTop: '1px solid #1e293b' }}>
                            <td style={{ padding: '16px 20px', fontWeight: '700', color: '#fda4af', fontFamily: 'monospace' }}>/{c.slug}</td>
                            <td style={{ padding: '16px 20px', color: '#c084fc' }}>{c.template_id}</td>
                            <td style={{ padding: '16px 20px' }}>
                              <div style={{ fontWeight: '700', color: '#fff' }}>{c.user?.name || 'Vãng lai'}</div>
                              <div style={{ fontSize: '11px', color: '#64748b' }}>{c.user?.email}</div>
                            </td>
                            <td style={{ padding: '16px 20px', fontWeight: '800', color: '#34d399' }}>{c.views_count || 0}</td>
                            <td style={{ padding: '16px 20px', color: '#64748b', fontSize: '12px' }}>{new Date(c.updated_at).toLocaleDateString('vi-VN')}</td>
                            <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                <a href={`/?v=${c.slug}`} target="_blank" rel="noreferrer" style={{ padding: '6px 12px', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34d399', textDecoration: 'none', fontSize: '12px', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><ExternalLink size={13} /> Xem Thiệp</a>
                                <button onClick={() => handleDeleteCard(c.id)} style={{ padding: '6px 10px', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: 'none', cursor: 'pointer' }}><Trash2 size={14} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* --- MODULE 7: MUSIC MANAGEMENT --- */}
              {activeModule === 'music' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', margin: 0 }}>Kho Nhạc Nền Cưới MP3</h3>
                      <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 0 0' }}>Tải lên file nhạc MP3 hoặc dán URL nhạc để làm nhạc nền mặc định cho thiệp cưới</p>
                    </div>
                    <button
                      onClick={() => {
                        setMusicForm({ id: null, title: '', artist: '', url: '', is_active: true, sort_order: (musicTracks.length + 1) });
                        setEditingMusic(true);
                      }}
                      style={{
                        padding: '10px 18px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)',
                        color: '#fff',
                        fontSize: '13px',
                        fontWeight: '800',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 8px 20px rgba(236, 72, 153, 0.35)'
                      }}
                    >
                      <Plus size={16} /> Thêm / Tải Lên Nhạc MP3
                    </button>
                  </div>

                  {/* Grid cards for Music Tracks */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
                    {(musicTracks || [])
                      .filter(m => (m?.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || (m?.artist || '').toLowerCase().includes(searchQuery.toLowerCase()))
                      .map(track => (
                        <div
                          key={track.id}
                          style={{
                            backgroundColor: '#0f172a',
                            borderRadius: '8px',
                            border: track.is_active ? '1px solid #1e293b' : '1px dashed #334155',
                            padding: '20px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '14px',
                            opacity: track.is_active ? 1 : 0.6,
                            position: 'relative'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                              <div style={{
                                width: '44px',
                                height: '44px',
                                borderRadius: '8px',
                                background: track.is_active ? 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)' : '#1e293b',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                              }}>
                                <Music size={22} color="#fff" />
                              </div>
                              <div style={{ minWidth: 0, flex: 1 }}>
                                <div style={{ fontSize: '15px', fontWeight: '800', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {track.title}
                                </div>
                                <div style={{ fontSize: '12px', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {track.artist || 'Chưa rõ ca sĩ'}
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => handleToggleMusicTrack(track.id)}
                              style={{
                                padding: '4px 10px',
                                borderRadius: '10px',
                                backgroundColor: track.is_active ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                                color: track.is_active ? '#34d399' : '#f87171',
                                border: track.is_active ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                                fontSize: '11px',
                                fontWeight: '700',
                                cursor: 'pointer'
                              }}
                            >
                              {track.is_active ? 'Hiển thị' : 'Đang ẩn'}
                            </button>
                          </div>

                          {/* HTML Audio Player */}
                          <div style={{ backgroundColor: '#090d16', borderRadius: '12px', padding: '8px 12px', border: '1px solid #1e293b' }}>
                            <audio controls src={track.url} style={{ width: '100%', height: '36px' }} />
                          </div>

                          {/* URL text link */}
                          <div style={{ fontSize: '11px', color: '#64748b', wordBreak: 'break-all', fontFamily: 'monospace', backgroundColor: '#090d16', padding: '6px 10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Link size={11} color="#64748b" /> {track.url}
                          </div>

                          {/* Action Buttons */}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #1e293b', paddingTop: '12px', marginTop: 'auto' }}>
                            <span style={{ fontSize: '11px', color: '#475569' }}>Thứ tự: #{track.sort_order || 0}</span>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                onClick={() => {
                                  setMusicForm(track);
                                  setEditingMusic(true);
                                }}
                                style={{ padding: '6px 12px', borderRadius: '8px', backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)', fontSize: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                              >
                                <Edit3 size={13} /> Sửa
                              </button>
                              <button
                                onClick={() => handleDeleteMusicTrack(track.id)}
                                style={{ padding: '6px 10px', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* --- MODULE 8: SETTINGS --- */}
              {activeModule === 'settings' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#fff', margin: 0 }}>Cấu Hình Toàn Bộ Hệ Thống & SEO Website</h3>
                    <p style={{ fontSize: '13px', color: '#94a3b8', margin: '4px 0 0 0' }}>Thiết lập thông tin thương hiệu, các thẻ SEO Meta, thông tin liên hệ, nhận tiền VietQR và bot Telegram thông báo</p>
                  </div>

                  <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* SECTION 1: WEBSITE IDENTITY & SEO */}
                    <div style={{ backgroundColor: '#0f172a', padding: '28px', borderRadius: '8px', border: '1px solid #1e293b', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #1e293b', paddingBottom: '14px' }}>
                        <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#fff', margin: 0 }}>1. Tên Thương Hiệu & Thẻ SEO Meta Google</h4>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                          <label style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Tên Thương Hiệu Web (site_name)</label>
                          <input
                            type="text"
                            placeholder="WeddingCard SaaS"
                            value={settings.site_name || ''}
                            onChange={(e) => setSettings(prev => ({ ...prev, site_name: e.target.value }))}
                            style={{ width: '100%', padding: '12px', borderRadius: '12px', backgroundColor: '#090d16', border: '1px solid #1e293b', color: '#fff', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Tiêu Đề Trang SEO (site_title)</label>
                          <input
                            type="text"
                            placeholder="Thiệp Cưới Online Thông Minh & Đẳng Cấp 2026"
                            value={settings.site_title || ''}
                            onChange={(e) => setSettings(prev => ({ ...prev, site_title: e.target.value }))}
                            style={{ width: '100%', padding: '12px', borderRadius: '12px', backgroundColor: '#090d16', border: '1px solid #1e293b', color: '#fff', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                          />
                        </div>
                      </div>

                      <div>
                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Mô Tả SEO Meta Description (site_description)</label>
                        <textarea
                          rows={3}
                          placeholder="Mô tả website xuất hiện khi hiển thị trên kết quả tìm kiếm Google hoặc link chia sẻ Facebook..."
                          value={settings.site_description || ''}
                          onChange={(e) => setSettings(prev => ({ ...prev, site_description: e.target.value }))}
                          style={{ width: '100%', padding: '12px', borderRadius: '12px', backgroundColor: '#090d16', border: '1px solid #1e293b', color: '#fff', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Từ Khóa SEO Meta Keywords (phân cách bằng dấu phẩy)</label>
                        <input
                          type="text"
                          placeholder="thiệp cưới online, tạo thiệp cưới, thiệp cưới số, vietqr mừng cưới"
                          value={settings.site_keywords || ''}
                          onChange={(e) => setSettings(prev => ({ ...prev, site_keywords: e.target.value }))}
                          style={{ width: '100%', padding: '12px', borderRadius: '12px', backgroundColor: '#090d16', border: '1px solid #1e293b', color: '#fff', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <ImageUploadField
                          label="Logo Website (site_logo)"
                          placeholder="https://.../logo.png hoặc Click Upload Ảnh"
                          value={settings.site_logo || ''}
                          onChange={(val) => setSettings(prev => ({ ...prev, site_logo: val }))}
                          token={token}
                          showNotification={showNotification}
                        />
                        <ImageUploadField
                          label="Favicon Icon Trình Duyệt (site_favicon)"
                          placeholder="https://.../favicon.ico hoặc Click Upload Ảnh"
                          value={settings.site_favicon || ''}
                          onChange={(val) => setSettings(prev => ({ ...prev, site_favicon: val }))}
                          token={token}
                          showNotification={showNotification}
                        />
                      </div>
                    </div>

                    {/* SECTION 2: CONTACT & SOCIAL LINKS */}
                    <div style={{ backgroundColor: '#0f172a', padding: '28px', borderRadius: '8px', border: '1px solid #1e293b', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #1e293b', paddingBottom: '14px' }}>
                        <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#fff', margin: 0 }}>2. Thông Tin Liên Hệ & Mạng Xã Hội Hỗ Trợ</h4>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                          <label style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Email Liên Hệ Hỗ Trợ (contact_email)</label>
                          <input
                            type="email"
                            placeholder="support@weddingcardsaas.vn"
                            value={settings.contact_email || ''}
                            onChange={(e) => setSettings(prev => ({ ...prev, contact_email: e.target.value }))}
                            style={{ width: '100%', padding: '12px', borderRadius: '12px', backgroundColor: '#090d16', border: '1px solid #1e293b', color: '#fff', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Hotline / SĐT Hỗ Trợ (contact_phone)</label>
                          <input
                            type="text"
                            placeholder="0987.654.321"
                            value={settings.contact_phone || ''}
                            onChange={(e) => setSettings(prev => ({ ...prev, contact_phone: e.target.value }))}
                            style={{ width: '100%', padding: '12px', borderRadius: '12px', backgroundColor: '#090d16', border: '1px solid #1e293b', color: '#fff', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                          />
                        </div>
                      </div>

                      <div>
                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Địa Chỉ Văn Phòng Trụ Sở (contact_address)</label>
                        <input
                          type="text"
                          placeholder="Tòa nhà Landmark 81, Bình Thạnh, TP. Hồ Chí Minh"
                          value={settings.contact_address || ''}
                          onChange={(e) => setSettings(prev => ({ ...prev, contact_address: e.target.value }))}
                          style={{ width: '100%', padding: '12px', borderRadius: '12px', backgroundColor: '#090d16', border: '1px solid #1e293b', color: '#fff', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                          <label style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Link Trang Facebook (social_facebook)</label>
                          <input
                            type="text"
                            placeholder="https://facebook.com/weddingcardsaas"
                            value={settings.social_facebook || ''}
                            onChange={(e) => setSettings(prev => ({ ...prev, social_facebook: e.target.value }))}
                            style={{ width: '100%', padding: '12px', borderRadius: '12px', backgroundColor: '#090d16', border: '1px solid #1e293b', color: '#fff', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Link Zalo / SĐT Zalo (social_zalo)</label>
                          <input
                            type="text"
                            placeholder="https://zalo.me/0987654321"
                            value={settings.social_zalo || ''}
                            onChange={(e) => setSettings(prev => ({ ...prev, social_zalo: e.target.value }))}
                            style={{ width: '100%', padding: '12px', borderRadius: '12px', backgroundColor: '#090d16', border: '1px solid #1e293b', color: '#fff', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* SECTION 3: VIETQR PAYMENT */}
                    <div style={{ backgroundColor: '#0f172a', padding: '28px', borderRadius: '8px', border: '1px solid #1e293b', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #1e293b', paddingBottom: '14px' }}>
                        <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#fff', margin: 0 }}>3. Cấu Hình Tài Khoản Nhận Tiền VietQR Automate</h4>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                        <div>
                          <label style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Mã Ngân Hàng (MB, VPB, VCB...)</label>
                          <input
                            type="text"
                            placeholder="MB"
                            value={settings.vietqr_bank_bin || ''}
                            onChange={(e) => setSettings(prev => ({ ...prev, vietqr_bank_bin: e.target.value }))}
                            style={{ width: '100%', padding: '12px', borderRadius: '12px', backgroundColor: '#090d16', border: '1px solid #1e293b', color: '#fff', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Số Tài Khoản Nhận Tiền</label>
                          <input
                            type="text"
                            placeholder="0987654321"
                            value={settings.vietqr_account_no || ''}
                            onChange={(e) => setSettings(prev => ({ ...prev, vietqr_account_no: e.target.value }))}
                            style={{ width: '100%', padding: '12px', borderRadius: '12px', backgroundColor: '#090d16', border: '1px solid #1e293b', color: '#fff', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Tên Chủ Tài Khoản (Không dấu)</label>
                          <input
                            type="text"
                            placeholder="DUONG QUANG TUAN"
                            value={settings.vietqr_account_name || ''}
                            onChange={(e) => setSettings(prev => ({ ...prev, vietqr_account_name: e.target.value }))}
                            style={{ width: '100%', padding: '12px', borderRadius: '12px', backgroundColor: '#090d16', border: '1px solid #1e293b', color: '#fff', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                          />
                        </div>
                      </div>

                      <ImageUploadField
                        label="Ảnh Mã QR Ngân Hàng Tĩnh (vietqr_qr_image - Tùy chọn)"
                        placeholder="Mặc định tự sinh mã VietQR tự động, hoặc Upload ảnh QR tĩnh riêng"
                        value={settings.vietqr_qr_image || ''}
                        onChange={(val) => setSettings(prev => ({ ...prev, vietqr_qr_image: val }))}
                        token={token}
                        showNotification={showNotification}
                      />
                    </div>

                    {/* SECTION 4: TELEGRAM NOTIFICATION */}
                    <div style={{ backgroundColor: '#0f172a', padding: '28px', borderRadius: '8px', border: '1px solid #1e293b', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #1e293b', paddingBottom: '14px' }}>
                        <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#fff', margin: 0 }}>4. Thông Báo Đơn Hàng Mới Qua Telegram Bot</h4>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                          <label style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Telegram Bot Token</label>
                          <input
                            type="text"
                            placeholder="123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ"
                            value={settings.telegram_notify_bot_token || ''}
                            onChange={(e) => setSettings(prev => ({ ...prev, telegram_notify_bot_token: e.target.value }))}
                            style={{ width: '100%', padding: '12px', borderRadius: '12px', backgroundColor: '#090d16', border: '1px solid #1e293b', color: '#fff', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Telegram Admin Chat ID</label>
                          <input
                            type="text"
                            placeholder="987654321"
                            value={settings.telegram_chat_id || ''}
                            onChange={(e) => setSettings(prev => ({ ...prev, telegram_chat_id: e.target.value }))}
                            style={{ width: '100%', padding: '12px', borderRadius: '12px', backgroundColor: '#090d16', border: '1px solid #1e293b', color: '#fff', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                          />
                        </div>
                      </div>
                    </div>

                    <AdminMailSettings settings={settings} setSettings={setSettings} token={token} />
                    {/* SECTION 5: GOOGLE OAUTH CONFIG */}
                    <div style={{ backgroundColor: '#0f172a', padding: '28px', borderRadius: '8px', border: '1px solid #1e293b', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #1e293b', paddingBottom: '14px' }}>
                        <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#fff', margin: 0 }}>5. Cấu Hình Đăng Nhập Google OAuth (Client ID & Secret)</h4>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                          <label style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Google Client ID (từ Google Cloud Console)</label>
                          <input
                            type="text"
                            placeholder="xxxxxxxxx-xxxxxxxxx.apps.googleusercontent.com"
                            value={settings.google_client_id || ''}
                            onChange={(e) => setSettings(prev => ({ ...prev, google_client_id: e.target.value }))}
                            style={{ width: '100%', padding: '12px', borderRadius: '12px', backgroundColor: '#090d16', border: '1px solid #1e293b', color: '#fff', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Google Client Secret</label>
                          <input
                            type="password"
                            placeholder="GOCSPX-xxxxxxxxxxxxxxxxxxxx"
                            value={settings.google_client_secret || ''}
                            onChange={(e) => setSettings(prev => ({ ...prev, google_client_secret: e.target.value }))}
                            style={{ width: '100%', padding: '12px', borderRadius: '12px', backgroundColor: '#090d16', border: '1px solid #1e293b', color: '#fff', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                          />
                        </div>
                      </div>
                      <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>
                        💡 Tạo Client ID tại: <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noreferrer" style={{ color: '#c084fc', textDecoration: 'underline' }}>Google Cloud Console APIS Credentials</a> (Thêm Authorized JavaScript origins: <code style={{ color: '#ec4899' }}>http://localhost:8000</code> hoặc domain thật).
                      </p>
                    </div>

                    <button
                      type="submit"
                      style={{
                        padding: '16px',
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                        color: '#fff',
                        fontSize: '15px',
                        fontWeight: '800',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 8px 24px rgba(168, 85, 247, 0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      <Save size={18} /> Lưu Tất Cả Cấu Hình Hệ Thống & SEO
                    </button>
                  </form>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* --- MODAL EDIT TEMPLATE --- */}
      {editingTemplate && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: '520px', maxHeight: 'calc(100dvh - 40px)', overflowY: 'auto', boxSizing: 'border-box', backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #1e293b', padding: '28px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', margin: '0 0 20px 0' }}>{templateForm.id ? 'Sửa Mẫu Thiệp' : 'Thêm Mẫu Thiệp Mới'}</h3>
            <form onSubmit={handleSaveTemplate} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8' }}>Thiết kế thiệp</label>
                  <select required value={templateForm.file_url || '/template.html'} onChange={e => setTemplateForm({ ...templateForm, file_url: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '10px', backgroundColor: '#090d16', border: '1px solid #1e293b', color: '#fff' }}>
                    {templateDesigns.map(design => <option key={design.url} value={design.url}>{design.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8' }}>Tag (HOT/NEW/VIP)</label>
                  <input type="text" value={templateForm.tag} onChange={(e) => setTemplateForm({ ...templateForm, tag: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '10px', backgroundColor: '#090d16', border: '1px solid #1e293b', color: '#fff' }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8' }}>Tên Mẫu Thiệp</label>
                <input type="text" value={templateForm.name} onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })} required style={{ width: '100%', padding: '10px', borderRadius: '10px', backgroundColor: '#090d16', border: '1px solid #1e293b', color: '#fff' }} />
              </div>

              <a href={templateForm.file_url || '/template.html'} target="_blank" rel="noopener noreferrer" style={{ color: '#c084fc', fontSize: '13px' }}>Xem trước thiết kế thiệp ↗</a>
              <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0 }}>Ảnh xem trước dùng để giới thiệu mẫu. Bố cục thiệp được lấy từ thiết kế bạn chọn.</p>
              <ImageUploadField
                label="Ảnh xem trước mẫu thiệp"
                placeholder="Dán link ảnh hoặc Upload ảnh thumbnail mẫu thiệp"
                value={templateForm.thumbnail || ''}
                onChange={(val) => setTemplateForm(prev => ({ ...prev, thumbnail: val }))}
                token={token}
                showNotification={showNotification}
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ color: '#94a3b8', fontSize: '13px' }}>Giá được quản lý theo gói cước. Mã mẫu được tạo tự động.</div>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8' }}>Danh Mục</label>
                  <input type="text" value={templateForm.category} onChange={(e) => setTemplateForm({ ...templateForm, category: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '10px', backgroundColor: '#090d16', border: '1px solid #1e293b', color: '#fff' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={() => setEditingTemplate(null)} style={{ flex: 1, padding: '12px', borderRadius: '12px', backgroundColor: '#1e293b', color: '#fff', border: 'none', cursor: 'pointer' }}>Hủy</button>
                <button type="submit" style={{ flex: 1, padding: '12px', borderRadius: '12px', backgroundColor: '#a855f7', color: '#fff', border: 'none', fontWeight: '800', cursor: 'pointer' }}>Lưu Mẫu Thiệp</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL EDIT PLAN --- */}
      {editingPlan && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: '520px', maxHeight: 'calc(100dvh - 40px)', overflowY: 'auto', boxSizing: 'border-box', backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #1e293b', padding: '28px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', margin: '0 0 20px 0' }}>{planForm.id ? 'Sửa Gói Cước' : 'Thêm Gói Cước Mới'}</h3>
            <form onSubmit={handleSavePlan} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8' }}>Mã Gói (pro, vip, free)</label>
                  <input type="text" value={planForm.code} onChange={(e) => setPlanForm({ ...planForm, code: e.target.value })} required style={{ width: '100%', padding: '10px', borderRadius: '10px', backgroundColor: '#090d16', border: '1px solid #1e293b', color: '#fff' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8' }}>Giá (VNĐ)</label>
                  <input type="number" value={planForm.price} onChange={(e) => setPlanForm({ ...planForm, price: parseFloat(e.target.value) || 0 })} required style={{ width: '100%', padding: '10px', borderRadius: '10px', backgroundColor: '#090d16', border: '1px solid #1e293b', color: '#fff' }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8' }}>Tên Gói Cước</label>
                <input type="text" value={planForm.name} onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })} required style={{ width: '100%', padding: '10px', borderRadius: '10px', backgroundColor: '#090d16', border: '1px solid #1e293b', color: '#fff' }} />
              </div>

              <div style={{ display: 'grid', gap: 10 }}>
                {[['subtitle', 'Dòng giới thiệu'], ['period', 'Đơn vị / chu kỳ'], ['description', 'Mô tả'], ['action', 'Nhãn nút chọn gói']].map(([field, label]) => <label key={field} style={{ fontSize: 12, color: '#94a3b8' }}>{label}<input value={planForm[field] || ''} onChange={event => setPlanForm(previous => ({ ...previous, [field]: event.target.value }))} style={{ width: '100%', padding: 10, borderRadius: 10, background: '#090d16', color: '#fff', border: '1px solid #1e293b', boxSizing: 'border-box' }} /></label>)}
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8' }}>Danh sách tính năng (Mỗi dòng 1 tính năng)</label>
                <PlanFeaturesEditor value={planForm.featuresInput} onChange={value => setPlanForm(previous => ({ ...previous, featuresInput: value }))} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="checkbox" id="is_popular" checked={planForm.is_popular} onChange={(e) => setPlanForm({ ...planForm, is_popular: e.target.checked })} />
                <label htmlFor="is_popular" style={{ fontSize: '13px', color: '#fff' }}>Đánh dấu là gói KHUYÊN DÙNG</label>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={() => setEditingPlan(null)} style={{ flex: 1, padding: '12px', borderRadius: '12px', backgroundColor: '#1e293b', color: '#fff', border: 'none', cursor: 'pointer' }}>Hủy</button>
                <button type="submit" style={{ flex: 1, padding: '12px', borderRadius: '12px', backgroundColor: '#a855f7', color: '#fff', border: 'none', fontWeight: '800', cursor: 'pointer' }}>Lưu Gói Cước</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL EDIT USER --- */}
      {editingUser && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 120, backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: '480px', maxHeight: 'calc(100dvh - 40px)', overflowY: 'auto', boxSizing: 'border-box', backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #1e293b', padding: '28px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', margin: '0 0 20px 0' }}>Chỉnh Sửa Thông Tin Khách Hàng</h3>
            <form onSubmit={handleSaveUser} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600' }}>Họ và Tên</label>
                  <input type="text" value={userForm.name || ''} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} required style={{ width: '100%', padding: '10px', borderRadius: '8px', backgroundColor: '#090d16', border: '1px solid #1e293b', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600' }}>Số Điện Thoại (SĐT)</label>
                  <input type="text" placeholder="0987.654.321" value={userForm.phone || ''} onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', backgroundColor: '#090d16', border: '1px solid #1e293b', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Email Liên Hệ</label>
                <input type="email" value={userForm.email || ''} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} required style={{ width: '100%', padding: '10px', borderRadius: '8px', backgroundColor: '#090d16', border: '1px solid #1e293b', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }} />
              </div>

              <label style={{ fontSize: 12, color: '#94a3b8' }}>Số lượt tạo thiệp đã mua<input type="number" min={0} step={1} required value={userForm.paid_credits ?? 0} onChange={event => setUserForm(previous => ({ ...previous, paid_credits: Number(event.target.value) }))} style={{ width: '100%', padding: 10, borderRadius: 8, background: '#090d16', border: '1px solid #1e293b', color: '#fff', boxSizing: 'border-box' }} /></label>

              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={() => setEditingUser(null)} style={{ flex: 1, padding: '12px', borderRadius: '8px', backgroundColor: '#1e293b', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: '600' }}>Hủy</button>
                <button type="submit" style={{ flex: 1, padding: '12px', borderRadius: '8px', backgroundColor: '#a855f7', color: '#fff', border: 'none', fontWeight: '800', cursor: 'pointer' }}>Lưu Thay Đổi</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL EDIT / UPLOAD MUSIC --- */}
      {editingMusic && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: '520px', maxHeight: 'calc(100dvh - 40px)', overflowY: 'auto', boxSizing: 'border-box', backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #1e293b', padding: '28px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', margin: '0 0 20px 0' }}>
              {musicForm.id ? 'Chỉnh Sửa Bài Hát' : 'Thêm Bài Hát Mới / Upload MP3'}
            </h3>
            <form onSubmit={handleSaveMusicTrack} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Tên Bài Hát</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Ngày Đầu Tiên, Hơn Cả Yêu..."
                  value={musicForm.title}
                  onChange={(e) => setMusicForm({ ...musicForm, title: e.target.value })}
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', backgroundColor: '#090d16', border: '1px solid #1e293b', color: '#fff', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Ca Sĩ / Nghệ Sĩ</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Đức Phúc, Bùi Anh Tuấn..."
                  value={musicForm.artist}
                  onChange={(e) => setMusicForm({ ...musicForm, artist: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', backgroundColor: '#090d16', border: '1px solid #1e293b', color: '#fff', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              {/* Upload File Section */}
              <div style={{ padding: '14px', backgroundColor: '#090d16', borderRadius: '14px', border: '1px dashed #334155', display: 'flex', flexDirection: 'column', gap: '10px', cursor: 'pointer' }}>
                <label htmlFor="admin_mp3_file_input" style={{ fontSize: '12px', color: '#ec4899', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <Upload size={16} /> Upload Tệp MP3 Từ Máy Tính (Tối đa 25MB)
                </label>
                <input
                  id="admin_mp3_file_input"
                  type="file"
                  accept="audio/mp3,audio/wav,audio/ogg,audio/m4a,.mp3,.wav,.ogg,.m4a"
                  onChange={handleUploadMP3}
                  disabled={uploadingAudio}
                  style={{ color: '#94a3b8', fontSize: '12px', cursor: 'pointer' }}
                />
                {uploadingAudio && (
                  <div style={{ fontSize: '12px', color: '#f59e0b', fontWeight: '600' }}>⏳ Đang tải file mp3 lên hệ thống, vui lòng chờ...</div>
                )}
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Đường Dẫn File MP3 (Direct URL)</label>
                <input
                  type="text"
                  placeholder="https://example.com/song.mp3 hoặc /uploads/music/..."
                  value={musicForm.url}
                  onChange={(e) => setMusicForm({ ...musicForm, url: e.target.value })}
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', backgroundColor: '#090d16', border: '1px solid #1e293b', color: '#fff', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              {musicForm.url && (
                <div style={{ padding: '8px 12px', backgroundColor: '#090d16', borderRadius: '10px', border: '1px solid #1e293b' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Nghe Thử Ngay:</span>
                  <audio controls src={musicForm.url} style={{ width: '100%', height: '36px' }} />
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  id="music_is_active"
                  checked={musicForm.is_active}
                  onChange={(e) => setMusicForm({ ...musicForm, is_active: e.target.checked })}
                  style={{ cursor: 'pointer' }}
                />
                <label htmlFor="music_is_active" style={{ fontSize: '13px', color: '#fff', cursor: 'pointer' }}>Cho phép hiển thị công khai cho người dùng chọn</label>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setEditingMusic(null)}
                  style={{ flex: 1, padding: '12px', borderRadius: '12px', backgroundColor: '#1e293b', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: '600' }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={uploadingAudio}
                  style={{ flex: 1, padding: '12px', borderRadius: '12px', background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)', color: '#fff', border: 'none', fontWeight: '800', cursor: 'pointer' }}
                >
                  {musicForm.id ? 'Lưu Thay Đổi' : 'Tạo Bài Hát'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
