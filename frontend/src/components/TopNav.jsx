import React from 'react';
import { Search, BookOpen } from 'lucide-react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';

const TopNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const handleSearch = (e) => {
    const val = e.target.value;
    if (val) {
      navigate(`/users?q=${encodeURIComponent(val)}`);
    } else {
      navigate('/users');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      background: 'rgba(8, 8, 8, 0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      padding: '14px 20px',
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
    }}>
      {/* Logo */}
      <div
        onClick={() => navigate('/')}
        style={{
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexShrink: 0,
        }}
      >
        <div style={{
          width: '34px', height: '34px',
          background: 'var(--primary)',
          borderRadius: '10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 14px rgba(255,0,0,0.35)',
        }}>
          <BookOpen size={18} color="white" />
        </div>
        <span style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)', letterSpacing: '-0.3px' }}>
          টালিখাতা
        </span>
      </div>

      {/* Search */}
      <div style={{ flexGrow: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
        <Search size={16} style={{ position: 'absolute', left: '14px', color: 'var(--text-muted)', pointerEvents: 'none' }} />
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="নাম বা নম্বর খুঁজুন..."
          style={{
            width: '100%',
            padding: '10px 14px 10px 40px',
            borderRadius: '30px',
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.05)',
            color: 'white',
            fontFamily: 'inherit',
            fontSize: '0.9rem',
            outline: 'none',
            transition: 'border-color 0.2s, box-shadow 0.2s',
          }}
          onFocus={e => {
            e.target.style.borderColor = 'rgba(255,0,0,0.4)';
            e.target.style.boxShadow = '0 0 0 3px rgba(255,0,0,0.1)';
          }}
          onBlur={e => {
            e.target.style.borderColor = 'rgba(255,255,255,0.08)';
            e.target.style.boxShadow = 'none';
          }}
        />
      </div>
    </div>
  );
};

export default TopNav;
