import { useMember } from '@/integrations';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Home, 
  User, 
  Trophy, 
  BookOpen, 
  Users, 
  Settings,
  LogOut,
  Zap,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function Layout() {
  const { member, isAuthenticated, isLoading, actions } = useMember();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, authRequired: true },
    { name: 'Learn', href: '/learn', icon: BookOpen, authRequired: true },
    { name: 'Battle Arena', href: '/battle', icon: Trophy, authRequired: true },
    { name: 'Guilds', href: '/guilds', icon: Users, authRequired: true },
    { name: 'Profile', href: '/profile', icon: User, authRequired: true },
  ];

  const isActivePath = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/') return true;
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-primary/20">
        <div className="max-w-[120rem] mx-auto px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-2xl font-heading font-black text-primary">VEDNIX</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navigation.map((item) => {
                if (item.authRequired && !isAuthenticated) return null;
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded font-paragraph transition-colors ${
                      isActivePath(item.href)
                        ? 'text-primary bg-primary/10'
                        : 'text-light-gray hover:text-primary hover:bg-primary/5'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              {isLoading && <LoadingSpinner />}
              
              {!isAuthenticated && !isLoading && (
                <Button 
                  onClick={actions.login}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Sign In
                </Button>
              )}

              {isAuthenticated && (
                <div className="hidden md:flex items-center gap-4">
                  <Link to="/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <Avatar className="h-8 w-8 border-2 border-primary/50">
                      <AvatarImage src={member?.profile?.photo?.url} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {member?.profile?.nickname?.[0] || member?.contact?.firstName?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-paragraph text-foreground">
                      {member?.profile?.nickname || member?.contact?.firstName || 'User'}
                    </span>
                  </Link>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={actions.logout}
                    className="border-primary/50 text-primary hover:bg-primary/10"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="outline"
                size="sm"
                className="md:hidden border-primary text-primary"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-primary/20 bg-background"
            >
              <div className="px-8 py-4 space-y-2">
                {navigation.map((item) => {
                  if (item.authRequired && !isAuthenticated) return null;
                  
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-3 rounded font-paragraph transition-colors ${
                        isActivePath(item.href)
                          ? 'text-primary bg-primary/10'
                          : 'text-light-gray hover:text-primary hover:bg-primary/5'
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  );
                })}
                
                {isAuthenticated && (
                  <>
                    <div className="border-t border-primary/20 my-2"></div>
                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-3 rounded font-paragraph text-light-gray hover:text-primary hover:bg-primary/5"
                    >
                      <Avatar className="h-5 w-5 border border-primary/50">
                        <AvatarImage src={member?.profile?.photo?.url} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {member?.profile?.nickname?.[0] || member?.contact?.firstName?.[0] || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        actions.logout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 px-3 py-3 rounded font-paragraph text-light-gray hover:text-primary hover:bg-primary/5 w-full text-left"
                    >
                      <LogOut className="h-5 w-5" />
                      Sign Out
                    </button>
                  </>
                )}
                
                {!isAuthenticated && (
                  <Button 
                    onClick={() => {
                      actions.login();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-4"
                  >
                    Sign In
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-dark-gray border-t border-primary/20 mt-20">
        <div className="max-w-[120rem] mx-auto px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                  <Zap className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-heading font-black text-primary">VEDNIX</span>
              </div>
              <p className="font-paragraph text-light-gray">
                The ultimate cyberpunk learning academy where education meets anime adventure.
              </p>
            </div>
            
            <div>
              <h3 className="font-heading font-bold text-foreground mb-4">Learn</h3>
              <ul className="space-y-2 font-paragraph text-light-gray">
                <li><Link to="/learn" className="hover:text-primary transition-colors">Courses</Link></li>
                <li><Link to="/battle" className="hover:text-primary transition-colors">Boss Battles</Link></li>
                <li><Link to="/quests" className="hover:text-primary transition-colors">Quests</Link></li>
                <li><Link to="/achievements" className="hover:text-primary transition-colors">Achievements</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-heading font-bold text-foreground mb-4">Community</h3>
              <ul className="space-y-2 font-paragraph text-light-gray">
                <li><Link to="/guilds" className="hover:text-primary transition-colors">Guilds</Link></li>
                <li><Link to="/leaderboard" className="hover:text-primary transition-colors">Leaderboard</Link></li>
                <li><Link to="/events" className="hover:text-primary transition-colors">Events</Link></li>
                <li><Link to="/forums" className="hover:text-primary transition-colors">Forums</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-heading font-bold text-foreground mb-4">Support</h3>
              <ul className="space-y-2 font-paragraph text-light-gray">
                <li><Link to="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
                <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy</Link></li>
                <li><Link to="/terms" className="hover:text-primary transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-primary/20 mt-8 pt-8 text-center">
            <p className="font-paragraph text-light-gray">
              © 2024 VEDNIX. All rights reserved. Level up your learning.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}