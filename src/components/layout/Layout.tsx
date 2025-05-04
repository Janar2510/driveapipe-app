import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Spline from '@splinetool/react-spline';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutGrid, 
  Users, 
  Building2, 
  Calendar, 
  Mail, 
  GitBranch, 
  Inbox,
  ShoppingCart,
  Settings,
  MenuIcon,
  XIcon,
  ChevronLeft,
  ChevronRight,
  Zap
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { currentUser } = useCRM();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const navigation = [
    { name: 'Dashboard', to: '/', icon: LayoutGrid },
    { name: 'Deals', to: '/deals', icon: GitBranch },
    { name: 'Contacts', to: '/contacts', icon: Users },
    { name: 'Organizations', to: '/organizations', icon: Building2 },
    { name: 'Activities', to: '/activities', icon: Calendar },
    { name: 'Calendar', to: '/calendar', icon: Calendar },
    { name: 'Emails', to: '/emails', icon: Mail },
    { name: 'Leads', to: '/leads', icon: Inbox },
    { name: 'Products', to: '/products', icon: ShoppingCart },
    { name: 'Settings', to: '/settings', icon: Settings },
  ];

  const Logo = () => (
    <div className="flex items-center space-x-2">
      <div className="flex-shrink-0 w-8 h-8 bg-primary-900/50 rounded-lg flex items-center justify-center ring-2 ring-primary-500/30">
        <Zap className="w-5 h-5 text-primary-400" />
      </div>
      {!sidebarCollapsed && (
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="text-xl font-bold text-white"
        >
          Driveapipe
        </motion.h1>
      )}
    </div>
  );

  return (
    <div className="flex min-h-screen bg-transparent">
      {/* Spline background */}
      <div className="fixed inset-0 z-0">
        <Spline scene="https://prod.spline.design/n0GFhlzrcT-MOycs/scene.splinecode" />
      </div>

      {/* Mobile menu button */}
      <button
        type="button"
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-900/30 backdrop-blur-md text-white hover:bg-gray-800/40"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <MenuIcon className="h-6 w-6" />
      </button>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ x: -240 }}
            animate={{ x: 0 }}
            exit={{ x: -240 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
            
            <div className="relative flex flex-col w-60 h-full bg-gray-900/60 backdrop-blur-md border-r border-white/10">
              <div className="absolute top-0 right-0 -mr-12 pt-4">
                <button
                  type="button"
                  className="p-2 rounded-md text-white"
                  onClick={() => setSidebarOpen(false)}
                >
                  <XIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="flex-1 flex flex-col pt-5 pb-4">
                <div className="flex-shrink-0 flex items-center px-4">
                  <Logo />
                </div>
                <nav className="mt-8 flex-1 px-2 space-y-1">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.to}
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                        location.pathname === item.to
                          ? 'bg-primary-900/50 text-white ring-1 ring-primary-500/50'
                          : 'text-gray-100 hover:bg-gray-800/30 hover:text-white'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon
                        className={`mr-3 h-5 w-5 ${
                          location.pathname === item.to
                            ? 'text-primary-400'
                            : 'text-gray-400 group-hover:text-white'
                        }`}
                      />
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>
              
              {currentUser && (
                <div className="flex-shrink-0 flex border-t border-white/10 p-4">
                  <div className="flex items-center">
                    <div>
                      {currentUser.avatar ? (
                        <img
                          className="inline-block h-8 w-8 rounded-full ring-2 ring-primary-500/30"
                          src={currentUser.avatar}
                          alt={currentUser.name}
                        />
                      ) : (
                        <div className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary-900/50 text-primary-100 font-medium text-lg ring-2 ring-primary-500/30">
                          {currentUser.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-white">{currentUser.name}</p>
                      <p className="text-xs text-gray-300 capitalize">{currentUser.role}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <motion.div 
        className="hidden md:flex md:flex-shrink-0"
        animate={{ width: sidebarCollapsed ? 64 : 200 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex flex-col w-full">
          <div className="flex flex-col h-full bg-gray-900/60 backdrop-blur-md border-r border-white/10">
            <div className="flex-1 flex flex-col pt-5 pb-4">
              <div className="flex-shrink-0 flex items-center px-4 justify-between">
                <Logo />
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="p-1 rounded-md text-gray-400 hover:text-white focus:outline-none"
                >
                  {sidebarCollapsed ? (
                    <ChevronRight className="h-5 w-5" />
                  ) : (
                    <ChevronLeft className="h-5 w-5" />
                  )}
                </button>
              </div>
              <nav className="mt-8 flex-1 px-2 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.to}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      location.pathname === item.to
                        ? 'bg-primary-900/50 text-white ring-1 ring-primary-500/50'
                        : 'text-gray-100 hover:bg-gray-800/30 hover:text-white'
                    }`}
                  >
                    <item.icon
                      className={`${sidebarCollapsed ? 'mx-auto' : 'mr-3'} h-5 w-5 ${
                        location.pathname === item.to
                          ? 'text-primary-400'
                          : 'text-gray-400 group-hover:text-white'
                      }`}
                    />
                    {!sidebarCollapsed && item.name}
                  </Link>
                ))}
              </nav>
            </div>
            
            {currentUser && !sidebarCollapsed && (
              <div className="flex-shrink-0 flex border-t border-white/10 p-4">
                <div className="flex items-center">
                  <div>
                    {currentUser.avatar ? (
                      <img
                        className="inline-block h-8 w-8 rounded-full ring-2 ring-primary-500/30"
                        src={currentUser.avatar}
                        alt={currentUser.name}
                      />
                    ) : (
                      <div className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary-900/50 text-primary-100 font-medium text-lg ring-2 ring-primary-500/30">
                        {currentUser.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white">{currentUser.name}</p>
                    <p className="text-xs text-gray-300 capitalize">{currentUser.role}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Main content */}
      <motion.div 
        className="flex-1 flex flex-col overflow-hidden"
        animate={{ 
          marginLeft: sidebarCollapsed ? "0px" : "0px",
          width: "100%"
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-2">
            <div className="max-w-[95rem] mx-auto px-2 sm:px-4 lg:px-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 bg-gray-900/40 backdrop-blur-md rounded-lg p-4 sm:p-6 shadow-xl border border-white/10"
              >
                {children}
              </motion.div>
            </div>
          </div>
        </main>
      </motion.div>
    </div>
  );
};

export default Layout;