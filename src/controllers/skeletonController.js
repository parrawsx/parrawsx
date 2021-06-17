const logger = require("../utils/logger");
const express = require('express');
const { truthy } = require("../utils/_checkers");
const pjson = require("../../package.json");
const myConection = require('express-myconnection');   
const json  = require("body-parser");
const mysql = require('mysql');
const Cryptr = require('cryptr');

encriptacion = new Cryptr('parra')


var connection = mysql.createPool({
    connectionLimit: 10,
    host: "127.0.0.1",     
    port: '3306',  
    user: "root", 
    password: "1QAws3ED_", 
    database: "proyecto_tienda",

  });

module.exports = {
    getVersionId: getVersion,
    getObtenerofertas:getObtenerofertas, 
    getObtenerarticulos:getObtenerarticulos,
    PostFiltroarticulos:PostFiltroarticulos,
    getcategoria:getcategoria, 
    getmarcas:getmarcas,
    getObtenerproducto:getObtenerproducto,
    postañadirusuario:postañadirusuario,
    postloginusuario:postloginusuario, 
    postmodificarusuario:postmodificarusuario,
    postloginmodusuario:postloginmodusuario,
    postpedido:postpedido,
    postpedidoinactivo:postpedidoinactivo,
    postcesta:postcesta,
    postobtenercesta:postobtenercesta,
    elimnarproductocesta:elimnarproductocesta,
    getObtenerarticulosadmin:getObtenerarticulosadmin,
    PostFiltroarticuloadmin:PostFiltroarticuloadmin,
    postchgactivo:postchgactivo,
    añadirarticuloadmin:añadirarticuloadmin,
    obtenerpedidos:obtenerpedidos,
    crearestadopedido:crearestadopedido,
    Filtrarpedidos:Filtrarpedidos,
    cambiarestadopedido:cambiarestadopedido,
    getusuarios:getusuarios,
    getatributos:getatributos,
    newatributo:newatributo,
    buscar:buscar,
    borrarstock:borrarstock,
    añadirprodaped:añadirprodaped,
    deletecesta:deletecesta,
    getproductos:getproductos,
    añadiroferta:añadiroferta,
    eliminarstock:eliminarstock,
    anadirstock:anadirstock,
};
/**
 * Function to get version of skeleton api
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
function getVersion(req, res, next) {
    try {
        logger.info("skeletonController - getVersion Inicio del método.");
        //truthy(0!=0)("Error de prueba", 400); se pronuncia tal que así trudi
        return res.status(200).json({ message: "Versión " + pjson.version, status: "ok " });
    } catch (err) {
        res.status(400).send(err);
    } finally {
        logger.info("skeletonController - getVersion Fin del método.");
    }
};

//GET
//obtener los articulos que estan en la tabla oferta
//usado en index y producto
function getObtenerofertas (req,res) {

    req.getConnection((err,con) =>{
        if (err) {
            console.log('mal')
        }
        else{
            
        con.query(`select oferta.*,productos.*,(Precio-(Precio*descuento/100)) as precdesc, count(stockproductos.id_stock) as stock from oferta,productos,stockproductos where oferta.ID_producto = productos.ID_producto and  productos.ID_producto = stockproductos.id_articulo group by productos.ID_producto;`, (err, result) => {
            if (err) console.log(err);
                let parseado =JSON.stringify(result)
                parseado=JSON.parse(parseado)                
                return res.status(200).json(parseado);
                
        })

        }
    });
}
//GET
//obtener todos los articulos de una categoria 
// usado en productos


//cambiado 
function getObtenerarticulos (req,res) {

    

    req.getConnection((err,con) =>{
        let pepe = req.headers.categoria == "null" ?`select productos.*,count(stockproductos.id_stock) as stock from productos ,stockproductos where stockproductos.id_articulo=productos.ID_producto and  activo = true group by Nombre;`:`select productos.*,count(stockproductos.id_stock) as stock from productos ,stockproductos where stockproductos.id_articulo=productos.ID_producto  and  id_categoria=${req.headers.categoria} and  activo = true group by Nombre;`
        if (err) {   
            console.log('mal')
        }


        else{
        con.query(pepe,(err, result) => {
            if (err) console.log(err);
                let parseado =JSON.stringify(result)
                parseado=JSON.parse(parseado)                
                return res.status(200).json(parseado);
                
        })

        }
    });
};
//POST
//obtener todos los articulos con una serie de condiciones
// usado en productos
function PostFiltroarticulos (req,res) {

    req.getConnection((err,con) =>{
        let PrecioMax = req.body.PrecioMax;
        let PrecioMin = req.body.PrecioMin ;
        let Marca =req.body.Marca;
    
        let categoria=req.body.categoria;
        let order =req.body.order;
        
        let pepe =`select productos.*,count(stockproductos.id_stock) as stock from productos ,stockproductos where stockproductos.id_articulo=productos.ID_producto  and Precio>? and Precio<? and id_categoria  IN (?) and marca IN (${Marca})  and  activo = true group by ID_producto order by ?;`;

        if (err) {   
            console.log('mal')
        }

        else{
        con.query(pepe,[PrecioMin,PrecioMax,categoria,order],(err, result) => {
            if (err) console.log(err);
                let parseado =JSON.stringify(result)
                parseado=JSON.parse(parseado)   
                console.log(parseado)             
                return res.status(200).json(parseado);
        })

        }
    });
};
//GET
//obtener todas las marcas que tienen los productos
// usado en productos
function getmarcas (req,res) {
    
    req.getConnection((err,con) =>{
        
        let query ='select DISTINCT(Marca),id_categoria from productos;';

        if (err) {
            console.log('mal')
        }
        
        else{
        con.query(query, (err, result) => {
            if (err) console.log(err);
                let parseado =JSON.stringify(result)
                parseado=JSON.parse(parseado)              
                return res.status(200).json(parseado);
                
        })

        }

    });

}
//GET
//obtener todas las categoriasque tienen los productos
// usado en productos
function getcategoria (req,res) {
    req.getConnection((err,con) =>{
        let query ='select DISTINCT(productos.id_categoria), categoria.Nombre from productos,categoria where categoria.id_categoria=productos.id_categoria;';
        if (err) {
            console.log('mal')
        }
        else{
 
        con.query(query, (err, result) => {
            if (err) console.log(err);
                let parseado =JSON.stringify(result)
                parseado=JSON.parse(parseado)                
                return res.status(200).json(parseado);
                
        })

        }
    });
}
//GET
//obtener un producto con un ID
// usado en producto
function getObtenerproducto (req,res) {

    req.getConnection((err,con) =>{
        let pepe = `select productos.*, count(stockproductos.id_stock) as stock from productos ,stockproductos where stockproductos.id_articulo=productos.ID_producto and productos.ID_producto =${req.headers.articulo} and activo=true;`
        if (err) {   
            console.log('mal')
        }


        else{
        con.query(pepe,(err, result) => {
            if (err) console.log(err); 
                let parseado =JSON.stringify(result)
                parseado=JSON.parse(parseado)                
                return res.status(200).json(parseado);
                
        }) 

        }
    });
};
//POST
//Insertar un usuario en la base de datos
// usado en register
function postañadirusuario(req,res){
    req.getConnection((err,con) =>{

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
            
        let nombre = req.body.nombre;
        let passwd = encriptacion.encrypt(req.body.passwd); 
        let correo =req.body.correo;
        existe=users.find(e=>e.nickname==nombre)


        let accion =`INSERT INTO usuario (nickname,passwd,correo,rol)VALUES (?,?,?,2);`;

        if (err) {   
            console.log('mal')
        }

       else{
           if(!existe){
                con.query(accion,[nombre,passwd,correo],(err, result) => {
                    if (err) console.log(err);
                        let parseado =JSON.stringify(result)
                        parseado=JSON.parse(parseado)                  
                        return res.status(200).json(parseado);
                }) 
            }
            else{
                return res.status(200).json({message:"error",error:"El usuario ya existe"});
            }
            }
        })()
    });
};

//POST
//buscar un usuario en la base de datos
// usado en login

function postloginusuario (req,res){

    req.getConnection((err,con) =>{

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

    req.getConnection((err,con) =>{
        let nombre = req.body.nombre;
        let passwd = req.body.passwd;
        existe=users.find(e=>e.nickname==nombre)
        console.log(existe)

        

        if(existe){
            let accion =`Select * from usuario where nickname=?`;
            if (err) {   
                console.log('mal')
            }
            else{
                if (passwd==encriptacion.decrypt(existe.passwd)) {

            
                passwd==encriptacion.decrypt(existe.passwd)
                con.query(accion,[nombre],(err, result) => {
                    if (err) console.log(err);
                        let parseado =JSON.stringify(result)
                        parseado=JSON.parse(parseado) 
                        return res.status(200).json(parseado);
                    })
                }
                else{
                    return res.status(200).json({message:"error",error:"El usuario o la contraseña estan mal"}); 
                }
            }
        }
        else{
            return res.status(200).json({message:"error",error:"El usuario no existe"});  
        }
    });
    })()
    });
};  

//POST
//modificar un usuario en la base de datos
// usado en modificarusuario
function postmodificarusuario(req,res){
    req.getConnection((err,con) =>{

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
        let nombre = req.body.nombre;
        let correo =req.body.correo;
        let id =req.body.id
        let existe=users.find(e=>e.id==id)  
        let passwd = req.body.passwd=="null" ? existe.passwd: encriptacion.encrypt(req.body.passwd) ;
        let accion =`UPDATE usuario SET nickname=? ,  passwd=? , correo=? WHERE id=?;`;

        if (err) {   
            console.log('mal')
        }

       else{
                con.query(accion,[nombre,passwd,correo,id],(err, result) => { 
                    if (err) console.log(err);
                        let parseado =JSON.stringify(result)
                        parseado=JSON.parse(parseado)                
                        return res.status(200).json(parseado);
                })
            }
        })()
    });
};
//POST
//buscar un usuario por id en la base de datos
// usado en login
function postloginmodusuario (req,res){
    req.getConnection((err,con) =>{
        let id =req.body.id

        let accion =`Select * from usuario where id=?`;

        if (err) {   
            console.log('mal')
        }

        else{
            con.query(accion,[id],(err, result) => {
                if (err) console.log(err);
                    let parseado =JSON.stringify(result)
                    parseado=JSON.parse(parseado) 
                    return res.status(200).json(parseado);
            })
            }
    });
}; 

//POST
//insertar datos en la tabla de pedidos
// usado en producto y cesta
function postpedidoinactivo (req,res){
    req.getConnection((err,con) =>{
        let id_producto =req.body.id_producto



        let accion =`UPDATE productos  SET Activo=false  WHERE ID_producto=?;`;

        if (err) {   
            console.log('mal')
        }

        else{
            con.query(accion,[id_producto],(err, result) => {
                if (err) console.log(err);
                    let parseado =JSON.stringify(result)
                    parseado=JSON.parse(parseado) 
                    return res.status(200).json(parseado);
            })
            }
    });
}; 
//POST
//insertar datos en la tabla de pedidos
// usado en producto y cesta
function postpedido (req,res){
    req.getConnection((err,con) =>{
        let usuario =req.body.usuario


        let accion =`INSERT INTO pedido (id_usuario)VALUES (?);`;

        if (err) {   
            console.log('mal')
        }

        else{
            con.query(accion,[usuario],(err, result) => {
                if (err) console.log(err);
                    let parseado =JSON.stringify(result)
                    parseado=JSON.parse(parseado)  
                    return res.status(200).json(parseado); 
            })
            }
    });
}; 

//POST
//insertar datos en la tabla de cesta
// usado en producto y cesta

function postcesta (req,res){
    req.getConnection((err,con) =>{
        let usuario =req.body.usuario
        let producto =req.body.producto
        let Precio =req.body.Precio

        let accion =`INSERT INTO cesta (idusuario,idproducto,Precio)VALUES (?,?,?);`;

        if (err) {   
            console.log('mal') 
        }

        else{  
            con.query(accion,[usuario,producto,Precio],(err, result) => {
                if (err) console.log(err);
                    let parseado =JSON.stringify(result)
                    parseado=JSON.parse(parseado) 
                    return res.status(200).json(parseado);
            })
            }
    });
};

//POST
//recoger datos en la tabla de cesta
// usado en cesta

function postobtenercesta (req,res){
    req.getConnection((err,con) =>{ 
        let usuario =req.body.usuario

        let accion =`Select * ,count(idproducto) as cantidad from cesta where idusuario=${usuario} group by idproducto;`;

        if (err) {   
            console.log('mal')
        }

        else{ 
            con.query(accion,(err, result) => {
                if (err) console.log(err); 
                    let parseado =JSON.stringify(result)
                    parseado=JSON.parse(parseado) 
                    return res.status(200).json(parseado);
            })
            }
    });
}; 


//POST
//eliminar datos en la tabla de cesta
// usado cesta
function elimnarproductocesta(req,res){
    req.getConnection((err,con) =>{

        SelectAllElements = () =>{
            return new Promise((resolve, reject)=>{
                let producto = req.body.producto;
                let usuario = req.body.usuario;
              connection.query(`select idCesta from cesta where  idproducto=? and idusuario=? group by idproducto,idusuario having idCesta=min(idCesta)`,[producto,usuario],  (error, elements)=>{
                    if(error){
                        return reject(error);
                    }
                    return resolve(elements);
                }); 
            });
          }; 


        (async () => { 
                const estado = await SelectAllElements(); 
                console.log(estado[0].idCesta)
                if (err) {   
                    console.log('mal')
                }
 
                else{
                   con.query(`DELETE FROM cesta WHERE idCesta in (${estado[0].idCesta});`,(err, result) => {
                    if (err) console.log(err);
                    let parseado =JSON.stringify(result)
                    parseado=JSON.parse(parseado)   
                    console.log(parseado)   
                   
                    return res.status(200).json(parseado);
                    })
                }

        })()
    });
}; 

//GET
//recoger articulos para admin
// usado productos
function getObtenerarticulosadmin (req,res) {
 

    req.getConnection((err,con) =>{
        let pepe = req.headers.categoria == "null" ?`select productos.*,count(stockproductos.id_stock) as stock from productos LEFT JOIN stockproductos ON productos.ID_producto = stockproductos.id_articulo group by ID_producto ;`:
        `select productos.*,count(stockproductos.id_stock) as stock from productos LEFT JOIN stockproductos ON productos.ID_producto = stockproductos.id_articulo where id_categoria=${req.headers.categoria} group by ID_producto ;`
        
        if (err) {   
            console.log('mal')
        }

        else{
        con.query(pepe,(err, result) => {
            if (err) console.log(err);
                let parseado =JSON.stringify(result)
                parseado=JSON.parse(parseado)                
                return res.status(200).json(parseado);
                
        })

        }
    });
};

//POST
//obtener todos los articulos con una serie de condiciones
// usado en productos
function PostFiltroarticuloadmin (req,res) {

    req.getConnection((err,con) =>{
        let PrecioMax = req.body.PrecioMax;
        let PrecioMin = req.body.PrecioMin ;
        let Marca =req.body.Marca;
    
        let categoria=req.body.categoria;
        let order =req.body.order;
        
        let pepe =`select productos.*,count(stockproductos.id_stock) as stock from productos LEFT JOIN stockproductos ON productos.ID_producto = stockproductos.id_articulo where  Precio>? and Precio<? and id_categoria  IN (?) and marca IN (${Marca}) and  activo = true group by ID_producto ; order by ?;`;

        if (err) {   
            console.log('mal')
        }

        else{
        con.query(pepe,[PrecioMin,PrecioMax,categoria,order],(err, result) => {
            if (err) console.log(err);
                let parseado =JSON.stringify(result)
                parseado=JSON.parse(parseado)                
                return res.status(200).json(parseado);
        })

        }
    });
};



//POST
//cambiar un producto a activo
// usado en cesta
function postchgactivo (req,res){
    req.getConnection((err,con) =>{
        let id_producto =req.body.id
        let ACTIVO =req.body.activo



        let accion =`UPDATE productos  SET Activo=${ACTIVO}  WHERE ID_producto=? ;`;

        if (err) {   
            console.log('mal')
        }

        else{
            con.query(accion,[id_producto],(err, result) => {
                if (err) console.log(err);
                    let parseado =JSON.stringify(result)
                    parseado=JSON.parse(parseado) 
                    return res.status(200).json(parseado);
            })
            }
    });
}; 

//POST
//añadir articulo
// usado en producto
function añadirarticuloadmin (req,res){
    req.getConnection((err,con) =>{
        let categoria = req.body.categoria;
        let nombre = req.body.nombre;
        let precio = req.body.precio;
        let marca = req.body.marca;
        let urlfoto = req.body.urlfoto;
        let accion =`insert into productos (id_categoria,Nombre,Precio,Marca,Foto_ruta,Activo,Fecha) VALUES (?,?,?,?,?,true,now());`;
 

        if (err) {   
            console.log('mal')
        }

        else{
            con.query(accion,[categoria,nombre,precio,marca,urlfoto],(err, result) => {
                if (err) console.log(err);
                    let parseado =JSON.stringify(result)
                    parseado=JSON.parse(parseado) 
                    return res.status(200).json(parseado);
            })
            }
    });
}; 

//GET
//recoger articulos para admin
// usado pedido
function obtenerpedidos (req,res) {
 

    req.getConnection((err,con) =>{
        let pepe = `select * from pedido;`;
        if (err) {   
            console.log('mal')
        }


        else{
        con.query(pepe,(err, result) => {
            if (err) console.log(err);
                let parseado =JSON.stringify(result)
                parseado=JSON.parse(parseado)                
                return res.status(200).json(parseado);
                
        })

        }
    });
};


//POST
//modificar un usuario en la base de datos
// usado en modificar usuario
function crearestadopedido(req,res){
    req.getConnection((err,con) =>{
 
        idpedido=req.body.idpedido
        let accion =`INSERT INTO estado (Id_pedido, Descripcion)VALUES ("${idpedido}", "Pendiente de pago");`;

        if (err) {   
            console.log('mal')
        }

       else{
                con.query(accion,(err, result) => {
                    if (err) console.log(err);
                        let parseado =JSON.stringify(result)
                        parseado=JSON.parse(parseado)                
                        return res.status(200).json(parseado);
                })
            }
    });
};



//POST
//añadir articulo
// usado en producto
function Filtrarpedidos (req,res){
    req.getConnection((err,con) =>{

        let PrecioMax=req.body.PrecioMax ;
        let PrecioMin=req.body.PrecioMin;
        let usuario=req.body.usuario=='%'?'%':req.body.usuario;
        let Estado=req.body.Estado=='%'?'%':req.body.Estado;


        let accion =`select pedido.Id_pedido,usuario.nickname, preciototal.precio,estado.Descripcion
        from estado,usuario,pedido,(select sum(Precio) as precio ,Id_pedido from pedidoproductos group by Id_pedido) as preciototal
        where  pedido.Id_pedido=preciototal.Id_pedido and pedido.Id_pedido=estado.Id_pedido and pedido.id_usuario=usuario.id
        and usuario.id like '${usuario}' and preciototal.precio<? and preciototal.precio>? and estado.Descripcion like '${Estado}';`;


        if (err) {    
            console.log('mal')
        }

        else{
            con.query(accion,[PrecioMax,PrecioMin],(err, result) => {
                if (err) console.log(err);
                    let parseado =JSON.stringify(result)
                    parseado=JSON.parse(parseado) 
                    return res.status(200).json(parseado);
            })
            }
    });
}; 

//POST
//añadir articulo
// usado en producto y cesta
function cambiarestadopedido (req,res){
    req.getConnection((err,con) =>{

        let Id_pedido=req.body.Id_pedido
        let estado=req.body.estado



        let accion =`UPDATE estado SET Descripcion =?  WHERE Id_pedido=?;`;


        if (err) {   
            console.log('mal')
        }

        else{
            con.query(accion,[estado,Id_pedido],(err, result) => {
                if (err) console.log(err);
                    let parseado =JSON.stringify(result)
                    parseado=JSON.parse(parseado) 
                    return res.status(200).json(parseado);
            })
            }
    });
}; 

//GET
//recoger todos los usuarios
// usado ----------------------------
function getusuarios (req,res) {
    req.getConnection((err,con) =>{
        let pepe = `select id,nickname from usuario;`;
        if (err) {   
            console.log('mal')
        }


        else{
        con.query(pepe,(err, result) => {
            if (err) console.log(err);
                let parseado =JSON.stringify(result)
                parseado=JSON.parse(parseado)                
                return res.status(200).json(parseado);   
        })
        }
    });
};

//POST
//buscar todos los atributos de un productos
// usado en producto y cesta
function getatributos (req,res){
    req.getConnection((err,con) =>{

        let nombreproducto=req.body.nombreproducto




        let accion =`select * from atributo where nombreproducto=?`


        if (err) {   
            console.log('mal')
        }

        else{
            con.query(accion,[nombreproducto],(err, result) => {
                if (err) console.log(err);
                    let parseado =JSON.stringify(result)
                    parseado=JSON.parse(parseado) 
                    return res.status(200).json(parseado);
            })
            }
    });
}; 

//POST
//insertar nuevo atributo a un productos
// usado en producto y cesta
function newatributo (req,res){
    req.getConnection((err,con) =>{

        let categoria=req.body.categoria;
        let nombreprod=req.body.nombreprod;
        let nombreatrib=req.body.nombreatrib;
        let valoratrib=req.body.valoratrib;




        let accion =`INSERT INTO atributo (id_categoria,Nombre,Valor,nombreproducto) VALUES (?,?,?,?);
        `;


        if (err) {   
            console.log('mal')
        }

        else{
            con.query(accion,[categoria,nombreatrib,valoratrib,nombreprod],(err, result) => {
                if (err) console.log(err);
                    let parseado =JSON.stringify(result)
                    parseado=JSON.parse(parseado) 
                    return res.status(200).json(parseado);
            })
            }
    });
}; 

//POST
//insertar nuevo atributo a un productos
// usado en producto y cesta
function buscar (req,res){
    req.getConnection((err,con) =>{

        let Busqueda=req.body.Busqueda;
 
        let accion =`select productos.*,count(stockproductos.id_stock) as stock from productos ,stockproductos where stockproductos.id_articulo=productos.ID_producto  and (nombre like ? or marca like ?) and activo = true group by ID_producto `;
        if (err) {
           throw error;
        } 

        else{
            con.query(accion,[`%${Busqueda}%`,`%${Busqueda}%`],(err, result) => { 

                if (err) console.log(err);
                    let parseado =JSON.stringify(result) 
                    parseado=JSON.parse(parseado) 
                    return res.status(200).json(parseado);
            })
            }
    });
}; 



//POST
//modificar un usuario en la base de datos
// usado en modificar usuario
function borrarstock(req,res){
    req.getConnection((err,con) =>{

        SelectAllElements = () =>{
            return new Promise((resolve, reject)=>{
                let idarticulo = req.body.idarticulo;
              connection.query(`select min(id_stock) as minstock from stockproductos  group  by id_articulo having id_articulo=${idarticulo};`,[idarticulo],  (error, elements)=>{
                    if(error){
                        return reject(error);
                    }
                    return resolve(elements);
                });
            });
          }; 

 
        (async () => { 
                const stock = await SelectAllElements(); 

                if (err) {   
                    console.log('mal')
                }

                else{
                   con.query(`DELETE FROM stockproductos WHERE id_stock in (${stock[0].minstock});`,(err, result) => {
                    if (err) console.log(err);
                    let parseado =JSON.stringify(result)
                    parseado=JSON.parse(parseado)   
                    console.log(parseado)   
                   
                    return res.status(200).json(parseado);
                    })
                }

        })()
    });
}; 


//POST
//modificar un usuario en la base de datos
// usado en modificar usuario
function añadirprodaped(req,res) {
    req.getConnection((err,con) =>{
        idpedido=req.body.idpedido;
        producto=req.body.producto;
        cantidad=req.body.cantidad;
        Precio=req.body.Precio;

        if (err) {    
            console.log('mal') 
        }  

        else{
            con.query( `INSERT INTO pedidoproductos(Id_pedido,ID_producto,cantidad,Precio)VALUES(${idpedido},?,?,?);`,[producto,cantidad,Precio],(err, result) => {
                if (err) console.log(err);
                    let parseado =JSON.stringify(result)
                    parseado=JSON.parse(parseado) 

                    return res.status(200).json(parseado);
            })
            } 
    });

};

//POST
//modificar un usuario en la base de datos
// usado en modificar usuario
function deletecesta(req,res) {
    req.getConnection((err,con) =>{
        usuario=req.body.usuario;


        if (err) {    
            console.log('mal') 
        }  

        else{
            con.query( `DELETE FROM proyecto_tienda.cesta WHERE idusuario=?;;`,[usuario],(err, result) => {
                if (err) console.log(err);
                    let parseado =JSON.stringify(result)
                    parseado=JSON.parse(parseado) 

                    return res.status(200).json(parseado);
            })
            } 
    });

};


//GET
//obtener los articulos que estan en la tabla oferta
//usado en index y producto
function getproductos (req,res) {

    req.getConnection((err,con) =>{
        if (err) {
            console.log('mal')
        }
        else{
            
        con.query(`select ID_producto,Nombre from productos  where ID_producto NOT in (select ID_producto from oferta);`, (err, result) => {
            if (err) console.log(err);
                let parseado =JSON.stringify(result)
                parseado=JSON.parse(parseado)                
                return res.status(200).json(parseado);
                
        })

        }
    });
}

//POST
//modificar un usuario en la base de datos
// usado en modificar usuario 
function añadiroferta(req,res) {
    req.getConnection((err,con) =>{
        descripcion=req.body.descripcion;
        idproducto=req.body.idproducto;
        fechainicio=req.body.fechainicio; 
        fechafinal=req.body.fechafinal;
        descuento=req.body.descuento;

        if (err) {    
            console.log('mal') 
        }  
        else{ 
            con.query( `INSERT INTO proyecto_tienda.oferta(descripcion,ID_producto,fechInicio,Fechafinal,descuento) VALUES(?,?,?,?,?);`,[descripcion,idproducto,fechainicio,fechafinal,descuento],(err, result) => {
                if (err) console.log(err);
                    let parseado =JSON.stringify(result)
                    parseado=JSON.parse(parseado) 

                    return res.status(200).json(parseado);
            })
            } 
    });

};

//POST
//modificar un usuario en la base de datos
// usado en modificar usuario
function eliminarstock(req,res) {
    req.getConnection((err,con) =>{
        idarticulo=req.body.idarticulo;

        if (err) {    
            console.log('mal') 
        }  
        else{ 
            con.query( `DELETE FROM stockproductos WHERE stockproductos.id_articulo = ?;`,[idarticulo],(err, result) => {
                if (err) console.log(err);
                    let parseado =JSON.stringify(result)
                    parseado=JSON.parse(parseado) 

                    return res.status(200).json(parseado);
            })
            } 
    });

};
//POST
//modificar un usuario en la base de datos
// usado en modificar usuario
function anadirstock(req,res) {
    req.getConnection((err,con) =>{
        idarticulo=req.body.idarticulo;

        if (err) {    
            console.log('mal') 
        }  
        else{ 
            con.query( `INSERT INTO stockproductos(id_articulo) VALUES(?);`,[idarticulo],(err, result) => {
                console.log(idarticulo);
                if (err) console.log(err);
                    let parseado =JSON.stringify(result)
                    parseado=JSON.parse(parseado) 

                    return res.status(200).json(parseado);
            })
            } 
    });

};








