import React, { useState } from 'react';
import { supabase } from './supabaseClient';

export default function Register({ onRegister }: { onRegister: () => void }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    setSucesso('');
    const { error } = await supabase.auth.signUp({ email, password: senha });
    if (error) setErro(error.message);
    else {
      setSucesso('Cadastro realizado! Verifique seu e-mail para confirmar.');
      setTimeout(onRegister, 2000);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#1b5e20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 350, width: '100%', background: '#fff', padding: 36, borderRadius: 18, boxShadow: '0 4px 32px #0003', alignItems: 'center', position: 'relative' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ background: 'linear-gradient(90deg, #43a047 60%, #2e7d32 100%)', borderRadius: '50%', width: 60, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8, boxShadow: '0 2px 8px #0002' }}>
            <svg width="32" height="32" fill="#fff" viewBox="0 0 24 24"><path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/></svg>
          </div>
          <h2 style={{ textAlign: 'center', color: '#2e7d32', margin: 0, fontWeight: 700, fontSize: '1.6rem', letterSpacing: 1 }}>Cadastro</h2>
        </div>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="E-mail" required style={{ padding: 12, borderRadius: 8, border: '1px solid #bdbdbd', fontSize: '1.08rem', width: '100%' }} />
        <input type="password" value={senha} onChange={e => setSenha(e.target.value)} placeholder="Senha" required style={{ padding: 12, borderRadius: 8, border: '1px solid #bdbdbd', fontSize: '1.08rem', width: '100%' }} />
        <button type="submit" style={{ background: 'linear-gradient(90deg, #43a047 60%, #2e7d32 100%)', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 0', fontWeight: 700, fontSize: '1.08rem', cursor: 'pointer', width: '100%', boxShadow: '0 2px 8px #0001', transition: 'background 0.2s' }}>Cadastrar</button>
        {erro && <div style={{ color: '#c62828', background: '#ffebee', borderRadius: 6, padding: '8px 0', width: '100%', textAlign: 'center', fontWeight: 500, marginTop: 4 }}>{erro}</div>}
        {sucesso && <div style={{ color: '#2e7d32', background: '#e8f5e9', borderRadius: 6, padding: '8px 0', width: '100%', textAlign: 'center', fontWeight: 500, marginTop: 4 }}>{sucesso}</div>}
      </form>
    </div>
  );
} 