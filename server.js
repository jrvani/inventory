const express=require('express');
const app=express();
const bodyParser=require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

const MongoClient=require('mongodb').MongoClient;

var db;
var s;

MongoClient.connect('mongodb://127.0.0.1:27017/BigBasket',(err,database)=>{
    if(err) return console.log(err)
    db=database.db('BigBasket');
    app.listen(3000,()=>{
        console.log("listening 3000");
    });
});

app.set('view engine','ejs');

app.use(express.static('public'));

app.get('/',(req,res)=>{
    db.collection('Inventory').find().toArray((err,result)=>{
        if(err) return console.log(err);
        res.render('homepage.ejs',{data:result})
    });
});

app.get('/create',(req,res)=>{
    res.render("add.ejs");
});


app.get('/updatestock',(req,res)=>{
    res.render("update.ejs");
});
app.get('/deleteproduct',(req,res)=>{
    res.render("delete.ejs");
});

app.post('/AddData',(req,res)=>{
    db.collection('Inventory').save(req.body,(err,result)=>{
        if(err) return console.log(err);
        res.redirect('/');
    });
});

app.post('/update',(req,res)=>{
    db.collection('Inventory').find().toArray((err,result)=>{
        if(err) return console.log(err);
        for(var i=0;i<result.length;i++)
        {
            if(result[i].pid==req.body.id)
            {
                s=result[i].quantity;
                break;
            }
        }
        db.collection('Inventory').findOneAndUpdate({pid:req.body.id},{
            $set:{quantity:parseInt(s)+parseInt(req.body.quantity)}},{sort:{_id:-1}},(err,result)=>{
                if(err) return res.send(err)
                console.log(req.body.id+'stock up');
                res.redirect('/');
          
            }
        )
    });
});


app.post('/delete',(req,res)=>{
    db.collection('Inventory').findOneAndDelete({pid:req.body.id},(err,result)=>{
        if(err) return console.log(err);
        res.redirect('/');
    });
});


