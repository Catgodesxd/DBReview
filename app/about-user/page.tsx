'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { deleteCookie } from 'cookies-next';
import BackButton from "@/components/BackButton";

export default function UserProfile() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const res = await fetch('/api/user/profile');
        const data = await res.json();
        setUsername(data.username);
      } catch (err) {
        setError('Failed to fetch username');
      }
    };

    fetchUsername();
  }, []);

  const handlePasswordChange = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await res.json();

      if (data.success) {
        setSuccess('Password updated successfully');
        setCurrentPassword('');
        setNewPassword('');
      } else {
        setError(data.error || 'Failed to update password');
      }
    } catch (err) {
      setError('An error occurred');
    }
  };

  const handleAccountDeletion = async () => {
    const confirmDeletion = window.confirm('Are you sure? This cannot be undone.');
    
    if (confirmDeletion) {
      try {
        const res = await fetch('/api/user/delete-account', { method: 'DELETE' });
        const data = await res.json();

        if (data.success) {
          deleteCookie('token');
          deleteCookie('username');
          router.push('/');
        } else {
          setError(data.error || 'Failed to delete account');
        }
      } catch (err) {
        setError('An error occurred');
      }
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/logout', { method: 'POST' });
      const data = await res.json();

      if (res.ok) {
        deleteCookie('token');
        deleteCookie('username');
        router.push('/');
      } else {
        setError(data.error || 'Failed to logout');
      }
    } catch (err) {
      setError('An error occurred');
    }
  };

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '50px auto', 
      padding: '30px', 
      backgroundColor: 'black', 
      color: 'white',
      borderRadius: '15px',
      boxShadow: '0 4px 6px rgba(255,255,255,0.1)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ 
          fontSize: '24px', 
          marginBottom: '10px',
          borderBottom: '1px solid white',
          paddingBottom: '10px'
        }}>
          {username}
        </h1>
      </div>

      {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '20px' }}>{error}</div>}
      {success && <div style={{ color: 'green', textAlign: 'center', marginBottom: '20px' }}>{success}</div>}

      <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="password" 
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Current Password"
          style={{
            padding: '10px',
            backgroundColor: 'black',
            color: 'white',
            border: '1px solid white',
            borderRadius: '5px'
          }}
          required
        />
        <input 
          type="password" 
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New Password"
          style={{
            padding: '10px',
            backgroundColor: 'black',
            color: 'white',
            border: '1px solid white',
            borderRadius: '5px'
          }}
          required
        />
        <button 
          type="submit" 
          style={{
            padding: '10px',
            backgroundColor: 'black',
            color: 'white',
            border: '1px solid white',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'background-color 0.3s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'black'}
        >
          Change Password
        </button>
      </form>

      <button 
        onClick={handleAccountDeletion}
        style={{
          width: '100%',
          marginTop: '20px',
          padding: '10px',
          backgroundColor: 'black',
          color: 'red',
          border: '1px solid red',
          borderRadius: '5px',
          cursor: 'pointer',
          transition: 'background-color 0.3s'
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,0,0,0.1)'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'black'}
      >
        Delete Account
      </button>

      <button 
        onClick={handleLogout}
        style={{
          width: '100%',
          marginTop: '10px',
          padding: '10px',
          backgroundColor: 'black',
          color: 'white',
          border: '1px solid white',
          borderRadius: '5px',
          cursor: 'pointer',
          transition: 'background-color 0.3s'
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'black'}
      >
        Logout
      </button>

      <BackButton />
    </div>
  );
}
