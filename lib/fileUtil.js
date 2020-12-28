
const fs = require('fs');
const path = require('path');


function readFileArray(filepath, defaultVlue = {}) {
    return readFile(filepath, [])

}

function readFileObject(filepath, defaultVlue = {}) {
    return readFile(filepath, {})
}

function readFile(filepath, defaultVlue = null) {
    let jsObject = defaultVlue;
    if (fs.existsSync(filepath)) {
        let content = fs.readFileSync(filepath, { encoding: 'utf8' });
        jsObject = JSON.parse(content);
    }
    return jsObject
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
    readFile,
    writeFile,
    mkdir,
}