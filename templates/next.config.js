/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.modules.push(path.resolve('./node_modules'));
        }
        return config;
    },

    basePath: '/elle',

    async rewrites() {
        return [
            {
                source: '/elleapi/:slug*',
                destination: 'http://localhost:5050/elleapi/:slug*'
            }
        ];
    }
};

module.exports = nextConfig;
