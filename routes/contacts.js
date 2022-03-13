var express = require('express');
var router = express.Router();
const Contacts = require('../db/contact');

(async () => {
     const database = require('../db/db');
     await database.sync();

})();


/*Lista todos os contatos*/
router.get('/mostraContatos', function (req, res) {
    (async function () {
      let contacts = await Contacts.findAll();
      res.json(contacts);
    })();
});

/*Lista apenas um contato*/
router.get('/listaUm/:id', function (req, res) {
    var { id } = req.params;
    (async function () {
      let contact = await Contacts.findAll({ where: { idUser: id } });
      res.header("Access-Control-Allow-Origin", "*");
      res.json(contact);
    })();
  });

/*Cadastrar um novo contato*/
router.post('/cadastro', function (req, res) {
    (async function () {
      var { idUser, name, contact } = req.body

      let numberContact = await Contacts.findAll({ where: { contact: contact } });
      
      if (Object.values(numberContact).length === 0) {
            const novoContact = Contacts.create({
                idUser: idUser,
                name: name,
                contact:contact,
            });
        res.json({
          "message": "Número cadastrado na agenda com sucesso!"
        });
      }else{
        res.json({
            "message": "Esse número já estar cadastrado!"
          });
      }
    })();
});

/*Edita um contato*/
router.put('/edita/:id',function (req, res) {
    (async function () {
     var { id } = req.params;
     var { name, contact } = req.body
      let contactl = await Contacts.findByPk(id);
      contactl.name = name;
      contactl.contact = contact;
      await contactl.save();
      res.json({
        "message": "Dados atualizados"
      });
    })();
});

/*apaga o contato pelo id*/
router.delete('/apaga/:id', function (req, res) {
    var { id } = req.params;
    (async function () {
      try {
      let contact = await Contacts.findByPk(id);
      await contact.destroy();
      res.json({
        "message": "Usuario apagado com sucesso"
      });
     }catch (e) {
        res.json({
            "message": "Esse id não existe."
          });
     }
  
    })();
  });



module.exports = router;
