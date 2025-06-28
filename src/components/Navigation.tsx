
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, User, Briefcase, Award, Camera, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'الرئيسية', icon: Home },
    { path: '/biography', label: 'السيرة الذاتية', icon: User },
    { path: '/political-career', label: 'المسيرة السياسية', icon: Briefcase },
    { path: '/achievements', label: 'الإنجازات', icon: Award },
    { path: '/media', label: 'وسائل الإعلام', icon: Camera },
    { path: '/contact', label: 'اتصل بي', icon: Phone },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2 space-x-reverse">
              <div className="w-10 h-10 bg-gradient-to-r from-iraqi-red to-iraqi-green rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">ع</span>
              </div>
              <span className="text-xl font-bold text-gray-900">د. أحمد العلواني</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="mr-10 flex items-baseline space-x-4 space-x-reverse">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-2 space-x-reverse ${
                      isActive(item.path)
                        ? 'bg-primary text-primary-foreground'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 flex items-center space-x-2 space-x-reverse ${
                    isActive(item.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
