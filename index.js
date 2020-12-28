module.exports = require('./lib/feiyuUtil');
const fileUtil = require('./core/feiyuUtil');
const PromisePool = require('./core/PromisePool');

module.exports = {
    fileUtil,
    PromisePool,
}
const { addTaskToPromisePool } = require('feiyu-util');
let fileContentArray = new Array(fileList.length);
addTaskToPromisePool(fileList,
    (file, index) => {
        fs.readFile(file, { encoding: 'utf8' }, (err, data) => {
            fileContentArray[index] = data;
        });
    },
    () => {
        console.log('finish');
    }
);