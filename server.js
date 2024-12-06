const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const app = express();
const port = 5500;
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
);

// app.use(express.json());

const db = new sqlite3.Database("./usuariodb.sqlite", (err) => {
  if (err) {
    console.error("Deu erro!");
  } else {
    console.log("Deu certo!");
  }
});

db.run(
  `CREATE TABLE IF NOT EXISTS usuario (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    dataCriacao TEXT DEFAULT CURRENT_TIMESTAMP
)`,
  (err) => {
    if (err) {
      console.error("Erro ao criar tabela:", err.message);
    } else {
      console.log("Tabela criada com sucesso!");
    }
  }
);

app.post("/api/usuario", (req, res) => {
  const { name, email } = req.body;
  const query = `INSERT INTO usuario(name,email) VALUES (?,?)`;

  db.run(query, [name, email], (err) => {
    if (err) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(201).json({ name, email });
    }
  });
});
app.get("/api/usuario", (req, res) => {
  const query = "SELECT * FROM  usuario";
  db.all(query, (err, rows) => {
    if (err) {
      console.error("Não encontramos", err.message);
      return res.status(400).json({ message: err.message });
    } else {
      res.status(200).json(rows);
    }
  });
});

app.post("/api/login", (req, res) => {
  const { email } = req.body;
  const query = "SELECT * FROM usuario WHERE email =?";
  db.get(query, [email], (err, row) => {
    if (err) {
      console.error("Erro", err.message);
      return res.status(400).json({ message: err.message });
    }
    if (!row) {
      // vai para uma tela de erro
      console.error("Não encontramos esse usuário.");
      return res.status(400).json({ error: "Não encontramos esse usuário." });
    } else {
      // vai para o quiz
      console.log("::::::", row);
      return res.status(200).json(row);
    }
  });
});

app.get("/api/usuario/:id", (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM usuario WHERE id =?";
  db.get(query, [id], (err, row) => {
    if (err) {
      console.error("Não encontramos esse usuário.", err.message);
      return res.status(400).json({ message: err.message });
    } else {
      res.status(200).json(row);
    }
  });
});

app.put("/api/usuario/:id", (req, res) => {
  const { id } = req.params;
  const { name, senha } = req.body;
  const query = "UPDATE usuario SET name = ?,senha =?, WHERE email = ?,";
  db.run(query, [name, email, senha], function (err) {
    if (err) {
      console.error("Não conseguimos atualizar", err.message);
      return res.status(400).json({ message: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: "Item não encontrado!" });
    } else {
      res.status(200).json({
        id,
        name,
        email,
        senha,
      });
    }
  });
});

app.patch("/api/usuario/:id", (req, res) => {
  const { id } = req.params;
  const { email } = req.body;
  const query = "UPDATE usuario SET name = ?, email = ?";
  db.run(query, [name, email], function (err) {
    if (err) {
      console.error("Não foi possível executar essa tarefa:", err.message);
      return res.status(400).json({ message: err.message });
    }
    if (this.changes === 0) {
      return res
        .status(404)
        .json({ message: "Perdão,não conseguimos encontrar." });
    } else {
      res.status(200).json({
        id,
      });
    }
  });
});

app.delete("/api/usuario/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM usuario WHERE id = ?";
  db.run(query, [id], function (err) {
    if (err) {
      console.error("Não conseguimos deletar essa informação.", err.message);
      return res.status(400).json({ message: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: "Dado não encontrado" });
    } else {
      res.status(200).json({
        id,
      });
    }
  });
});
app.use(express.static("sssss"));

app.get("/criar_conta", (_req, res) => {
  res.sendFile(__dirname + "/static/html/criar_conta.html");
});
app.get("/editar", (_req, res) => {
  res.sendFile(__dirname + "/static/html/editar.html");
});
app.get("/quizz", (_req, res) => {
  res.sendFile(__dirname + "/static/html/quizz.html");
});
app.get("/quizz.js", (_req, res) => {
  res.sendFile(__dirname + "/static/js/quizz.js");
});
app.get("/resultado", (_req, res) => {
  res.sendFile(__dirname + "/static/html/resultado.html");
});
app.get("/usuario", (_req, res) => {
  res.sendFile(__dirname + "/static/html/usuario.html");
});
app.get("/usuario.js", (_req, res) => {
  res.sendFile(__dirname + "/static/js/usuario.js");
});
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
