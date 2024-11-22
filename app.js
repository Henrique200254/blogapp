// Carregando Módulos
import express from "express"
import { ExpressHandlebars } from "express-handlebars"
import bodyParser from "body-parser"
import mongoose from "mongoose"
const app = express()

// Configurações

// Rotas

//Outros
const Port = 8081
app.listen(Port, function() {
    console.log("Servidor rodando! ")
}) 