import { useEffect, useState } from 'react';
import axios from 'axios';

interface Registro {
  id: string;
  data: string;
  horario_inicio: string;
  horario_fim: string;
  horimetro_inicial: number;
  horimetro_final: number;
  operador: string;
  codigo_maquina: string;
  atividade: string;
  talhao: string;
  linhas_feitas: number;
  criado_em: string;
}

function getAnoMes(dateStr: string) {
  const d = new Date(dateStr);
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
}

export default function RegistrosTable() {
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [filtros, setFiltros] = useState({ data: '', operador: '', codigo_maquina: '' });
  const [loading, setLoading] = useState(false);
  const [talhaoSelecionado, setTalhaoSelecionado] = useState('');
  const [maquinaSelecionada, setMaquinaSelecionada] = useState('');
  const [horasMaquinaTalhao, setHorasMaquinaTalhao] = useState<number | null>(null);
  const [mesSelecionado, setMesSelecionado] = useState('');
  const [diaSelecionado, setDiaSelecionado] = useState('');
  const [editando, setEditando] = useState<Registro | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  useEffect(() => {
    buscarRegistros();
    // eslint-disable-next-line
  }, [filtros]);

  async function buscarRegistros() {
    setLoading(true);
    try {
      const params: any = {};
      if (filtros.data) params.data = filtros.data;
      if (filtros.operador) params.operador = filtros.operador;
      if (filtros.codigo_maquina) params.codigo_maquina = filtros.codigo_maquina;
      const { data } = await axios.get(' https://registro-horimetros.onrender.com/registros', { params });
      setRegistros(data);
    } catch (err) {
      setRegistros([]);
    } finally {
      setLoading(false);
    }
  }

  // Calculadora de horas por máquina em talhão, mês e dia
  function calcularHorasMaquinaTalhao() {
    if (!talhaoSelecionado || !maquinaSelecionada) {
      setHorasMaquinaTalhao(null);
      return;
    }
    let registrosFiltrados = registros.filter(r => r.talhao === talhaoSelecionado && r.codigo_maquina === maquinaSelecionada);
    if (diaSelecionado) {
      registrosFiltrados = registrosFiltrados.filter(r => {
        const dataRegistro = new Date(r.data).toISOString().slice(0, 10);
        return dataRegistro === diaSelecionado;
      });
    } else if (mesSelecionado) {
      registrosFiltrados = registrosFiltrados.filter(r => getAnoMes(r.data) === mesSelecionado);
    }
    const total = registrosFiltrados.reduce((acc, r) => acc + (r.horimetro_final - r.horimetro_inicial), 0);
    setHorasMaquinaTalhao(total);
  }

  // Lista única de talhões, máquinas e meses disponíveis
  const talhoes = Array.from(new Set(registros.map(r => r.talhao))).filter(t => t);
  const maquinasNoTalhao = talhaoSelecionado
    ? Array.from(new Set(registros.filter(r => r.talhao === talhaoSelecionado).map(r => r.codigo_maquina))).filter(m => m)
    : [];
  const mesesDisponiveis = Array.from(new Set(
    registros
      .filter(r => r.talhao === talhaoSelecionado && r.codigo_maquina === maquinaSelecionada)
      .map(r => getAnoMes(r.data))
  ));

  async function excluirRegistro(id: string) {
    if (!window.confirm('Tem certeza que deseja excluir este registro?')) return;
    try {
      await axios.delete(`https://registro-horimetros.onrender.com/registros/${id}`);
      setRegistros(registros.filter(r => r.id !== id));
    } catch (err) {
      alert('Erro ao excluir registro.');
    }
  }

  function editarRegistro(registro: Registro) {
    setEditando(registro);
    setEditForm({ ...registro });
  }

  async function salvarEdicao() {
    try {
      await axios.put(`https://registro-horimetros.onrender.com/registros/${editando!.id}`, {
        ...editForm,
        horimetro_inicial: parseFloat(editForm.horimetro_inicial),
        horimetro_final: parseFloat(editForm.horimetro_final),
        linhas_feitas: parseInt(editForm.linhas_feitas),
      });
      setRegistros(registros.map(r => r.id === editando!.id ? { ...r, ...editForm } : r));
      setEditando(null);
    } catch (err) {
      alert('Erro ao salvar edição.');
    }
  }

  return (
    <div style={{ minHeight: '100vh', width: '100vw', background: '#1b5e20', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 0' }}>
      <h2 style={{ textAlign: 'center', color: '#fff', marginBottom: 24 }}>Registros de Horímetro</h2>
      {/* Calculadora de horas por máquina em talhão, mês e dia */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, flexWrap: 'wrap', justifyContent: 'center', background: '#e6f4ea', padding: 16, borderRadius: 8, width: '100%', maxWidth: 1100 }}>
        <span style={{ fontWeight: 600, color: '#2e7d32' }}>Calcular horas por máquina em talhão:</span>
        <select value={talhaoSelecionado} onChange={e => { setTalhaoSelecionado(e.target.value); setMaquinaSelecionada(''); setMesSelecionado(''); setDiaSelecionado(''); setHorasMaquinaTalhao(null); }} style={{ padding: 8, borderRadius: 6, border: '1px solid #bdbdbd', minWidth: 120 }}>
          <option value="">Selecione o talhão</option>
          {talhoes.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={maquinaSelecionada} onChange={e => { setMaquinaSelecionada(e.target.value); setMesSelecionado(''); setDiaSelecionado(''); setHorasMaquinaTalhao(null); }} style={{ padding: 8, borderRadius: 6, border: '1px solid #bdbdbd', minWidth: 120 }} disabled={!talhaoSelecionado}>
          <option value="">Selecione a máquina</option>
          {maquinasNoTalhao.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <select value={mesSelecionado} onChange={e => { setMesSelecionado(e.target.value); setDiaSelecionado(''); setHorasMaquinaTalhao(null); }} style={{ padding: 8, borderRadius: 6, border: '1px solid #bdbdbd', minWidth: 120 }} disabled={!maquinaSelecionada}>
          <option value="">Todos os meses</option>
          {mesesDisponiveis.map(m => <option key={m} value={m}>{m.split('-')[1] + '/' + m.split('-')[0]}</option>)}
        </select>
        <input type="date" value={diaSelecionado} onChange={e => { setDiaSelecionado(e.target.value); setHorasMaquinaTalhao(null); }} style={{ padding: 8, borderRadius: 6, border: '1px solid #bdbdbd', minWidth: 140 }} disabled={!maquinaSelecionada} />
        <button onClick={calcularHorasMaquinaTalhao} style={{ background: '#2e7d32', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, cursor: 'pointer' }}>Calcular</button>
        {horasMaquinaTalhao !== null && (
          <span style={{ marginLeft: 16, fontWeight: 600, color: '#1b5e20', fontSize: '1.1rem' }}>
            Total: {horasMaquinaTalhao.toFixed(2)} horas
          </span>
        )}
      </div>
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, justifyContent: 'center', flexWrap: 'wrap', background: '#e6f4ea', padding: 16, borderRadius: 8 }}>
        <input type="date" value={filtros.data} onChange={e => setFiltros(f => ({ ...f, data: e.target.value }))} style={{ padding: 8, borderRadius: 6, border: '1px solid #bdbdbd', minWidth: 140 }} />
        <input placeholder="Operador" value={filtros.operador} onChange={e => setFiltros(f => ({ ...f, operador: e.target.value }))} style={{ padding: 8, borderRadius: 6, border: '1px solid #bdbdbd', minWidth: 140 }} />
        <input placeholder="Código Máquina" value={filtros.codigo_maquina} onChange={e => setFiltros(f => ({ ...f, codigo_maquina: e.target.value }))} style={{ padding: 8, borderRadius: 6, border: '1px solid #bdbdbd', minWidth: 140 }} />
        <button onClick={buscarRegistros} disabled={loading} style={{ background: '#2e7d32', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 24px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 2px 8px #0001', transition: 'background 0.2s' }}>{loading ? 'Filtrando...' : 'Filtrar'}</button>
      </div>
      <div style={{ width: '100%', overflowX: 'auto', borderRadius: 8, boxShadow: '0 1px 4px #0001', background: '#fff' }}>
        <table style={{ width: '100%', minWidth: 1200, borderCollapse: 'separate', borderSpacing: 0, tableLayout: 'fixed', margin: '0 auto' }}>
          <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
            <tr style={{ background: '#2e7d32', color: '#fff' }}>
              <th style={{ padding: 12, width: 90, borderTopLeftRadius: 12 }}>Data</th>
              <th style={{ padding: 12, width: 90 }}>Início</th>
              <th style={{ padding: 12, width: 90 }}>Horímetro Inicial</th>
              <th style={{ padding: 12, width: 90 }}>Fim</th>
              <th style={{ padding: 12, width: 90 }}>Horímetro Final</th>
              <th style={{ padding: 12, width: 120 }}>Operador</th>
              <th style={{ padding: 12, width: 120 }}>Código Máquina</th>
              <th style={{ padding: 12, width: 160, whiteSpace: 'normal' }}>Atividade</th>
              <th style={{ padding: 12, width: 90 }}>Talhão</th>
              <th style={{ padding: 12, width: 90 }}>Linhas</th>
              <th style={{ padding: 12, width: 120 }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {registros.length === 0 && (
              <tr><td colSpan={12} style={{ textAlign: 'center', padding: 24, color: '#888' }}>Nenhum registro encontrado.</td></tr>
            )}
            {registros.map((r, idx) => (
              <tr key={r.id} style={{ background: idx % 2 === 0 ? '#f7faf7' : '#e6f4ea', transition: 'background 0.2s' }}>
                <td style={{ padding: 10, textAlign: 'center' }}>{new Date(r.data).toLocaleDateString()}</td>
                <td style={{ padding: 10, textAlign: 'center' }}>{r.horario_inicio}</td>
                <td style={{ padding: 10, textAlign: 'center' }}>{r.horimetro_inicial}</td>
                <td style={{ padding: 10, textAlign: 'center' }}>{r.horario_fim}</td>
                <td style={{ padding: 10, textAlign: 'center' }}>{r.horimetro_final}</td>
                <td style={{ padding: 10, wordBreak: 'break-word', maxWidth: 120, textAlign: 'center' }}>{r.operador}</td>
                <td style={{ padding: 10, wordBreak: 'break-word', maxWidth: 120, textAlign: 'center' }}>{r.codigo_maquina}</td>
                <td style={{ padding: 10, wordBreak: 'break-word', maxWidth: 160, textAlign: 'center' }}>{r.atividade}</td>
                <td style={{ padding: 10, textAlign: 'center' }}>{r.talhao}</td>
                <td style={{ padding: 10, textAlign: 'center' }}>{r.linhas_feitas}</td>
                <td style={{ padding: 10, textAlign: 'center' }}>
                  <button onClick={() => editarRegistro(r)} style={{ marginRight: 8, background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 12px', cursor: 'pointer' }}>Editar</button>
                  <button onClick={() => excluirRegistro(r.id)} style={{ background: '#c62828', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 12px', cursor: 'pointer' }}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Modal de edição */}
        {editando && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0008', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
            <form onSubmit={e => { e.preventDefault(); salvarEdicao(); }} style={{ background: '#fff', padding: 32, borderRadius: 12, minWidth: 320, boxShadow: '0 4px 24px #0003', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <h3 style={{ textAlign: 'center', color: '#2e7d32' }}>Editar Registro</h3>
              <input name="data" type="date" value={editForm.data} onChange={e => setEditForm({ ...editForm, data: e.target.value })} required />
              <input name="horario_inicio" type="time" value={editForm.horario_inicio} onChange={e => setEditForm({ ...editForm, horario_inicio: e.target.value })} required />
              <input name="horimetro_inicial" type="number" step="0.1" value={editForm.horimetro_inicial} onChange={e => setEditForm({ ...editForm, horimetro_inicial: e.target.value })} required placeholder="Horímetro inicial" />
              <input name="horario_fim" type="time" value={editForm.horario_fim} onChange={e => setEditForm({ ...editForm, horario_fim: e.target.value })} required />
              <input name="horimetro_final" type="number" step="0.1" value={editForm.horimetro_final} onChange={e => setEditForm({ ...editForm, horimetro_final: e.target.value })} required placeholder="Horímetro final" />
              <input name="codigo_maquina" value={editForm.codigo_maquina} onChange={e => setEditForm({ ...editForm, codigo_maquina: e.target.value })} required placeholder="Código da máquina" />
              <input name="atividade" value={editForm.atividade} onChange={e => setEditForm({ ...editForm, atividade: e.target.value })} required placeholder="Atividade" />
              <input name="talhao" value={editForm.talhao} onChange={e => setEditForm({ ...editForm, talhao: e.target.value })} required placeholder="Talhão" />
              <input name="linhas_feitas" type="number" value={editForm.linhas_feitas} onChange={e => setEditForm({ ...editForm, linhas_feitas: e.target.value })} placeholder="Linhas feitas" />
              <input name="operador" value={editForm.operador} onChange={e => setEditForm({ ...editForm, operador: e.target.value })} required placeholder="Nome do operador" />
              <div style={{ display: 'flex', gap: 12, marginTop: 8, justifyContent: 'center' }}>
                <button type="submit" style={{ background: '#2e7d32', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 24px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}>Salvar</button>
                <button type="button" onClick={() => setEditando(null)} style={{ background: '#c62828', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 24px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}>Cancelar</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
} 