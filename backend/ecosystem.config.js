require('dotenv').config({ path: './.env.deploy' });

const {
  DEPLOY_USER,
  DEPLOY_HOST,
  DEPLOY_PATH,
  DEPLOY_REPO,
  DEPLOY_REF = 'origin/master',
  DEPLOY_SSH_KEY,
} = process.env;

module.exports = {
  apps: [
    {
      name: 'backend',
      script: './dist/app.js',
      env_production: {
        NODE_ENV: 'production',
        PORT: process.env.PORT,
        DB_ADDRESS: process.env.DB_ADDRESS,
        JWT_SECRET: process.env.JWT_SECRET,
      },
    },
  ],

  deploy: {
    production: {
      user: DEPLOY_USER,
      host: DEPLOY_HOST,
      ref: DEPLOY_REF,
      repo: DEPLOY_REPO,
      path: DEPLOY_PATH,
      ssh_options: `StrictHostKeyChecking=no -i ${DEPLOY_SSH_KEY}`,
      'pre-deploy-local': `scp -i ${DEPLOY_SSH_KEY} .env ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/shared/.env`,
      'post-deploy': `
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
        mkdir -p backend
        cp ../shared/.env backend/.env
        cd backend && npm install && npm run build
        pm2 reload ecosystem.config.js --env production
      `,
    },
  },
};