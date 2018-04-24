const express = require('express')
const hbs = require('express-handlebars')
const app = express()
const bodyParser = require('body-parser')
const nodemailer = require('nodemailer');

app.use(bodyParser.urlencoded({ extended: false }))
app.engine('handlebars', hbs({ defaultLayout: 'index', partialsDir: __dirname + '/views/partials/' }))
app.set('view engine', 'handlebars')
app.use('/public', express.static('public'));

app.get('/', (req, res) => {
    res.render('home')
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
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    nodemailer.createTestAccount((err, account) => {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: 'tfeiser2014', // generated ethereal user
                pass: 'Cartoons2' // generated ethereal password
            }
        });
    
        // setup email data with unicode symbols
        let mailOptions = {
            from: req.body.name, // sender address
            to: 'tnsherpa1@gmail.com', // list of receivers
            subject: 'Message from TashiSherpa.io ✔', // Subject line
            html: output // html body
        };
    
        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        });
    });
    
})

app.listen(3000, () => console.log('Listening at port 3000...'))