# feiyu-util

飞羽 nodejs 工具类，包含如下模块

## 简单方法

| method  | desc                          |
| ------- | ----------------------------- |
| copy    | 复制内容到剪切板              |
| sleep   | 异步 sleep(毫秒) await 可睡眠 |
| logging | console.log ，多了时间戳      |

## PromisePool

线程池相关操作，主要限制同时执行的异步任务数

| method               | desc                         |
| -------------------- | ---------------------------- |
| PromisePool          | PromisePool 对象，内部使用， |
| addTaskToPromisePool | 添加任务列表到线程池         |

```
/**
 * dataList 数据集合
 * dataHandle 每条数据要做的操作, 传入的参数为 data 和 index
 * success 数据全部执行完成后执行的方法
 */
addTaskToPromisePool(dataList, dataHandle, success)

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

```

## fileUtil

文件操作相关工具

| method         | desc                                                 |
| -------------- | ---------------------------------------------------- |
| readFileArray  | 读取文件内容到数组，如文件不存在，则为空数组         |
| readFileObject | 读取文件内容到对象，如文件不存在，则为空对象         |
| readJson       | 读取文件内容到 Json，如文件不存在，则为 null         |
| readFile       | 读取文件内容到字符串，如文件不存在，则为 null        |
| writeFile      | 写文件内容到文件里，如是对象，则会使用 json 格式存储 |
| mkdir          | 创建目录，带递归                                     |

## SSHUtil

ssh2 工具类

| method   | desc                                   |
| -------- | -------------------------------------- |
| instance | 静态异步方法，通过该方法来获取工具实例 |
| shell    | 交互式执行命令                         |
| exec     | 执行某条命令，返回命令结果             |
| download | 下载远端服务器文件到本地               |
| upload   | 上传本地文件到远端服务器               |
| close    | 关闭 ssh2 的链接                       |
