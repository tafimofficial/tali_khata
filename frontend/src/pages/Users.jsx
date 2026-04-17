import React, { useEffect, useState } from 'react';
import { getUsers, createUser } from '../services/api';
import { UserPlus, Phone, MapPin, Pin, X, ChevronRight } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [color, setColor] = useState('#4F46E5');
  const [saving, setSaving] = useState(false);

  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const filteredUsers = users
    .filter(u =>
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.phone.includes(query)
    )
    .sort((a, b) => {
      if (a.is_pinned === b.is_pinned) return 0;
      return a.is_pinned ? -1 : 1;
    });

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createUser({ name, phone, address, background_color: color });
      setShowModal(false);
      setName(''); setPhone(''); setAddress(''); setColor('#4F46E5');
      fetchUsers();
    } catch (err) {
      alert('ফোন নম্বর ইতোমধ্যে ব্যবহৃত হয়েছে বা ত্রুটি হয়েছে।');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="container" style={{ paddingTop: '28px' }}>
        {/* Header */}
        <div className="flex justify-between items-center animate-fade-up" style={{ marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '700', letterSpacing: '-0.4px' }}>ব্যবহারকারী</h2>
            {!loading && <p className="text-sm text-muted" style={{ marginTop: '3px' }}>{filteredUsers.length} জন</p>}
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary"
            style={{
              width: 'auto', padding: '11px 20px', borderRadius: '30px',
              display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem',
            }}
          >
            <UserPlus size={17} /> যোগ করুন
          </button>
        </div>

        {/* List */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[1,2,3].map(i => (
              <div key={i} className="skeleton" style={{ height: '100px', borderRadius: '18px', animationDelay: `${i * 80}ms` }} />
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <p className="text-center text-muted text-sm" style={{ padding: '60px 0' }}>কোনো ব্যবহারকারী পাওয়া যায়নি</p>
        ) : (
          <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {filteredUsers.map((user, i) => {
              const pos = Number(user.total_balance) >= 0;
              return (
                <Link to={`/users/${user.id}`} key={user.id} style={{ display: 'block' }}>
                  <div
                    className="glass-card animate-fade-up"
                    style={{
                      padding: '18px 20px',
                      borderLeft: `3px solid ${user.background_color}`,
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {/* subtle colored glow */}
                    <div style={{
                      position: 'absolute', top: 0, left: 0, bottom: 0, width: '60px',
                      background: `linear-gradient(90deg, ${user.background_color}18, transparent)`,
                      pointerEvents: 'none',
                    }} />

                    <div className="flex justify-between items-start" style={{ position: 'relative' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        {/* Avatar circle */}
                        <div style={{
                          width: '44px', height: '44px', borderRadius: '14px', flexShrink: 0,
                          background: `${user.background_color}28`,
                          border: `1.5px solid ${user.background_color}50`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '1.1rem', fontWeight: '700', color: user.background_color,
                        }}>
                          {user.name[0]}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-main)' }}>{user.name}</h3>
                            {user.is_pinned && <Pin size={13} fill="var(--primary)" color="var(--primary)" />}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted" style={{ marginTop: '3px' }}>
                            <Phone size={12} /> {user.phone}
                          </div>
                          {user.address && (
                            <div className="flex items-center gap-1 text-xs text-muted" style={{ marginTop: '2px' }}>
                              <MapPin size={11} /> {user.address}
                            </div>
                          )}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: '1.1rem', fontWeight: '700', color: pos ? 'var(--secondary)' : 'var(--danger)' }}>
                          {pos ? '+' : '−'} ৳ {Math.abs(user.total_balance || 0).toLocaleString('bn-BD')}
                        </div>
                        <span className="badge" style={{
                          marginTop: '5px',
                          background: pos ? 'var(--secondary-dim)' : 'var(--danger-dim)',
                          color: pos ? 'var(--secondary)' : 'var(--danger)',
                        }}>
                          {pos ? 'পাবো' : 'বাকি'}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="modal-box">
            <div className="flex justify-between items-center" style={{ marginBottom: '22px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700' }}>নতুন ব্যবহারকারী</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'rgba(255,255,255,0.07)', color: 'var(--text-muted)', padding: '7px', borderRadius: '10px', lineHeight: 0 }}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddUser} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <input required className="input-field" placeholder="নাম" value={name} onChange={e => setName(e.target.value)} />
              <input
                required className="input-field"
                placeholder="ফোন নম্বর (শুধুমাত্র সংখ্যা)"
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                type="tel"
                pattern="[0-9]*"
                inputMode="numeric"
              />
              <input className="input-field" placeholder="ঠিকানা (ঐচ্ছিক)" value={address} onChange={e => setAddress(e.target.value)} />

              <div className="flex items-center gap-3" style={{ padding: '4px 0' }}>
                <span className="text-sm text-muted">রঙ:</span>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', overflow: 'hidden', border: `3px solid ${color}80` }}>
                  <input type="color" value={color} onChange={e => setColor(e.target.value)} style={{ border: 'none', width: '46px', height: '46px', margin: '-5px', cursor: 'pointer' }} />
                </div>
                <span style={{ fontSize: '0.8rem', color: color, fontWeight: '600' }}>{color}</span>
              </div>

              <div className="flex gap-3" style={{ marginTop: '8px' }}>
                <button type="button" className="btn-ghost" onClick={() => setShowModal(false)}>বাতিল</button>
                <button type="submit" className="btn-primary" disabled={saving} style={{ opacity: saving ? 0.6 : 1 }}>
                  {saving ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Users;
