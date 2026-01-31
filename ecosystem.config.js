module.exports = {
  apps: [
    {
      name: "mpip-frontend",
      cwd: "/app/frontend",
      script: "npm",
      args: "start",
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: "production"
      }
    },
    {
      name: "mpip-gateway",
      cwd: "/app/backend/gateway",
      script: "npm",
      args: "start",
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: "production"
      }
    },
    {
      name: "mpip-node-api",
      cwd: "/app/backend/node-api",
      script: "npm",
      args: "start",
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
