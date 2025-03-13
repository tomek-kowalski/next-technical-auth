import withMDX from '@next/mdx';

const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'md', 'mdx'],
};

export default withMDX(nextConfig);