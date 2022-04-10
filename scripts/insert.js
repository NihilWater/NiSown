'use strict';

// 插入一篇文章

const fs = require('fs');
const path = require('path')
const article = require("./backend/service/article");
// const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

const article_template = {
    'paper': '\n## 基础信息\n\n文章标题：\n\n文章链接：\n\n发表时间：\n\n\n## 背景\n\n\n## 创新点简介\n\n\n## 详细内容\n\n### 模型结构\n\n\n## 引用',
}

// 获取命令行参数 
let org_file = process.argv[2]
let file_name = process.argv[3]

console.log(path.dirname(org_file))


let content = '';
if (process.argv[4] && article_template[process.argv[4]]) {
    content = article_template[process.argv[4]]
}
article.insertMarkdown(org_file, file_name, content)


