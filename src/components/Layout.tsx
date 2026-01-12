import { useMember } from '@/integrations';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BackgroundMusic } from '@/components/ui/background-music';
import { AnimeMentor } from '@/components/ui/anime-mentor';
import { AnimePet } from '@/components/ui/anime-pet';
import { AnimeBackground } from '@/components/ui/anime-background';
import { FloatingPetCompanion } from '@/components/ui/floating-pet-companion';
import { PetNotificationSystem } from '@/components/ui/pet-notification-system';
import { DraggableNotificationButton } from '@/components/ui/draggable-notification-button';
import { LanguageSelector } from '@/components/ui/language-selector';
import { usePetStore } from '@/stores/petStore';
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
  X,
  MessageCircle,
  Heart,
  Film
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function Layout() {
  const { member, isAuthenticated, isLoading, actions } = useMember();
  const { loadFromLocalStorage } = usePetStore();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mentorOpen, setMentorOpen] = useState(false);
  const [petOpen, setPetOpen] = useState(false);
  const [userCharacter, setUserCharacter] = useState<any>(null); // Store user's character

  // Load user character from localStorage on component mount
  useEffect(() => {
    const savedCharacter = localStorage.getItem('userCharacter');
    if (savedCharacter) {
      try {
        setUserCharacter(JSON.parse(savedCharacter));
      } catch (error) {
        console.error('Error loading user character:', error);
      }
    }
    
    // Load pet from localStorage
    loadFromLocalStorage();
  }, [loadFromLocalStorage]);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, authRequired: true },
    { name: 'Learn', href: '/learn', icon: BookOpen, authRequired: true },
    { name: 'Anime Reels', href: '/reels', icon: Film, authRequired: true },
    { name: 'Battle Arena', href: '/battle', icon: Trophy, authRequired: true },
    { name: 'Guilds', href: '/guilds', icon: Users, authRequired: true },
    { name: 'Profile', href: '/profile', icon: User, authRequired: true },
  ];

  const isActivePath = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/') return true;
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Anime Background */}
      <AnimeBackground />
      
      {/* Content wrapper with relative positioning */}
      <div className="relative z-10">
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
              <LanguageSelector />
              
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
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setMentorOpen(true)}
                    className="text-light-gray hover:text-primary"
                    title="AI Mentor"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPetOpen(true)}
                    className="text-light-gray hover:text-secondary"
                    title="Your Pet"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                  
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
                    <button
                      onClick={() => {
                        setMentorOpen(true);
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 px-3 py-3 rounded font-paragraph text-light-gray hover:text-primary hover:bg-primary/5 w-full text-left"
                    >
                      <MessageCircle className="h-5 w-5" />
                      AI Mentor
                    </button>
                    <button
                      onClick={() => {
                        setPetOpen(true);
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 px-3 py-3 rounded font-paragraph text-light-gray hover:text-secondary hover:bg-secondary/5 w-full text-left"
                    >
                      <Heart className="h-5 w-5" />
                      Your Pet
                    </button>
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

      {/* Background Music Player */}
      <BackgroundMusic />

      {/* AI Mentor Modal */}
      <AnimeMentor 
        isOpen={mentorOpen} 
        onClose={() => setMentorOpen(false)}
        userCharacter={userCharacter}
      />

      {/* Pet Modal */}
      <AnimePet isOpen={petOpen} onClose={() => setPetOpen(false)} />

      {/* Draggable Notification Button */}
      {isAuthenticated && (
        <DraggableNotificationButton onNotificationOpen={() => {}} />
      )}

      {/* Floating Pet Companion Window */}
      {isAuthenticated && (
        <FloatingPetCompanion />
      )}

      {/* Pet Notification System - manages health reminders and motivational messages */}
      {isAuthenticated && <PetNotificationSystem />}
      </div>
    </div>
  );
}