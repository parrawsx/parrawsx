/*———— Imports ————*/
const json  = require("body-parser");
const multer = require("multer");
const router = require("express").Router();
const path = require('path');
const MimeTypes = require('mime-types');



/*———— Controllers ————*/
const EmailCtrl = require('../controllers/mailcontroller');
const SkeletonController = require("../controllers/skeletonController");
const { error } = require("winston");

const NoController = (req, res, next) => {
    return res.status(418).json({ message: "I'm a teapot" });
};

         
//multerF
const storage = multer.diskStorage({
    destination:'./public/uploads' ,
    filename: function (req,res,cb) {
        console.log(req.body.nombre)
       cb("",res.originalname) 
    }
})
const upload = multer({ storage:storage })


//GET Y POST
/**getVersion */
router.get("/version", SkeletonController.getVersionId);
/**Obtenerofertas */
router.get('/Obtenerofertas', SkeletonController.getObtenerofertas);
/**Obtenerarticulos */
router.get('/Obtenerarticulos', SkeletonController.getObtenerarticulos);
/**filtrarticulos */
router.post('/filtrarticulos', SkeletonController.PostFiltroarticulos);
/**getmarcas */
router.get('/getmarcas', SkeletonController.getmarcas);
/**getcategoria */
router.get('/getcategoria', SkeletonController.getcategoria);
/**getproducto */
router.get('/getproducto', SkeletonController.getObtenerproducto);
/**registerusuario */
router.post('/registerusuario',SkeletonController.postañadirusuario);
/**loginusuario */
router.post('/loginusuario',SkeletonController.postloginusuario);

/**modificarusuario */
router.post('/modificarusuarioa',SkeletonController.postmodificarusuario);

/**loginmodificarusuario */
router.post('/logmodusuario',SkeletonController.postloginmodusuario);

/**enviar pedido */
router.post('/pedido',SkeletonController.postpedido);  

/**cambiar pedido inactivo */
router.post('/pedidoinactivo',SkeletonController.postpedidoinactivo);  

/**cambiar pedido inactivo */
router.post('/cesta',SkeletonController.postcesta);

/**Obtener productos de la cesta */
router.post('/obtenercesta',SkeletonController.postobtenercesta);

/**eliminar productos de la cesta  */
router.post('/elimnarprodcesta',SkeletonController.elimnarproductocesta);

/**obtener todos los productos para el administradpr */
router.get('/Obtenerarticulosadmin',SkeletonController.getObtenerarticulosadmin);

/**filtrar todos los productos para el administradpr */
router.post('/filtrarticulosadmin',SkeletonController.PostFiltroarticuloadmin); 

/**obtener todos los productos para el administradpr */
router.post('/chgactivo',SkeletonController.postchgactivo);

/**obtener todos los productos para el administradpr */
router.post('/anadirarticulo',SkeletonController.añadirarticuloadmin);
/**obtener todos los productos para el administradpr */
router.get('/obtenerpedidos',SkeletonController.obtenerpedidos);
/**obtener y crear un estado */
router.post('/crearestado',SkeletonController.crearestadopedido);
/**obtener pedidos filtrados */
router.post('/Filtrarpedidos',SkeletonController.Filtrarpedidos);
/**cambiar estado */
router.post('/cambiarestadopedido',SkeletonController.cambiarestadopedido); 
/**cambiar estado */
router.get('/getusuarios',SkeletonController.getusuarios);
/**cambiar estado */
router.post('/email', EmailCtrl.sendEmail);  
/**obtener atributos */
router.post('/getatributos',SkeletonController.getatributos);
/**camobiar atributos */
router.post('/newatrib',SkeletonController.newatributo);
 /**camobiar atributos */
router.post('/buscar',SkeletonController.buscar);
 /**camobiar atributos */
 router.post('/borrarstock',SkeletonController.borrarstock);
 /**camobiar atributos */
 router.post('/addproped',SkeletonController.añadirprodaped);
 /**camobiar atributos */
 router.post('/borrarcesta',SkeletonController.deletecesta);
 /**camobiar atributos */
 router.get('/proforofer',SkeletonController.getproductos);
 /**camobiar atributos */
 router.post('/eliminarstock',SkeletonController.eliminarstock);
 /**añadir stock */
 router.post('/anadirstock',SkeletonController.anadirstock);
/**añadir stock */
router.post('/anadirofertas',SkeletonController.añadiroferta);

/**putimagen */
router.post('/putimagen',upload.single('avatar'),(req,res)=>{
    res.sendFile(rutavistas +'paraartras.html');

});


  
//RUTAS DE VISTAS

//carpeta de views
let rutavistas =path.join( __dirname + '/../views/'); 

//index
router.get('/', (req,res)=>{
    res.sendFile(rutavistas +'index.html');

    });

//ruta pagina2
router.get('/productos', (req,res)=>{
    res.sendFile(rutavistas +'productos.html');
    });

//ruta pagina3
router.get('/producto', (req,res)=>{
    res.sendFile(rutavistas +'producto.html');
    }); 


//login
router.get('/login', (req,res)=>{
    res.sendFile(rutavistas +'login.html');
    });

//register
router.get('/register', (req,res)=>{
    res.sendFile(rutavistas +'register.html');
    });
    
//ruta modusuario
router.get('/modificarusuario', (req,res)=>{
    res.sendFile(rutavistas +'modificarusuario.html');
    }); 

//ruta cesta
router.get('/cesta', (req,res)=>{
    res.sendFile(rutavistas +'cesta.html');
    }); 

    //ruta cesta
router.get('/pedidos', (req,res)=>{
    res.sendFile(rutavistas +'pedidos.html');
    }); 



//ruta css
let rutaccs = path.join(__dirname + '/../../public/css');
console.log(rutaccs)


    router.get('/css/articulo', (req,res)=>{
        res.sendFile(rutaccs + '/articulo.css');
        });

    router.get('/css/base', (req,res)=>{
        res.sendFile(rutaccs +'/base.css');
        });

    router.get('/css/index', (req,res)=>{
        res.sendFile(rutaccs +'/index.css');
        }); 

    router.get('/css/normalizador', (req,res)=>{
        res.sendFile(rutaccs +'/normalizador.css');
        }); 

    router.get('/css/productos', (req,res)=>{
        res.sendFile(rutaccs +'/productos.css');
        }); 

    router.get('/css/reseteador', (req,res)=>{
        res.sendFile(rutaccs +'/reseteador.css');
        }); 



module.exports = router;
