
const db = require('../config/db.config');
const Customer = db.Customerr;
const Restaurant = db.restaurants;
const Product = db.products;
const Login = db.logins;
const Buyer = db.buyers;
const Order = db.orders;
const logger = require('pino')()
const bcrypt = require('bcryptjs')
const generateJwtToken = require('../helpers/generateJwtToken');


exports.createRestaurant = (req, res) => {
  
  try{
    
      const restaurant = {
            username: req.body.username,
            email: req.body.email,
            address: req.body.address,
            password: req.body.password,
            phone: req.body.phone,
            has_service_tax: r2|XCeq.body.has_service_tax
      }

      if(!req.body.username || !req.body.email || !req.body.address || !req.body.password || !req.body.phone || !req.body.has_service_tax){
        logger.error({msg:"Unable to register, incomplete data"})
        return res.status(400).json({hasError: true, erro: "Unable to register, incomplete data"})
     }

      Restaurant.findAll({
        where: {email: req.body.email}
    })
        .then(result => {
            if (result == '') {
            
                Restaurant.create(restaurant)   
                restaurant.password = null
                res.status(200).json({
                    message: "Restaurant Registered Successfully",
                    restaurants: restaurant
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

exports.createProduct =  async (req, res) => {
    const product = {};
  
    try{

        const loginRest = await Login.findOne({ 
            where: { status: true },
            order: [['id', 'DESC']],  
        })

        const verifyRestaurant = await Product.findOne({ where: {name: req.body.name, restaurant_id: loginRest.id_restaurant_login}})
            if(verifyRestaurant){

                return res.status(200).json({
                    message: "Existing Product this Restaurant!",
                
                });
        }
        product.name = req.body.name;
        product.value = req.body.value;
        product.restaurant_id = loginRest.id_restaurant_login;
   
        await Product.create(product).then(result => {    
            
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
  

exports.getProducts = async (req, res) => {

    try{
        const loginRest = await Login.findOne({ 
            where: { status: true },
            order: [['id', 'DESC']],  
        })

        const listProducts = await Product.findAll({where: {restaurant_id: loginRest.id_restaurant_login}})
        res.status(200).json({
            message: "Products list",
            products: listProducts,
        });

    }catch(error){
        res.status(500).json({
            message: "Fail!",
            error: error.message
        });
    }
}


exports.createOrder =  async (req, res) => {
  
    try{

        const buyer = await Buyer.findOne({
            where: { phone: req.body.phone }
        })

        const loginRest = await Login.findOne({ 
            where: { status: true },
            order: [['id', 'DESC']],  
        })

        const order = {};

        if(buyer) {

            const product
            order.product_id = req.body.product_id;
            order.amount = req.body.amount;
            order.phone = buyer.phone;
            order.name = req.body.name;
            order.buyer_id = buyer.id;
            order.restaurant_id = loginRest.id_restaurant_login;

        

            await Order.create(order)

            return res.status(400).json({
                message: "Order Created Successfully!",
                order: order
            
            });

        }
        else{
            const createBuyer = {};
            createBuyer.name = req.body.name;
            createBuyer.phone = req.body.phone;
            const buyerCreated = await Buyer.create(createBuyer)
            
            order.product_id = req.body.product_id;
            order.amount = req.body.amount;
            order.phone = buyerCreated.phone;
            order.name = req.body.name;
            order.buyer_id = buyerCreated.id;
            order.restaurant_id = loginRest.id_restaurant_login;
            
            await Order.create(order)

            return res.status(400).json({
                message: "Buyer and Order Created Successfully!",
                order: order
            
            });
        }

    }catch(error){
        res.status(500).json({
            message: "Fail!",
            error: error.message
        });
    }
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
