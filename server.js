'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var jsonParser = bodyParser.json()
var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.MONGOLAB_URI);

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended: false}));

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});
var timeout = 10000;
console.log(process.env.MONGO_URI)
  mongoose.connect(process.env.MONGO_URI,{ useNewUrlParser: true })
 var Schema = mongoose.Schema;
 
var blogSchema = new Schema(
  { long:  {
    type: String,
    required: true}
  , short:{
    type: Number,
    required: true}     
});

 
 
 
var Person = mongoose.model('URLDB', blogSchema);
  var maxvalue=1000; var findvalue;
var newx =function (x,callback) {  
 
 if( x < maxvalue){
    console.log((x))
    Person.findOne({short:x},function (err, docs) {
              if(docs){
     newx (x+1,callback) 
  }else{
       findvalue =x; 
    x=maxvalue;      
     callback();
  }
  })}  
 
  console.log("find!"+findvalue);
  }
var createAndSave = function(passurl,x) {
   console.log("1>: "+passurl);
     console.log("x>: "+x)
  var person = new Person({ long:passurl, short:x})
 var data=person.save(function(err, person) {
 if (err) return console.error (err)
  return console.log("2>: "+person)
 });

};

 const urlExists = require('url-exists');
// your first API endpoint...Route path: /flights/:from-:to
//Request URL: http://localhost:3000/flights/LAX-SFO
//req.params: { "from": "LAX", "to": "SFO" } jsonParser
app.post("/api/shorturl/new",  urlencodedParser  , function (req, res, next) {
   console.log(req.body)
  
 
var url = req.body.url

urlExists(url, function(err, exists) {
  console.log(exists); // true 
  if (err) { 
   
  res.json({err: "invalid URL"}) ; console.log({err: "invalid URL"});
    next();
  }else if (exists){  
  
    //check if exist in db
     Person.findOne({long:url},function (err, docs) {
      if(docs){
       res.json({msg: "already in db", original_url:url, short_url: docs.short});
      }else{
        newx(1,function(){// new 
        createAndSave (url,findvalue)//callback with new number
        res.json({msg: "created and saved in db", original_url:url, short_url: findvalue}); //send 
   })
  }
     
    
 
}) 
   
     }else{
         console.log({url: "invalid URL"}); // true 
   res.json({url: "invalid URL"});
         next();
  }
});
});
app.get('/:number', function(req, res) {
    console.log(req.params.number)
  if(!isNaN(req.params.number)){
  var query = Person.findOne( {short: req.params.number})
    query.exec(function (err, docs) {
      console.log(docs.long)
      if(docs.long)res.redirect(docs.long);       
    })
  }    
});


/*app.post("/api/shorturl/:from%20-%20:to", function (req, res) {
   console.log(req.params.from)
    console.log(req.params.to)
  res.json({new: req.params.from, url:req.params.to});
});*/
app.listen(port, function () {
  console.log('Node.js listening ...');
});