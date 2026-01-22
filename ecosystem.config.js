module.exports = {
  apps: [
    {
      name: "mpip-frontend",
      cwd: "/home/ubuntu/projects/dev/MPIP/frontend",
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
      cwd: "/home/ubuntu/projects/dev/MPIP/backend/gateway",
      script: "npm",
      args: "start",
      autorestart: true,
      watch: false
    },
    {
      name: "mpip-node-api",
      cwd: "/home/ubuntu/projects/dev/MPIP/backend/node-api",
      script: "npm",
      args: "start",
      autorestart: true,
      watch: false
    }
  ]
};
