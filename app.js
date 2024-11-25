// Carregando Módulos
import express from "express"
import { engine } from "express-handlebars"
import bodyParser from "body-parser"
import mongoose from "mongoose"
import admin from "./routes/admin.js"
import path from "path"
const __dirname = path.resolve()
const app = express()
import session from "express-session"
import flash from "connect-flash"


// Configurações
   // Sessão
      app.use(session({
         secret: "cursodenode",
         resave: true,
         saveUninitialized: true
      }))
      app.use(flash())
   // Middleware
      app.use((req,res,next) => {
          res.locals.success_msg = req.flash("success_msg")
          res.locals.error_msg = req.flash("error_msg")
          next()
      })   
   //Body parser
      app.use(express.urlencoded({extended: true}))
      app.use(express.json())
   // Handlebars
      app.engine('handlebars', engine())
      app.set('view engine', 'handlebars')
      app.set('views', './views')
   //Mongoose
      mongoose.Promise = global.Promise
      mongoose.connect("mongodb://localhost/blogapp").then(() => {
          console.log("Conectado ao Mongo")
      }).catch((erro) => {
          console.log("Erro ao se conectar: " + erro)
      })
   // Public
   app.use(express.static(path.join(__dirname,"public")))

   app.use((req,res,next) => {
       console.log("Oi eu sou um middleware")
       next()
   })
// Rotas
    app.use('/admin', admin)
//Outros
const Port = 8081
app.listen(Port, function() {
    console.log("Servidor rodando! ")
}) 