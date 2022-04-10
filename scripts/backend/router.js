var user = {
    "user4": {
        "name": "mohit",
        "password": "password4",
        "profession": "teacher",
        "id": 4
    }
}
let labels = require("../../public/data/lables.json");
const articleService = require("../backend/service/article");
console.log(labels)

// 注册router路由
function registerRouter(app) {

    app.get('/addUser', function (req, res) {
        res.end(JSON.stringify(user));
    });

    // 插入一片文章
    /** 测试代码 
    a = {
        'id': '122333221',
        'title': '【论文整理 弱监督语义分割】Simple Does It（SDI）',
        'org_path': 'nisown/1-基础/01-案例.md',
        'markdowncontent': '## 创新点总结\n'
    }

    fetch('http://127.0.0.1:3001/insertMarkdown', {
        method: "POST",
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(a)
    })
    */ 
    app.post('/insertMarkdown', function (req, res) {
        let body = req.body
        console.log(body.dir)
        if (body.org_path && body.title && body.markdowncontent) {
            let org_path = `public/markdown/${body.org_path}`
            articleService.insertMarkdown(org_path, body.title, body.markdowncontent)
        }
        res.send(JSON.stringify(user));
    });

    app.get('/labels', function (req, res) {
        res.end(JSON.stringify(labels))
    });

    app.post('/articles', function (req, res) {
        let body = req.body
        console.log(body.dir)
        let articles = require("../../public/data/" + body.dir + ".json");
        res.end(JSON.stringify(articles))
    });
}


module.exports = registerRouter;
