/* Nos permite consultar el usuario en el caso que halla uno y en caso que exista un usuario
con los parametros enviados nos genera un TOKEN para el usuario y es retornado y en el caso
que no exista ese usuario, el token devolverá un valor nulo */

const Usuario = require("../models/usuarios.model");
const crypto = require("crypto")
const jwt = require("jsonwebtoken")

exports.login = function(req, res, next){

    let hashedpass = crypto.createHash("sha512").update(req.body.pass).digest("hex");

    Usuario.findOne({ usuario: req.body.usuario, pass: hashedpass}, function(err, usuario){
        let response = {
        token:null
        }

        if(usuario !== null){
            response.token = jwt.sign({
                id: usuario._id,
                usuario: usuario.usuario
            }, "__recret__")
        }
        res.json(response);
    })
}