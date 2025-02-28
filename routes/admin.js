import express from "express"
const router = express.Router()
import mongoose from "mongoose"
import Categorias from "../models/Categoria.js"
const Categoria = mongoose.model("categorias")
import Postagens from "../models/Postagem.js"
const Postagem = mongoose.model("postagens")
import eAdmin from "../helpers/eAdmin.js"


router.get('/', function(req,res){
   res.render("admin/index")
})

router.get('/posts', eAdmin, function(req, res){
   res.send("Página de posts")
})

router.get('/categorias', function(req, res){
   Categoria.find().lean().sort({date: "desc"}).then((categorias) => {
      res.render("admin/categorias", {categorias: categorias})
   }).catch((erro) => {
      req.flash("error_msg", "Houve um erro ao registrar as categorias")
      res.redirect("/admin")
   })
   
})

router.get("/categorias/add", function (req,res) {
   res.render("admin/addcategorias")
})

router.post("/categorias/nova", (req,res) => {
   
   var erros = []

   if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
       erros.push({texto: "nome inválido"})
   }
   
   if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
       erros.push({texto: "Slug inválido"})
   }

   if(req.body.nome.length < 2){
      erros.push({texto: "Nome da categoria muito pequeno"})
   }
   
   if(erros.length > 0){
       res.render("admin/addcategorias", {erros: erros})
   } else {
      const novaCategoria = {
         nome: req.body.nome,
         slug: req.body.slug
      }
   
      new Categoria(novaCategoria).save().then(() => {
         req.flash("success_msg", "Categoria criada com sucesso!")
         res.redirect("/admin/categorias")
      }).catch((erro) => {
         req.flash("error_msg", "Houve um erro ao salvar a categoria!")
         res.redirect("/admin")
      })
   }
   
})

router.get("/categorias/edit/:id", (req,res) => {
   Categoria.findOne({_id: req.params.id}).lean().then((categoria) => {
      res.render("admin/editcategorias", {categoria: categoria})
   }).catch((erro) => {
      req.flash("error_msg", "Esta categoria não existe")
      res.redirect("/admin/categorias")
   })
   
})

router.post("/categorias/edit", (req,res) => {
   Categoria.findOne({_id: req.body.id}).then( (categoria) => {

      categoria.nome = req.body.nome
      categoria.slug = req.body.slug

      categoria.save().then(() => {
          req.flash('success_msg', 'Categoria editada com Sucesso!')
          res.redirect('/admin/categorias')
      }).catch( (erro) => { // ERR: Erro ao salvar::editar
          req.flash('error_msg', 'Houve um erro interno ao editar categoria.')
          res.redirect("/admin/categorias")
      })

  }).catch( (erro) => { // ERR: Não encontrou a categoria
      req.flash('error_msg', 'Houve um erro ao editar categoria.') //Mensagem de Erro
      res.redirect("/admin/categorias")
  })
   
})

router.post("/categorias/deletar", (req,res) => {
   Categoria.deleteOne({_id: req.body.id}).then(() => {
      req.flash("success_msg", "Categoria deletada com sucesso!")
      res.redirect("/admin/categorias")
   }).catch((erro) => {
      req.flash("error_msg", "Houve um erro ao deletar a categoria")
      res.redirect("/admin/categorias")
   })
})

router.get("/postagens", (req, res) => {
   Postagem.find().lean().populate("categoria").sort({data: "desc"}).then((postagens) => {
      res.render("admin/postagens", {postagens: postagens})
   }).catch((erro) => {
      req.flash("error_msg", "Houve um erro ao listar as postagens")
      res.redirect("/admin")
   })
  
})

router.get("/postagens/add", (req,res) => {
   Categoria.find().lean().then((categorias) => {
      res.render("admin/addpostagem", {categorias: categorias})
   }).catch((erro) => {
      req.flash("error_msg", "Houve um erro ao carregar o formulário")
      res.redirect("/admin")
   })
   
})

router.post("/postagens/nova", (req,res) => {
   var erros = []

   if(req.body.categoria == "0") {
      erros.push({texto: "categoria inválida, registre uma categoria"})
   }

   if(erros.length > 0){
      res.render("admin/addpostagem", {erros: erros})
   } else{
       const novaPostagem = {
           titulo: req.body.titulo,
           descricao: req.body.descricao,
           conteudo: req.body.conteudo,
           categoria: req.body.categoria,
           slug: req.body.slug
       }

       new Postagem(novaPostagem).save().then(() => {
         req.flash("success_msg", `Postagem ${req.body.titulo} criada com sucesso!`)
         res.redirect("/admin/postagens")
       }).catch((erro) => {
         req.flash("error_msg", "Houve um erro durante o salvamento da postagem")
         console.log("Erro ao cadastrar postagem" + erro)
         res.redirect("/admin/postagens")
       })
   }
})

router.get("/postagens/edit/:id", (req,res) => {
   Postagem.findOne({_id: req.params.id}).lean().then((postagem) => {
      Categoria.find().lean().then((categorias) => {
         res.render("admin/editpostagens", {categorias: categorias, postagem: postagem})
       }).catch((erro) => {
         req.flash("error_msg", "Houve um erro ao listar as categorias")
         res.redirect("/admin/postagens")
       })
   }).catch((erro) => {
      req.flash("error_msg", "Houve um erro ao carregar o formulário de edição")
      res.redirect("/admin/postagens")
   })
   
   
})

router.post("/postagem/edit", (req,res) => {
   Postagem.findOne({_id: req.body.id}).then((postagem) => {
      postagem.titulo = req.body.titulo
      postagem.slug = req.body.slug
      postagem.descricao = req.body.descricao
      postagem.conteudo = req.body.conteudo
      postagem.categoria = req.body.categoria

      postagem.save().then(() => {
         req.flash("success_msg", "Postagem editada com sucesso!")
         res.redirect("/admin/postagens")
      }).catch((erro) => {
         console.log(erro)
         req.flash("error_msg", "Erro interno")
         res.redirect("/admin/postagens")
      })
   }).catch((erro) => {
      console.log(erro)
      req.flash("error_msg", "Houve um erro ao salvar a edição")
      res.redirect("/admin/postagens")
   })
})

router.get("/postagens/deletar/:id",(req,res) => {
   Postagem.deleteOne({_id: req.params.id}).then(() => {
      req.flash("success_msg", "Postagem deletada com sucesso")
      res.redirect("/admin/postagens")
   }).catch((erro) => {
      req.flash("erro_msg", "Houve um erro ao deletar postagem")
      console.log("Erro ao deletar" + erro)
      res.redirect("/admin/postagens")
   })
})


export default router
