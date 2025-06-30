import React, { useState } from 'react';

interface LoginPageProps {
  onLogin: (operador: string) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [nome, setNome] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (nome.trim()) {
      localStorage.setItem('operador', nome.trim());
      onLogin(nome.trim());
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 80 }}>
      <h2>Login do Operador</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 240 }}>
        <input
          type="text"
          placeholder="Nome do operador"
          value={nome}
          onChange={e => setNome(e.target.value)}
          required
        />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
} 