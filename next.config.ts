import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**", // Wildcard to allow any domain
			},
		],
	},
	/* config options here */
};

export default nextConfig;
