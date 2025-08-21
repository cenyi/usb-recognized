import { useEffect } from 'react';

const SEO = ({
    title,
    description,
    canonical,
    ogImage = '/favicon.png',
    structuredData,
    noindex = false,
    alternateLanguages = [],
    author,
    publishedTime,
    modifiedTime
}) => {
    useEffect(() => {
        // Set page title
        if (title) {
            document.title = title;
        }

        // Set or update meta description
        let metaDescription = document.querySelector('meta[name="description"]');
        if (description) {
            if (!metaDescription) {
                metaDescription = document.createElement('meta');
                metaDescription.name = 'description';
                document.head.appendChild(metaDescription);
            }
            metaDescription.content = description;
        }

        // Set author
        let metaAuthor = document.querySelector('meta[name="author"]');
        if (author) {
            if (!metaAuthor) {
                metaAuthor = document.createElement('meta');
                metaAuthor.name = 'author';
                document.head.appendChild(metaAuthor);
            }
            metaAuthor.content = author;
        }

        // Set robots meta
        let metaRobots = document.querySelector('meta[name="robots"]');
        if (!metaRobots) {
            metaRobots = document.createElement('meta');
            metaRobots.name = 'robots';
            document.head.appendChild(metaRobots);
        }
        metaRobots.content = noindex ? 'noindex, nofollow' : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1';

        // Set canonical URL
        let canonicalLink = document.querySelector('link[rel="canonical"]');
        if (canonical) {
            if (!canonicalLink) {
                canonicalLink = document.createElement('link');
                canonicalLink.rel = 'canonical';
                document.head.appendChild(canonicalLink);
            }
            canonicalLink.href = canonical;
        }

        // Set alternate language links
        alternateLanguages.forEach(({ lang, url }) => {
            let hrefLangLink = document.querySelector(`link[hreflang="${lang}"]`);
            if (!hrefLangLink) {
                hrefLangLink = document.createElement('link');
                hrefLangLink.rel = 'alternate';
                hrefLangLink.hreflang = lang;
                document.head.appendChild(hrefLangLink);
            }
            hrefLangLink.href = url;
        });

        // Update Open Graph tags
        const updateOGTag = (property, content) => {
            let ogTag = document.querySelector(`meta[property="${property}"]`);
            if (!ogTag) {
                ogTag = document.createElement('meta');
                ogTag.property = property;
                document.head.appendChild(ogTag);
            }
            ogTag.content = content;
        };

        if (title) updateOGTag('og:title', title);
        if (description) updateOGTag('og:description', description);
        if (canonical) updateOGTag('og:url', canonical);
        updateOGTag('og:type', 'website');
        updateOGTag('og:image', `https://usbrecognized.com${ogImage}`);
        updateOGTag('og:image:width', '1200');
        updateOGTag('og:image:height', '630');
        updateOGTag('og:site_name', 'USB Recognized');
        updateOGTag('og:locale', 'en_US');

        if (publishedTime) updateOGTag('article:published_time', publishedTime);
        if (modifiedTime) updateOGTag('article:modified_time', modifiedTime);
        if (author) updateOGTag('article:author', author);

        // Update Twitter Card tags
        const updateTwitterTag = (name, content) => {
            let twitterTag = document.querySelector(`meta[name="${name}"]`);
            if (!twitterTag) {
                twitterTag = document.createElement('meta');
                twitterTag.name = name;
                document.head.appendChild(twitterTag);
            }
            twitterTag.content = content;
        };

        updateTwitterTag('twitter:card', 'summary_large_image');
        if (title) updateTwitterTag('twitter:title', title);
        if (description) updateTwitterTag('twitter:description', description);
        updateTwitterTag('twitter:image', `https://usbrecognized.com${ogImage}`);
        updateTwitterTag('twitter:site', '@USBRecognized');
        updateTwitterTag('twitter:creator', '@USBRecognized');

        // Add structured data
        if (structuredData) {
            // Remove existing structured data
            const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
            existingScripts.forEach(script => script.remove());

            // Add new structured data (supports arrays)
            const dataArray = Array.isArray(structuredData) ? structuredData : [structuredData];
            dataArray.forEach((data, index) => {
                const script = document.createElement('script');
                script.type = 'application/ld+json';
                script.textContent = JSON.stringify(data);
                script.id = `structured-data-${index}`;
                document.head.appendChild(script);
            });
        }

        // Add other important meta tags
        const setMetaTag = (name, content) => {
            let metaTag = document.querySelector(`meta[name="${name}"]`);
            if (!metaTag) {
                metaTag = document.createElement('meta');
                metaTag.name = name;
                document.head.appendChild(metaTag);
            }
            metaTag.content = content;
        };

        setMetaTag('theme-color', '#3b82f6');
        setMetaTag('msapplication-TileColor', '#3b82f6');
        setMetaTag('apple-mobile-web-app-capable', 'yes');
        setMetaTag('apple-mobile-web-app-status-bar-style', 'default');

        // Trigger pre-rendering event
        if (typeof window !== 'undefined') {
            setTimeout(() => {
                document.dispatchEvent(new Event('render-event'));
            }, 100);
        }

    }, [title, description, canonical, ogImage, structuredData, noindex, alternateLanguages, author, publishedTime, modifiedTime]);

    return null;
};

export default SEO;