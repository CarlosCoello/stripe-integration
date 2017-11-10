const express = require('express');
const keys = require('./config/keys');
const app = express();
const stripe = require('stripe')(keys.stripeSecretKey);
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const port = process.env.PORT || 2500;

// handlebars middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// set static folders or files
app.use(express.static(`${__dirname}/public`));

// index route
app.get('/', (req, res) => {
    res.render('index', {
        stripePublishableKey: keys.stripePublishableKey
    });
});

// charge route
app.post('/charge', (req, res) => {
    const amount = 2500;
    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken
    }).then( (customer) => {
        stripe.charges.create({
            amount,
            description: 'The Marketplace',
            currency: 'usd',
            customer: customer.id
        })
    }).then( (charge) => {
        res.render('success');
    })
});

// app.get('/success', (req, res) => {
//     res.render('success');
// })

app.listen(port, () => {
    console.log(`server on port: ${port}`);
});