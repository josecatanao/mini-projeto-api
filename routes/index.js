var express = require('express');
var router = express.Router();
const app = express()
const jwt = require("jsonwebtoken");
const Users = require('../db/users');
const nodemailer = require("nodemailer");

app.use(express.static('public'))



/*Eu sei que esse é um dado secreto,
 só estou colocando aqui para diminuir complexidade*/
 const SECRET = "jose";


function verifyJWT(req,res,next){
  const token = req.headers['x-access-token'];
  jwt.verify(token,SECRET,(err,decoded)=>{
    if(err) return res.status(401).end();
    req.userId = decoded.userId;
    next();
  })
}

let transporter = nodemailer.createTransport({
  host:"smtp-mail.outlook.com",
  port:587,
  secureConnection:false,
  tls: {
    ciphers: 'SSLv3'
    },
    requireTLS:true,
  auth:{
    /*coloque seu email e senha aqui */
    user:"jose.catanao@hotmail.com",
    pass:"Josecatanao@2000"
  }
});

(async () => {
  const database = require('../db/db');
   await database.sync(); 

    
    /* Função que apaga usuarios nãoa validados em meia hora */
    /*
    function intervalFunc() {

      Users.destroy({
        where: {
           validated:false
        }
      })
      console.log("apagado com sucesso");
       }
      setInterval(intervalFunc,1800000); */
  
})();

/* valaida o codigo enviado para o email */
router.post('/validacodigo', function (req, res) {
       (async function () {
        var { codigo } = req.body
       let userd = await Users.findOne({where: {cod: codigo } });
       if(userd != null){
          if(codigo == userd.cod){
                await Users.update({ validated: true }, {
                  where: {
                    cod: codigo
                  }
                });
            res.header("Access-Control-Allow-Origin", "*");
            res.json({
              "message": "Usuario verificado com sucesso!"
            });
        }
        }else{
          res.header("Access-Control-Allow-Origin", "*");
          res.json({
            "message": "Esse codigo não existe"
          });
       }
      })();
  })




/* Realiza o login do usuario */
router.post('/login', function (req, res) {
     (async function () {
      try {
          var { name, password } = req.body
          let userd = await Users.findOne({where: { name: name, password: password } });
          if(name == userd.name && password == userd.password && userd.validated == true ){
            const token = jwt.sign({userId:1},SECRET,{expiresIn:300});
            res.json({
               id:userd.id,
               name:userd.name,
               })
          }else{
            res.header("Access-Control-Allow-Origin", "*");
            res.json({
              "Warning": "Usuario não validado"
            });
          }
        } catch (e) {
          res.header("Access-Control-Allow-Origin", "*");
          res.json({
              "message": "user ou password não existe."
            });
       }

    })();
});

/* Mostra todos os usuários */
router.get('/', function (req, res) {
  (async function () {
    let users = await Users.findAll();
    res.header("Access-Control-Allow-Origin", "*");
    res.json(users);
  })();
});
/***************************/

/* Mostra um usuario pelo id. */
router.get('/:id', function (req, res) {
  var { id } = req.params;
  (async function () {
    let user = await Users.findAll({ where: { id: id } });
    res.header("Access-Control-Allow-Origin", "*");
    res.json(user);
  })();
});
/***************************/

/* Cadastra um usuario. */
router.post('/cadastro', function (req, res) {
    (async function () {
      var { name, email, password } = req.body
      let user = await Users.findAll({ where: { name: name } });
      if (Object.values(user).length === 0) {

        let cod = Math.floor(Math.random() * 900000) + 100000
        transporter.sendMail({
          from:"Seu codigo <jose.catanao@hotmail.com>",
          to:email,
          subject:"Seu código chegou",
          html:`<h3>Você estar apenas a um passo </h3> </br> <p>Seu código é: <b>${cod}</b></p>`
        }).then(mes=>{
          console.log(mes);
        }).catch(err=>{
          console.log(err);
        })
        const novoUser = Users.create({
          name: name,
          email: email,
          password: password,
          cod: cod, 
        });
        res.header("Access-Control-Allow-Origin", "*");
        res.json({
          "message": "Usuario cadastrado! Enviamos um codigo para seu email!"
        });
      } else {
        res.header("Access-Control-Allow-Origin", "*");
        res.json({
          "message": "Já existe um usario com esse nome"
        })

      }
    })();
});
/***************************/

/* Editando dados do usuario */
router.put('/:id', function (req, res) {
  var { id } = req.params;
  var { name, email, password } = req.body;
  (async function () {
    let user = await Users.findByPk(id);
    user.name = name;
    user.email = email;
    user.password = password;
    await user.save();
    res.header("Access-Control-Allow-Origin", "*");
    res.json({
      "message": "Dados atualizados"
    });
  })();
});
/***************************/

/* apaga o usuario pelo id */
router.delete('/:id', function (req, res) {
  var { id } = req.params;
  (async function () {
    try {
    let user = await Users.findByPk(id);
    await user.destroy();
    res.header("Access-Control-Allow-Origin", "*");
    res.json({
      "message": "Usuario apagado com sucesso"
    });
   }catch (e) {
      res.header("Access-Control-Allow-Origin", "*");
      res.json({
          "message": "Esse id não existe."
        });
   }

  })();
});
//***************************/





module.exports = router;