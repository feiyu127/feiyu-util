const fileUtil = require("./fileUtil");
const PromisePool = require("./PromisePool");
const SSHUtil = require("./SSHUtil");

/** 复制文本到剪切板 */
let copy = (content, encoding = "utf8") => {
  require("child_process")
    .exec("clip")
    .stdin.end(require("iconv-lite").encode(content, encoding));
};
/**
 * 睡眠一段时间
 * @param {毫秒数} millsSeconds
 */
let sleep = (millsSeconds) =>
  new Promise((resolve) => {
    setTimeout(resolve, millsSeconds);
  });

/** 记录日志 */
let logging = function (content) {
  let finalContent =
    typeof content == "string" ? content : JSON.stringify(content, null, 2);
  console.log(`[${new Date().toLocaleString()}] ${finalContent}`);
};

module.exports = {
  fileUtil,
  PromisePool,
  SSHUtil,
  copy,
  sleep,
  logging
};
