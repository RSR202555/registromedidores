import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import type { User, AuthChangeEvent, Session } from '@supabase/supabase-js';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import RegistroForm from './RegistroForm';
import RegistrosTable from './RegistrosTable';

function ProtectedRoute({ user, children }: { user: User | null, children: React.ReactNode }) {
  if (!user) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}

// Exemplo de página administrativa
function AdminPanel() {
  return (
    <div style={{ padding: 32, background: '#fff', borderRadius: 12, maxWidth: 900, margin: '40px auto' }}>
      <h2 style={{ color: '#2e7d32', textAlign: 'center' }}>Painel Administrativo</h2>
      <RegistrosTable />
      {/* Aqui você pode adicionar funções extras para admin, como exportação, edição, etc. */}
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }: { data: { session: Session | null } }) => setUser(data.session?.user ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ?? null);
    });
    return () => { listener?.subscription.unsubscribe(); };
  }, []);

  function handleLogout() {
    supabase.auth.signOut();
  }

  return (
    <Router>
      <div style={{ minHeight: '100vh', background: '#1b5e20' }}>
        {/* Navegação só para admin logado */}
        {user && (
          <>
            <button onClick={handleLogout} style={{ position: 'absolute', right: 24, top: 8, background: '#2e7d32', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, cursor: 'pointer' }}>Sair</button>
          </>
        )}
        <Routes>
          {/* Rotas públicas */}
          <Route path="/registrar" element={<RegistroForm />} />
          <Route path="/visualizar" element={<RegistrosTable />} />
          {/* Rotas admin */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<ProtectedRoute user={user}><AdminPanel /></ProtectedRoute>} />
          {/* Redirecionamento padrão */}
          <Route path="*" element={<Navigate to="/visualizar" replace />} />
        </Routes>
      </div>
    </Router>
  );
} 