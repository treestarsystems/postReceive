module.exports = {
  apps : [{
    name        : "postReceive",
    script      : "server/index.js",
    watch       : true,
    cwd         : "/opt/postReceive",
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
