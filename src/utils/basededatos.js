const mysql =require('mysql');

var conectar = mysql.createConnection({
    host: "127.0.0.1",     
    port: '3306',  
    user: "root", 
    password: "1QAws3ED_", 
    database: "proyecto_tienda"
  });

conectar.connect(function (err) {
    if (err) throw err;
    console.log("Database conectada")
})
module.exports = conectar;