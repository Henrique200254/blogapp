import express from "express"
const router = express.Router()

router.get('/', function(req,res){
   res.render("admin/index")
})

router.get('/posts', function(req, res){
   res.send("Página de posts")
})

router.get('/categorias', function(req, res){
   res.send("Página de categorias")
})

export default router
