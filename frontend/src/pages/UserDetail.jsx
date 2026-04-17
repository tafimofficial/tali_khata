import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUser, createTransaction, updateTransaction, updateUser, deleteUser } from '../services/api';
import { ArrowLeft, Plus, History, Edit2, Pin, Trash2, Edit, X, ChevronRight } from 'lucide-react';

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showTxModal, setShowTxModal] = useState(false);
  const [txAmount, setTxAmount] = useState('');
  const [txDesc, setTxDesc] = useState('');
  const [txType, setTxType] = useState('give');
  const [editTxId, setEditTxId] = useState(null);
  const [txSaving, setTxSaving] = useState(false);

  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editColor, setEditColor] = useState('');
  const [userSaving, setUserSaving] = useState(false);

  useEffect(() => { fetchUser(); }, [id]);

  const fetchUser = async () => {
    try {
      const res = await getUser(id);
      setUser(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTransaction = async (e) => {
    e.preventDefault();
    setTxSaving(true);
    let finalAmount = Math.abs(Number(txAmount));
    if (txType === 'receive') finalAmount = -finalAmount;
    try {
      if (editTxId) {
        await updateTransaction(editTxId, { amount: finalAmount, description: txDesc });
      } else {
        await createTransaction({ user: id, amount: finalAmount, description: txDesc });
      }
      setShowTxModal(false);
      setTxAmount(''); setTxDesc(''); setEditTxId(null);
      fetchUser();
    } catch (err) {
      alert('লেনদেন সংরক্ষণে সমস্যা হয়েছে।');
    } finally {
      setTxSaving(false);
    }
  };

  const openEdit = (tx) => {
    setEditTxId(tx.id);
    setTxAmount(Math.abs(tx.amount));
    setTxType(Number(tx.amount) >= 0 ? 'give' : 'receive');
    setTxDesc(tx.description);
    setShowTxModal(true);
  };

  const handleTogglePin = async () => {
    try {
      await updateUser(id, { is_pinned: !user.is_pinned });
      fetchUser();
    } catch (err) { console.error(err); }
  };

  const handleDeleteUser = async () => {
    if (window.confirm('এই ব্যবহারকারী ও সকল লেনদেন মুছে ফেলবেন?')) {
      try {
        await deleteUser(id);
        navigate('/users');
      } catch (err) {
        alert('মুছে ফেলা সম্ভব হয়নি।');
      }
    }
  };

  const openEditUser = () => {
    setEditName(user.name);
    setEditPhone(user.phone);
    setEditAddress(user.address || '');
    setEditColor(user.background_color);
    setShowEditUserModal(true);
  };

  const handleUpdateUserForm = async (e) => {
    e.preventDefault();
    setUserSaving(true);
    try {
      await updateUser(id, { name: editName, phone: editPhone, address: editAddress, background_color: editColor });
      setShowEditUserModal(false);
      fetchUser();
    } catch (err) {
      alert('তথ্য আপডেট করা সম্ভব হয়নি।');
    } finally {
      setUserSaving(false);
    }
  };

  if (loading) return (
    <div className="container" style={{ paddingTop: '28px' }}>
      <div className="skeleton" style={{ height: '48px', width: '120px', marginBottom: '20px', borderRadius: '12px' }} />
      <div className="skeleton" style={{ height: '140px', borderRadius: '22px', marginBottom: '24px' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: '80px', borderRadius: '18px' }} />)}
      </div>
    </div>
  );

  if (!user) return <p className="text-center text-muted" style={{ padding: '60px 0' }}>ব্যবহারকারী পাওয়া যায়নি</p>;

  const totalBalance = Number(user.total_balance) || 0;
  const isPositive = totalBalance >= 0;

  return (
    <>
      <div className="container" style={{ paddingTop: '24px' }}>

        {/* Back + Actions Bar */}
        <div className="flex justify-between items-center animate-fade-up" style={{ marginBottom: '22px' }}>
          <button
            onClick={() => navigate('/users')}
            style={{
              background: 'rgba(255,255,255,0.06)',
              color: 'var(--text-muted)',
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '9px 16px', borderRadius: '30px',
              fontSize: '0.9rem', border: '1px solid rgba(255,255,255,0.08)',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.06)'}
          >
            <ArrowLeft size={17} /> ফিরে যান
          </button>
          <div className="flex gap-2">
            <button
              onClick={handleTogglePin}
              title={user.is_pinned ? 'আনপিন করুন' : 'পিন করুন'}
              style={{
                background: user.is_pinned ? 'rgba(255,0,0,0.12)' : 'rgba(255,255,255,0.06)',
                color: user.is_pinned ? 'var(--primary)' : 'var(--text-muted)',
                padding: '9px', borderRadius: '12px', lineHeight: 0,
                border: `1px solid ${user.is_pinned ? 'rgba(255,0,0,0.25)' : 'rgba(255,255,255,0.08)'}`,
                transition: 'all 0.2s',
              }}
            >
              <Pin size={18} fill={user.is_pinned ? 'var(--primary)' : 'none'} />
            </button>
            <button
              onClick={openEditUser}
              style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)', padding: '9px', borderRadius: '12px', lineHeight: 0, border: '1px solid rgba(255,255,255,0.08)', transition: 'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.12)'}
              onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.06)'}
            >
              <Edit size={18} />
            </button>
            <button
              onClick={handleDeleteUser}
              style={{ background: 'rgba(239,68,68,0.12)', color: 'var(--danger)', padding: '9px', borderRadius: '12px', lineHeight: 0, border: '1px solid rgba(239,68,68,0.2)', transition: 'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background='rgba(239,68,68,0.22)'}
              onMouseLeave={e => e.currentTarget.style.background='rgba(239,68,68,0.12)'}
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {/* User Hero Card */}
        <div
          className="animate-fade-up"
          style={{
            borderRadius: '22px',
            padding: '24px',
            marginBottom: '28px',
            background: `linear-gradient(135deg, ${user.background_color}28 0%, ${user.background_color}08 100%)`,
            border: `1px solid ${user.background_color}35`,
            position: 'relative', overflow: 'hidden',
            animationDelay: '60ms',
          }}
        >
          {/* glow */}
          <div style={{ position: 'absolute', width: '160px', height: '160px', borderRadius: '50%', background: `${user.background_color}20`, filter: 'blur(50px)', top: '-40px', right: '-40px', pointerEvents: 'none' }} />

          <div className="flex items-center gap-4" style={{ position: 'relative', marginBottom: '18px' }}>
            <div style={{
              width: '58px', height: '58px', borderRadius: '18px',
              background: `${user.background_color}30`,
              border: `2px solid ${user.background_color}55`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.5rem', fontWeight: '700', color: user.background_color,
              flexShrink: 0,
            }}>
              {user.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>{user.name}</h2>
                {user.is_pinned && <Pin size={14} fill="var(--primary)" color="var(--primary)" />}
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '3px' }}>
                {user.phone}{user.address && ` · ${user.address}`}
              </p>
            </div>
          </div>

          <div style={{
            background: 'rgba(0,0,0,0.25)',
            borderRadius: '14px',
            padding: '16px 20px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            position: 'relative',
          }}>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>মোট ব্যালেন্স</p>
              <span style={{ fontSize: '1.6rem', fontWeight: '700', color: isPositive ? 'var(--secondary)' : 'var(--danger)', letterSpacing: '-0.5px' }}>
                ৳ {Math.abs(totalBalance).toLocaleString('bn-BD')}
              </span>
            </div>
            <span className="badge" style={{
              background: isPositive ? 'var(--secondary-dim)' : 'var(--danger-dim)',
              color: isPositive ? 'var(--secondary)' : 'var(--danger)',
              fontSize: '0.85rem', padding: '6px 14px',
            }}>
              {isPositive ? 'পাবো' : 'বাকি'}
            </span>
          </div>
        </div>

        {/* Transactions Header */}
        <div className="flex justify-between items-center animate-fade-up" style={{ marginBottom: '16px', animationDelay: '120ms' }}>
          <div className="flex items-center gap-2">
            <History size={18} color="var(--text-muted)" />
            <h3 style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>লেনদেন ইতিহাস</h3>
          </div>
          <button
            onClick={() => { setEditTxId(null); setTxAmount(''); setTxDesc(''); setTxType('give'); setShowTxModal(true); }}
            className="btn-primary"
            style={{ width: 'auto', padding: '10px 18px', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '7px', fontSize: '0.88rem' }}
          >
            <Plus size={16} /> যোগ করুন
          </button>
        </div>

        {/* Transaction List */}
        {(!user.transactions || user.transactions.length === 0) ? (
          <p className="text-center text-muted text-sm" style={{ padding: '48px 0' }}>এখনো কোনো লেনদেন নেই</p>
        ) : (
          <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '8px' }}>
            {user.transactions.slice().reverse().map((tx) => {
              const pos = Number(tx.amount) >= 0;
              return (
                <div key={tx.id} className="glass-card animate-fade-up" style={{ padding: '16px 20px' }}>
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3 items-start">
                      <div style={{
                        width: '38px', height: '38px', borderRadius: '11px', flexShrink: 0,
                        background: pos ? 'var(--secondary-dim)' : 'var(--danger-dim)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <span style={{ fontSize: '1.1rem' }}>{pos ? '↑' : '↓'}</span>
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{tx.description || 'বিবরণ নেই'}</div>
                        <div className="text-xs text-muted" style={{ marginTop: '3px' }}>{new Date(tx.date).toLocaleString('bn-BD')}</div>
                        {tx.history && tx.history.length > 0 && (
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px', display: 'inline-block', background: 'rgba(255,255,255,0.06)', borderRadius: '6px', padding: '2px 8px' }}>
                            {tx.history.length}× এডিট
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ color: pos ? 'var(--secondary)' : 'var(--danger)', fontWeight: '700', fontSize: '1.05rem' }}>
                        {pos ? '+' : '−'} ৳ {Math.abs(tx.amount).toLocaleString('bn-BD')}
                      </div>
                      <button
                        onClick={() => openEdit(tx)}
                        style={{
                          background: 'none', color: 'var(--text-muted)',
                          display: 'flex', alignItems: 'center', gap: '4px',
                          fontSize: '0.78rem', marginTop: '8px', marginLeft: 'auto',
                          transition: 'color 0.2s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.color='var(--primary)'}
                        onMouseLeave={e => e.currentTarget.style.color='var(--text-muted)'}
                      >
                        <Edit2 size={13} /> এডিট
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Transaction Modal */}
      {showTxModal && (
        <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) setShowTxModal(false); }}>
          <div className="modal-box">
            <div className="flex justify-between items-center" style={{ marginBottom: '22px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>{editTxId ? 'লেনদেন এডিট' : 'নতুন লেনদেন'}</h3>
              <button onClick={() => setShowTxModal(false)} style={{ background: 'rgba(255,255,255,0.07)', color: 'var(--text-muted)', padding: '7px', borderRadius: '10px', lineHeight: 0 }}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleTransaction} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Toggle */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {[
                  { val: 'give', label: 'আমরা দিলাম', sub: '(পাবো)', color: 'var(--secondary)' },
                  { val: 'receive', label: 'তারা দিল', sub: '(কমবে)', color: 'var(--danger)' },
                ].map(opt => (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => setTxType(opt.val)}
                    style={{
                      padding: '12px',
                      borderRadius: '14px',
                      background: txType === opt.val ? (opt.val === 'give' ? 'var(--secondary-dim)' : 'var(--danger-dim)') : 'rgba(255,255,255,0.04)',
                      border: `1.5px solid ${txType === opt.val ? opt.color : 'rgba(255,255,255,0.1)'}`,
                      color: txType === opt.val ? opt.color : 'var(--text-muted)',
                      fontWeight: '600', fontSize: '0.85rem',
                      transition: 'all 0.2s',
                    }}
                  >
                    {opt.label}<br /><span style={{ fontWeight: '400', fontSize: '0.75rem' }}>{opt.sub}</span>
                  </button>
                ))}
              </div>
              <input required type="number" step="0.01" className="input-field" placeholder="টাকার পরিমাণ" value={txAmount} onChange={e => setTxAmount(e.target.value)} />
              <input required className="input-field" placeholder="বিবরণ লিখুন" value={txDesc} onChange={e => setTxDesc(e.target.value)} />
              <div className="flex gap-3" style={{ marginTop: '6px' }}>
                <button type="button" className="btn-ghost" onClick={() => setShowTxModal(false)}>বাতিল</button>
                <button type="submit" className="btn-primary" disabled={txSaving} style={{ opacity: txSaving ? 0.6 : 1 }}>
                  {txSaving ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditUserModal && (
        <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) setShowEditUserModal(false); }}>
          <div className="modal-box">
            <div className="flex justify-between items-center" style={{ marginBottom: '22px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>তথ্য আপডেট করুন</h3>
              <button onClick={() => setShowEditUserModal(false)} style={{ background: 'rgba(255,255,255,0.07)', color: 'var(--text-muted)', padding: '7px', borderRadius: '10px', lineHeight: 0 }}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleUpdateUserForm} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <input required className="input-field" placeholder="নাম" value={editName} onChange={e => setEditName(e.target.value)} />
              <input required className="input-field" placeholder="ফোন নম্বর" value={editPhone} onChange={e => setEditPhone(e.target.value.replace(/\D/g, ''))} type="tel" inputMode="numeric" />
              <input className="input-field" placeholder="ঠিকানা (ঐচ্ছিক)" value={editAddress} onChange={e => setEditAddress(e.target.value)} />
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted">রঙ:</span>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', overflow: 'hidden', border: `3px solid ${editColor}80` }}>
                  <input type="color" value={editColor} onChange={e => setEditColor(e.target.value)} style={{ border: 'none', width: '46px', height: '46px', margin: '-5px', cursor: 'pointer' }} />
                </div>
                <span style={{ fontSize: '0.8rem', color: editColor, fontWeight: '600' }}>{editColor}</span>
              </div>
              <div className="flex gap-3" style={{ marginTop: '6px' }}>
                <button type="button" className="btn-ghost" onClick={() => setShowEditUserModal(false)}>বাতিল</button>
                <button type="submit" className="btn-primary" disabled={userSaving} style={{ opacity: userSaving ? 0.6 : 1 }}>
                  {userSaving ? 'আপডেট হচ্ছে...' : 'আপডেট করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UserDetail;
