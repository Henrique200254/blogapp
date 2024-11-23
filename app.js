// Carregando Módulos
import express from "express"
import { engine } from "express-handlebars"
import bodyParser from "body-parser"
import mongoose from "mongoose"
import admin from "./routes/admin.js"
import path from "path"
const __dirname = path.resolve()
const app = express()


// Configurações
   //Body parser
      app.use(express.urlencoded({extended: true}))
      app.use(express.json())
   // Handlebars
      app.engine('handlebars', engine())
      app.set('view engine', 'handlebars')
      app.set('views', './views')
   //Mongoose

   // Public
   app.use(express.static(path.join(__dirname,"public")))
// Rotas
    app.use('/admin', admin)
//Outros
const Port = 8081
app.listen(Port, function() {
    console.log("Servidor rodando! ")
}) 