const { readFileSync } = require('fs');

function loadEnv(path) {
  try {
    return Object.fromEntries(
      readFileSync(`${__dirname}/${path}`, 'utf8')
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith('#') && line.includes('='))
        .map((line) => {
          const i = line.indexOf('=');
          return [line.slice(0, i).trim(), line.slice(i + 1).trim()];
        }),
    );
  } catch {
    return {};
  }
}

module.exports = {
  apps: [
    {
      name: 'blog-gk-backend',
      cwd: '/var/www/blog-gk/backend',
      script: 'dist/main.js',
      node_args: '--use-system-ca',
      env: {
        NODE_ENV: 'production',
        ...loadEnv('backend/.env'),
      },
    },
    {
      name: 'blog-gk-site',
      cwd: '/var/www/blog-gk/site',
      script: 'node_modules/.bin/next',
      args: 'start -p 5021',
      env: {
        NODE_ENV: 'production',
        ...loadEnv('site/.env'),
      },
    },
    {
      name: 'blog-gk-opencode',
      cwd: '/var/www/blog-gk/opencode',
      script: 'opencode',
      args: 'serve --hostname 127.0.0.1 --port 5023',
      interpreter: 'none',
      env: {
        NODE_ENV: 'production',
        ...loadEnv('opencode/.env'),
      },
    },
  ],
};
