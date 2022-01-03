const ssh2 = require("ssh2");
const process = require("process");
/**
 * ssh 工具类
 *
 * 使用方法：
 * 通过 SSHUtil.instance(config) 获取对象，
 * 执行方法
 * sshUtil.close();
 *
 *
 * let client = await SSHUtil.instance({server:{
 *   host, port, username, password|privateKey
 * }})
 * client.shell('ls');
 * client.shell(['cd /home', 'pwd']);
 * client.exec('ls);
 * client.download('/home/user/temp.txt', 'temp.txt')
 * client.close();
 *
 * let client = SSHUtil.instance(config: object);
 * client.shell(commands: string | symbol)
 * client.exec(commands: string | symbol)
 * client.download(remotePath, localPath)
 * client.upload(localPath, remotePath)
 * client.close();
 *
 *
 */
class SSHUtil {
  server;
  echoOn; // 是否回显 ssh 服务端的日志
  client; // ssh2的conn
  sleepSecond = 500; // 每条命令执行的间隔
  rootPassword; // root的password
  constructor(
    conf = {
      rootPassword: "helloworld",
      echoOn: false,
    }
  ) {
    if (!conf.server) {
      throw new Error("no server config");
    }
    this.server = conf.server;
    this.echoOn = conf.echoOn;
    this.rootPassword = conf.rootPassword;
  }

  static instance(config) {
    let sshUtil = new SSHUtil(config);
    return new Promise((resolve, reject) => {
      let client = new ssh2.Client();
      client
        .on("close", () => {
          sshUtil._logging("client is closed\n");
        })
        .on("ready", () => {
          sshUtil.client = client;
          resolve(sshUtil);
        })
        .connect(sshUtil.server);
    });
  }

  download(remotePath, localPath) {
    let client = this.client;
    return new Promise((resolve, reject) => {
      client.sftp((err, sftp) => {
        sftp.fastGet(remotePath, localPath, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(localPath);
          }
        });
      });
    });
  }

  upload(localPath, remotePath) {
    let client = this.client;
    return new Promise((resolve, reject) => {
      client.sftp((err, sftp) => {
        sftp.fastGet(localPath, remotePath, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(remotePath);
          }
        });
      });
    });
  }

  exec(command) {
    let client = this.client;
    return new Promise((resolve, reject) => {
      client.exec(command, (err, stream) => {
        if (err) throw err;
        stream
          .on("close", (code, signal) => {
            console.info("auto close exec stream");
          })
          .on("data", (data) => {
            resolve({ stream, data: data.toString() });
          })
          .stderr.on("data", (data) => {
            resolve({ stream, errdata: data.toString() });
          });
      });
    });
  }

  shell(commands) {
    let rootPassword = this.rootPassword;
    let client = this.client;
    return new Promise((resolve, reject) => {
      let su = false;
      client.shell(async (err, stream) => {
        if (err) throw err;

        if (typeof commands == "string") {
          commands = [commands];
        }
        let result = [];
        stream
          .on("close", (code, signal) => {
            console.info("stream closed");
          })
          .on("data", async (buffer) => {
            let data = buffer.toString();
            result.push(data);
            this._logging(data);
            if (commands.includes(rootPassword) && data.includes("Password:")) {
              su = true;
              stream.write(commands.shift() + "\n");
            } else {
              let commonCommand = buffer.indexOf("$") > 2;
              let suCommand = buffer.indexOf("#") > 2;
              if (commonCommand || suCommand) {
                if (commands.length > 0) {
                  await this._sleeping();
                  stream.write(commands.shift() + "\n");
                } else {
                  if (su) {
                    su = false;
                    await this._sleeping();
                    stream.write("exit" + "\n");
                  } else {
                    await this._sleeping();
                    stream.end("exit" + "\n");
                    result.push("\n");
                    resolve({ data: result });
                  }
                }
              }
            }
          })
          .stderr.on("data", (data) => {
            console.error("error data:" + data);
            resolve({ stream, errdata: data.toString() });
          });
      });
    });
  }

  close() {
    this.client.end();
  }
  // 内部方法

  _logging(info) {
    if (this.echoOn) {
      process.stdout.write(info);
    }
  }

  _sleep(millsSeconds) {
    return new Promise((resolve) => setTimeout(resolve, millsSeconds));
  }

  async _sleeping() {
    await this._sleep(this.sleepSecond);
  }
}
