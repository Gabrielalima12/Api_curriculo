const express = require('express')
const { Pool } = require('pg') 
require('dotenv').config()
const path = require('path');

const PORT = 3333

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL
})

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
    console.log('olá mundo')
    res.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/dados_pessoais/', async (req, res) => {
    try{
        const { rows } = await pool.query('SELECT * FROM dados_pessoais')
        return res.status(200).send(rows)
    } catch(err){
        return res.status(400).send(err)
    }
})

app.post('/session', async (req, res) => {
    const { username } = req.body
    let user = ''
    try{
        user = await pool.query('SELECT * FROM users WHERE user_name = ($1)', [username])
        if (!user.rows[0]){
            user = await pool.query('INSERT INTO users(user_name) VALUES ($1) RETURNING *', [username])
        }
        return res.status(200).send(user.rows)
    }catch(err) {
        return res.status(400).send(err)
    }
})

app.post('/dados_pessoais/', async (req, res) => {
    const { DADOS_NOME, DADOS_IDADE, DADOS_TELEFONE, DADOS_ENDERECO} = req.body
    const { dados_id } = req.params
    try {
        const newTodo = await pool.query('INSERT INTO dados_pessoais (DADOS_NOME, DADOS_IDADE, DADOS_TELEFONE, DADOS_ENDERECO) VALUES ($1, $2, $3, $4) RETURNING *', [DADOS_NOME, DADOS_IDADE, DADOS_TELEFONE, DADOS_ENDERECO])
        return res.status(200).send(newTodo.rows)
    } catch(err) {
        return res.status(400).send(err)

    }
})

app.post('/experiencia/', async (req, res) => {
    const { EXP_TITULO, EXP_DESCR } = req.body
    const { EXP_ID } = req.params
    try {
        const newExp = await pool.query('INSERT INTO experiencias_profissionais (EXP_TITULO, EXP_DESCR) VALUES ($1, $2) RETURNING *', [EXP_TITULO, EXP_DESCR])
        return res.status(200).send(newExp.rows)
    } catch(err) {
        return res.status(400).send(err)

    }
})

app.get('/experiencias/', async (req, res) => {
    try{
        const { rows } = await pool.query('SELECT * FROM experiencias_profissionais')
        return res.status(200).send(rows)
    } catch(err){
        return res.status(400).send(err)
    }
})

app.listen(PORT, () => console.log(`Servidor rodando em: http://localhost:${PORT}`))