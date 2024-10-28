var db = require('../config/connection')
var collection = require('../config/collections')
// var ObjectId = require('mongoose').Types.ObjectId;
var objectId = require('mongodb').ObjectID

module.exports={

    addProduct:(product,callback)=>{

        db.get().collection('product').insertOne(product).then((data)=>{
            callback(data.ops[0]._id)
        })
    },
    getAllProducts:()=>{
        return new Promise(async(resolve,reject)=>{
            let product = await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(product)
        })
    },
    deleteProduct:(productId)=>{
        return new Promise ((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({_id:objectId(productId)}).then((response)=>{
                resolve(response.productId)
            })
        })
    },
    getProductDetails:(productId)=>{
        return new Promise ((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:objectId(productId)}).then((product)=>{
                resolve(product)
            })
        })
    },
    updateProduct:(productId,productDetails)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION)
            .updateOne({_id:objectId(productId)},{
                $set:{
                    name:productDetails.name,
                    description:productDetails.description,
                    price:productDetails.price,
                    category:productDetails.category
                }
            }).then((response)=>{
                resolve()
            })
        })
    }   
}