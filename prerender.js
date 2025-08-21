// prerender.js
// This script is used to pre-render pages after build completion for SEO optimization

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Routes to pre-render
const routes = [
  '/',
  '/about-us',
  '/contact',
  '/privacy-policy',
  '/terms-of-service',
  '/usb-not-recognized',
  '/blog'
];

// Blog post data for pre-rendering
const blogPosts = [
  {
    slug: 'usb-protocol-evolution-history',
    title: 'USB Protocol Evolution: From 1.0 to USB4 - A Complete Technical Journey',
    description: 'Complete guide to USB protocol evolution from USB 1.0 to USB4. Learn the technical journey, improvements, and real-world impact of each USB generation.'
  },
  {
    slug: 'usb-c-complexity-explained',
    title: 'Why is USB-C So Complex? Understanding the Universal Connector',
    description: 'I bought 5 different USB-C cables last month. Only 2 worked with my laptop. Here\'s why USB-C is more confusing than the problem it was meant to solve.'
  },
  {
    slug: 'enterprise-usb-troubleshooting-case-study',
    title: 'Case Study: How We Solved USB Issues for 500+ Corporate Workstations',
    description: 'Real-world case study of enterprise USB troubleshooting. Learn how we resolved USB recognition issues across 500+ corporate workstations with PowerShell automation.'
  },
  {
    slug: 'usb-device-lifespan-maintenance',
    title: '5 Secrets to Extend USB Device Lifespan: Maintenance Tips You Never Knew',
    description: 'Discover 5 hidden techniques to dramatically extend USB device lifespan. Professional maintenance tips that can save you hundreds on replacement costs.'
  },
  {
    slug: 'usb-buying-guide-2025',
    title: 'USB Device Buying Guide 2025: 10 Critical Factors Before You Purchase',
    description: 'Complete USB device buying guide for 2025. 10 critical factors to evaluate before purchasing any USB device, with real-world testing data and failure rate analysis.'
  },
  {
    slug: 'photographer-usb-workflow-optimization',
    title: 'Photographer\'s USB Workflow: Optimize Your Camera-to-Computer Transfer',
    description: 'Professional photographer\'s guide to optimizing USB workflow. Reduce transfer times by 60% with these proven techniques and equipment recommendations.'
  }
];

// Function to check SEO elements
async function checkSEO(page, route) {
  console.log(`Pre-rendering: ${route}`);
  
  // Navigate to the route
  const url = `file://${path.join(__dirname, 'dist', route === '/' ? 'index.html' : `${route.substring(1)}.html`)}?prerender=1`;
  await page.goto(url, { waitUntil: 'networkidle0' });
  
  // Get the page title
  const title = await page.title();
  console.log(`  - Title: ${title ? '✓' : '✗'}`);
  
  // Get the meta description
  const description = await page.$('meta[name="description"]');
  console.log(`  - Description: ${description ? '✓' : '✗'}`);
  
  // Check for structured data
  const structuredData = await page.$('script[type="application/ld+json"]');
  console.log(`  - Structured Data: ${structuredData ? '✓' : '✗'}`);
  
  // Check for canonical URL
  const canonical = await page.$('link[rel="canonical"]');
  console.log(`  - Canonical URL: ${canonical ? '✓' : '✗'}`);
  
  // Get the HTML content
  const html = await page.content();
  
  // Save the pre-rendered HTML
  const outputPath = path.join(__dirname, 'dist', route === '/' ? 'index.html' : `${route.substring(1)}.html`);
  fs.writeFileSync(outputPath, html);
  console.log(`  ✓ ${route}`);
}

// Function to pre-render blog posts
async function prerenderBlogPosts(page) {
  // Create blog directory if it doesn't exist
  const blogDir = path.join(__dirname, 'dist', 'blog');
  if (!fs.existsSync(blogDir)) {
    fs.mkdirSync(blogDir, { recursive: true });
  }
  
  // Pre-render all blog posts
  for (const post of blogPosts) {
    try {
      console.log(`Pre-rendering: /blog/${post.slug}`);
      
      // Copy blog.html to create the blog post file
      const outputPath = path.join(__dirname, 'dist', 'blog', `${post.slug}.html`);
      fs.copyFileSync(path.join(__dirname, 'dist', 'blog.html'), outputPath);
      
      // Navigate to the blog post route
      const url = `file://${outputPath}?prerender=1&slug=${post.slug}`;
      await page.goto(url, { waitUntil: 'networkidle0' });
      
      // Wait a bit for the page to render
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update the page title and meta description
      await page.evaluate((postData) => {
        // Update title
        const titleElement = document.querySelector('title');
        if (titleElement) {
          titleElement.textContent = `${postData.title} - USB Recognized Blog`;
        }
        
        // Update meta description
        const descriptionElement = document.querySelector('meta[name="description"]');
        if (descriptionElement) {
          descriptionElement.setAttribute('content', postData.description);
        }
        
        // Update og:title
        const ogTitleElement = document.querySelector('meta[property="og:title"]');
        if (ogTitleElement) {
          ogTitleElement.setAttribute('content', `${postData.title} - USB Recognized Blog`);
        }
        
        // Update og:description
        const ogDescriptionElement = document.querySelector('meta[property="og:description"]');
        if (ogDescriptionElement) {
          ogDescriptionElement.setAttribute('content', postData.description);
        }
        
        // Update twitter:title
        const twitterTitleElement = document.querySelector('meta[name="twitter:title"]');
        if (twitterTitleElement) {
          twitterTitleElement.setAttribute('content', `${postData.title} - USB Recognized Blog`);
        }
        
        // Update twitter:description
        const twitterDescriptionElement = document.querySelector('meta[name="twitter:description"]');
        if (twitterDescriptionElement) {
          twitterDescriptionElement.setAttribute('content', postData.description);
        }
        
        // Update canonical URL
        const canonicalElement = document.querySelector('link[rel="canonical"]');
        if (canonicalElement) {
          canonicalElement.setAttribute('href', `https://usbrecognized.com/blog/${postData.slug}`);
        }
      }, post);
      
      // Get the page title
      const title = await page.title();
      console.log(`  - Title: ${title ? '✓' : '✗'}`);
      
      // Get the meta description
      const description = await page.$('meta[name="description"]');
      console.log(`  - Description: ${description ? '✓' : '✗'}`);
      
      // Check for structured data
      const structuredData = await page.$('script[type="application/ld+json"]');
      console.log(`  - Structured Data: ${structuredData ? '✓' : '✗'}`);
      
      // Check for canonical URL
      const canonical = await page.$('link[rel="canonical"]');
      console.log(`  - Canonical URL: ${canonical ? '✓' : '✗'}`);
      
      // Get the HTML content
      const html = await page.content();
      
      // Save the pre-rendered HTML
      fs.writeFileSync(outputPath, html);
      console.log(`  ✓ /blog/${post.slug}`);
    } catch (error) {
      console.error(`预渲染失败: ${error.message}`);
    }
  }
}

// Main function to pre-render all pages
async function prerenderPages() {
  // Copy index.html to all routes first
  routes.forEach(route => {
    if (route !== '/') {
      const outputPath = path.join(__dirname, 'dist', `${route.substring(1)}.html`);
      fs.copyFileSync(path.join(__dirname, 'dist', 'index.html'), outputPath);
    }
  });
  
  // Launch browser
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Pre-render all static routes
  for (const route of routes) {
    try {
      await checkSEO(page, route);
    } catch (error) {
      console.error(`预渲染失败: ${error.message}`);
    }
  }
  
  // Pre-render all blog posts
  await prerenderBlogPosts(page);
  
  // Close browser
  await browser.close();
  console.log('预渲染完成!');
}

// Run the pre-rendering
prerenderPages().catch(error => {
  console.error('预渲染过程出错:', error);
  process.exit(1);
});