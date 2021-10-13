
const fs = require('fs');
const path = require('path');


function readFileArray(filepath, defaultVlue = {}) {
    return readJson(filepath, [])

}

function readFileObject(filepath, defaultVlue = {}) {
    return readJson(filepath, {});
}
function readJson(filepath, defaultVlue = null){
    let result = defaultVlue;

    let content = readFile(filepath);
    if(content){
        result = JSON.parse(content);
    }
    return result;
}

function readFile(filepath, defaultVlue = null) {
    let result = null;
    if (fs.existsSync(filepath)) {
        result = fs.readFileSync(filepath, { encoding: 'utf8' });
    }
    return result;
}

function writeFile(filepath, data) {
    let dir = path.dirname(filepath);
    let content = '';
    if (data) {
        let type = typeof (data);
        if (type == 'object') {
            content = JSON.stringify(data, null, 2);
        } else if (type == 'string') {
            content = data;
        } else {
            content = data.toString();
        }
    }
    mkdir(dir);
    fs.writeFileSync(filepath, content, { encoding: 'utf8' });
}

function mkdir(filepath) {
    if (!fs.existsSync(filepath)) {
        fs.mkdirSync(filepath, { recursive: true })
    }
}

module.exports = {
    readFileArray,
    readFileObject,
    readJson,
    readFile,
    writeFile,
    mkdir,
}