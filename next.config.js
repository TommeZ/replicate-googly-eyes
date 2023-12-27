/** @type {import('next').NextConfig} */

// https://nextjs.org/docs/messages/next-image-unconfigured-host
module.exports = {
    images: {
        remotePatterns: [
            {
                hostname: 'replicate.delivery'
            },
            {
                hostname: 'upcdn.io'
            },
        ]
    }
};