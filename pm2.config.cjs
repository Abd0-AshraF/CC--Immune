/**
 * PM2 configuration for bare-metal VPS deployments.
 * Usage: pm2 start pm2.config.cjs
 */
module.exports = {
  apps: [
    {
      name: 'cc-immune',
      script: 'src/index.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_restarts: 10,
      min_uptime: '30s',
      // Restart before the OS OOM-killer intervenes.
      max_memory_restart: '480M',
      node_args: '--max-old-space-size=384',
      env: { NODE_ENV: 'production' },
      error_file: 'logs/pm2-error.log',
      out_file: 'logs/pm2-out.log',
      time: true,
    },
  ],
};
