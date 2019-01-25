module.exports = {
  apps : [{
    name: 'fcjb',
    script: 'dist/app.js',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    cron_restart: '*/1 * * * *',
    args: 'one two',
    instances: 1,
    autorestart: false,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],

};
