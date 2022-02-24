

const jwt = require("jsonwebtoken");
require("dotenv").config();
const logger = require('pino')()
const db = require('../config/db.config');
const Login = db.logins;

/**
 * Middleware para validação do token JWT 
 * Entrada: token JWT
 * Saída: id do revendedor associado ao token
 */
const jwtCheck = async (req, res, next) => {

  token = req.headers.token;

  try{

      if (!token) {
        logger.error({msg:"token não fornecido!"})
        return res.status(401).send({ erro: "token não fornecido!" });
      }
  
        jwt.verify(token, process.env.SECRET_HASH, (err, decoded) => {
      if (err) {
        logger.error({msg:"token fornecido é inválido!"})
        return res.status(401).send({ error: "token fornecido é inválido!" });
        }
        logger.info({msg:"token validado com sucesso!"})
        restaurant_id = decoded.id;
      
        
        });

        let rest = {};

        rest.id_restaurant_login = restaurant_id;
        rest.status = true;
        await Login.create(rest);
        return next();

  }catch(error){
        res.status(500).json({
        message: "Fail!",
        error: error.message
      });
    }
  };

module.exports = jwtCheck
