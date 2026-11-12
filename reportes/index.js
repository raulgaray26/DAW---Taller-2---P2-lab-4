import express from 'express';

const CURSOS_URL = process.env.CURSOS_URL ?? 'http://localhost:3000';
const app = express();

app.get('/', (_req, res) => {
  res.json({ servicio: 'reportes', estado: 'ok' });
});

app.get('/resumen', async (_req, res) => {
  try {
    const respuesta = await fetch(`${CURSOS_URL}/cursos`, {
      signal: AbortSignal.timeout(5000)
    });
    if (!respuesta.ok) throw new Error('El servicio de cursos no responde');
    const cursos = await respuesta.json();
    res.json({
      totalCursos: cursos.length,
      totalCreditos: cursos.reduce((suma, curso) => suma + curso.creditos, 0)
    });
  } catch {
    res.status(503).json({ error: 'El servicio de cursos no responde' });
  }
});

app.listen(4000, () => console.log('Reportes: http://localhost:4000'));
