module.exports = {
  apps: [
    {
      name: 'pixel-twin-nexus-master',
      script: 'dist/main.js',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'master',
        PORT: 3000
      },
      log_file: './logs/master-combined.log',
      out_file: './logs/master-out.log',
      error_file: './logs/master-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      kill_timeout: 5000,
      env_file: '.env.master'
    },
    {
      name: 'pixel-twin-nexus-slave',
      script: 'dist/main.js',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'slave',
        PORT: 3001
      },
      log_file: './logs/slave-combined.log',
      out_file: './logs/slave-out.log',
      error_file: './logs/slave-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      kill_timeout: 5000,
      env_file: '.env.slave'
    }
  ]
};