var nodemailer = require('nodemailer');

exports.sendEmail = function(req, res){
    let correo= req.body.correo;
    let cabecera= req.body.cabecera;
    let html= req.body.html;
    //tipo de servicio y autenticacion dentro de ese servicio
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'tiendaproyecto3@gmail.com',
            pass: 'llyjnhabcmaelbvm'
        }
    });
    //mandar el correo
    var mailOptions = {
    from: 'tiendaproyecto3@gmail.com',
    to: `${correo}`,
    subject: `${cabecera}`,
    text:null,
    html: `${html}` 
};
//respuesta
transporter.sendMail(mailOptions, function(error, info){
    console.log(mailOptions)
    if (error){
        console.log(error);
        res.send(500, err.message);
    } else {
        console.log("Email send");
        res.status(200).json(req.body);
    }
});
};