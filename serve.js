const express = require('express')
const app = express()
const neDB = require('nedb')
const path = require('path')
const port = 3000
const db = new neDB({
    filename: path.join(__dirname, '/db/log.db'),
    autoload: true
})

/*  publicディレクトリ以降は自動的に返す  */
app.use('/public', express.static('./public'))
/*  / -> publicに流す */
app.get('/', (req, res) => {
    res.redirect(302, '/public')
})

// Scope API

app.get('/api/insert', (req, res) => {
    const q = req.query
    db.insert({
        title: q.title,
        str: q.str,
        stime: (new Date()).getTime()
    }, (err, doc) => {
        if (err) return
        res.redirect(302, '/public')
    })
})

app.listen(port, () => {
    console.log(`listen to ${port}`)
})
