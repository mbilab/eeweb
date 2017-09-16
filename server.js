const express = require('express')
const app = require('express')()
const path = require('path')
const webpack = require('webpack')
const fs = require('fs')
const dp = require('./lib/dropbox.js')


server.listen(1099, ()=>{console.log("server connect")})

app.use(express.static(path.resolve('./dist')))


