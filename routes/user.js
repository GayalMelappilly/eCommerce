const { response } = require('express');
var express = require('express');
const { USER_COLLECTION } = require('../config/collections');
var router = express.Router();
var productHelper = require('../helpers/product-helpers')
const userHelpers = require('../helpers/user-helpers')
const verifyLogin = (req,res,next)=>{
  if(req.session.loggedIn){
    next()
  }else{
    res.redirect('/login')
  }
}

/* GET home page. */
router.get('/',async function (req, res, next) {
  let user = req.session.user
  console.log(user);
  let cartCount = null
  if(req.session.user){
    cartCount = await userHelpers.getCartCount(req.session.user._id)
  }
  productHelper.getAllProducts().then((products)=>{
    console.log(products);
    res.render('user/view-products', {admin:false,products,user,cartCount});
  })
});

router.get('/login',(req,res)=>{
    if(req.session.loggedIn){
      res.redirect('/')
    }else{

      res.render('user/login',{"loginErr":req.session.loginErr})
      req.session.loginErr=false
    }
  })


router.get('/signup',(req,res)=>{
  res.render('user/signup')
})

router.post('/signup',(req,res)=>{
  userHelpers.doSignup(req.body).then((response)=>{
    console.log(response);
    req.session.loggedIn=true
    req.session.user=response
    res.redirect('/')
  })
})

router.post('/login',(req,res)=>{
  userHelpers.doLogin(req.body).then((response)=>{
    if(response.status){
      req.session.loggedIn=true
      req.session.user=response.user
      res.redirect('/')
    }else{
      req.session.loginErr='Invalid username or password'
      res.redirect('/login')
    }
  })
})

router.get('/logout',(req,res)=>{
  res.render('user/logout')
})

router.post('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/')
})

router.get('/cart',verifyLogin, async (req,res)=>{
  let products = await userHelpers.getCartProducts(req.session.user._id)
  let total = await userHelpers.getTotalAmount(req.session.user._id)
  console.log(products)
  let user = req.session.user._id
  res.render('user/cart',{products,user,total})
})

router.get('/add-to-cart/:id',(req,res)=>{
  console.log('api call');
  userHelpers.addToCart(req.params.id,req.session.user._id).then(()=>{
    res.json({status:true})
  })
})

router.post('/change-product-quantity',(req,res,next)=>{
  userHelpers.changeProductQuantity(req.body).then(async(response)=>{
    response.total = await userHelpers.getTotalAmount(req.body.user)
    res.json(response)
  })
})

router.post('/remove-cart-item',(req,res,next)=>{
  userHelpers.removeCartProduct(req.body).then((response)=>{
    res.json(response)
  })
})

router.get('/place-order', verifyLogin, async (req,res,next)=>{
  let total = await userHelpers.getTotalAmount(req.session.user._id)
  res.render('user/order',{total,user:req.session.user})
})

router.post('/place-order' ,async(req,res)=>{
  let products = await userHelpers.getCartProductList(req.body.userId)
  let totalPrice = await userHelpers.getTotalAmount(req.body.userId)
  userHelpers.placeOrder(req.body,products,totalPrice).then((response)=>{

  })
  console.log(req.body);
})

module.exports = router;
