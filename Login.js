const express = require('express');
const session = require('express-session');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '1969',
    database: 'auth_db'
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

app.use(session({
    secret: 'MysecretKey',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false, 
        maxAge: 3600000 
    }
}));

const sanitizeInput = (req, res, next) => {
    const sqlKeywords = /(\b(ALTER|CREATE|DELETE|DROP|EXEC(UTE){0,1}|INSERT( +INTO){0,1}|MERGE|SELECT|UPDATE|UNION( +ALL){0,1})\b)/i;
    
    for(const [key, value] of Object.entries(req.body)) {
        if(sqlKeywords.test(value)) {
            return res.status(400).send('Entrada no válida');
        }
    }
    next();
};

const getConnection = async () => {
    return await mysql.createConnection(dbConfig);
};

app.get("/setSession", (req, res) => {
    req.session.username = 'LuisEnrique';
    res.send("Session data set");
});

app.get("/getSession", (req, res) => {
    const username = req.session.username;
    res.send("Username: " + username);
});

app.get("/destroySession", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error al destruir la sesión: ", err);
            return res.status(500).send("Error al destruir la sesión");
        }
        res.send("Sesión destruida");
    });
});

app.post('/register', sanitizeInput, async (req, res) => {
    const { username, password, confirm_password } = req.body;

    if(!username || !password || !confirm_password) {
        return alert('Todos los campos son requeridos');
    }
    
    if(password !== confirm_password) {
        return alert('Las contraseñas no coinciden');
    }
    
    if(password.length < 8) {
        return alert('La contraseña debe tener al menos 8 caracteres');
    }
    
    try {
        const connection = await getConnection();
        const [users] = await connection.execute(
            'SELECT username FROM users WHERE username = ?',
            [username]
        );
        
        if(users.length > 0) {
            return alert('El usuario ya existe');
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        await connection.execute(
            'INSERT INTO users (username, password) VALUES (?, ?)',
            [username, hashedPassword]
        );
        
        connection.end();
        res.send('Registro exitoso');
        
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
});

app.post('/login', sanitizeInput, async (req, res) => {
    const { username, password } = req.body;
    
    if(!username || !password) {
        return alert('Usuario y contraseña requeridos');
    }
    
    try {
        const connection = await getConnection();
        const [users] = await connection.execute(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );
        
        if(users.length === 0) {
            return alert('Credenciales inválidas');
        }
        
        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.password);
        
        if(!validPassword) {
            return alert('Credenciales inválidas');
        }
        
        req.session.userId = user.id;
        req.session.username = user.username;
        alert('Login exitoso');
        
    } catch (error) {
        console.error(error);
        alert('Error en el servidor');
    }
});

const requireAuth = (req, res, next) => {
    if(req.session.userId) {
        return next();
    }
    alert('Acceso no autorizado');
};

app.get('/profile', requireAuth, (req, res) => {
    alert(`Bienvenido ${req.session.username}`);
});

app.listen(3081, () => {
    console.log("Servidor corriendo en el puerto 3400");
});