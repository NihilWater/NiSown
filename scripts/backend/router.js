var user = {
    "user4": {
        "name": "mohit",
        "password": "password4",
        "profession": "teacher",
        "id": 4
    }
}

// 注册router路由
function registerRouter(app){
    app.get('/addUser', function (req, res) {
        res.end(JSON.stringify(user));
    })
}

module.exports = registerRouter;
