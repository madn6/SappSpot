import type { NextConfig } from 'next';

const securityHeaders = [
	{
		key: 'X-DNS-Prefetch-Control',
		value: 'on'
	},
	{
		key: 'Strict-Transport-Security',
		value: 'max-age=63072000; includeSubDomains; preload'
	},
	{
		key: 'X-XSS-Protection',
		value: '1; mode=block'
	},
	{
		key: 'X-Frame-Options',
		value: 'SAMEORIGIN'
	},
	{
		key: 'X-Content-Type-Options',
		value: 'nosniff'
	},
	{
		key: 'Referrer-Policy',
		value: 'strict-origin-when-cross-origin'
	},
	{
		key: 'Permissions-Policy',
		value: 'camera=(), microphone=(), geolocation=()'
	},
	{
		key: 'Content-Security-Policy',
		value: `
		default-src 'self';
		script-src 'self' 'unsafe-inline' 'unsafe-eval';
		style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.cdnfonts.com;
		font-src 'self' https://fonts.gstatic.com https://fonts.cdnfonts.com;
		img-src * data: blob:;
		connect-src *;
		frame-ancestors 'none';
	`
			.replace(/\s{2,}/g, ' ')
			.trim()
	}
];

const nextConfig: NextConfig = {
	async headers() {
		return [
			{
				source: '/(.*)', // Apply to all routes
				headers: securityHeaders
			}
		];
	}
};

export default nextConfig;
