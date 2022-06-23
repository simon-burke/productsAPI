const mongoose = require('mongoose');
const Order = require('../models/order.js');
const Product = require('../models/product.js');


module.exports = {

    get_main : (req, res) => {
        Order.find()
        .select('-__v')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        message: 'Order created',
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + doc.product
                        }
                    }
                })
            }) 
        })
        .catch(err => {
            res.status(500).json({err: err});
        })
    },

    post : (req, res) => {
        
        Product.findById(req.body.productId)
        .then(product => {
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            });
            return order.save()
        })
        .then(result => {
            res.status(201).json({
                _id: result._id,
                product: result.product,
                quantity: result.quantity,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + result.product
                }
            });
        })
        .catch(err => {
            res.status(500).json({message: 'Product not found', err: err})
        });
    },

    get_id : (req, res) => {
        Order.findById(req.params.orderId)
        .select('-__v')
        .then(result => {
            res.status(200).json({
                _id: result._id,
                product: result.product,
                quantity: result.quantity,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products'
                }
            })
        })
        .catch(err => {
            res.status(500).json({message: 'Order not found', err: err})
        });
    },

    delete : (req, res) => {
        id = req.params.orderId;
        Order.remove({_id: id})
        .exec()
        .then(result => {
            res.status(200).json({
            message: 'Order deleted',
            orderId: req.params.orderId,
            request:{
                type: 'POST',
                url: 'http://localhost:3000/orders/',
                description: 'Make a new order'
            }})
        })
        .catch(err => {
            res.status(500).json({message: 'Order not found', err: err})
        })
    },
}