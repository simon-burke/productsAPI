const Product = require('../models/product');
const mongoose = require('mongoose');
module.exports = {


    get_main : (req, res) => {
        Product.find()
        .select('-__v')
        .exec()
        .then(docs => {
            console.log(docs);
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name, 
                        price: doc.price,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + doc._id
                        }
                    }
                })
            }
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: error});
    });

    },

    post : (req, res) => {
        const product = new Product({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            price: req.body.price
        });
        product.save().then(result => {
            console.log(result);
            res.status(201).json({message: "Product created",
            createdProduct: {
                name: result.name,
                 price: result.price,
                  _id: result._id,
                   request: {
                type: 'GET',
                url: 'http://localhost:3000/products/' + result._id 
            }
        }
         })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
    },

    get_id : (req, res) => {
        const id = req.params.productId;
        Product.findById(id)
        .select('-__v')
        .exec()
        .then(doc => {
            console.log("From database:" + doc);
            if(doc){
                res.status(200).json({product: doc,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products',
                        description: 'Get all product info'
                    }
                });
            }
            else{
                res.status(404).json({message: 'No valid entry for provided ID'});
            }
        }
            )
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err})});
    },

    patch : (req, res) => {
        const id = req.params.productId;
        const updateOps = {};
        for(const ops of req.body)
        {
            updateOps[ops.propName] = ops.value;
        }
        Product.updateOne({_id : id}, {$set : updateOps})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Product updated',
            request: {
                type: 'GET',
                url: 'http://localhost:3000/products/' + result._id,
                description: 'Get all product info'
            }});
        })
        .catch(err => {
            res.status(500).json({
                err: err
            });
        });
    },

    delete : (req, res) => {
        const id = req.params.productId
        Product.remove({_id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Product deleted',
                request : {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + result._id,
                    description: 'Get all product info'
                }
        });
        })
        .catch(err => {
            res.status(500).json({err: err});
        });
    }
}