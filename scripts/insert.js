'use strict';

// 插入一篇文章

const fs = require('fs');
const path = require('path')
const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

// 获取命令行参数 
let org_file = process.argv[2]
let file_name = process.argv[3]

console.log(path.dirname(org_file))

// 判断文件是否存在
if( ! fs.existsSync(org_file) ){
    console.log("文件不存在")
}

// 文件存在时继续
else{
    let state = fs.statSync(org_file)
    let i = 0;
    let org_path = path.dirname(org_file)
    if(state.isDirectory(org_file)){
        i = 1;
        fs.writeFileSync(org_file + "\\00-" + file_name + ".md", '#'+file_name);
        org_path = org_file
    }

    // 读取所有的文件
    let articals = fs.readdirSync(org_path);
    for(; i<62*62 && i<=articals.length; i++){
        console.log(articals[i])
        if(articals[i].endsWith('.md')){
            // 重新命名 
            let first = parseInt(i/62); 
            let last = i%62;
            let new_name = `${first}${last}-${articals[i].substring(2, articals[i].length)}`
            fs.rename(path.join(org_file, articals[i]), new_name, ()=>{});
        }
        if(org_file.endsWith(articals[i])){
            i = i + 1;
            let first = parseInt(i/62); 
            let last = i%62;
            fs.writeFileSync(`${first}${last}-` + file_name + ".md", '#'+file_name);
        }
    }
}

