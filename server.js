const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 5500;

app.use(express.json());

const db = new sqlite3.Database('./usuariodb.sqlite', (err) => {
    if(err) {
        console.error('Deu erro!');
    } else {
        console.log('Deu certo!');
    }
});

db.run(`CREATE TABLE IF NOT EXISTS usuario (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
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


app.post("/usuario", (req,res)=>{
    const  {name , email, senha} = req.body;
    const query = `INSERT INTO usuario(name,email,senha) VALUES (?,?,?)`

    db.run(query, [name, email, senha], (err) => {
        if (err){
            res.status(400).json({message : err.message});

        }else {
            res.status(201).json({name , email});
        }

    })
    
});
app.get('/usuario', (req,res) => {
    const query = "SELECT * FROM  usuario";
    db.all(query,(err,rows)=>{
        if(err){
            console.error('Não encontramos',err.message);
            return res.status(400).json({message:err.message});
        }else{
            res.status(200).json(rows);
        }
    })

});

app.get('/usuario/:id',(req,res) =>{
    const {id} = req.params;
    const query = 'SELECT * FROM usuario WHERE id =?';
    db.get(query,[id], (err,row)=>{
        if (err){
            console.error('Não encontramos esse usuário.', err.message)
            return res.status(400).json({message:err.message})
        }else{
            res.status(200).json(row);
        }
    })
});

app.put('/usuario/:id', (req, res) => {
    const { id } = req.params;  
    const { name, senha} = req.body; 
    const query = 'UPDATE usuario SET name = ?,senha =?, WHERE email = ?,';
    db.run(query, [name, email, senha], function (err) {
        if (err) {
            console.error('Não conseguimos atualizar', err.message);
            return res.status(400).json({ message: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'Item não encontrado!' });
        }else{
        res.status(200).json({
            id,
            name,
            email,
            senha
        });
}});
});

app.patch('/usuario/:id',(req,res)=>{
    const {id} = req.params;  
    const {email} = req.body; 
    const query = 'UPDATE usuario SET name = ?, email = ?';
    db.run(query, [name, email], function (err) {
        if (err) {
            console.error('Não foi possível executar essa tarefa:', err.message);
            return res.status(400).json({ message: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'Perdão,não conseguimos encontrar.' });
        }else{
        res.status(200).json({
            id
        });
}});
});

app.delete('/usuario/:id',(req,res)=>{
    const {id}=req.params;
    const query = 'DELETE FROM usuario WHERE id = ?';
    db.run(query,[id],function(err){
        if(err){
            console.error('Não conseguimos deletar essa informação.',err.message);
            return res.status(400).json({message:err.message});            
        }if(this.changes === 0){
            return res.status(404).json({message:'Dado não encontrado'})
        }else{
            res.status(200).json({
		id
            })
        }
    })
})
app.use(express.static('sssss'));

app.get('/criar_conta',(_req,res)=> {
    res.sendFile(__dirname +'/criar_conta.html')
});
app.get('/editar',(_req,res)=> {
    res.sendFile(__dirname +'/editar.html')
});
app.get('/quizz',(_req,res)=> {
    res.sendFile(__dirname +'/quizz.js')
});
app.get('/quuizzz',(_req,res)=> {
    res.sendFile(__dirname +'/quizz.html')
});
app.get('/resultado',(_req,res)=> {
    res.sendFile(__dirname +'/resultado.html')
});
app.get('/usuario',(_req,res)=> {
    res.sendFile(__dirname +'/usuario.html')
});
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
