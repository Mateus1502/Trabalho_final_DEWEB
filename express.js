const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

app.use(express.json());

const db = new sqlite3.Database('./Usuariodb.sqlite', (err) => {
    if(err) {
        console.error('Deu erro!');
    } else {
        console.log('Deu certo!');
    }
});

db.run(`CREATE TABLE IF NOT EXISTS Usuario (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    dataCriacao TEXT DEFAULT CURRENT_TIMESTAMP)`, (err) => {
        if (err) {
            console.error('Erro ao criar tabela');
        }
});

app.post("/Usuario", (req,res)=>{
    const  {name , email } = req.body;
    const query = `INSERT INTO items(name,email) VALUES (?,?)`// ?? para impedir ataques maliciosos

    db.run(query, [name, email], (err) => {
        if (err){
            res.status(400).json({message : err.message});

        }else {
            res.status(201).json({id: this.lastID , name , email});
        }

    })
    
});

app.get('/Usuario', (req,res) => {
    const query = "SELECT * FROM  Usuario";
    db.all(query,(err,rows)=>{
        if(err){
            console.error({'Não encontramos', err.message})
            return res.status(400).json({message:err.message});
        }else{
            res.status(200).json(rows);
        }
    })

});

app.get('/Usuario/:id',(req,res) =>{
    const {id} = req.params;
    const query = 'SELECT * FROM Usuario WHERE id =?';
    db.get(query,[id], (err,row)=>{
        if (err){
            console.error({'Não encontramos esse usuário.',err.message})
            return res.status(400).json({message:err.message})
        }else{
            res.status(200).json(row);
        }
    })
});

app.put('/Usuario/:id', (req, res) => {
    const { id } = req.params;  
    const { name, descricao } = req.body; 
    const query = 'UPDATE Usuario SET name = ?, email = ? WHERE id = ?';
    db.run(query, [name, email, id], function (err) {
        if (err) {
            console.error('Não conseguimos atualizar:', err.message);
            return res.status(400).json({ message: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'Item não encontrado!' });
        }else{
        res.status(200).json({
            id,
            name,
            email
        });
}});
});

app.patch('/Usuario/:id',(req,res)=>{
    const { id } = req.params;  
    const { name, email } = req.body; 
    const query = 'UPDATE Usuario SET name = ?, email = ? WHERE id = ?';
    db.run(query, [name, email, id], function (err) {
        if (err) {
            console.error('Não foi possível executar essa tarefa:', err.message);
            return res.status(400).json({ message: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'Perdão,não conseguimos encontrar.' });
        }else{
        res.status(200).json({
            id,
            name,
            email
        });
}});
});

app.delete('/Usuario/:id',(req,res)=>{
    const {id}=req.params;
    const query = 'DELETE FROM Usuario WHERE id = ?';
    db.run(query,[id],function(err){
        if(err){
            console.error('Não conseguimos deletar essa informação.',err.message);
            return res.status(400).json({message:err.message});            
        }if(this.changes === 0){
            return res.status(404).json({message:'Dado não encontrado'})
        }else{
            res.status(200).json({
                id,
		name,
		email
            })
        }
    })
})
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
