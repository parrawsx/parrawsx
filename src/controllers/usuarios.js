const passport =require ('passport');
var mysql = require('mysql');


var connection = mysql.createConnection({ 
    host: "127.0.0.1",     
    port: '3306',  
    user: "root", 
    password: "1QAws3ED_", 
    database: "proyecto_tienda"
  });


exports.postsignup = (req,res,next)=>{
    //const Usuarios= CONSULTA

    email=req.body.email
    usuario=Usuarios.find(e=> e.correo ==email)
    if (usuario) {
        return res.status(400).send('email existente')
    }
    else{
        //insert query
        
        //insert query
    }
}

exports.postlogin =(req,res,next)=>{
    passport.authenticate('local',(err,usuario,info)=>{
        if (err) {
            next(err);
            
        }
        if(!usuario){
            return res.status(400).send('nousaurio')
        }
        req.logIn(usuario,(err)=>{
            if(err){
                next(err);
            }
            res.send('bien logeado')
        })
    })(req,res,next);
}

exports.logout = (req,res)=>{
    res.logout('salirse');
    res,send('assdasdasd');
}
