var express = require('express');
var router = express.Router();
var productHelper = require('../helpers/product-helpers')

/* GET users listing. */
router.get('/', function(req, res, next) {

  productHelper.getAllProducts().then((products)=>{
    console.log(products);
    res.render('admin/view-products', {admin:true,products});
  })
});

router.get('/add-products',function(req,res){
  res.render('admin/add-products',{admin:true})
})

router.post('/add-products',(req,res)=>{
  productHelper.addProduct(req.body,(id)=>{
    let image=req.files.image
    image.mv('./public/product-images/'+id+'.jpg',(err)=>{
      if(!err){
        res.render('admin/add-products',{admin:true})
      }else{
        console.log(err)
      }
    })
  })
})


router.get('/delete-product/:id',(req,res)=>{
  let productId=req.params.id
  console.log(productId);
  productHelper.deleteProduct(productId).then((response)=>{
    res.redirect('/admin/')
  })
})


router.get('/edit-products/:id', async (req,res)=>{
  let product= await productHelper.getProductDetails(req.params.id)
  console.log(product);
  res.render('admin/edit-products',{product})
})

router.post('/edit-products/:id',(req,res)=>{
  //console.log(req.params.id);
  let id = req.params.id
  productHelper.updateProduct(req.params.id,req.body).then(()=>{
    res.redirect('/admin')
    if(req.files.image){
      let image = req.files.image
      image.mv('./public/product-images/'+id+'.jpg')
    }
  })
})

module.exports = router;
