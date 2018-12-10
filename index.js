const mysql = require ('mysql');
const express = require('express');

var app = express();
const bodyparser = require('body-parser');
app.use(bodyparser.json());

 var mysqlConnection =mysql.createConnection({
     host:'localhost',
     user:'root',
     password:'root',
     database:'node',
     multipleStatements:true

 })

 mysqlConnection.connect((err)=>{
     if(!err){
         console.log("connected");
     }
     else{
        console.log("disconnected");
     }
    
 })

 app.listen(3031,()=>console.log('express server running'));

 app.get('/getuser',(req,res)=>{
    mysqlConnection.query('SELECT * FROM user',(err,rows,fields)=>{
        if(!err){
            res.send(rows);
        }
        else{
            console.log(err);
        }
    })
 })
 app.get('/getus/:sno',(req,res)=>{
    mysqlConnection.query('SELECT u.name,b.book FROM user as u join book as b on u.sno=b.map_id  WHERE u.sno=?',[req.params.sno],(err,rows,fields)=>{
        if(!err){
            if(!rows.length){
                res.send('No Record found for this sno=>'+req.params.sno);
            }
            else{
            res.send(rows[0]); 
            }
        }
        else{
            console.log(err);
        }
    })
 })
 app.post('/add',(req,res)=>{
    
    mysqlConnection.query('INSERT INTO user(name,email,password) VALUES (?,?,?)',[req.body.name,req.body.email,req.body.password],(err,rows,fields)=>{
if(!err){
    mysqlConnection.query('SELECT sno FROM user where name=?',[req.body.name],(err,rows,fields)=>{
        if(!err){
            
            mysqlConnection.query('INSERT INTO book (map_id,book) VALUES (?,?)',[rows[0].sno,req.body.book],(err,rows,fields)=>{
                if(!err){
                    res.send('Inserted');
                }else{
                    console.log('failed'+err)
                }
                    })
        }
        else{
            console.log(err);
        }
    })
}else{
    res.send('failed');
}
    })
    })
 
app.put('/update',(req,res)=>{
    mysqlConnection.query('UPDATE user SET name=?,email=?,password=? where sno=?',[req.body.name,req.body.email,req.body.password,req.body.sno],(err,rows,fields)=>{
if(!err){
    res.send('Updated==-->'+req.body.name);
}else{
    console.log('failed')
}
    })
 })
 