
const db = require('../config/db.config');
const Restaurant = db.restaurants;
const Product = db.products;
const Login = db.logins;
const Buyer = db.buyers;
const Order = db.orders;
const logger = require('pino')()
const bcrypt = require('bcryptjs')
const generateJwtToken = require('../helpers/generateJwtToken');

exports.createRestaurant = async (req, res) => {
  
  try{
    
      const restaurant = {
            username: req.body.username,
            email: req.body.email,
            address: req.body.address,
            password: req.body.password,
            phone: req.body.phone,
            has_service_tax: req.body.has_service_tax
      }

      if(!req.body.username || !req.body.email || !req.body.address || !req.body.password || !req.body.phone || !req.body.has_service_tax){
        logger.error({msg:"Unable to register, incomplete data"})
        return res.status(400).json({hasError: true, erro: "Unable to register, incomplete data"})
     }

      restaurantRegister = await Restaurant.findAll({
        where: {email: req.body.email}
    })
            if (restaurantRegister == "") {
            
                Restaurant.create(restaurant).then(result => {   
                res.status(200).json({
                    message: "Restaurant Registered Successfully",
                    restaurants: result
                });
            })}
           
            else{
                res.status(200).json({
                message: "Existing Restaurant!",
              
            });
        }
    
  }catch(error){
      res.status(500).json({
          message: "Fail!",
          error: error.message
      });
  }
}

exports.login = async (req, res) => {

    try{

        const result = await Restaurant.findOne({
            where: { email: req.body.email }
        })
                if (!result) {
                    return res.status(404).send({
                    message: 'Restaurant Not Found, check your email',
                    })}
                    
                bcrypt.compare(req.body.password, result.password, (err, results) => {

                    if (results){ 

                        return res.status(200).json({
                            message: "Restaurant Found!",
                            restaurants: result,
                            token:generateJwtToken.newToken(result.id)
                        });
                    }
                    else {
                        return res.status(404).send({
                            message: 'Password invalid',
                        })
                        }
                    });
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
                message: "Product Created Successfully ",
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

        const order = {};
  
    try{

        const loginRest = await Login.findOne({ 
            where: { status: true },
            order: [['id', 'DESC']],  
        })

        const restaurant = await Restaurant.findByPk(loginRest.id_restaurant_login) 
        const buyer = await Buyer.findOne({ where: { phone: req.body.phone }})
        
        const {product_id} = req.body
        const product = await Product.findByPk(product_id)
        const total_price = (req.body.amount)*(product.value)
        total_service_price = ""
        
        if(buyer) {

            if(restaurant.has_service_tax == true){
                order.total_service_price = total_price + 0.1*(product.value)
            }
            else{
                order.total_service_price = 0
            }
            
            order.product_id = req.body.product_id;
            order.amount = req.body.amount;
            order.phone = buyer.phone;
            order.name = req.body.name;
            order.buyer_id = buyer.id;
            order.restaurant_id = loginRest.id_restaurant_login;
            order.total_price = total_price;

            const orders = await Order.create(order)

            return res.status(400).json({
                message: "Order Created Successfully!",
                order: orders,
                buyer: buyer
            
            });

        }
        else{

            if(restaurant.has_service_tax == true){
                order.total_service_price = total_price + 0.1*(product.value)
            }
            else{
                order.total_service_price = 0
            }
            
            const createBuyer = {};
            createBuyer.name = req.body.name;
            createBuyer.phone = req.body.phone;
            const buyerCreated = await Buyer.create(createBuyer)
            
            order.product_id = req.body.product_id;
            order.amount = req.body.amount;
            order.phone = req.body.phone;
            order.name = req.body.name;
            order.buyer_id = buyerCreated.id;
            order.restaurant_id = loginRest.id_restaurant_login;
            order.total_price = total_price;
            
            const orders = await Order.create(order)

            return res.status(400).json({
                message: "Buyer and Order Created Successfully!",
                order: orders,
                buyer: buyerCreated,
            
            });
        }

    }catch(error){
        res.status(500).json({
            message: "Fail!",
            error: error.message
        });
    }
  }

  exports.getOrders = async (req, res) => {

    try{
        const loginRest = await Login.findOne({ 
            where: { status: true },
            order: [['id', 'DESC']],  
        })

        const listOrders = await Order.findAll({where: {restaurant_id: loginRest.id_restaurant_login}})
        res.status(200).json({
            message: "Orders list",
            orders: listOrders
        });

    }catch(error){
        res.status(500).json({
            message: "Fail!",
            error: error.message
        });
    }
}
