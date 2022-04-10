'use strict';

let article = require("./backend/service/article");

let title = process.argv[2]
let type = process.argv[3]

article.toWord(title, type=='a')

