import React, { useState } from "react";
import './App.css';

// Componente de formulario para agregar una nueva guitarra
const FormularioGuitarra = ({ agregarGuitarra }) => {
  const [guitarra, setGuitarra] = useState({
    nombre: "",
    tipo: "",
    precio: "",
    marca: "",
    año: "",
    color: "",
    cuerdas: "",
    descripcion: ""
  });

  const [errores, setErrores] = useState({});

  // Manejo del cambio de valor en los inputs
  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setGuitarra({ ...guitarra, [name]: value });
  };

  // Validación del formulario
  const validarFormulario = () => {
    let errores = {};

    // Validar campos requeridos
    if (!guitarra.nombre) errores.nombre = "El nombre es obligatorio";
    if (!guitarra.tipo) errores.tipo = "El tipo de guitarra es obligatorio";
    if (!guitarra.precio || isNaN(guitarra.precio)) errores.precio = "El precio debe ser un número válido";
    if (!guitarra.marca) errores.marca = "La marca es obligatoria";
    if (!guitarra.año || isNaN(guitarra.año) || guitarra.año < 1800 || guitarra.año > new Date().getFullYear()) errores.año = "El año de fabricación debe ser un número válido y estar en el rango correcto";
    if (!guitarra.color) errores.color = "El color es obligatorio";
    if (!guitarra.cuerdas || isNaN(guitarra.cuerdas) || guitarra.cuerdas < 4 || guitarra.cuerdas > 12) errores.cuerdas = "El número de cuerdas debe ser un número entre 4 y 12";
    if (!guitarra.descripcion) errores.descripcion = "La descripción es obligatoria";

    return errores;
  };

  // Manejo del envío del formulario
  const manejarEnvio = (e) => {
    e.preventDefault();
    const erroresValidacion = validarFormulario();
    setErrores(erroresValidacion);

    if (Object.keys(erroresValidacion).length === 0) {
      agregarGuitarra(guitarra);
      setGuitarra({
        nombre: "",
        tipo: "",
        precio: "",
        marca: "",
        año: "",
        color: "",
        cuerdas: "",
        descripcion: ""
      });
    }
  };

  return (
    <div>
      <h2>Registrar una Guitarra</h2>
      <form onSubmit={manejarEnvio}>
        <input type="text" name="nombre" value={guitarra.nombre} onChange={manejarCambio} placeholder="Nombre de la guitarra" />
        {errores.nombre && <span>{errores.nombre}</span>}

        <input type="text" name="tipo" value={guitarra.tipo} onChange={manejarCambio} placeholder="Tipo de guitarra" />
        {errores.tipo && <span>{errores.tipo}</span>}

        <input type="number" name="precio" value={guitarra.precio} onChange={manejarCambio} placeholder="Precio" />
        {errores.precio && <span>{errores.precio}</span>}

        <input type="text" name="marca" value={guitarra.marca} onChange={manejarCambio} placeholder="Marca" />
        {errores.fabricante && <span>{errores.fabricante}</span>}

        <input type="number" name="año" value={guitarra.año} onChange={manejarCambio} placeholder="Año de fabricación" />
        {errores.año && <span>{errores.año}</span>}

        <input type="text" name="color" value={guitarra.color} onChange={manejarCambio} placeholder="Color" />
        {errores.color && <span>{errores.color}</span>}

        <input type="number" name="cuerdas" value={guitarra.cuerdas} onChange={manejarCambio} placeholder="Número de cuerdas" />
        {errores.cuerdas && <span>{errores.cuerdas}</span>}

        <textarea name="descripcion" value={guitarra.descripcion} onChange={manejarCambio} placeholder="Descripción" />
        {errores.descripcion && <span>{errores.descripcion}</span>}

        <button type="submit">Registrar Guitarra</button>
      </form>
    </div>
  );
};

// Componente para mostrar la lista de guitarras registradas
const ListaGuitarras = ({ guitarras, eliminarGuitarra }) => {
  return (
    <div>
      <h2>Guitarras Registradas</h2>
      <ul>
        {guitarras.map((guitarra, index) => (
          <li key={index}>
            {guitarra.nombre} - {guitarra.tipo} - ${guitarra.precio} - {guitarra.marca}
            <button onClick={() => eliminarGuitarra(index)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Componente principal
const App = () => {
  const [guitarras, setGuitarras] = useState([]);

  const agregarGuitarra = (guitarra) => {
    setGuitarras([...guitarras, guitarra]);
  };

  const eliminarGuitarra = (index) => {
    const nuevasGuitarras = guitarras.filter((_, i) => i !== index);
    setGuitarras(nuevasGuitarras);
  };

  return (
    <div>
      <h1>Aplicación CRUD de Guitarras</h1>
      <FormularioGuitarra agregarGuitarra={agregarGuitarra} />
      <ListaGuitarras guitarras={guitarras} eliminarGuitarra={eliminarGuitarra} />
    </div>
  );
};

export default App;
