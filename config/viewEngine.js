const path = require('path');
const express = require('express')
const configViewEngine = (app) => {
    console.log('../web')
    app.set('views', path.join('../web', 'views'));
    app.set('view engine', 'ejs');

    app.use(express.static(path.join('../web', 'public')));

}

module.exports = configViewEngine;