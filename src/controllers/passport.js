const passport =require ('passport');
const localstrategy = require('passport-local').Strategy;
var mysql = require('mysql');
var Usuarios=[];
let usuario;
var connection = mysql.createPool({
    connectionLimit: 10,
    host: "127.0.0.1",     
    port: '3306',  
    user: "root", 
    password: "1QAws3ED_", 
    database: "proyecto_tienda"
  });

// node native promisify
SelectAllElements = () =>{
  return new Promise((resolve, reject)=>{
    connection.query('SELECT * FROM usuario ',  (error, elements)=>{
          if(error){
              return reject(error);
          }
          return resolve(elements);
      });
  });
};

(async () => {
  const users = await SelectAllElements();
  
  passport.serializeUser((usuario,done)=>{
    done (null,usuario.id);
  }
  )
  passport.deserializeUser((id,done)=>{
    
    obtenerusuarios();
    console.log(Usuarios)
    usuario=Usuarios.find(e=> e.id ==id)
    done(err,usuario)
  })

  passport.use(new localstrategy(
    {userfield:'email'},
    (email,password,done)=>{
      
      usuario=Usuarios.find(e=> e.correo ==email)
      if (!usuario) {
        done(null,false,{Message:'este correo no existe'})
        
      }
      else{
        if(usuario.passwd==password){
          done(null,usuario)
        }
        else{
          done(null,false,{Message:'La contraseña esta mal'})
        }
      }

    }

  ))

  exports.userautenticado = (req,res,next)=>{
    if(req.isAuthenticated()){
      return next();
    }
    res.satus(401).send('Registrate')
  }








})()
