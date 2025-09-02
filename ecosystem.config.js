module.exports = {
    apps : [{
      name:'ms-tracer-bencana',
      script: 'server.js',
      watch: '.',
      ignore_watch: ['api/logapi','tmp','upload', 'logs', 'storage'],
      exp_backoff_restart_delay: 100
    }],
  
    deploy : {
      production : {
        user : 'SSH_USERNAME',
        host : 'SSH_HOSTMACHINE',
        ref  : 'origin/master',
        repo : 'GIT_REPOSITORY',
        path : 'DESTINATION_PATH',
        'pre-deploy-local': '',
        'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
        'pre-setup': ''
      }
    }
  };
  
