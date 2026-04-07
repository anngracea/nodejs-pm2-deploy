require('dotenv').config({ path: '../.env.deploy' });

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
      name: 'frontend',
      script: 'serve',
      args: ['-s', 'build', '-l', '3001'],
    },
  ],

  deploy: {
    production: {
      user: DEPLOY_USER,
      host: DEPLOY_HOST,
      ref: DEPLOY_REF,
      repo: DEPLOY_REPO,
      path: `${DEPLOY_PATH}/frontend`,
      ssh_options: `StrictHostKeyChecking=no -i ${DEPLOY_SSH_KEY}`,
      'post-deploy': `
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
        cd frontend && npm install && npm run build
      `,
    },
  },
};