const fileUtil = require("./fileUtil");
const PromisePool = require("./PromisePool");
let iconv = require('iconv-lite');
/**
 * 复制文本到剪切板
 * 
 * @param {复制内容} content
 * @param {内容编码，默认utf-8} encoding
 */
let copy = (content, encoding = "utf8") => {
  require("child_process")
    .exec("clip")
    .stdin.end(iconv.encode(content, encoding));
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
  copy,
  sleep,
  logging
};
