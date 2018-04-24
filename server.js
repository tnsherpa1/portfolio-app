const express = require('express')
const dotenv = require('dotenv')
const hbs = require('express-handlebars')
const app = express()
const bodyParser = require('body-parser')
const nodemailer = require('nodemailer')
const flash = require('connect-flash');
const session = require('express-session'); 
const swal = require('sweetalert')

dotenv.config()
app.use(session({
    secret: 'sherpa',
    resave: true,
    saveUninitialized: true
  }));
app.use(flash());
app.use(bodyParser.urlencoded({ extended: false }))
app.engine('handlebars', hbs({ defaultLayout: 'index', partialsDir: __dirname + '/views/partials/' }))
app.set('view engine', 'handlebars')
app.use('/public', express.static('public'));
app.use('/vendors', express.static('vendors'));
swal("Hello world!");
app.get('/', (req, res) => {
    res.render('home', {msg: req.flash('success')})
})

app.post('/message', function(req, res){
    'use strict';
    console.log("Sending...");
    const output = `
      <p>You have a new contact request</p>
      <h3>Contact Details</h3>
      <ul>  
        <li>Name: ${req.body.first_name}</li>
        <li>Name: ${req.body.last_name}</li>
        <li>Email: ${req.body.email}</li>
      </ul>
      <h3>Message</h3>
      <p>${req.body.message}</p>
    `;
    nodemailer.createTestAccount((err, account) => {
        let transporter = nodemailer.createTransport({
            host: process.env.HOSTNAME,
            port: process.env.SMTP_PORT,
            secure: process.env.SECURE_FLAG,
            auth: {
                user: process.env.USER_ID,
                pass: process.env.USER_PWD
            }
        });
    
        let mailOptions = {
            from: req.body.name,
            to: 'tnsherpa1@gmail.com',
            subject: 'Message from TashiSherpa.io ✔',
            html: output
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            } else {
                console.log('Message sent: %s', info.messageId)
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
                req.flash('success', 'Your message has been successfully sent')
                res.redirect('/')
            }
        });
    });
    
})

app.listen(3000, () => console.log('Listening at port 3000...'))