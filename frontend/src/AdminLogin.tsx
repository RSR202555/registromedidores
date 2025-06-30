import React, { useState } from 'react';

interface AdminLoginProps {
  onLogin: () => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (senha === 'admin123') {
      onLogin();
      setErro('');
    } else {
      setErro('Senha incorreta!');
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e6f4ea' }}>
      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: 32, borderRadius: 12, boxShadow: '0 2px 16px #0002', display: 'flex', flexDirection: 'column', gap: 16, minWidth: 320 }}>
        <h2 style={{ textAlign: 'center', color: '#2e7d32' }}>Acesso Administrativo</h2>
        <input type="password" placeholder="Senha do admin" value={senha} onChange={e => setSenha(e.target.value)} style={{ padding: 10, borderRadius: 6, border: '1px solid #bdbdbd', fontSize: '1.1rem' }} />
        <button type="submit" style={{ background: 'linear-gradient(90deg, #43a047 60%, #2e7d32 100%)', color: '#fff', border: 'none', borderRadius: 6, padding: '12px 0', fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer' }}>Entrar</button>
        {erro && <div style={{ color: 'red', textAlign: 'center' }}>{erro}</div>}
      </form>
    </div>
  );
} 