import express from 'express'
import axios from 'axios'
import {writeFileSync, readFileSync} from 'fs'

const database = './data/dados.json'

const app = express()

//acessando essa rota, essa função ira capturar os dados da api e escrever em um arquivo JSON
app.get('/', async (req,res)=>{
   try {
       await axios.get('https://devchallenge-biblioteca.herokuapp.com/list')
            .then( async ({data}) =>{
                await writeFileSync(database, JSON.stringify(data))
                res.send('Dados capturados com sucesso!')
            })
   } catch (error) {
       res.send('Erro ao acessar api')
   }
})

//função para ler os dados que estao em JSON
async function read(){
    const dados = await readFileSync(database)

    return JSON.parse(dados.toString())
}


app.get('/insert', async (req, res)=>{
    //capturando o primeiro dado do array JSON
    const [dado] = await read()

    //enviando o dado para outra api com bd em sql
    try {
        await axios.post('https://apinodesqlite.herokuapp.com/api/insert', JSON.stringify(dado))
        res.send('Dado enviado com sucesso!')    
    } catch (error) {
        res.send('Erro ao inserir!')
    }
})

app.listen(3000)