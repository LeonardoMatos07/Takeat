const jwt = require("jsonwebtoken")
require("dotenv").config();
/**
 * Função para gerar token JWT 
 * Entrada: id do usuario     
 * Saída: Token JWT
 */
const newToken = (id)=>{
     return jwt.sign({id}, process.env.SECRET_HASH, {
          expiresIn: 172800
     })
}



module.exports = {newToken}