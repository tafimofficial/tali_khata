import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users } from 'lucide-react';

const BottomNav = () => {
  return (
    <div style={{
      position: 'fixed',
      bottom: 0, left: 0, right: 0,
      background: 'rgba(8, 8, 8, 0.9)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(255,255,255,0.07)',
      display: 'flex',
      justifyContent: 'space-around',
      padding: '10px 0',
      paddingBottom: 'calc(10px + env(safe-area-inset-bottom))',
      zIndex: 50,
    }}>
      {[
        { to: '/', Icon: Home, label: 'হোম' },
        { to: '/users', Icon: Users, label: 'ব্যবহারকারী' },
      ].map(({ to, Icon, label }) => (
        <NavLink key={to} to={to} end style={({ isActive }) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          padding: '8px 28px',
          borderRadius: '14px',
          color: isActive ? 'var(--primary)' : 'var(--text-muted)',
          fontWeight: isActive ? '600' : '400',
          fontSize: '0.75rem',
          transition: 'color 0.2s',
          background: isActive ? 'rgba(255,0,0,0.08)' : 'transparent',
        })}>
          {({ isActive }) => (
            <>
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} style={{ transition: 'transform 0.2s', transform: isActive ? 'scale(1.1)' : 'scale(1)' }} />
              <span>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </div>
  );
};

export default BottomNav;
