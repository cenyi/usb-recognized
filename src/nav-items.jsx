import { HomeIcon, WrenchIcon, ShieldIcon, FileTextIcon, UsersIcon, MailIcon, BookOpenIcon } from "lucide-react";
import Index from "./pages/Index.jsx";
import Troubleshooting from "./pages/Troubleshooting.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import TermsOfService from "./pages/TermsOfService.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import Contact from "./pages/Contact.jsx";
import Blog from "./pages/Blog.jsx";
import BlogPost from "./pages/BlogPost.jsx";

export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Troubleshooting",
    to: "/usb-not-recognized",
    icon: <WrenchIcon className="h-4 w-4" />,
    page: <Troubleshooting />,
    tooltip: "Fix USB device recognition issues",
  },
  {
    title: "Blog",
    to: "/blog",
    icon: <BookOpenIcon className="h-4 w-4" />,
    page: <Blog />,
    tooltip: "USB troubleshooting guides and tips",
  },
  {
    title: "Privacy Policy",
    to: "/privacy-policy",
    icon: <ShieldIcon className="h-4 w-4" />,
    page: <PrivacyPolicy />,
    tooltip: "How we protect your data and privacy",
  },
  {
    title: "Terms of Service",
    to: "/terms-of-service",
    icon: <FileTextIcon className="h-4 w-4" />,
    page: <TermsOfService />,
    tooltip: "Usage agreement and guidelines",
  },
  {
    title: "About Us",
    to: "/about-us",
    icon: <UsersIcon className="h-4 w-4" />,
    page: <AboutUs />,
    tooltip: "Learn more about our team and mission",
  },
  {
    title: "Contact",
    to: "/contact",
    icon: <MailIcon className="h-4 w-4" />,
    page: <Contact />,
    tooltip: "Get in touch with our support team",
  },
];
