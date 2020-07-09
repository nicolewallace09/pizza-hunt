const { Pizza } = require('../models');
// const { db } = require('../models/Pizza');

const pizzaController = {
    // the functions will go in here as methods
    // get all pizzas -- find() method GET /api/pizza
    getAllPizza(req, res) {
        Pizza.find({})
        // populate a field 
        .populate({
            path: 'comments',
            // don't return this field 
            select: '-__v'
        })
        .select('-__v')
        // sort in DESC order by id
        .sort({ _id: -1 })
        .then(dbPizzaData => res.json(dbPizzaData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    },

    // get one pizza by ID -- findOne()
    getPizzaById({ params }, res) {
        Pizza.findOne({ _id: params.id })
        .populate({
            path: 'comments',
            select: '-__v'
        })
        .select('-__v')
        .then(dbPizzaData => {
            // if no pizza is found, send 404
            if(!dbPizzaData) {
                res.status(404).json({ message: 'No pizza found with this id'});
                return;
            }
            res.json(dbPizzaData)
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err)
        });
    }, 

    // POST /api/posts -- create pizza
    // createPizza
    createPizza({ body }, res) {
        Pizza.create(body)
            .then(dbPizzaData => res.json(dbPizzaData))
            .catch(err => res.status(400).json(err));
    },

    // PUT /api/pizzas/:id update pizza by id 
    updatePizza({ params, body }, res) {
        // {new: true} returns a new document
        Pizza.findOneAndUpdate({ _id: params.id }, body, { new: true })
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id!' });
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => res.status(400).json(err));
    },

    // DELETE /api/pizzas/:id -- delete pizza
    deletePizza({ params }, res) {
        // find the document to be returned and deletes it 
        Pizza.findOneAndDelete({ _id: params.id })
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id!' });
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => res.status(400).json(err));
      }

};

module.exports = pizzaController;