import nextPWA from 'next-pwa';

const withPWA = nextPWA({
    dest: 'public'
});

/** @type {import("next").NextConfig} */
const config = {
    output: 'standalone'
};

export default withPWA(config);
