const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./model/urlShortner')
const app = express()
require('dotenv').config()


mongoose.set('strictQuery', true)
mongoose.connect(process.env.DATABASE_URL)


const db = mongoose.connection

db.on('error', error => console.log(error))
db.once('open', () => console.log('Mongoose connected successfully'))

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false}))
// Routes
app.get('/', async (req, res) => {
    const shortUrls = await ShortUrl.find()
    res.render('index', { shortUrls: shortUrls })
})

app.post('/shortUrl', async (req, res) => {
    await ShortUrl.create({ full: req.body.fullUrl})
    res.redirect('/')
})

app.get('/:shortUrl', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
    if (shortUrl == null) return res.sendStatus(404)
  
    shortUrl.clicks++
    shortUrl.save()
  
    res.redirect(shortUrl.full)
  })
// require('dotenv').config()
app.listen(process.env.PORT || 5000)