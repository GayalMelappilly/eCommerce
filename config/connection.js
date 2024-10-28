const mongoClient = require('mongodb').MongoClient
//const mongoose = require('mongoose')
const state = {
    db:null
}


module.exports.connect=function(done){
    const url = 'mongodb://0.0.0.0:27017'
    const dbname = 'Shopping-Cart-Sample'

    mongoClient.connect(url,(err,data)=>{
        if(err) return done(err)
        state.db=data.db(dbname)
        done()
    })

    //mongoose.connect( url, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology:true })

    
}

module.exports.get=function(){
    return state.db
}