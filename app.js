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
import Postagens from "./models/Postagem.js"
const Postagem = mongoose.model("postagens")
import Categorias from "./models/Categoria.js"
const Categoria = mongoose.model("categorias")
import usuarios from "./routes/usuario.js"
import auth from "./config/auth.js"
import passport from "passport"

// Configurações
   // Sessão
      app.use(session({
         secret: "Nodejs",
         resave: true,
         saveUninitialized: true,
         cookie: {
            secure:false,
            maxAge: 15 * 60 * 1000,
         },
      }))

      app.use(passport.initialize())
      app.use(passport.session())
      auth(passport)
      app.use(flash())
   // Middleware
      app.use((req,res,next) => {
          res.locals.success_msg = req.flash("success_msg")
          res.locals.error_msg = req.flash("error_msg")
          res.locals.error = req.flash("error")
          res.locals.user = req.user
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
   
   const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1/blogapp';

      mongoose.Promise = global.Promise
      mongoose.connect(mongoURI, {
         useNewUrlParser: true,
         useUnifiedTopology: true,
         dbName: 'blogapp'
       }).then(() => {
          console.log("Conectado ao Mongo")
      }).catch((erro) => {
          console.log("Erro ao se conectar: " + erro)
      })
   // Public
   app.use(express.static(path.join(__dirname,"public")))

   app.use((req,res,next) => {
       next()
   })
// Rotas
    app.use('/admin', admin)
    app.get("/", (req, res) => {
      // Verifica se a sessão já foi criada e incrementa o contador de visualizações
      if (!req.session.views) {
        req.session.views = 0;  // Inicializa a variável de sessões se ainda não existir
      }
      req.session.views++;  // Incrementa a cada vez que a página for acessada
    
      // Log para verificar a quantidade de acessos (opcional)
      console.log(`Número de acessos: ${req.session.views}`);
    
      // Busca as postagens do banco de dados e renderiza a página principal
      Postagem.find()
        .lean()
        .populate("categoria")
        .sort({ data: "desc" })
        .then((postagens) => {
          res.render("index", { postagens: postagens, views: req.session.views });
        })
        .catch((erro) => {
          req.flash("error_msg", "Houve um erro interno");
          res.redirect("/404");
        });
    });


    app.get("/404", (req,res) => {
        res.send("error 404!")
    })

    app.get("/postagem/:slug", (req,res) => {
        Postagem.findOne({slug: req.params.slug}).lean().then((postagem) => {
            if(postagem){
               res.render("inicio", {postagem: postagem})
            }else{
               req.flash("error_msg", "Essa postagem não existe")
               res.redirect("/")
            }
        }).catch((erro) => {
            req.flash("error_msg", "Houve um erro interno")
            res.redirect("/")
        })
    })

    app.get("/categorias",(req,res) => {
        Categoria.find().lean().then((categorias) => {
            res.render("categorias/index", {categorias: categorias})
        }).catch((erro) => {
           req.flash("error_msg", "Houve um erro interno ao listar as categorias")
           res.redirect("/")
        })
    })

    app.get("/categorias/:slug", (req,res) => {
       Categoria.findOne({slug: req.params.slug}).lean().then((categoria) => {
            if(categoria){
               Postagem.find({categoria: categoria._id}).lean().then((postagens) => {
                    res.render("categorias/postagens", {postagens: postagens, categoria: categoria})
               }).catch((erro) => {
                  req.flash("error_msg", "Houve um erro ao listar os posts")
                  res.redirect("/")
               })
            }else{
              req.flash("error_msg", "Esta categoria não existe")
              res.redirect("/")
            }
       }).catch((erro) => {
          req.flash("error_msg", "Houve um erro interno ao carrgear a página desta categoria")
          res.redirect("/")
       })
    })

    app.use("/usuarios", usuarios)

//Outros
const Port = process.env.PORT || 8081
app.listen(Port, function() {
    console.log("Servidor rodando! ")
}) 