const fs = require("fs");
const markdownPathForFs = "./public/markdown/";  // fs, require 读取文件路径不一样
const markdownPathForRe = "../../../public/markdown/";
const outDataPathForFs = "./public/data/";
const outDataPathForRe = "../../../public/data/";
const labelOutJsonPath = "./public/json/labels.json";
const topicalOutJsonPath = "./public/json/topicals.json";
const infoFileName = "info";

/**
 * 将 data 文件转化为markdown文件和 json文件。
 * 1. 将data 里的每一个文件夹都转化为一个个json，表示每一个主题
 * 2. 将每一个主题里的文件夹转化为以个个json，表示每一个分主题
 * 3. 将每一个md 文件转化为html模式，并且写到json里，
 */
const resetMarkdown = function(){
    console.log("执行方法: resetMarkdown()")
    var dirs = fs.readdirSync(markdownPathForFs);  // 获取每一个主题
    
    labelObj = {"labels":[]};
    topicalObj = {"topicals":[]};

    dirs.forEach((dir)=>{
        // 1. 将data 里的每一个文件夹都转化为一个个json，表示每一个主题
        let info_obj = require(markdownPathForRe + dir + "/" + infoFileName);
        info_obj.href = "#";
        labelObj.labels.push(info_obj);
        articalObj = {};
        
        // 2. 将每一个主题里的文件夹转化为以个个json，表示每一个分主题
        let subTopicalDirs = fs.readdirSync(markdownPathForFs + dir);
        let subTopicalList = []
        subTopicalDirs.forEach((subTopicalDir) => {
            if(fs.statSync(markdownPathForFs + dir + "/" + subTopicalDir).isDirectory()){
                subTopicalList.push(subTopicalDir)
                // 3. 将每一个md 文件转化为html模式，并且写到json里
                let articals = fs.readdirSync(markdownPathForFs + dir + "/" + subTopicalDir);
                let mdList = [];
                articals.forEach((artical)=>{
                    if(artical.endsWith('.md')){
                        mdList.push({
                            'title': artical.substring(0, artical.length - 3),
                            'href': '#',
                        });
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
        // console.log(articalObj)
        fs.writeFileSync(outDataPathForFs + dir + ".json", JSON.stringify(articalObj));

    })
    // 写入主页标签 label 
    fs.writeFileSync(labelOutJsonPath, JSON.stringify(labelObj));

    // 写入每个主题，和主题中的子标签 
    fs.writeFileSync(topicalOutJsonPath, JSON.stringify(topicalObj));


}

module.exports.resetMarkdown = resetMarkdown;