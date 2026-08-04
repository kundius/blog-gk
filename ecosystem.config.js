module.exports = {
  apps: [
    {
      name: 'blog-gk-backend',
      cwd: '/var/www/blog-gk/backend',
      script: 'dist/main.js',
      node_args: '--use-system-ca',
      env_file: 'backend/.env',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'blog-gk-site',
      cwd: '/var/www/blog-gk/site',
      script: 'node_modules/.bin/next',
      args: 'start -p 3000',
      env_file: 'site/.env',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
