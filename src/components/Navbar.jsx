import React, { useState, useEffect } from 'react';
import { 
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Toggle } from '@/components/ui/toggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sun, Palette, Menu, X, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { navItems } from '../nav-items.jsx';

const Navbar = () => {
  // Available themes: light, sepia
  const [theme, setTheme] = useState('light');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Apply saved theme when component mounts
  useEffect(() => {
    // Check if there's a saved theme in local storage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      // If saved theme is dark, set to light instead
      if (savedTheme === 'dark') {
        setTheme('light');
        applyTheme('light');
      } else {
        setTheme(savedTheme);
        applyTheme(savedTheme);
      }
    }
  }, []);

  // Function to apply theme
  const applyTheme = (selectedTheme) => {
    // Remove all theme classes
    document.documentElement.classList.remove('light', 'dark', 'sepia');
    // Add selected theme class
    document.documentElement.classList.add(selectedTheme);
    // Save theme to local storage
    localStorage.setItem('theme', selectedTheme);
  };

  // Function to toggle theme
  const toggleTheme = () => {
    let newTheme;
    if (theme === 'light') {
      newTheme = 'sepia';
    } else {
      newTheme = 'light';
    }
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/blog?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  // Filter navigation items for main navigation
  const mainNavItems = navItems.filter(item => 
    ['Home', 'Troubleshooting', 'Blog'].includes(item.title)
  );
  
  // Filter navigation items for mobile menu
  const mobileNavItems = navItems;

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${theme === 'light' ? 'bg-white/90 backdrop-blur-sm shadow-sm' : 'bg-amber-50/90 backdrop-blur-sm shadow-amber-100'} border-b border-gray-200`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} className="text-blue-600" /> : <Menu size={24} className="text-blue-600" />}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <NavigationMenu>
              <NavigationMenuList className="flex items-center space-x-1">
                {mainNavItems.map((item) => (
                  <NavigationMenuItem key={item.to}>
                    <NavigationMenuLink 
                      href={item.to} 
                      className={cn(navigationMenuTriggerStyle(), "px-4 py-2 rounded-lg transition-all duration-300 font-medium", 
                        "hover:bg-blue-50 hover:text-blue-700",
                        "data-[active=true]:bg-blue-100 data-[active=true]:text-blue-800")}
                      title={item.tooltip || item.title}
                    >
                      {item.title}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>

            {/* Desktop Search */}
            <div className="relative hidden lg:block">
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="text"
                  placeholder="Search blog posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Button type="submit" className="hidden">Search</Button>
              </form>
            </div>
          </div>

          {/* Theme toggle and mobile search */}
          <div className="flex items-center space-x-2">
            {/* Mobile Search Icon */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden text-gray-700 hover:bg-blue-100 rounded-full p-2"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search size={20} />
            </Button>
            
            {/* Theme toggle */}
            <Toggle
              onClick={toggleTheme}
              aria-label={
                theme === 'light' ? 'Switch to sepia mode' : 'Switch to light mode'
              }
              className="bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full p-2 transition-all duration-300"
            >
              {theme === 'light' ? <Palette size={18} /> : <Sun size={18} />}
            </Toggle>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="md:hidden mt-4 pb-4">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Search blog posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Button type="submit" className="hidden">Search</Button>
            </form>
          </div>
        )}

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <nav className="flex flex-col space-y-2 bg-white/80 backdrop-blur-sm rounded-lg p-2 shadow-lg">
              {mobileNavItems.map((item) => (
                <a
                  key={item.to}
                  href={item.to}
                  className="px-4 py-3 rounded-md hover:bg-blue-50 text-gray-800 font-medium transition-colors duration-200 flex items-center"
                  title={item.tooltip || item.title}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon}
                  <span className="ml-2">{item.title}</span>
                </a>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;