const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

app.use(express.json());

const db = new sqlite3.Database('./Usuariodb.sqlite', (err) => {
    if (err) {
        console.error('Deu erro!');
    } else {
        console.log('Deu certo!');
    }
});

db.run(`CREATE TABLE IF NOT EXISTS Usuario (
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    senha TEXT NOT NULL,
    dataCriacao TEXT DEFAULT CURRENT_TIMESTAMP
)`, (err) => {
    if (err) {
        console.error('Erro ao criar tabela:', err.message); 
    } else {
        console.log('Tabela criada com sucesso!');
    }
});
app.post("/Usuario", (req, res) => {
    const { name, email, senha } = req.body;
    const query = `INSERT INTO Usuario(name, email, senha) VALUES (?, ?, ?)`;

    db.run(query, [name, email, senha], (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        } else {
            res.status(201).json({ name, email });
        }
    });
});

app.get('/Usuario', (req, res) => {
    const query = "SELECT * FROM Usuario";
    db.all(query, (err, rows) => {
        if (err) {
            console.error('Não encontramos', err.message);
            return res.status(400).json({ message: err.message });
        } else {
            res.status(200).json(rows);
        }
    });
});


app.get('/Usuario/:name', (req, res) => {
    const { name } = req.params;
    const query = 'SELECT * FROM Usuario WHERE name = ?';

    db.get(query, [name], (err, row) => {
        if (err) {
            console.error('Não encontramos esse usuário.', err.message);
            return res.status(400).json({ message: err.message });
        } else {
            res.status(200).json(row);
        }
    });
});

app.put('/Usuario/:email', (req, res) => {
    const { email } = req.params;  
    const { name, senha } = req.body; 
    const query = 'UPDATE Usuario SET name = ?, senha = ? WHERE email = ?';

    db.run(query, [name, senha, email], function (err) {
        if (err) {
            console.error('Não conseguimos atualizar', err.message);
            return res.status(400).json({ message: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'Item não encontrado!' });
        } else {
            res.status(200).json({ name, email });
        }
    });
});


app.patch('/Usuario/:name', (req, res) => {
    const { name } = req.params;  
    const { email } = req.body; 
    const query = 'UPDATE Usuario SET email = ? WHERE name = ?';

    db.run(query, [email, name], function (err) {
        if (err) {
            console.error('Não foi possível executar essa tarefa:', err.message);
            return res.status(400).json({ message: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'Perdão, não conseguimos encontrar.' });
        } else {
            res.status(200).json({ name, email });
        }
    });
});


app.delete('/Usuario/:name', (req, res) => {
    const { name } = req.params;
    const query = 'DELETE FROM Usuario WHERE name = ?';

    db.run(query, [name], function (err) {
        if (err) {
            console.error('Não conseguimos deletar essa informação.', err.message);
            return res.status(400).json({ message: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'Dado não encontrado' });
        } else {
            res.status(200).json({ name });
        }
    });
});


app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
