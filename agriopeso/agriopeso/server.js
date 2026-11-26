const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
const PORT = 3000;
// Aquí irá el código de actualización y consulta
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const dbConfig = {
  user: 'agropeso_user',
  password: 'TuPassword123!',
  server: 'localhost',
  database: 'agropeso_db',
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

const poolPromise = sql.connect(dbConfig)
  .then((pool) => {
    console.log('Conectado a SQL Server (agropeso_db) correctamente.');
    return pool;
  })
  .catch((err) => {
    console.error('Error conectando a SQL Server:', err.message);
    throw err;
  });

app.get('/api/prueba', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query`
      SELECT DB_NAME() AS base_datos, SYSTEM_USER AS usuario
    `;
    res.json({ ok: true, datos: result.recordset[0] });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.get('/api/pesajes', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query`
      SELECT TOP 20
        id_pesaje,
        id_jornalero,
        id_operador,
        fecha_hora,
        peso_bruto,
        num_arpillas,
        tara_calculada,
        peso_neto,
        estado_sincronizacion,
        tipo_chile,
        calidad,
        precio_por_kilo,
        importe
      FROM dbo.pesaje
      ORDER BY id_pesaje DESC
    `;
    res.json({ ok: true, pesajes: result.recordset });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.post('/api/pesajes', async (req, res) => {
  try {
    const {
      id_jornalero,
      id_operador,
      peso_bruto,
      num_arpillas,
      tara_calculada,
      peso_neto,
      estado_sincronizacion,
      tipo_chile,
      calidad,
      precio_por_kilo,
      importe
    } = req.body;

    const pool = await poolPromise;
    const result = await pool.request()
      .input('id_jornalero', sql.Int, id_jornalero)
      .input('id_operador', sql.Int, id_operador)
      .input('peso_bruto', sql.Decimal(10, 2), peso_bruto)
      .input('num_arpillas', sql.Int, num_arpillas)
      .input('tara_calculada', sql.Decimal(10, 2), tara_calculada)
      .input('peso_neto', sql.Decimal(10, 2), peso_neto)
      .input('estado_sincronizacion', sql.VarChar(50), estado_sincronizacion || 'Sincronizado')
      .input('tipo_chile', sql.VarChar(100), tipo_chile)
      .input('calidad', sql.VarChar(100), calidad)
      .input('precio_por_kilo', sql.Decimal(10, 2), precio_por_kilo)
      .input('importe', sql.Decimal(10, 2), importe)
      .query`
        INSERT INTO dbo.pesaje (
          id_jornalero,
          id_operador,
          fecha_hora,
          peso_bruto,
          num_arpillas,
          tara_calculada,
          peso_neto,
          estado_sincronizacion,
          tipo_chile,
          calidad,
          precio_por_kilo,
          importe
        )
        OUTPUT INSERTED.*
        VALUES (
          @id_jornalero,
          @id_operador,
          GETDATE(),
          @peso_bruto,
          @num_arpillas,
          @tara_calculada,
          @peso_neto,
          @estado_sincronizacion,
          @tipo_chile,
          @calidad,
          @precio_por_kilo,
          @importe
        )
      `;

    res.json({
      ok: true,
      mensaje: 'Pesaje guardado en agropeso_db',
      registro: result.recordset[0]
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
