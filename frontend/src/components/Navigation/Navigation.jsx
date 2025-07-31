import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Brain, BookOpen, Search } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    {
      path: '/',
      name: 'Lesson Analyser',
      icon: Search,
      description: 'Analyze existing lesson plans'
    },
    {
      path: '/creator',
      name: 'Lesson Creator',
      icon: BookOpen,
      description: 'Create new lesson plans'
    }
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Brain className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-800">Teaching Cycle AI</span>
          </div>

          {/* Navigation Items */}
          <div className="flex space-x-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-blue-100 text-blue-700 font-medium' 
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }
                  `}
                  title={item.description}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;