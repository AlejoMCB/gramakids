import React from 'react';
import { AuthService } from '../services/authService';

const UserInfo = ({ user, userData, onLogout }) => {
  const handleLogout = async () => {
    const result = await AuthService.logout();
    if (result.success) {
      onLogout();
    }
  };

  if (!user) return null;

  return (
    <div className="user-info">
      <span>👤 {user.email}</span>
      {userData?.premium && (
        <span className="premium-badge">PREMIUM</span>
      )}
      <button onClick={handleLogout} className="logout-btn">
        Cerrar Sesión
      </button>
    </div>
  );
};

export default UserInfo;