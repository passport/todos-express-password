var express = require('express')
var router = express.Router()

router.use(require('connect-ensure-login').ensureLoggedIn())
// 该路由使用的中间件
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});

router.get('/', function (req, res) {
    res.send('api')
})
module.exports = router