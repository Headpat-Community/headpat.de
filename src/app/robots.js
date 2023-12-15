export default function robots() {
    return {
      rules: {
        userAgent: '*',
        allow: '/',
        disallow: '/account/',
      },
      sitemap: `${process.env.NEXT_PUBLIC_DOMAIN}/sitemap.xml`,
    }
  }