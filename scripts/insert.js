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
    let isFind = 0;
    let position = 0;
    let org_path = path.dirname(org_file)
    if(state.isDirectory(org_file)){
        isFind = 1;
        org_path = org_file
    }
    // 读取所有的文件
    let articals = fs.readdirSync(org_path);
    for(let i = 0; i<62*62 && i<articals.length; i++){
        console.log(articals[i])
        if(articals[i].endsWith('.md')){
            // 重新命名 
            let first = parseInt((i+isFind)/62); 
            let last = (i+isFind)%62;
            let new_name = `${first}${last}-${articals[i].substring(3, articals[i].length)}`
            fs.rename(
                path.join(org_path, articals[i]), 
                path.join(org_path, new_name), ()=>{});
        }
        if(org_file.endsWith(articals[i])){
            isFind = 1;
            position = i+1;
        }
    }
    let first = parseInt(position/62); 
    let last = position%62;
    let new_name = `${first}${last}-${file_name}.md`

    fs.writeFileSync(path.join(org_path, new_name), '# '+file_name);
}

