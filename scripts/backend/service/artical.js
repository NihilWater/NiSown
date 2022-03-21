const fs = require("fs");
const MarkdownIt = require("markdown-it");
const hljs = require('highlight.js'); // https://highlightjs.org/
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

const markdownPathForFs = "./public/markdown/";  // fs, require 读取文件路径不一样
const markdownPathForRe = "../../../public/markdown/";
const outDataPathForFs = "./public/data/";
const outJsonPathForFs = "./public/json/";
const outDataPathForRe = "../../../public/data/";
const labelOutJsonPath = "./public/json/labels.json";
const topicalOutJsonPath = "./public/json/topicals.json";
const infoFileName = "info";
const MaxArticalNum = 10;

/**
 * 将 data 文件转化为markdown文件和 json文件。
 * 1. 将data 里的每一个文件夹都转化为一个个json，表示每一个主题
 * 2. 将每一个主题里的文件夹转化为以个个json，表示每一个分主题
 * 3. 将每一个md 文件转化为html模式，并且写到json里，
 */
const resetMarkdown = function () {
    console.log("执行方法: resetMarkdown()")
    var dirs = fs.readdirSync(markdownPathForFs);  // 获取每一个主题

    labelObj = { "labels": [] };
    topicalObj = { "topicals": [] };
    articalList = [];

    dirs.forEach((dir) => {
        // 1. 将data 里的每一个文件夹都转化为一个个json，表示每一个主题
        let info_obj = require(markdownPathForRe + dir + "/" + infoFileName);
        info_obj.href = "#";
        labelObj.labels.push(info_obj);
        articalObj = {};

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
                let articals = fs.readdirSync(markdownPathForFs + dir + "/" + subTopicalDir);
                let mdList = [];
                if (!fs.existsSync(outDataPathForFs + dir + '/' + dir + '-' + index1)) {
                    fs.mkdirSync(outDataPathForFs + dir + '/' + dir + '-' + index1)
                }
                articals.forEach((artical, index2) => {
                    if (artical.endsWith('.md')) {
                        let title = artical.substring(3, artical.length - 3);
                        mdList.push({
                            title,
                            'href': dir + '/' + dir + '-' + index1 + '/' + index2,
                        });
                        let markdown_context = fs.readFileSync(markdownPathForFs + dir + "/" + subTopicalDir + "/" + artical, encode = 'UTF-8');
                        let stat = fs.statSync(markdownPathForFs + dir + "/" + subTopicalDir + "/" + artical);
                        let imgHref = markdown_context.match(/\!\[.*\]\((.*?)\)/);
                        imgHref = imgHref?imgHref[1]:"";
                        articalList.push({
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
                articalObj[subTopicalDir] = mdList;
            }
        })
        topicalObj.topicals.push({
            "topical": dir,
            "subTopical": subTopicalList
        })

        // 记录artical文章 到 'data/${topicalName}' 下
        fs.writeFileSync(outDataPathForFs + dir + ".json", JSON.stringify(articalObj));

    })
    // 写入主页标签 label 
    fs.writeFileSync(labelOutJsonPath, JSON.stringify(labelObj));

    // 写入每个主题，和主题中的子标签 
    fs.writeFileSync(topicalOutJsonPath, JSON.stringify(topicalObj));

    // 写入 主页文章中 根据时间排序的文章
    articalList.sort((a, b) => { return b.date.getTime() - a.date.getTime() });
    let index3 = 0;
    let pageNum = 1;
    while (index3 < articalList.length) {
        let subArticalList = []
        for (; index3 < pageNum * 10 && index3 < articalList.length; index3++) {
            subArticalList.push(articalList[index3]);
        }
        fs.writeFileSync(outJsonPathForFs + 'artical' + pageNum + ".json",
            JSON.stringify({ "articals": subArticalList }), encode = 'UTF-8', flag = 'w');
        pageNum++;
    }
}
module.exports.resetMarkdown = resetMarkdown;