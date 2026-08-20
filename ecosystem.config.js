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
      args: 'start -p 5021',
      env_file: 'site/.env',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'blog-gk-opencode',
      cwd: '/var/www/blog-gk/opencode',
      script: 'opencode',
      args: 'serve --hostname 127.0.0.1 --port 5023',
      interpreter: 'none',
      env_file: 'opencode/.env',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
