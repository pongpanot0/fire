const category = require('../controller/Category')

module.exports = function (app) {
    app.post('/createCategory', category.createCategory);
}