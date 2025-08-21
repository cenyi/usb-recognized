import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, ClockIcon, UserIcon, ArrowLeftIcon } from "lucide-react";
import { blogPosts } from '@/data/blogContent';
import SEO from '@/components/SEO';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const BlogPost = () => {
  const { slug } = useParams();
  
  // Find the blog post by slug
  const post = blogPosts.find(p => p.slug === slug);
  
  if (!post) {
    return (
      <>
        <SEO 
          title="Blog Post Not Found - USB Recognized"
          description="The requested blog post could not be found. Browse our other USB troubleshooting guides and technical articles."
          canonical={`https://usbrecognized.com/blog/${slug}`}
        />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Article Not Found</h1>
            <p className="text-gray-600 mb-8">Sorry, the blog post you're looking for doesn't exist.</p>
            <a 
              href="/blog" 
              className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Blog
            </a>
          </div>
        </div>
      </>
    );
  }
  
  return (
    <>
      <SEO 
        title={`${post.title} - USB Recognized Blog`}
        description={post.metaDescription || post.excerpt}
        canonical={`https://usbrecognized.com/blog/${post.slug}`}
        author={post.author}
        alternateLanguages={[
          { lang: 'en', url: `https://usb-recognized.com/en/blog/${post.slug}` },
          { lang: 'en-US', url: `https://usb-recognized.com/en-US/blog/${post.slug}` },
          { lang: 'en-GB', url: `https://usb-recognized.com/en-GB/blog/${post.slug}` }
        ]}
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Back button */}
          <div className="mb-6">
            <a 
              href="/blog" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Blog
            </a>
          </div>
          
          {/* Article header */}
          <Card className="mb-8">
            <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-lg overflow-hidden flex items-center justify-center">
              <div className="text-white text-center p-8">
                <div className="text-6xl mb-4">📱</div>
                <p className="text-lg opacity-90">{post.category}</p>
              </div>
            </div>
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <Badge variant="outline">{post.category}</Badge>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    {new Date(post.publishDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    {post.readTime}
                  </div>
                  <div className="flex items-center">
                    <UserIcon className="h-4 w-4 mr-1" />
                    {post.author}
                  </div>
                </div>
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900 mb-4">
                {post.title}
              </CardTitle>
              <p className="text-lg text-gray-600 mb-4">
                {post.excerpt}
              </p>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardHeader>
          </Card>
          
          {/* Article content */}
          <Card>
            <CardContent className="prose prose-lg max-w-none p-8 blog-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
            </CardContent>
          </Card>
          
          {/* Related posts */}
          {post.relatedPosts && post.relatedPosts.length > 0 && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Related Articles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {post.relatedPosts.map((relatedSlug) => {
                    const relatedPost = blogPosts.find(p => p.slug === relatedSlug);
                    if (!relatedPost) return null;
                    
                    return (
                      <a 
                        key={relatedSlug}
                        href={`/blog/${relatedSlug}`}
                        className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {relatedPost.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {relatedPost.excerpt}
                        </p>
                        <div className="flex items-center mt-2 text-xs text-gray-500">
                          <ClockIcon className="h-3 w-3 mr-1" />
                          {relatedPost.readTime}
                        </div>
                      </a>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Call to action */}
          <Card className="mt-8 bg-blue-50 border-blue-200">
            <CardContent className="text-center p-8">
              <h3 className="text-2xl font-bold mb-4">Need Immediate USB Help?</h3>
              <p className="text-gray-600 mb-6">
                Try our free USB recognition tool to diagnose your device issues instantly.
              </p>
              <a 
                href="/"
                className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Test USB Device Now
              </a>
            </CardContent>
          </Card>
          
        </div>
      </div>
    
      {/* Footer */}
      <footer className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex flex-wrap justify-center gap-4 mb-3">
          <a href="/privacy-policy" title="How we protect your USB device data and privacy with our USB recognition tool" className="text-gray-600 hover:text-gray-900 text-sm">Privacy Policy</a>
          <a href="/terms-of-service" title="USB recognition tool usage agreement and guidelines for USB device diagnostics" className="text-gray-600 hover:text-gray-900 text-sm">Terms of Service</a>
          <a href="/about-us" title="Learn more about our USB device recognition team and mission" className="text-gray-600 hover:text-gray-900 text-sm">About Us</a>
          <a href="/contact" title="Get in touch with our USB support team for device recognition help" className="text-gray-600 hover:text-gray-900 text-sm">Contact</a>
        </div>
        
        <div className="flex justify-center my-4">
          <a href="https://www.buymeacoffee.com/moca" target="_blank" rel="noopener noreferrer" title="Support our USB recognition tool development">
            <img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="41" width="174" className="rounded-md shadow-sm hover:shadow transition-shadow" />
          </a>
        </div>
        
        <p className="text-center text-gray-500 text-xs">
          &copy; {new Date().getFullYear()} USBRecognized.com - USB Device Recognition Tool - All rights reserved. USB device data is processed locally in your browser.
        </p>
      </footer>
    </>
  );
};

export default BlogPost;