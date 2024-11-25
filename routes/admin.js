import express from "express"
const router = express.Router()
import mongoose from "mongoose"
import Categorias from "../models/Categoria.js"
const Categoria = mongoose.model("categorias")

router.get('/', function(req,res){
   res.render("admin/index")
})

router.get('/posts', function(req, res){
   res.send("Página de posts")
})

router.get('/categorias', function(req, res){
   res.render("admin/categorias")
})

router.get("/categorias/add", function (req,res) {
   res.render("admin/addcategorias")
})

router.post("/categorias/nova", (req,res) => {
   const novaCategoria = {
      nome: req.body.nome,
      slug: req.body.slug
   }

   new Categoria(novaCategoria).save().then(() => {
      console.log("Categoria salva com sucesso!")
   }).catch((erro) => {
      console.log("Erro ao salvar categoria! "+ erro)
   })
})
export default router
