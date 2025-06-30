import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import Register from './Register';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [showRegister, setShowRegister] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
    if (error) setErro(error.message);
    else window.location.href = '/visualizar';
  }

  if (showRegister) return <Register onRegister={() => setShowRegister(false)} />;

  return (
    <div style={{ minHeight: '100vh', background: '#1b5e20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320, background: '#fff', padding: 32, borderRadius: 12, boxShadow: '0 2px 16px #0002' }}>
        <h2 style={{ textAlign: 'center', color: '#2e7d32' }}>Login</h2>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="E-mail" required />
        <input type="password" value={senha} onChange={e => setSenha(e.target.value)} placeholder="Senha" required />
        <button type="submit" style={{ background: '#2e7d32', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 0', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}>Entrar</button>
        <span style={{ textAlign: 'center', marginTop: 8 }}>
          Não tem conta? <button type="button" style={{ background: 'none', color: '#2e7d32', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontWeight: 600 }} onClick={() => setShowRegister(true)}>Cadastre-se</button>
        </span>
        {erro && <div style={{ color: 'red', textAlign: 'center' }}>{erro}</div>}
      </form>
    </div>
  );
} 