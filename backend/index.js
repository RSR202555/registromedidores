const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

console.log('URL:', process.env.SUPABASE_URL);
console.log('KEY:', process.env.SUPABASE_KEY ? 'OK' : 'FALTA');

// Criar registro
app.post('/registros', async (req, res) => {
  const { data, horario_inicio, horario_fim, horimetro_inicial, horimetro_final, operador, codigo_maquina, atividade, talhao, linhas_feitas } = req.body;
  const { error } = await supabase
    .from('registros')
    .insert([{ data, horario_inicio, horario_fim, horimetro_inicial, horimetro_final, operador, codigo_maquina, atividade, talhao, linhas_feitas }]);
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json({ message: 'Registro criado com sucesso!' });
});

// Listar registros com filtros
app.get('/registros', async (req, res) => {
  let query = supabase.from('registros').select('*');
  const { data, operador, codigo_maquina } = req.query;
  if (data) query = query.eq('data', data);
  if (operador) query = query.ilike('operador', `%${operador}%`);
  if (codigo_maquina) query = query.ilike('codigo_maquina', `%${codigo_maquina}%`);
  const { data: registros, error } = await query.order('data', { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  res.json(registros);
});

// Deletar registro
app.delete('/registros/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('registros').delete().eq('id', id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Registro excluído com sucesso!' });
});

// Editar registro
app.put('/registros/:id', async (req, res) => {
  const { id } = req.params;
  const dados = req.body;
  const { error } = await supabase.from('registros').update(dados).eq('id', id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Registro atualizado com sucesso!' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`)); 