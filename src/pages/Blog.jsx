import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarIcon, ClockIcon, UserIcon, SearchIcon, TrendingUpIcon, StarIcon, EyeIcon } from "lucide-react";
import SEO from '@/components/SEO';
import { blogPosts, blogCategories } from '@/data/blogContent';
import { useLocation } from 'react-router-dom';

const Blog = () => {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const initialSearchQuery = urlParams.get('search') || '';
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [sortBy, setSortBy] = useState('date'); // date, popularity, featured

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    let filtered = blogPosts;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => 
        post.category.toLowerCase().replace(/\s+/g, '-') === selectedCategory
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query)) ||
        post.seoKeywords.some(keyword => keyword.toLowerCase().includes(query))
      );
    }

    // Sort posts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popularity':
          return (b.views + b.likes) - (a.views + a.likes);
        case 'featured':
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return new Date(b.publishDate) - new Date(a.publishDate);
        default: // date
          return new Date(b.publishDate) - new Date(a.publishDate);
      }
    });

    return filtered;
  }, [selectedCategory, searchQuery, sortBy]);

  // Get featured posts
  const featuredPosts = blogPosts.filter(post => post.featured).slice(0, 2);

  // Get category color
  const getCategoryColor = (categoryName) => {
    const category = blogCategories.find(cat => 
      cat.name.toLowerCase() === categoryName.toLowerCase()
    );
    return category?.color || 'blue';
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <SEO 
        title="USB Troubleshooting Blog - Expert Guides & Technical Insights"
        description="Professional USB troubleshooting guides, technical deep-dives, and expert insights. Learn from real case studies and industry best practices."
        canonical="https://usbrecognized.com/blog"
        author="USB Recognized Team"
        alternateLanguages={[
          { lang: 'en', url: 'https://usb-recognized.com/en/blog' },
          { lang: 'en-US', url: 'https://usb-recognized.com/en-US/blog' },
          { lang: 'en-GB', url: 'https://usb-recognized.com/en-GB/blog' }
        ]}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              USB Expert Insights & Guides
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Deep technical analysis, real-world case studies, and professional insights 
              to help you master USB troubleshooting and optimization.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg"
              />
            </div>
          </div>

          {/* Featured Posts */}
          {featuredPosts.length > 0 && !searchQuery && selectedCategory === 'all' && (
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <StarIcon className="text-yellow-500" size={24} />
                <h2 className="text-2xl font-bold text-gray-900">Featured Articles</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {featuredPosts.map((post) => (
                  <Card key={post.id} className="hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-yellow-200" 
                        onClick={() => window.location.href = `/blog/${post.slug}`}>
                    <div className="aspect-video bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg flex items-center justify-center">
                      <div className="text-white text-center p-6">
                        <StarIcon className="mx-auto mb-2" size={32} />
                        <p className="text-sm opacity-90">Featured Article</p>
                      </div>
                    </div>
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={`bg-${getCategoryColor(post.category)}-100 text-${getCategoryColor(post.category)}-800`}>
                          {post.category}
                        </Badge>
                        <Badge variant="outline" className="text-yellow-600 border-yellow-300">
                          <StarIcon size={12} className="mr-1" />
                          Featured
                        </Badge>
                      </div>
                      <CardTitle className="text-xl hover:text-blue-600 transition-colors">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="text-base">
                        {post.excerpt}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center">
                            <UserIcon className="h-4 w-4 mr-1" />
                            {post.author}
                          </div>
                          <div className="flex items-center">
                            <ClockIcon className="h-4 w-4 mr-1" />
                            {post.readTime}
                          </div>
                        </div>
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          {formatDate(post.publishDate)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Filters and Sorting */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
              >
                All Articles
              </Button>
              {blogCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={selectedCategory === category.id ? 
                    `bg-${category.color}-600 hover:bg-${category.color}-700` : ''}
                >
                  {category.name}
                </Button>
              ))}
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
              >
                <option value="date">Latest</option>
                <option value="featured">Featured First</option>
                <option value="popularity">Most Popular</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''} found
              {searchQuery && ` for "${searchQuery}"`}
              {selectedCategory !== 'all' && ` in ${blogCategories.find(cat => cat.id === selectedCategory)?.name}`}
            </p>
          </div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-all duration-300 cursor-pointer group" 
                    onClick={() => window.location.href = `/blog/${post.slug}`}>
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    <div className="text-center p-4">
                      <TrendingUpIcon size={32} className="mx-auto mb-2 opacity-80" />
                      <p className="text-sm opacity-90">{post.category}</p>
                    </div>
                  </div>
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={`bg-${getCategoryColor(post.category)}-100 text-${getCategoryColor(post.category)}-800`}>
                      {post.category}
                    </Badge>
                    <Badge variant="outline" className={`text-${post.difficulty === 'beginner' ? 'green' : post.difficulty === 'intermediate' ? 'yellow' : 'red'}-600`}>
                      {post.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg group-hover:text-blue-600 transition-colors line-clamp-2">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="text-sm line-clamp-3">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <div className="flex items-center">
                      <UserIcon className="h-4 w-4 mr-1" />
                      <span className="truncate">{post.author}</span>
                    </div>
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {post.readTime}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <div className="flex items-center">
                      <CalendarIcon className="h-3 w-3 mr-1" />
                      {formatDate(post.publishDate)}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        <EyeIcon className="h-3 w-3 mr-1" />
                        {post.views}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {post.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {post.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{post.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No Results */}
          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <SearchIcon size={48} className="mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No articles found</h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your search terms or browse different categories.
              </p>
              <Button onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}>
                Clear Filters
              </Button>
            </div>
          )}

          {/* Call to Action */}
          <div className="text-center mt-16 p-8 bg-white rounded-xl shadow-sm border">
            <h3 className="text-2xl font-bold mb-4">Need Immediate USB Help?</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              While our blog provides in-depth insights, sometimes you need quick solutions. 
              Try our diagnostic tool for immediate troubleshooting assistance.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" onClick={() => window.location.href = '/usb-not-recognized'}>
                Quick USB Diagnostic
              </Button>
              <Button variant="outline" size="lg" onClick={() => window.location.href = '/contact'}>
                Contact Expert Support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Blog;