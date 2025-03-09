const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Base de datos simulada
let guitars = [];

// Validación de los datos de la guitarra
const validateGuitarData = (data) => {
  const { brand, model, year, type, color, price, description, serial } = data;
  if (!brand || !model || !year || !type || !color || !price || !description || !serial) {
    return "Todos los campos son obligatorios";
  }
  if (typeof price !== 'number' || price <= 0) {
    return "El precio debe ser un número positivo";
  }
  if (typeof year !== 'number' || year < 1900 || year > new Date().getFullYear()) {
    return "El año debe ser un número válido";
  }
  return null;
};

// Crear nueva guitarra
app.post('/api/guitars', (req, res) => {
  const error = validateGuitarData(req.body);
  if (error) {
    return res.status(400).json({ error });
  }

  guitars.push(req.body);
  res.status(201).json({ message: 'Guitarra registrada correctamente', guitar: req.body });
});

// Obtener todas las guitarras
app.get('/api/guitars', (req, res) => {
  res.json(guitars);
});

// Iniciar servidor
const port = 5000;
app.listen(port, () => {
  console.log(`Servidor en el puerto ${port}`);
});
