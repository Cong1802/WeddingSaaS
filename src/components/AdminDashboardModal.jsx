import React, { useState, useEffect } from 'react';

export default function AdminDashboardModal({ isOpen, onClose, token }) {
  const [activeTab, setActiveTab] = useState('stats'); // 'stats' | 'users' | 'cards' | 'orders'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Data states
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [cards, setCards] = useState([]);
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isOpen && token) {
      fetchData();
    }
  }, [isOpen, activeTab, token]);

  const fetchData = async () => {
    setLoading(true);
    setError('');

    try {
      if (activeTab === 'stats') {
        const res = await fetch('/api/admin/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok && data.success) setStats(data.stats);
        else throw new Error(data.message);
      } else if (activeTab === 'users') {
        const res = await fetch('/api/admin/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok && data.success) setUsers(data.users);
        else throw new Error(data.message);
      } else if (activeTab === 'cards') {
        const res = await fetch('/api/admin/cards', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok && data.success) setCards(data.cards);
        else throw new Error(data.message);
      } else if (activeTab === 'orders') {
        const res = await fetch('/api/admin/orders', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok && data.success) setOrders(data.orders);
        else throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message || 'Lỗi khi tải dữ liệu admin');
    } finally {
      setLoading(false);
    }
  };

  const handleGrantCredit = async (userId, userEmail) => {
    if (!confirm(`Cấp 1 lượt làm thiệp cho người dùng: ${userEmail}?`)) return;
    try {
      const res = await fetch(`/api/admin/users/${userId}/grant-credit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount: 1 })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg(data.message);
        fetchData();
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleApproveOrder = async (orderId, orderCode) => {
    if (!confirm(`Phê duyệt thanh toán cho đơn hàng ${orderCode}? (Khách hàng sẽ được cộng +1 lượt tạo thiệp)`)) return;
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/approve`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg(data.message);
        fetchData();
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggleRole = async (userId) => {
    if (!confirm('Bạn có chắc chắn muốn thay đổi quyền người dùng này?')) return;
    try {
      const res = await fetch(`/api/admin/users/${userId}/toggle-role`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg(data.message);
        fetchData();
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Hành động này sẽ xóa người dùng và TOÀN BỘ thiệp cưới của họ! Tiếp tục?')) return;
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg(data.message);
        fetchData();
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteCard = async (cardId) => {
    if (!confirm('Bạn có chắc chắn muốn xóa thiệp cưới này?')) return;
    try {
      const res = await fetch(`/api/admin/cards/${cardId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg(data.message);
        fetchData();
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  if (!isOpen) return null;

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCards = cards.filter(c => 
    c.slug?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.user?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOrders = orders.filter(o =>
    o.order_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.user?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fadeIn">
      <div className="relative w-full max-w-5xl h-[85vh] bg-slate-900 text-slate-100 rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-800">
        
        {/* Top Header */}
        <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-xl">
              👑
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif text-white tracking-wide">Bảng Quản Trị Admin SaaS</h2>
              <p className="text-xs text-slate-400">Quản lý hệ thống người dùng, đơn hàng VietQR & thiệp cưới toàn nền tảng</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-900/50 px-6 gap-2 overflow-x-auto">
          <button
            onClick={() => { setActiveTab('stats'); setSearchQuery(''); }}
            className={`py-3.5 px-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'stats'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>📊</span> Thống Kê Tổng Quan
          </button>
          <button
            onClick={() => { setActiveTab('users'); setSearchQuery(''); }}
            className={`py-3.5 px-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'users'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>👥</span> Quản Lý Người Dùng
          </button>
          <button
            onClick={() => { setActiveTab('orders'); setSearchQuery(''); }}
            className={`py-3.5 px-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🛒</span> Quản Lý Đơn Hàng ({orders.filter(o => o.status === 'pending').length} chờ duyệt)
          </button>
          <button
            onClick={() => { setActiveTab('cards'); setSearchQuery(''); }}
            className={`py-3.5 px-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'cards'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>💌</span> Quản Lý Thiệp Cưới
          </button>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="mx-6 mt-4 p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
            <span>🎉</span> {successMsg}
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center h-48 text-slate-400 gap-3">
              <svg className="animate-spin h-6 w-6 text-indigo-500" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span>Đang tải dữ liệu...</span>
            </div>
          ) : error ? (
            <div className="p-4 bg-rose-500/20 border border-rose-500/30 text-rose-300 rounded-xl">
              ⚠️ {error}
            </div>
          ) : (
            <>
              {/* TAB 1: STATS */}
              {activeTab === 'stats' && stats && (
                <div className="space-y-6">
                  {/* Stat Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-5 bg-slate-800/80 rounded-2xl border border-slate-700/80 shadow-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-400">Tổng Người Dùng</span>
                        <span className="p-2 bg-indigo-500/20 rounded-xl text-indigo-400">👥</span>
                      </div>
                      <div className="text-3xl font-bold mt-2 text-white">{stats.total_users}</div>
                      <div className="text-xs text-slate-400 mt-1">Đã đăng ký tài khoản</div>
                    </div>

                    <div className="p-5 bg-slate-800/80 rounded-2xl border border-slate-700/80 shadow-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-400">Tổng Thiệp Đã Tạo</span>
                        <span className="p-2 bg-rose-500/20 rounded-xl text-rose-400">💌</span>
                      </div>
                      <div className="text-3xl font-bold mt-2 text-white">{stats.total_cards}</div>
                      <div className="text-xs text-slate-400 mt-1">Thiệp cưới đã được lưu</div>
                    </div>

                    <div className="p-5 bg-slate-800/80 rounded-2xl border border-slate-700/80 shadow-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-400">Tổng Lượt Xem</span>
                        <span className="p-2 bg-emerald-500/20 rounded-xl text-emerald-400">👁️</span>
                      </div>
                      <div className="text-3xl font-bold mt-2 text-white">{stats.total_views}</div>
                      <div className="text-xs text-slate-400 mt-1">Lượt khách truy cập xem thiệp</div>
                    </div>
                  </div>

                  {/* Templates Distribution */}
                  <div className="p-6 bg-slate-800/60 rounded-2xl border border-slate-700/60">
                    <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                      <span>🎨</span> Thống Kê Sử Dụng Template
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {stats.templates.map((t, idx) => (
                        <div key={idx} className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-700 flex items-center justify-between">
                          <span className="text-sm font-semibold text-indigo-300">Template ID: {t.template_id}</span>
                          <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-bold">
                            {t.count} thiệp
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: USER MANAGEMENT */}
              {activeTab === 'users' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <input
                      type="text"
                      placeholder="Tìm kiếm theo tên hoặc email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full max-w-xs px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                    />
                    <div className="text-xs text-slate-400">Hiển thị {filteredUsers.length} người dùng</div>
                  </div>

                  <div className="bg-slate-800/60 rounded-2xl border border-slate-700 overflow-hidden">
                    <table className="w-full text-left text-sm text-slate-200">
                      <thead className="bg-slate-900/80 text-slate-400 text-xs uppercase tracking-wider">
                        <tr>
                          <th className="p-4">Người Dùng</th>
                          <th className="p-4">Email</th>
                          <th className="p-4">Vai Trò</th>
                          <th className="p-4">Lượt Tạo Thiệp</th>
                          <th className="p-4">Số Thiệp</th>
                          <th className="p-4">Ngày Tạo</th>
                          <th className="p-4 text-right">Hành Động</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/60">
                        {filteredUsers.map((u) => (
                          <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                            <td className="p-4 flex items-center gap-3">
                              <img src={u.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'} alt="Avatar" className="w-8 h-8 rounded-full bg-slate-700" />
                              <span className="font-semibold text-white">{u.name}</span>
                            </td>
                            <td className="p-4 text-slate-300">{u.email}</td>
                            <td className="p-4">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                u.role === 'admin' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-slate-700 text-slate-300'
                              }`}>
                                {u.role === 'admin' ? '👑 Admin' : '👤 User'}
                              </span>
                            </td>
                            <td className="p-4 font-mono font-bold text-emerald-400">
                              {u.role === 'admin' ? '∞ Vô hạn' : `${u.paid_credits || 0} lượt`}
                            </td>
                            <td className="p-4 text-slate-300 font-mono">{u.cards_count || 0}</td>
                            <td className="p-4 text-slate-400 text-xs">
                              {new Date(u.created_at).toLocaleDateString('vi-VN')}
                            </td>
                            <td className="p-4 text-right space-x-2">
                              <button
                                onClick={() => handleGrantCredit(u.id, u.email)}
                                className="px-2.5 py-1 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 text-xs rounded-lg transition-colors"
                              >
                                ➕ Cấp Lượt
                              </button>
                              <button
                                onClick={() => handleToggleRole(u.id)}
                                className="px-2.5 py-1 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 text-xs rounded-lg transition-colors"
                              >
                                Chuyển quyền
                              </button>
                              <button
                                onClick={() => handleDeleteUser(u.id)}
                                className="px-2.5 py-1 bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 text-xs rounded-lg transition-colors"
                              >
                                Xóa
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: ORDERS MANAGEMENT */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <input
                      type="text"
                      placeholder="Tìm theo mã đơn hoặc email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full max-w-xs px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                    />
                    <div className="text-xs text-slate-400">Hiển thị {filteredOrders.length} đơn hàng</div>
                  </div>

                  <div className="bg-slate-800/60 rounded-2xl border border-slate-700 overflow-hidden">
                    <table className="w-full text-left text-sm text-slate-200">
                      <thead className="bg-slate-900/80 text-slate-400 text-xs uppercase tracking-wider">
                        <tr>
                          <th className="p-4">Mã Đơn Hàng</th>
                          <th className="p-4">Khách Hàng</th>
                          <th className="p-4">Gói Dịch Vụ</th>
                          <th className="p-4">Số Tiền</th>
                          <th className="p-4">Trạng Thái</th>
                          <th className="p-4">Thời Gian</th>
                          <th className="p-4 text-right">Hành Động</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/60">
                        {filteredOrders.length === 0 ? (
                          <tr>
                            <td colSpan="7" className="p-8 text-center text-slate-400 italic">
                              Chưa có đơn hàng nào
                            </td>
                          </tr>
                        ) : (
                          filteredOrders.map((o) => (
                            <tr key={o.id} className="hover:bg-slate-800/40 transition-colors">
                              <td className="p-4 font-mono font-bold text-amber-300">
                                #{o.order_code}
                              </td>
                              <td className="p-4 text-slate-300">
                                {o.user ? (
                                  <div>
                                    <div className="font-semibold text-white">{o.user.name}</div>
                                    <div className="text-xs text-slate-400">{o.user.email}</div>
                                  </div>
                                ) : (
                                  <span className="text-slate-500 italic">N/A</span>
                                )}
                              </td>
                              <td className="p-4">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                  o.package_type === 'vip' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                }`}>
                                  Gói {o.package_type.toUpperCase()}
                                </span>
                              </td>
                              <td className="p-4 font-mono font-bold text-emerald-400">
                                {o.amount.toLocaleString('vi-VN')}đ
                              </td>
                              <td className="p-4">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                  o.status === 'completed' 
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                                }`}>
                                  {o.status === 'completed' ? '✓ Đã Phê Duyệt' : '⏳ Chờ Thanh Toán'}
                                </span>
                              </td>
                              <td className="p-4 text-slate-400 text-xs">
                                {new Date(o.created_at).toLocaleString('vi-VN')}
                              </td>
                              <td className="p-4 text-right">
                                {o.status === 'pending' ? (
                                  <button
                                    onClick={() => handleApproveOrder(o.id, o.order_code)}
                                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-emerald-950"
                                  >
                                    ✓ Phê Duyệt (Cấp Lượt)
                                  </button>
                                ) : (
                                  <span className="text-slate-500 text-xs italic">Đã xử lý</span>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 4: CARD MANAGEMENT */}
              {activeTab === 'cards' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <input
                      type="text"
                      placeholder="Tìm theo slug hoặc chủ sở hữu..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full max-w-xs px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                    />
                    <div className="text-xs text-slate-400">Hiển thị {filteredCards.length} thiệp cưới</div>
                  </div>

                  <div className="bg-slate-800/60 rounded-2xl border border-slate-700 overflow-hidden">
                    <table className="w-full text-left text-sm text-slate-200">
                      <thead className="bg-slate-900/80 text-slate-400 text-xs uppercase tracking-wider">
                        <tr>
                          <th className="p-4">Slug / Link</th>
                          <th className="p-4">Template</th>
                          <th className="p-4">Chủ Sở Hữu</th>
                          <th className="p-4">Lượt Xem</th>
                          <th className="p-4">Cập Nhật</th>
                          <th className="p-4 text-right">Hành Động</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/60">
                        {filteredCards.map((c) => (
                          <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                            <td className="p-4 font-mono font-semibold text-rose-300">
                              /{c.slug}
                            </td>
                            <td className="p-4 text-slate-300">
                              <span className="px-2 py-0.5 bg-slate-700 rounded text-xs">{c.template_id}</span>
                            </td>
                            <td className="p-4 text-slate-300">
                              {c.user ? (
                                <div>
                                  <div className="font-semibold text-white">{c.user.name}</div>
                                  <div className="text-xs text-slate-400">{c.user.email}</div>
                                </div>
                              ) : (
                                <span className="text-slate-500 italic">Khách vãng lai</span>
                              )}
                            </td>
                            <td className="p-4 font-mono text-emerald-400">{c.views_count || 0}</td>
                            <td className="p-4 text-slate-400 text-xs">
                              {new Date(c.updated_at).toLocaleDateString('vi-VN')}
                            </td>
                            <td className="p-4 text-right space-x-2">
                              <a
                                href={`/?v=${c.slug}`}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2.5 py-1 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 text-xs rounded-lg transition-colors inline-block"
                              >
                                Xem thiệp
                              </a>
                              <button
                                onClick={() => handleDeleteCard(c.id)}
                                className="px-2.5 py-1 bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 text-xs rounded-lg transition-colors"
                              >
                                Xóa
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

