module.exports = {
  apps : [{
    name        : "postReceive",
    script      : "server/index.js",
    watch       : true,
    cwd         : "/opt/postReceive",
    instances	: "max",
    exec_mode	: "cluster",
    watch	: ["./server","./system_confs"],
    ignore_watch	: ["./log_storage","./db_storage","./message_storage"],
    out_file	: "./log_storage/postReceive_out.log",
    error_file	: "./log_storage/postReceive_err.log",
    pid_file	: "./log_storage/pid/postReceive_id.pid",
    log_date_format	: "YYYY-MM-DD HH:mm Z",
    env: {
      "NODE_ENV": "prod",
      "PORT": "5000",
      "HOST": "localhost"
    },
    env_dev : {
      "NODE_ENV": "dev",
      "PORT": "5001",
      "HOST": "localhost"
    }
  }]
}
