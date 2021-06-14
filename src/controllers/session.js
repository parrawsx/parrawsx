//backend.js
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
/*———— PASSPORT ————*/
app.use(passport.initialize());
app.use(passport.session());
/*———— PASSPORT ————*/
//END
//END
app.use(CookieParser());
/*———— SESSION ————*/
var options = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '1QAws3ED_',
    database: 'proyecto_tienda'
};
var sessionStore = new MySQLStore(options);

app.use(session({
    secret: 'secreto',
    name:'sesion',
    resave: false,
    saveUninitialized:false,
    }));
//=============================================================
