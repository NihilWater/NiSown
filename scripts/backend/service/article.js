const fs = require("fs");
const path = require("path");
const utils = require("./utils");

const MarkdownIt = require("markdown-it");
const mk = require('@iktakahiro/markdown-it-katex');

function isSpace(code) {
    switch (code) {
        case 0x09:
        case 0x20:
            return true;
    }
    return false;
}


const hljs = require('highlight.js'); // https://highlightjs.org/
const { setFlagsFromString } = require("v8");
let md = MarkdownIt({
    html: true,
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return '<pre class="hljs"><code>' +
                    hljs.highlight(lang, str, true).value +
                    '</code></pre>';
            } catch (__) { }
        }
        return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
    }
});

md.use(mk);

const markdownPathForFs = "./public/markdown/";  // fs, require 读取文件路径不一样
const markdownPathForRe = "../../../public/markdown/";
const outDataPathForFs = "./public/data/";
const outDataPathForRe = "../../../public/data/";
const labelOutJsonPath = "./public/data/lables.json";
const topicalOutJsonPath = "./public/json/topicals.json";
const infoFileName = "info";
const MaxarticleNum = 10;
const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

// const article_template = {
//     'paper': '\n## 基础信息\n\n文章标题：\n\n文章链接：\n\n发表时间：\n\n\n## 背景\n\n\n## 创新点简介\n\n\n## 详细内容\n\n### 模型结构\n\n\n## 引用',
// }


/**
 * 将 data 文件转化为markdown文件和 json文件。
 * 1. 将data 里的每一个文件夹都转化为一个个json，表示每一个主题
 * 2. 将每一个主题里的文件夹转化为以个个json，表示每一个分主题
 * 3. 将每一个md 文件转化为html模式，并且写到json里，
 */
const resetMarkdown = function () {
    console.log("执行方法: resetMarkdown()")
    if (!fs.existsSync(outDataPathForFs)) {
        fs.mkdirSync(outDataPathForFs)
    }

    var dirs = fs.readdirSync(markdownPathForFs);  // 获取每一个主题

    labelObj = { "labels": [] };
    topicalObj = { "topicals": [] };
    articleList = [];

    dirs.forEach((dir) => {
        // 1. 将data 里的每一个文件夹都转化为一个个json，表示每一个主题
        let info_obj = require(markdownPathForRe + dir + "/" + infoFileName);
        info_obj.href = dir;
        labelObj.labels.push(info_obj);
        articleObj = {};

        // 2. 将每一个主题里的文件夹转化为以个个json，表示每一个分主题
        let subTopicalDirs = fs.readdirSync(markdownPathForFs + dir);
        let subTopicalList = []
        if (!fs.existsSync(outDataPathForFs + dir)) {
            fs.mkdirSync(outDataPathForFs + dir)
        }
        subTopicalDirs.forEach((subTopicalDir, index1) => {
            if (fs.statSync(markdownPathForFs + dir + "/" + subTopicalDir).isDirectory()) {
                subTopicalList.push(subTopicalDir)
                // 3. 将每一个md 文件转化为html模式，并且写到json里
                let articles = fs.readdirSync(markdownPathForFs + dir + "/" + subTopicalDir);
                let mdList = [];
                if (!fs.existsSync(outDataPathForFs + dir + '/' + dir + '-' + index1)) {
                    fs.mkdirSync(outDataPathForFs + dir + '/' + dir + '-' + index1)
                }
                articles.forEach((article, index2) => {
                    if (article.endsWith('.md')) {
                        let title = article.substring(3, article.length - 3);
                        mdList.push({
                            title,
                            'href': dir + '/' + dir + '-' + index1 + '/' + index2,
                            'md_path': `${dir}/${subTopicalDir}/${article}`
                        });
                        let markdown_context = fs.readFileSync(markdownPathForFs + dir + "/" + subTopicalDir + "/" + article, encode = 'UTF-8');
                        let stat = fs.statSync(markdownPathForFs + dir + "/" + subTopicalDir + "/" + article);
                        let imgHref = markdown_context.match(/\!\[.*\]\((.*?)\)/);
                        imgHref = imgHref ? imgHref[1] : "";
                        articleList.push({
                            "title": title,
                            "img": imgHref,
                            "href": dir + '/' + dir + '-' + index1 + '/' + index2,
                            "des": markdown_context.length < 500 ? markdown_context : markdown_context.substring(0, 500),
                            "commend": 0,
                            "watch": 0,
                            "evaluate": 0,
                            "date": stat.mtime
                        })
                        let context = md.render(markdown_context);
                        fs.writeFileSync(outDataPathForFs + dir + '/' + dir + '-' + index1 + '/' + index2 + ".html", context, encode = 'UTF-8', flag = 'w');
                    }
                });
                articleObj[subTopicalDir] = mdList;
            }
        })
        topicalObj.topicals.push({
            "topical": dir,
            "subTopical": subTopicalList
        })

        // 记录article文章 到 'data/${topicalName}' 下
        fs.writeFileSync(outDataPathForFs + dir + ".json", JSON.stringify(articleObj));

    })
    // 写入主页标签 label 
    fs.writeFileSync(labelOutJsonPath, JSON.stringify(labelObj));

    // 写入每个主题，和主题中的子标签 
    fs.writeFileSync(topicalOutJsonPath, JSON.stringify(topicalObj));

    // 写入 主页文章中 根据时间排序的文章
    articleList.sort((a, b) => { return b.date.getTime() - a.date.getTime() });
    let index3 = 0;
    let pageNum = 1;
    while (index3 < articleList.length) {
        let subarticleList = []
        for (; index3 < pageNum * 10 && index3 < articleList.length; index3++) {
            subarticleList.push(articleList[index3]);
        }
        fs.writeFileSync(outDataPathForFs + 'article' + pageNum + ".json",
            JSON.stringify({ "articles": subarticleList }), encode = 'UTF-8', flag = 'w');
        pageNum++;
    }
}

/**
 * 插入命令：插入一篇文章
 */
const insertMarkdown = function (org_file, file_name, content) {
    // 判断文件是否存在
    if (!fs.existsSync(org_file)) {
        console.log("文件不存在")
    }

    // 文件存在时继续
    else {
        let state = fs.statSync(org_file)
        let isFind = 0;
        let position = 0;
        let org_path = path.dirname(org_file)
        if (state.isDirectory(org_file)) {
            isFind = 1;
            org_path = org_file
        }
        // 读取所有的文件
        let articles = fs.readdirSync(org_path);
        for (let i = 0; i < 62 * 62 && i < articles.length; i++) {
            console.log(articles[i])
            if (articles[i].endsWith('.md')) {
                // 重新命名 
                let first = parseInt((i + isFind) / 62);
                let last = (i + isFind) % 62;
                let new_name = `${chars[first]}${chars[last]}-${articles[i].substring(3, articles[i].length)}`
                fs.rename(
                    path.join(org_path, articles[i]),
                    path.join(org_path, new_name), () => { });
            }
            if (org_file.endsWith(articles[i])) {
                isFind = 1;
                position = i + 1;
            }
        }
        let first = parseInt(position / 62);
        let last = position % 62;
        let new_name = `${chars[first]}${chars[last]}-${file_name}_private.md`

        content = '# ' + file_name + '\n' + content;
        fs.writeFileSync(path.join(org_path, new_name), content);
    }
}

/**
 * 数据脱敏，将敏感数据剔除
 */
const filtePrivateBuild = function () {
    // 删除文件夹
    utils.deleteFolderRecursive(outDataPathForFs)
    fs.mkdirSync(outDataPathForFs)
    let filter_markdown = []
    let filter_images = []

    console.log("执行方法: deletePrivateBuild()")
    var dirs = fs.readdirSync(markdownPathForFs);  // 获取每一个主题
    labelObj = { "labels": [] };
    topicalObj = { "topicals": [] };
    articleList = [];

    dirs.forEach((dir) => {
        // 1. 将data 里的每一个文件夹都转化为一个个json，表示每一个主题
        let info_obj = require(markdownPathForRe + dir + "/" + infoFileName);
        info_obj.href = dir;
        labelObj.labels.push(info_obj);
        articleObj = {};

        // 2. 将每一个主题里的文件夹转化为以个个json，表示每一个分主题
        let subTopicalDirs = fs.readdirSync(markdownPathForFs + dir);
        let subTopicalList = []
        if (!fs.existsSync(outDataPathForFs + dir)) {
            fs.mkdirSync(outDataPathForFs + dir)
        }
        subTopicalDirs.forEach((subTopicalDir, index1) => {
            if (fs.statSync(markdownPathForFs + dir + "/" + subTopicalDir).isDirectory()) {
                subTopicalList.push(subTopicalDir)
                // 3. 将每一个md 文件转化为html模式，并且写到json里
                let articles = fs.readdirSync(markdownPathForFs + dir + "/" + subTopicalDir);
                let mdList = [];
                if (!fs.existsSync(outDataPathForFs + dir + '/' + dir + '-' + index1)) {
                    fs.mkdirSync(outDataPathForFs + dir + '/' + dir + '-' + index1)
                }
                articles.forEach((article, index2) => {
                    if (article.endsWith('.md')) {
                        if (article.endsWith('_private.md')) {
                            filter_markdown.push(article);
                            let markdown_context = fs.readFileSync(markdownPathForFs + dir + "/" + subTopicalDir + "/" + article, encode = 'UTF-8');
                            // console.log(markdown_context)
                            let imgHrefs = [...markdown_context.matchAll(/\!\[.*\]\((.*?)\)/g)].map(item => item[1].split('/').pop());
                            filter_images.push(...imgHrefs)
                        } else {
                            let title = article.substring(3, article.length - 3);
                            mdList.push({
                                title,
                                'href': dir + '/' + dir + '-' + index1 + '/' + index2,
                                'md_path': `${dir}/${subTopicalDir}/${article}`
                            });
                            let markdown_context = fs.readFileSync(markdownPathForFs + dir + "/" + subTopicalDir + "/" + article, encode = 'UTF-8');
                            let stat = fs.statSync(markdownPathForFs + dir + "/" + subTopicalDir + "/" + article);
                            let imgHref = markdown_context.match(/\!\[.*\]\((.*?)\)/);
                            imgHref = imgHref ? imgHref[1] : "";
                            articleList.push({
                                "title": title,
                                "img": imgHref,
                                "href": dir + '/' + dir + '-' + index1 + '/' + index2,
                                "des": markdown_context.length < 500 ? markdown_context : markdown_context.substring(0, 500),
                                "commend": 0,
                                "watch": 0,
                                "evaluate": 0,
                                "date": stat.mtime
                            })
                            let context = md.render(markdown_context);
                            fs.writeFileSync(outDataPathForFs + dir + '/' + dir + '-' + index1 + '/' + index2 + ".html", context, encode = 'UTF-8', flag = 'w');

                        }
                    }
                });
                articleObj[subTopicalDir] = mdList;
            }
        })
        topicalObj.topicals.push({
            "topical": dir,
            "subTopical": subTopicalList
        })

        // 记录article文章 到 'data/${topicalName}' 下
        fs.writeFileSync(outDataPathForFs + dir + ".json", JSON.stringify(articleObj));

    })
    // 写入主页标签 label 
    fs.writeFileSync(labelOutJsonPath, JSON.stringify(labelObj));

    // 写入每个主题，和主题中的子标签 
    fs.writeFileSync(topicalOutJsonPath, JSON.stringify(topicalObj));

    // 写入 主页文章中 根据时间排序的文章
    articleList.sort((a, b) => { return b.date.getTime() - a.date.getTime() });
    let index3 = 0;
    let pageNum = 1;
    while (index3 < articleList.length) {
        let subarticleList = []
        for (; index3 < pageNum * 10 && index3 < articleList.length; index3++) {
            subarticleList.push(articleList[index3]);
        }
        fs.writeFileSync(outDataPathForFs + 'article' + pageNum + ".json",
            JSON.stringify({ "articles": subarticleList }), encode = 'UTF-8', flag = 'w');
        pageNum++;
    }
    return {
        'filter_markdown': filter_markdown,
        'filter_images': filter_images
    }
}

/**
 * 发布word
 */
const toWord = function (title, isAll) {

    if (!fs.existsSync(markdownPathForFs + title)) {
        console.log("没有找到" + markdownPathForFs + title)
        return;
    }
    let out_put_path = outDataPathForFs + 'word/' + title

    if (!fs.existsSync(out_put_path)) {
        if (!fs.existsSync(outDataPathForFs + 'word')) {
            fs.mkdirSync(outDataPathForFs + 'word')
            if (!fs.existsSync(outDataPathForFs)) {
                fs.mkdirSync(outDataPathForFs)
            }
        }
        fs.mkdirSync(out_put_path)
    }

    md.block.ruler.before('heading', 'headingadd', function (state, startLine, endLine, silent) {
        var ch, level, tmp, token,
            pos = state.bMarks[startLine] + state.tShift[startLine],
            max = state.eMarks[startLine];

        // if it's indented more than 3 spaces, it should be a code block
        if (state.sCount[startLine] - state.blkIndent >= 4) { return false; }

        ch = state.src.charCodeAt(pos);

        if (ch !== 0x23/* # */ || pos >= max) { return false; }

        // count heading level
        level = 2;
        ch = state.src.charCodeAt(++pos);
        while (ch === 0x23/* # */ && pos < max && level <= 6) {
            level++;
            ch = state.src.charCodeAt(++pos);
        }

        if (level > 6 || (pos < max && !isSpace(ch))) { return false; }

        if (silent) { return true; }

        // Let's cut tails like '    ###  ' from the end of string

        max = state.skipSpacesBack(max, pos);
        tmp = state.skipCharsBack(max, 0x23, pos); // #
        if (tmp > pos && isSpace(state.src.charCodeAt(tmp - 1))) {
            max = tmp;
        }

        state.line = startLine + 1;

        token = state.push('heading_open', 'h' + String(level), 1);
        token.markup = '########'.slice(0, level);
        token.map = [startLine, state.line];

        token = state.push('inline', '', 0);
        token.content = state.src.slice(pos, max).trim();
        token.map = [startLine, state.line];
        token.children = [];

        token = state.push('heading_close', 'h' + String(level), -1);
        token.markup = '########'.slice(0, level);

        return true;
    }, ['paragraph', 'reference', 'blockquote'])
    md.block.ruler.disable('heading')

    let filter_markdown = []
    console.log("执行方法: toWord()")

    labelObj = { "labels": [] };
    articleList = [];



    // 1. 获取专栏 info.json 作为word标题
    let info_obj = require(markdownPathForRe + title + "/" + infoFileName);

    // 2. 读取专栏下的所有文章
    let subTopicalDirs = fs.readdirSync(markdownPathForFs + title);
    let subTopicalList = []
    let html_inner = info_obj.title + '\n'
    subTopicalDirs.forEach((subTopicalDir, index1) => {
        if (fs.statSync(markdownPathForFs + title + "/" + subTopicalDir).isDirectory()) {
            subTopicalList.push(subTopicalDir)
            html_inner = html_inner + `<h1>${subTopicalDir}</h1>\n`
            // 3. 将每一个md 文件转化为html模式, 并写到 subTopical_inner 里

            subTopical_inner = ""
            let articles = fs.readdirSync(markdownPathForFs + title + "/" + subTopicalDir);
            articles.forEach((article, index2) => {
                if (article.endsWith('.md')) {
                    if (article.endsWith('_private.md') && !isAll) {
                        filter_markdown.push(article);
                    } else {
                        // let title = article.substring(3, article.length - 3);
                        let markdown_context = fs.readFileSync(markdownPathForFs + title + "/" + subTopicalDir + "/" + article, encode = 'UTF-8');
                        let context = md.render(markdown_context);
                        html_inner = html_inner + context + '\n'
                    }
                }
            });
        }
    })


    fs.writeFileSync(out_put_path + '/outhtml.html', html_inner);

    var process = require('child_process');
    var cmd = `cd /d .\\public\\data\\word\\${title}&&pandoc outhtml.html -o outhtml.docx --reference-doc ..\\..\\..\\custom-reference.docx`;

    process.exec(cmd, function (error, stdout, stderr) {
        console.log("error:" + error);
        console.log("stdout:" + stdout);
        console.log("stderr:" + stderr);
    });


    return {
        'filter_markdown': filter_markdown
    }
}

module.exports.resetMarkdown = resetMarkdown;
module.exports.insertMarkdown = insertMarkdown;
module.exports.filtePrivateBuild = filtePrivateBuild;
module.exports.toWord = toWord;