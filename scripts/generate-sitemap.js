// generate-sitemap.js
// Generate sitemap for SEO optimization

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAIN = 'https://usbrecognized.com';
const OUTPUT_PATH = path.join(__dirname, '../public/sitemap.xml');

// Website page configuration
const pages = [
  {
    url: '/',
    changefreq: 'weekly',
    priority: '1.0',
    lastmod: '2025-07-26'
  },
  {
    url: '/usb-not-recognized',
    changefreq: 'monthly',
    priority: '0.9',
    lastmod: '2025-07-26'
  },
  {
    url: '/blog',
    changefreq: 'weekly',
    priority: '0.8',
    lastmod: '2025-07-26'
  },
  {
    url: '/about-us',
    changefreq: 'monthly',
    priority: '0.7',
    lastmod: '2025-07-26'
  },
  {
    url: '/contact',
    changefreq: 'monthly',
    priority: '0.6',
    lastmod: '2025-07-26'
  },
  {
    url: '/privacy-policy',
    changefreq: 'yearly',
    priority: '0.5',
    lastmod: '2025-07-26'
  },
  {
    url: '/terms-of-service',
    changefreq: 'yearly',
    priority: '0.5',
    lastmod: '2025-07-26'
  }
];

// Blog posts configuration
const blogPosts = [
  {
    slug: 'usb-protocol-evolution-history',
    title: 'USB Protocol Evolution: From 1.0 to USB4 - A Complete Technical Journey',
    publishDate: '2025-07-21',
    lastModified: '2025-07-21',
    priority: '0.8'
  },
  {
    slug: 'usb-c-complexity-explained',
    title: 'Why is USB-C So Complex? Understanding the Universal Connector',
    publishDate: '2025-07-20',
    lastModified: '2025-07-20',
    priority: '0.8'
  },
  {
    slug: 'enterprise-usb-troubleshooting-case-study',
    title: 'Case Study: How We Solved USB Issues for 500+ Corporate Workstations',
    publishDate: '2025-07-19',
    lastModified: '2025-07-19',
    priority: '0.8'
  },
  {
    slug: 'usb-device-lifespan-maintenance',
    title: '5 Secrets to Extend USB Device Lifespan: Maintenance Tips You Never Knew',
    publishDate: '2025-07-18',
    lastModified: '2025-07-18',
    priority: '0.8'
  },
  {
    slug: 'usb-buying-guide-2025',
    title: 'USB Device Buying Guide 2025: 10 Critical Factors Before You Purchase',
    publishDate: '2025-07-17',
    lastModified: '2025-07-17',
    priority: '0.8'
  },
  {
    slug: 'photographer-usb-workflow-optimization',
    title: 'Photographer\'s USB Workflow: Optimize Your Camera-to-Computer Transfer',
    publishDate: '2025-07-16',
    lastModified: '2025-07-16',
    priority: '0.8'
  }
];

// Generate XML sitemap
function generateSitemap() {
  const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;
  const xmlFooter = '</urlset>';
  
  // Generate URLs for main pages
  const pageUrls = pages.map(page => {
    let imageXml = '';
    if (page.url === '/') {
      imageXml = `
    <image:image>
      <image:loc>${DOMAIN}/favicon.png</image:loc>
      <image:title>USB Recognition Tool Logo</image:title>
      <image:caption>Free online USB device recognition tool</image:caption>
    </image:image>`;
    }
    
    return `  <url>
    <loc>${DOMAIN}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>${imageXml}
  </url>`;
  });

  // Generate URLs for blog posts
  const blogUrls = blogPosts.map(post => {
    return `  <url>
    <loc>${DOMAIN}/blog/${post.slug}</loc>
    <lastmod>${post.lastModified}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${post.priority}</priority>
    <news:news>
      <news:publication>
        <news:name>USB Recognized</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${post.publishDate}</news:publication_date>
      <news:title><![CDATA[${post.title}]]></news:title>
    </news:news>
  </url>`;
  });

  const urls = [...pageUrls, ...blogUrls].join('\n');
  const sitemap = xmlHeader + urls + '\n' + xmlFooter;
  
  // Ensure directory exists
  const dir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  // Write file
  fs.writeFileSync(OUTPUT_PATH, sitemap, 'utf8');
  
  console.log('✓ Sitemap generated successfully:', OUTPUT_PATH);
  console.log(`✓ Contains ${pages.length} pages and ${blogPosts.length} blog posts`);
  
  // Generate robots.txt file
  const robotsContent = `User-agent: *
Allow: /
Sitemap: ${DOMAIN}/sitemap.xml

# Disallow crawling of admin or sensitive areas
Disallow: /admin/
Disallow: /.git/
Disallow: /node_modules/

# Allow all other content
Allow: /blog/
Allow: /usb-not-recognized
Allow: /about-us
Allow: /contact
`;
  
  fs.writeFileSync(path.join(__dirname, '../public/robots.txt'), robotsContent, 'utf8');
  console.log('✓ robots.txt updated successfully');
  
  return sitemap;
}

// If running this script directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateSitemap();
}

export { generateSitemap, pages, blogPosts };