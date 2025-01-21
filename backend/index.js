const express = require("express");
const cors = require("cors");
const helmet = require('helmet');
require("./db/config");
const User = require("./db/User");
const Product = require("./db/Product");
const app = express();
const Jwt = require('jsonwebtoken');
const jwtKey = 'e-comm';

app.use(express.json());
app.use(cors());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],  // Default policy for loading content. 'self' refers to the origin from which the document is being served.
      scriptSrc: ["'self'"],   // Allow scripts hosted from the same origin
      imgSrc: ["'self'"],      // Allow images from the same origin
      styleSrc: ["'self'", 'https:', "'unsafe-inline'"],  // Allow styles from the same origin and inline styles
      connectSrc: ["'self'", "https://api.yourservice.com"], // Allow connections to your API and self
    },
  })
);

app.post("/register", async (req, resp) => {
  let user = new User(req.body);
  let result = await user.save();
  result = result.toObject();
  delete result.password
  Jwt.sign({ result }, jwtKey, { expiresIn: "2h" }, (err, token) => {
    if (err) {
      resp.send({ result: "something went wrong, please try after some time" })
    }
    resp.send({ result, auth: token })
  })
})

app.post("/login", async (req, resp) => {
  if (req.body.password && req.body.email) {
    let user = await User.findOne(req.body).select("-password");
    if (user) {
      Jwt.sign({ user }, jwtKey, { expiresIn: "2h" }, (err, token) => {
        if (err) {
          resp.send({ result: "something went wrong, please try after some time" })
        }
        resp.send({ user, auth: token })
      })
    } else {
      resp.send({ result: "No user found" })
    }
  } else {
    resp.send({ result: "No user found" })
  }

})

app.post("/add-product", verifyToken, async (req, resp) => {
  let product = new Product(req.body);
  let result = await product.save();
  resp.send(result);
});

app.get("/products", verifyToken, async (req, resp) => {
  const products = await Product.find();
  if (products.length > 0) {
    resp.send(products)
  } else {
    resp.send({ result: "No product found" })
  }
});
app.delete("/product/:id", verifyToken, async (req, resp) => {
  let result = await Product.deleteOne({ _id: req.params.id });
  resp.send(result)
});

app.get("/product/:id", verifyToken,  async (req, resp) => {
  let result = await Product.findOne({ _id: req.params.id })
  if (result) {
    resp.send(result)
  } else {
    resp.send({ "result": "No Record Found." })
  }

})

app.put("/product/:id",verifyToken,  async (req, resp) => {
  let result = await Product.updateOne(
    { _id: req.params.id },
    { $set: req.body }
  )
  resp.send(result)
})

app.get("/search/:key",verifyToken,  async (req, resp) => {
  let result = await Product.find({
    "$or": [
      {
        name: { $regex: req.params.key }
      },
      {
        company: { $regex: req.params.key }
      },
      {
        category: { $regex: req.params.key }
      }
    ]
  });
  resp.send(result);
})
function verifyToken(req,resp,next){
  console.warn(req.headers['authorization']);
  let token = req.headers['authorization'];
  if(token){
    token = token.split(' ')[1];
    Jwt.verify(token, jwtKey, (err, valid)=>{
      if(err){
        resp.status(403).send({result: 'Please provide a valid token'})
      }else {
        next();
      }

    })
  }else {
    resp.status(403).send({result: 'Please provide a token'})
  }
  
}

app.listen(3000);

