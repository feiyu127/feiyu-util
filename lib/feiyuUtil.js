const fileUtil = require('./fileUtil');
const PromisePool = require('./PromisePool');

let copy = (content, encoding='utf8')=>{
    require('child_process')
       .exec('clip')
       .stdin
       .end(require('iconv-lite').encode(content, encoding));
}

module.exports = {
    fileUtil,
    PromisePool,
    copy
}