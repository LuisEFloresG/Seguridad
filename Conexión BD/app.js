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
    let GUITARRA = req.body.GUITARRA
    let id = req.body.id
    let MARCA = req.body.MARCA
    let MODELO = req.body.MODELO
    let AÑO = req.body.AÑO
    let DISEÑO = req.body.DISEÑO
    let COLOR = req.body.COLOR
    let ESTILO = req.body.ESTILO
    let TIPO = req.body.TIPO

    con.query('INSERT INTO usuario (id, GUITARRA, MARCA, MODELO, AÑO, DISEÑO, COLOR, ESTILO, TIPO) VALUES (?, ?, ?, ?, ?, ? , ?, ?, ?)', [id, GUITARRA, MARCA, MODELO, AÑO, DISEÑO, COLOR, ESTILO, TIPO], (err, respuesta, fields) => {
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
            <h2 class="text-center text-primary mb-4">Información del Jugador</h2>
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
    <style>
        body {
            background: linear-gradient(to right, #f8f9fa, #e9ecef);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .card {
            max-width: 700px;
            border-radius: 15px;
            border: none;
            background: white;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        .list-group-item {
            border: none;
            background-color: rgba(0, 0, 0, 0.05);
            border-radius: 10px;
            margin-bottom: 8px;
            padding: 12px;
        }
        .btn {
            border-radius: 20px;
            padding: 8px 14px;
        }
        .form-control-sm {
            border-radius: 10px;
        }
    </style>
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
                <div class="d-flex">
                    <form action="/editarUsuario/${usuario.id}" method="post" class="me-2 d-flex">
                        <input type="text" name="nombre" value="${usuario.GUITARRA}" class="form-control form-control-sm me-2" required>
                        <button type="submit" class="btn btn-warning btn-sm">Editar</button>
                    </form>
                    <form action="/eliminarUsuario/${usuario.id}" method="post">
                        <button type="submit" class="btn btn-danger btn-sm">Eliminar</button>
                    </form>
                </div>
            </li>`;
    });
    
    respuestaHTML += `
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

app.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000')
})