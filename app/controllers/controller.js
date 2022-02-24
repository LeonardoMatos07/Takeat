/**
 * Copyright by https://loizenai.com
 * youtube loizenai
 */

const db = require('../config/db.config');
const Customer = db.Customerr;
const Restaurant = db.restaurants;
const Product = db.products;
const Login = db.logins;
const logger = require('pino')()
const bcrypt = require('bcryptjs')
const generateJwtToken = require('../helpers/generateJwtToken')

exports.create = (req, res) => {
    let customer = {};

    try{
        // Building Customer object from upoading request's body
        customer.firstname = req.body.firstname;
        customer.lastname = req.body.lastname;
        customer.address = req.body.address;
        customer.age = req.body.age;
    
        // Save to MySQL database
        Customer.create(customer).then(result => {    
            // send uploading message to client
            res.status(200).json({
                message: "Upload Successfully a Customer with id = " + result.id,
                customer: result,
            });
        });
    }catch(error){
        res.status(500).json({
            message: "Fail!",
            error: error.message
        });
    }
}

exports.createRestaurant = (req, res) => {
  //const restaurant = {};

  try{
      // Building Customer object from upoading request's body

      
      const restaurant = {
            username: req.body.username,
            email: req.body.email,
            address: req.body.address,
            password: req.body.password,
            phone: req.body.phone,
            has_service_tax: req.body.has_service_tax
      }
      const { username } = req.body;

      if(!req.body.username || !req.body.email || !req.body.address || !req.body.password || !req.body.phone || !req.body.has_service_tax){
        logger.error({msg:"Não foi possivel cadastrar o usuario, dados incompletos"})
        return res.status(400).json({hasError: true, erro: "Não foi possivel cadastrar o usuario, dados incompletos"})
     }

      Restaurant.findAll({
        where: {username: username}
    })
        .then(result => {
            if (result == '') {
            
                Restaurant.create(restaurant).then(result => {    
                    // send uploading message to client
                    res.status(200).json({
                        message: "Restaurant Registered Successfully" + result.id,
                        restaurants: result,
                    });
                });
            
            }
                
            else{
                res.status(200).json({
                message: "Existing Restaurant!",
              
            });
        }
        })

  }catch(error){
      res.status(500).json({
          message: "Fail!",
          error: error.message
      });
  }
}



exports.createProduct =  async (req, res) => {
    const product = {};
  
    try{

        const loginRest = await Login.findOne({ 
            where: { status: true },
            order: [['id', 'DESC']],  
        })

        product.name = req.body.name;
        product.value = req.body.value;
        product.restaurant_id = loginRest.id_restaurant_login;
        //product.restaurant_id = restaurant_id;
       // product.value = product.value/10;
        // PEGAR ID PELO NOME DO RESTAURANTE
        // Save to MySQL database
        await Product.create(product).then(result => {    
            // send uploading message to client
            res.status(200).json({
                message: "Upload Successfully a Customer with id = " + result.id,
                product: result,
            });
        });
    }catch(error){
        res.status(500).json({
            message: "Fail!",
            error: error.message
        });
    }
  }
  
  

exports.login = (req, res) => {

    Restaurant.findOne({
        where: { email: req.body.email }
    })
        .then(result => {
            if (!result) {
                return res.status(404).send({
                  message: 'Restaurant Not Found, check your email',
                })}
                
            bcrypt.compare(req.body.password, result.password, (err, results) => {

                if (results){  
                        
                    console.log(result.password, req.body.password, result.id, "DEU CERTO")
                    return res.status(200).json({
                        message: "Restaurant Found!",
                        restaurants: result,
                        token:generateJwtToken.newToken(result.id)
                    });
                }
                else {
                    console.log("errado")
                    return res.status(404).send({
                        message: 'Password invalid',
                      })
                    }
                });
        
        })
        . catch(error => {
          console.log(error);

          res.status(500).json({
              message: "Error!",
              error: error
          });
        });

}

exports.getCustomerById = (req, res) => {
  // find all Customer information from 
  let customerId = req.params.id;
  Customer.findByPk(customerId)
      .then(customer => {
          res.status(200).json({
              message: " Successfully Get a Customer with id = " + customerId,
              customers: customer
          });
      })
      . catch(error => {
        // log on console
        console.log(error);

        res.status(500).json({
            message: "Error!",
            error: error
        });
      });
}


exports.filteringByAge = (req, res) => {
  let age = req.query.age;

    Customer.findAll({
                      attributes: ['id', 'firstname', 'lastname', 'age', 'address', 'copyrightby'],
                      where: {age: age}
                    })
          .then(results => {
            res.status(200).json({
                message: "Get all Customers with age = " + age,
                customers: results,
            });
          })
          . catch(error => {
              console.log(error);
              res.status(500).json({
                message: "Error!",
                error: error
              });
            });
}
 
exports.pagination = (req, res) => {
  try{
    let page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);
  
    const offset = page ? page * limit : 0;
  
    Customer.findAndCountAll({ limit: limit, offset:offset })
      .then(data => {
        const totalPages = Math.ceil(data.count / limit);
        const response = {
          message: "Paginating is completed! Query parameters: page = " + page + ", limit = " + limit,
          data: {
              "copyrightby": "https://loizenai.com",
              "totalItems": data.count,
              "totalPages": totalPages,
              "limit": limit,
              "currentPageNumber": page + 1,
              "currentPageSize": data.rows.length,
              "customers": data.rows
          }
        };
        res.send(response);
      });  
  }catch(error) {
    res.status(500).send({
      message: "Error -> Can NOT complete a paging request!",
      error: error.message,
    });
  }    
}

exports.pagingfilteringsorting = (req, res) => {
  try{
    let page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);
    let age = parseInt(req.query.age);
  
    const offset = page ? page * limit : 0;

    console.log("offset = " + offset);
  
    Customer.findAndCountAll({
                                attributes: ['id', 'firstname', 'lastname', 'age', 'address'],
                                where: {age: age}, 
                                order: [
                                  ['firstname', 'ASC'],
                                  ['lastname', 'DESC']
                                ],
                                limit: limit, 
                                offset:offset 
                              })
      .then(data => {
        const totalPages = Math.ceil(data.count / limit);
        const response = {
          message: "Pagination Filtering Sorting request is completed! Query parameters: page = " + page + ", limit = " + limit + ", age = " + age,
          data: {
              "copyrightby": "https://loizenai.com",
              "totalItems": data.count,
              "totalPages": totalPages,
              "limit": limit,
              "age-filtering": age,
              "currentPageNumber": page + 1,
              "currentPageSize": data.rows.length,
              "customers": data.rows
          }
        };
        res.send(response);
      });  
  }catch(error) {
    res.status(500).send({
      message: "Error -> Can NOT complete a paging request!",
      error: error.message,
    });
  }      
}

exports.updateById = async (req, res) => {
    try{
        let customerId = req.params.id;
        let customer = await Customer.findByPk(customerId);
    
        if(!customer){
            // return a response to client
            res.status(404).json({
                message: "Not Found for updating a customer with id = " + customerId,
                customer: "",
                error: "404"
            });
        } else {    
            // update new change to database
            let updatedObject = {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                address: req.body.address,
                age: req.body.age
            }
            let result = await Customer.update(updatedObject, {returning: true, where: {id: customerId}});
            
            // return the response to client
            if(!result) {
                res.status(500).json({
                    message: "Error -> Can not update a customer with id = " + req.params.id,
                    error: "Can NOT Updated",
                });
            }

            res.status(200).json({
                message: "Update successfully a Customer with id = " + customerId,
                customer: updatedObject,
            });
        }
    } catch(error){
        res.status(500).json({
            message: "Error -> Can not update a customer with id = " + req.params.id,
            error: error.message
        });
    }
}

exports.deleteById = async (req, res) => {
    try{
        let customerId = req.params.id;
        let customer = await Customer.findByPk(customerId);

        if(!customer){
            res.status(404).json({
                message: "Does Not exist a Customer with id = " + customerId,
                error: "404",
            });
        } else {
            await customer.destroy();
            res.status(200).json({
                message: "Delete Successfully a Customer with id = " + customerId,
                customer: customer,
            });
        }
    } catch(error) {
        res.status(500).json({
            message: "Error -> Can NOT delete a customer with id = " + req.params.id,
            error: error.message,
        });
    }
}
