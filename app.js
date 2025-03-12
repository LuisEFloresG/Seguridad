const express = require("express")
const mysql = require("mysql2")
var bodyParser = require('body-parser')
var app = express()

var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1969',
    database: 'GUITARRA'
})
con.connect();

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(express.static('public'))

app.post('/agregarUsuario', (req, res) => {

    const camposRequeridos = ['GUITARRA', 'MARCA', 'MODELO', 'AÑO', 'DISEÑO', 'COLOR', 'ESTILO', 'TIPO'];
    const camposFaltantes = camposRequeridos.filter(campo => !req.body[campo]);

    if (camposFaltantes.length > 0) {
        return res.status(400).send(`Faltan los siguientes campos: ${camposFaltantes.join(', ')}`);
    }

    const id = req.body.id;
    const AÑO = req.body.AÑO;
    const GUITARRA = req.body.GUITARRA;
    const MARCA = req.body.MARCA;
    const MODELO = req.body.MODELO;
    const DISEÑO = req.body.DISEÑO;
    const COLOR = req.body.COLOR;
    const ESTILO = req.body.ESTILO;
    const TIPO = req.body.TIPO;


    if (isNaN(AÑO) || AÑO < 1900 || AÑO > new Date().getFullYear() + 1) {
        return res.status(400).send('El año debe ser un número válido entre 1900 y ' + (new Date().getFullYear() + 1));
    }


    const validarLongitud = (valor, nombreCampo, max = 50) => {
        if (valor.length > max) {
            return res.status(400).send(`${nombreCampo} no puede exceder los ${max} caracteres`);
        }
        if (valor.trim() === '') {
            return res.status(400).send(`${nombreCampo} no puede estar vacío`);
        }
    };

    validarLongitud(GUITARRA, 'GUITARRA');
    validarLongitud(MARCA, 'MARCA');
    validarLongitud(MODELO, 'MODELO');
    validarLongitud(DISEÑO, 'DISEÑO', 100);
    validarLongitud(COLOR, 'COLOR');
    validarLongitud(ESTILO, 'ESTILO');
    validarLongitud(TIPO, 'TIPO');


    const validarCaracteres = (valor, nombreCampo) => {
        const regex = /[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]/gi;
        if (regex.test(valor)) {
            res.status(400).send(`${nombreCampo} solo permite letras, números y espacios`);
            return true;
        }
        return false;
    };

    if (validarCaracteres(GUITARRA, 'GUITARRA')) return;
    if (validarCaracteres(MARCA, 'MARCA')) return;
    if (validarCaracteres(MODELO, 'MODELO')) return;
    if (validarCaracteres(DISEÑO, 'DISEÑO')) return;
    if (validarCaracteres(COLOR, 'COLOR')) return;
    if (validarCaracteres(ESTILO, 'ESTILO')) return;
    if (validarCaracteres(TIPO, 'TIPO')) return;

   
    con.query('INSERT INTO usuario ( GUITARRA, MARCA, MODELO, AÑO, DISEÑO, COLOR, ESTILO, TIPO) VALUES (?, ?, ?, ?, ? , ?, ?, ?)', 
    [GUITARRA, MARCA, MODELO, AÑO, DISEÑO, COLOR, ESTILO, TIPO], 
    (err, respuesta, fields) => {
    
        if (err) {
            console.log("Error al conectar", err);
            return res.status(500).send("Error al conectar");
        }

        return res.send(`

           <!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Información del Usuario</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            background: linear-gradient(to right, #ece9e6, #ffffff);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .card {
            max-width: 500px;
            border-radius: 15px;
            border: none;
        }
        .list-group-item {
            border: none;
            background-color: rgba(0, 0, 0, 0.05);
            border-radius: 10px;
            margin-bottom: 5px;
        }
        .btn-primary {
            border-radius: 30px;
            padding: 10px 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="card shadow-lg p-4">
            <h2 class="text-center text-primary mb-4">Información de la Guitarra</h2>
            <ul class="list-group">
                <li class="list-group-item"><strong>Guitarra:</strong> ${GUITARRA}</li>
                <li class="list-group-item"><strong>Marca:</strong> ${MARCA}</li>
                <li class="list-group-item"><strong>Modelo:</strong> ${MODELO}</li>
                <li class="list-group-item"><strong>Año:</strong> ${AÑO}</li>
                <li class="list-group-item"><strong>Diseño:</strong> ${DISEÑO}</li>
                <li class="list-group-item"><strong>Color:</strong> ${COLOR}</li>
                <li class="list-group-item"><strong>Estilo:</strong> ${ESTILO}</li>
                <li class="list-group-item"><strong>Tipo:</strong> ${TIPO}</li>
            </ul>
            <div class="text-center mt-4">
                <a href="/" class="btn btn-primary shadow-sm">Volver al Inicio</a>
            </div>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
        `);
        
            });
})

app.get('/obtenerUsuario', (req, res) => {
    con.query('SELECT * FROM usuario', (err, resultados) => {
        if (err) {
            console.error("Error al obtener usuarios", err);
            return res.status(500).send("Error al obtener usuarios");
        }

        let respuestaHTML = `
       <!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Lista de Guitarras</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container">
        <div class="card shadow-lg p-4">
            <h2 class="text-center text-primary mb-4">Lista de Guitarras</h2>
            <ul class="list-group">
                ${resultados.map(usuario => `
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <strong>ID:</strong> ${usuario.id} | <strong>Guitarra:</strong> ${usuario.GUITARRA}
                        </div>
                        <div class="d-flex">
                            <form action="/editarUsuario/${usuario.id}" method="post" class="me-2 d-flex">
                                <input type="text" name="nombre" value="${usuario.GUITARRA}" class="form-control form-control-sm me-2" required>
                                <button type="submit" class="btn btn-warning btn-sm">Editar</button>
                            </form>
                            <form action="/eliminarUsuario/${usuario.id}" method="post">
                                <button type="submit" class="btn btn-danger btn-sm">Eliminar</button>
                            </form>
                        </div>
                    </li>
                `).join('')}
            </ul>
            <div class="text-center mt-4">
                <a href="/" class="btn btn-primary">Volver al Inicio</a>
            </div>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
`;
    
    resultados.forEach(usuario => {
        respuestaHTML += `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                    <strong>ID:</strong> ${usuario.id} | <strong>Guitarra:</strong> ${usuario.GUITARRA}
                </div>

                    <form action="/eliminarUsuario/${usuario.id}" method="post">
                        <button type="submit" class="btn btn-danger btn-sm">Eliminar</button>
                    </form>
                </div>
            </li>`;
    });
    
    respuestaHTML += ``;  
    
        respuestaHTML += "</ul>";

        res.send(respuestaHTML);
    });
});

app.post('/eliminarUsuario/:id', (req, res) => {
    const userId = req.params.id;

    con.query('DELETE FROM usuario WHERE id = ?', [userId], (err, respuesta) => {
        if (err) {
            console.error("Error al eliminar usuario", err);
            return res.status(500).send("Error al eliminar usuario");
        }

        if (respuesta.affectedRows > 0) {
            return res.redirect('/obtenerUsuario'); 
        } else {
            return res.send(`<h1>No se encontró un usuario con ID ${userId}.</h1>`);
        }
    });
});

app.post('/editarUsuario/:id', (req, res) => {
    const userId = req.params.id;
    const nuevoGuitarra = req.body.GUITARRA;

    con.query('UPDATE usuario SET nombre = ? WHERE id = ?', [nuevoGuitarra, userId], (err, respuesta) => {
        if (err) {
            console.error("Error al actualizar usuario", err);
            return res.status(500).send("Error al actualizar usuario");
        }

        if (respuesta.affectedRows > 0) {
            return res.redirect('/obtenerUsuario'); 
        } else {
            return res.send(`<h1>No se encontró un usuario con ID ${userId}.</h1>`);
        }
    });
});

app.listen(3015, () => {
    console.log('Servidor escuchando en el puerto 3000')
})