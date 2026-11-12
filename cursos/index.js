import express from 'express';
import mongoose from 'mongoose';

const MONGO_URL = process.env.MONGO_URL ?? 'mongodb://localhost:27017/academia';
const app = express();

const Curso = mongoose.model('Curso', new mongoose.Schema({
  nombre: String,
  creditos: Number
}));

app.get('/', (_req, res) => {
  res.json({ servicio: 'cursos', estado: 'ok' });
});

app.get('/cursos', async (_req, res) => {
  res.json(await Curso.find());
});

// Cada visita crea un curso de ejemplo, como indica el laboratorio.
app.get('/cursos/demo', async (_req, res) => {
  const curso = await Curso.create({ nombre: 'Desarrollo Web', creditos: 4 });
  res.status(201).json(curso);
});

app.use((error, _req, res, _next) => {
  console.error(error.message);
  res.status(500).json({ error: 'No se pudo completar la consulta a MongoDB' });
});

try {
  await mongoose.connect(MONGO_URL);
  console.log('Conectado a MongoDB');
  app.listen(3000, () => console.log('Cursos: http://localhost:3000'));
} catch (error) {
  console.error('No se pudo conectar a MongoDB:', error.message);
  process.exit(1);
}
