import React, { useState } from 'react';
import axios from 'axios';
import { FaTractor } from 'react-icons/fa';

interface RegistroFormProps {
  operador?: string;
  onRegistroSalvo?: () => void;
}

export default function RegistroForm({ onRegistroSalvo }: RegistroFormProps) {
  const [form, setForm] = useState({
    data: '',
    horario_inicio: '',
    horario_fim: '',
    horimetro_inicial: '',
    horimetro_final: '',
    codigo_maquina: '',
    atividade: '',
    talhao: '',
    linhas_feitas: '',
    operador: '',
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [focus, setFocus] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    try {
      await axios.post(' https://registro-horimetros.onrender.com/registros', {
        ...form,
        horimetro_inicial: parseFloat(form.horimetro_inicial),
        horimetro_final: parseFloat(form.horimetro_final),
        linhas_feitas: parseInt(form.linhas_feitas),
      }, {
        timeout: 10000 // 10 segundos
      });
      setMsg('Registro salvo com sucesso!');
      setForm({
        data: '', horario_inicio: '', horario_fim: '', horimetro_inicial: '', horimetro_final: '', codigo_maquina: '', atividade: '', talhao: '', linhas_feitas: '', operador: '',
      });
      if (onRegistroSalvo) onRegistroSalvo();
    } catch (err: any) {
      if (err.code === 'ECONNABORTED') {
        setMsg('Tempo de espera excedido. Tente novamente.');
      } else {
        setMsg('Erro ao salvar registro.');
      }
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = (name: string) => ({
    border: focus === name ? '2px solid #43a047' : '1px solid #bdbdbd',
    outline: 'none',
    boxShadow: focus === name ? '0 0 0 2px #a5d6a7' : undefined,
    transition: 'border 0.2s, box-shadow 0.2s',
    background: '#fff',
    color: '#222',
    marginBottom: 6,
  });

  return (
    <div style={{ minHeight: '100vh', width: '100vw', background: '#1b5e20', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 0' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 420, width: '100%', background: '#fff', padding: 32, borderRadius: 18, boxShadow: '0 4px 24px #0002', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ background: 'linear-gradient(90deg, #43a047 60%, #2e7d32 100%)', borderRadius: '50%', width: 54, height: 54, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8, boxShadow: '0 2px 8px #0002' }}>
            <FaTractor size={32} color="#fff" />
          </div>
          <h2 style={{ textAlign: 'center', marginBottom: 6, letterSpacing: 1 }}>Registrar Horímetro</h2>
          <span style={{ color: '#388e3c', fontSize: '1rem', textAlign: 'center', marginBottom: 4, fontWeight: 500 }}>Preencha os dados do trabalho realizado no campo abaixo</span>
        </div>
        <input name="data" type="date" value={form.data} onChange={handleChange} onFocus={()=>setFocus('data')} onBlur={()=>setFocus(null)} required style={{...inputStyle('data'), marginBottom: 4, borderRadius: 10, fontSize: '1.08rem', color: '#222', background: '#fafafa', boxShadow: focus==='data' ? '0 0 0 2px #a5d6a7' : undefined, border: focus==='data' ? '2px solid #43a047' : '1px solid #bdbdbd'}} />
        <input name="horario_inicio" type="time" value={form.horario_inicio} onChange={handleChange} onFocus={()=>setFocus('horario_inicio')} onBlur={()=>setFocus(null)} required style={{...inputStyle('horario_inicio'), marginBottom: 4, borderRadius: 10, fontSize: '1.08rem', color: '#222', background: '#fafafa', boxShadow: focus==='horario_inicio' ? '0 0 0 2px #a5d6a7' : undefined, border: focus==='horario_inicio' ? '2px solid #43a047' : '1px solid #bdbdbd'}} />
        <input name="horimetro_inicial" type="number" step="0.1" value={form.horimetro_inicial} onChange={handleChange} onFocus={()=>setFocus('horimetro_inicial')} onBlur={()=>setFocus(null)} required placeholder="Horímetro inicial" style={{...inputStyle('horimetro_inicial'), marginBottom: 4, borderRadius: 10, fontSize: '1.08rem', color: '#222', background: '#fafafa', boxShadow: focus==='horimetro_inicial' ? '0 0 0 2px #a5d6a7' : undefined, border: focus==='horimetro_inicial' ? '2px solid #43a047' : '1px solid #bdbdbd'}} />
        <input name="horario_fim" type="time" value={form.horario_fim} onChange={handleChange} onFocus={()=>setFocus('horario_fim')} onBlur={()=>setFocus(null)} required style={{...inputStyle('horario_fim'), marginBottom: 4, borderRadius: 10, fontSize: '1.08rem', color: '#222', background: '#fafafa', boxShadow: focus==='horario_fim' ? '0 0 0 2px #a5d6a7' : undefined, border: focus==='horario_fim' ? '2px solid #43a047' : '1px solid #bdbdbd'}} />
        <input name="horimetro_final" type="number" step="0.1" value={form.horimetro_final} onChange={handleChange} onFocus={()=>setFocus('horimetro_final')} onBlur={()=>setFocus(null)} required placeholder="Horímetro final" style={{...inputStyle('horimetro_final'), marginBottom: 4, borderRadius: 10, fontSize: '1.08rem', color: '#222', background: '#fafafa', boxShadow: focus==='horimetro_final' ? '0 0 0 2px #a5d6a7' : undefined, border: focus==='horimetro_final' ? '2px solid #43a047' : '1px solid #bdbdbd'}} />
        <input name="codigo_maquina" value={form.codigo_maquina} onChange={handleChange} onFocus={()=>setFocus('codigo_maquina')} onBlur={()=>setFocus(null)} required placeholder="Código da máquina" style={{...inputStyle('codigo_maquina'), marginBottom: 4, borderRadius: 10, fontSize: '1.08rem', color: '#222', background: '#fafafa', boxShadow: focus==='codigo_maquina' ? '0 0 0 2px #a5d6a7' : undefined, border: focus==='codigo_maquina' ? '2px solid #43a047' : '1px solid #bdbdbd'}} />
        <input name="atividade" value={form.atividade} onChange={handleChange} onFocus={()=>setFocus('atividade')} onBlur={()=>setFocus(null)} required placeholder="Atividade" style={{...inputStyle('atividade'), marginBottom: 4, borderRadius: 10, fontSize: '1.08rem', color: '#222', background: '#fafafa', boxShadow: focus==='atividade' ? '0 0 0 2px #a5d6a7' : undefined, border: focus==='atividade' ? '2px solid #43a047' : '1px solid #bdbdbd'}} />
        <input name="talhao" value={form.talhao} onChange={handleChange} onFocus={()=>setFocus('talhao')} onBlur={()=>setFocus(null)} required placeholder="Talhão" style={{...inputStyle('talhao'), marginBottom: 4, borderRadius: 10, fontSize: '1.08rem', color: '#222', background: '#fafafa', boxShadow: focus==='talhao' ? '0 0 0 2px #a5d6a7' : undefined, border: focus==='talhao' ? '2px solid #43a047' : '1px solid #bdbdbd'}} />
        <input name="linhas_feitas" type="number" value={form.linhas_feitas} onChange={handleChange} onFocus={()=>setFocus('linhas_feitas')} onBlur={()=>setFocus(null)} placeholder="Linhas feitas" style={{...inputStyle('linhas_feitas'), marginBottom: 4, borderRadius: 10, fontSize: '1.08rem', color: '#222', background: '#fafafa', boxShadow: focus==='linhas_feitas' ? '0 0 0 2px #a5d6a7' : undefined, border: focus==='linhas_feitas' ? '2px solid #43a047' : '1px solid #bdbdbd'}} />
        <input name="operador" value={form.operador} onChange={handleChange} onFocus={()=>setFocus('operador')} onBlur={()=>setFocus(null)} required placeholder="Nome do operador" style={{...inputStyle('operador'), marginBottom: 12, borderRadius: 10, fontSize: '1.08rem', color: '#222', background: '#fafafa', boxShadow: focus==='operador' ? '0 0 0 2px #a5d6a7' : undefined, border: focus==='operador' ? '2px solid #43a047' : '1px solid #bdbdbd'}} />
        <button type="submit" disabled={loading} style={{
          background: loading ? '#a5d6a7' : 'linear-gradient(90deg, #43a047 60%, #2e7d32 100%)',
          color: '#fff',
          border: 'none',
          borderRadius: 10,
          padding: '14px 0',
          fontSize: '1.1rem',
          fontWeight: 700,
          marginTop: 10,
          boxShadow: '0 2px 8px #0002',
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'background 0.2s, box-shadow 0.2s',
        }}
        onMouseOver={e => e.currentTarget.style.background = '#388e3c'}
        onMouseOut={e => e.currentTarget.style.background = loading ? '#a5d6a7' : 'linear-gradient(90deg, #43a047 60%, #2e7d32 100%)'}
        >{loading ? 'Salvando...' : 'Salvar'}</button>
        {msg && <div style={{ marginTop: 12, color: msg.includes('sucesso') ? '#2e7d32' : 'red', textAlign: 'center', fontWeight: 500 }}>{msg}</div>}
      </form>
    </div>
  );
} 