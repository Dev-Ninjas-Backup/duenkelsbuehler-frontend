import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://aristopay.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/blog", "/privacy", "/terms", "/login", "/register", "/forgot-password"],
        disallow: [
          "/admin/*",
          "/admin",
          "/client/*",
          "/client",
          "/sp/*",
          "/sp",
          "/docusign/*",
          "/veriff/*",
          "/api/*",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
