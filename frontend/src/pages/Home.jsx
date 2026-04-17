import React, { useEffect, useState } from 'react';
import { getSummary } from '../services/api';
import { ArrowUpRight, ArrowDownRight, Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [data, setData] = useState({ total_balance: 0, recent_activities: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const res = await getSummary();
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const balance = Number(data.total_balance) || 0;
  const isPositive = balance >= 0;

  return (
    <div className="container" style={{ paddingTop: '28px' }}>

      {/* Hero Balance Card */}
      <div
        className="animate-fade-up"
        style={{
          borderRadius: '28px',
          padding: '36px 24px',
          marginBottom: '28px',
          position: 'relative',
          overflow: 'hidden',
          textAlign: 'center',
          background: isPositive
            ? 'linear-gradient(145deg, rgba(16,185,129,0.18) 0%, rgba(16,185,129,0.05) 100%)'
            : 'linear-gradient(145deg, rgba(239,68,68,0.18) 0%, rgba(239,68,68,0.05) 100%)',
          border: `1px solid ${isPositive ? 'rgba(16,185,129,0.35)' : 'rgba(239,68,68,0.35)'}`,
          boxShadow: isPositive
            ? '0 0 60px rgba(16,185,129,0.1), 0 20px 40px rgba(0,0,0,0.3)'
            : '0 0 60px rgba(239,68,68,0.1), 0 20px 40px rgba(0,0,0,0.3)',
        }}
      >
        {/* Glow blobs */}
        <div style={{ position: 'absolute', width: '220px', height: '220px', borderRadius: '50%', background: isPositive ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', filter: 'blur(70px)', top: '-60px', right: '-50px', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: '150px', height: '150px', borderRadius: '50%', background: isPositive ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', filter: 'blur(50px)', bottom: '-40px', left: '-20px', pointerEvents: 'none' }} />

        <p style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '14px', position: 'relative' }}>
          মোট ব্যালেন্স
        </p>

        <div style={{ position: 'relative', animation: 'countUp 0.6s 0.1s ease both' }}>
          <div style={{ fontSize: '3.4rem', fontWeight: '800', color: isPositive ? 'var(--secondary)' : 'var(--danger)', lineHeight: 1.1, letterSpacing: '-2px', textShadow: isPositive ? '0 0 40px rgba(16,185,129,0.4)' : '0 0 40px rgba(239,68,68,0.4)' }}>
            ৳ {Math.abs(balance).toLocaleString('bn-BD')}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '16px', position: 'relative' }}>
          {isPositive ? <TrendingUp size={16} color="var(--secondary)" /> : <TrendingDown size={16} color="var(--danger)" />}
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '4px',
            padding: '5px 14px', borderRadius: '99px', fontWeight: '700', fontSize: '0.85rem',
            background: isPositive ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)',
            color: isPositive ? 'var(--secondary)' : 'var(--danger)',
            border: `1px solid ${isPositive ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}`,
          }}>
            {isPositive ? 'পাবো (Receivable)' : 'দিতে হবে (Payable)'}
          </span>
        </div>
      </div>

      {/* Recent */}
      <div className="flex items-center gap-2" style={{ marginBottom: '16px', animation: 'fadeUp 0.45s 80ms both' }}>
        <Clock size={18} color="var(--text-muted)" />
        <h3 style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          সাম্প্রতিক লেনদেন
        </h3>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[1,2,3].map(i => (
            <div key={i} className="skeleton" style={{ height: '72px', animationDelay: `${i * 80}ms` }} />
          ))}
        </div>
      ) : (
        <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {data.recent_activities.length === 0 ? (
            <p className="text-center text-muted text-sm" style={{ padding: '40px 0' }}>কোনো লেনদেন নেই</p>
          ) : (
            data.recent_activities.map((tx) => {
              const pos = Number(tx.amount) >= 0;
              return (
                <div key={tx.id} className="glass-card animate-fade-up" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0,
                      background: pos ? 'var(--secondary-dim)' : 'var(--danger-dim)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {pos ? <ArrowUpRight size={18} color="var(--secondary)" /> : <ArrowDownRight size={18} color="var(--danger)" />}
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{tx.description || 'বিবরণ নেই'}</div>
                      <div className="text-xs text-muted" style={{ marginTop: '3px' }}>{new Date(tx.date).toLocaleDateString('bn-BD')}</div>
                    </div>
                  </div>
                  <div style={{ color: pos ? 'var(--secondary)' : 'var(--danger)', fontWeight: '700', fontSize: '1.05rem', letterSpacing: '-0.3px', textAlign: 'right', flexShrink: 0 }}>
                    {pos ? '+' : '−'} ৳ {Math.abs(tx.amount).toLocaleString('bn-BD')}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
