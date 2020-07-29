module.exports = {
  apps: [
    {
      name: "app",
      script: "./app.js",
      watch: true,
      env: {
        MONGO_URI: "<require>"
      },
      production_env: {

      }
    }
  ]
};
