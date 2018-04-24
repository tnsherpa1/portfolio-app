const express = require('express')
const hbs = require('express-handlebars')
const app = express()

app.engine('handlebars', hbs({ defaultLayout: 'index', partialsDir: __dirname + '/views/partials/' }))
app.set('view engine', 'handlebars')
app.use('/public', express.static('public'));

app.get('/', (req, res) => {
    res.render('home')
})

app.listen(3000, () => console.log('Listening at port 3000...'))