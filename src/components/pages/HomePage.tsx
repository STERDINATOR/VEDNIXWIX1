// HPI 1.4-G
import React, { useState, useEffect, useRef } from 'react';
import { useMember } from '@/integrations';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import { AnimePet } from '@/components/ui/anime-pet';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
{/* ... keep existing code (imports) ... */}

// A simple hook for Intersection Observer to add animations on scroll
const useIntersectionObserver = (options: IntersectionObserverInit) => {
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const [node, setNode] = useState<HTMLElement | null>(null);

  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setEntry(entry);
        if (node && observer.current) {
          observer.current.unobserve(node);
        }
      }
    }, options);

    const { current: currentObserver } = observer;
    if (node) currentObserver.observe(node);

    return () => currentObserver.disconnect();
  }, [node, options]);

  return [setNode, entry?.isIntersecting] as const;
};

const AnimatedElement = ({ children, className, threshold = 0.1 }: { children: React.ReactNode, className?: string, threshold?: number }) => {
  const [ref, isVisible] = useIntersectionObserver({ threshold });
  return (
    <div
      ref={ref}
      className={`${className || ''} transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-8 blur-sm'}`}
    >
      {children}
    </div>
  );
};

const features = [
  {
    id: "01",
    icon: <span className="text-4xl">🎮</span>,
    title: "3D Anime Avatars",
    description: "Forge your digital identity. Customize your cyberpunk character and pet companions that evolve with your progress, becoming a legend in the VEDNIX universe."
  },
  {
    id: "02",
    icon: <span className="text-4xl">🏆</span>,
    title: "Gamified Learning",
    description: "Education is the new high score. Earn XP, maintain streaks, unlock achievements, and face down quiz-based boss battles that make learning addictive."
  },
  {
    id: "03",
    icon: <span className="text-4xl">👥</span>,
    title: "Multiplayer Quests",
    description: "Syndicate with allies. Team up with friends for cooperative group challenges and engage in epic, immersive multiplayer boss battles for ultimate glory."
  },
  {
    id: "04",
    icon: <span className="text-4xl">🌟</span>,
    title: "AI Anime Tutor",
    description: "Your personal AI sensei is always on duty. It adapts to your unique learning style, tracks your mood, and provides support when you need it most."
  },
  {
    id: "05",
    icon: <span className="text-4xl">⚡</span>,
    title: "RPG Skill Trees",
    description: "Knowledge is power. Unlock new abilities on a visualized skill tree, watching your expertise grow from a novice operative to a master of your craft."
  },
  {
    id: "06",
    icon: <span className="text-4xl">▶️</span>,
    title: "Interactive Stories",
    description: "Your choices define your reality. Immerse yourself in branching anime storylines that adapt to your decisions, creating a unique narrative experience."
  }
];

const avatars = [
    {
        name: "Kaira, The Ghost Runner",
        imageSrc: "https://static.wixstatic.com/media/c5b305_2b388092ea9449b5b7d8c824de9478eb~mv2.png?originWidth=1600&originHeight=896"
    },
    {
        name: "Jax, The Code Ronin",
        imageSrc: "https://static.wixstatic.com/media/c5b305_33595e345346413ea180cd88272002e3~mv2.png?originWidth=1600&originHeight=896"
    },
    {
        name: "Echo, The Data Weaver",
        imageSrc: "https://static.wixstatic.com/media/c5b305_0575faa63c7244588655b0b8c6ba086a~mv2.png?originWidth=1600&originHeight=896"
    }
];

export default function HomePage() {
  const { member, isAuthenticated, actions } = useMember();
  const [currentAvatar, setCurrentAvatar] = useState(0);
  const [showPetModal, setShowPetModal] = useState(false);

  const nextAvatar = () => {
    setCurrentAvatar((prev) => (prev === avatars.length - 1 ? 0 : prev + 1));
  };

  const prevAvatar = () => {
    setCurrentAvatar((prev) => (prev === 0 ? avatars.length - 1 : prev - 1));
  };

  return (
    <div className="w-full bg-background text-foreground font-paragraph overflow-clip">
      <style>{`
        .glitch-text::before,
        .glitch-text::after {
          content: 'VEDNIX';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: black;
          overflow: hidden;
        }
        .glitch-text::before {
          left: 2px;
          text-shadow: -2px 0 #FF00FF;
          animation: glitch-anim-1 2.5s infinite linear alternate-reverse;
        }
        .glitch-text::after {
          left: -2px;
          text-shadow: -2px 0 #00FFFF, 2px 2px #FF00FF;
          animation: glitch-anim-2 2s infinite linear alternate-reverse;
        }
        @keyframes glitch-anim-1 {
          0% { clip-path: polygon(0 2%, 100% 2%, 100% 5%, 0 5%); }
          10% { clip-path: polygon(0 15%, 100% 15%, 100% 15%, 0 15%); }
          20% { clip-path: polygon(0 10%, 100% 10%, 100% 20%, 0 20%); }
          30% { clip-path: polygon(0 1%, 100% 1%, 100% 2%, 0 2%); }
          40% { clip-path: polygon(0 33%, 100% 33%, 100% 33%, 0 33%); }
          50% { clip-path: polygon(0 44%, 100% 44%, 100% 44%, 0 44%); }
          60% { clip-path: polygon(0 50%, 100% 50%, 100% 20%, 0 20%); }
          70% { clip-path: polygon(0 70%, 100% 70%, 100% 70%, 0 70%); }
          80% { clip-path: polygon(0 80%, 100% 80%, 100% 80%, 0 80%); }
          90% { clip-path: polygon(0 50%, 100% 50%, 100% 55%, 0 55%); }
          100% { clip-path: polygon(0 60%, 100% 60%, 100% 70%, 0 70%); }
        }
        @keyframes glitch-anim-2 {
          0% { clip-path: polygon(0 5%, 100% 5%, 100% 6%, 0 6%); }
          15% { clip-path: polygon(0 20%, 100% 20%, 100% 20%, 0 20%); }
          25% { clip-path: polygon(0 30%, 100% 30%, 100% 40%, 0 40%); }
          35% { clip-path: polygon(0 2%, 100% 2%, 100% 3%, 0 3%); }
          45% { clip-path: polygon(0 40%, 100% 40%, 100% 40%, 0 40%); }
          55% { clip-path: polygon(0 55%, 100% 55%, 100% 55%, 0 55%); }
          65% { clip-path: polygon(0 60%, 100% 60%, 100% 30%, 0 30%); }
          75% { clip-path: polygon(0 80%, 100% 80%, 100% 80%, 0 80%); }
          85% { clip-path: polygon(0 90%, 100% 90%, 100% 90%, 0 90%); }
          95% { clip-path: polygon(0 60%, 100% 60%, 100% 65%, 0 65%); }
          100% { clip-path: polygon(0 70%, 100% 70%, 100% 80%, 0 80%); }
        }
        .text-outline {
          -webkit-text-stroke: 1px var(--tw-prose-body);
          -webkit-text-fill-color: transparent;
        }
        .cyan-highlight {
          background: linear-gradient(to right, theme('colors.primary') 0%, theme('colors.primary') 100%);
          background-repeat: no-repeat;
          background-size: 100% 2px;
          background-position: 0 95%;
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative w-full min-h-screen flex items-center justify-center overflow-clip p-4 md:p-8">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://static.wixstatic.com/media/c5b305_490d743d8ecb496da658ec88b53d728f~mv2.png?originWidth=1920&originHeight=1024"
            alt="A sprawling, neon-lit cyberpunk city under a dark, rainy sky, with towering skyscrapers and holographic advertisements."
            width={1920}
            height={1080}
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        <div className="relative z-20 grid grid-cols-12 gap-4 w-full max-w-[120rem] mx-auto">
          <div className="col-span-12 lg:col-span-8 lg:col-start-2">
            <h1 className="relative font-heading text-8xl sm:text-9xl text-foreground glitch-text z-50">
              VEDNIX
            </h1>
            <AnimatedElement className="mt-6">
              <p className="max-w-xl text-lg md:text-xl text-light-gray font-paragraph leading-lg">
                Level Up Your Learning in the Ultimate Anime Cyberpunk Academy. Where knowledge is power, and every lesson is a mission.
              </p>
            </AnimatedElement>
            <AnimatedElement className="mt-10 flex flex-col sm:flex-row gap-4" threshold={0.5}>
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard">
                    <Button className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 text-base font-heading uppercase tracking-widest">
                      <span className="mr-2 text-lg">▶️</span>
                      Continue Journey
                    </Button>
                  </Link>
                  <Link to="/profile">
                    <Button variant="outline" className="w-full sm:w-auto border-primary text-primary hover:bg-primary/10 px-8 py-3 text-base font-heading uppercase tracking-widest">
                      View Profile
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Button onClick={actions.login} className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 text-base font-heading uppercase tracking-widest">
                    <span className="mr-2 text-lg">⚡</span>
                    Start Your Quest
                  </Button>
                  <Button variant="outline" className="w-full sm:w-auto border-primary text-primary hover:bg-primary/10 px-8 py-3 text-base font-heading uppercase tracking-widest" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
                    Explore Features
                  </Button>
                </>
              )}
            </AnimatedElement>
          </div>
        </div>
        <div className="absolute bottom-8 right-8 z-10 text-primary font-paragraph text-xs uppercase hidden md:block">
          <p>// System Status: Online</p>
          <p>// Connection: Secure</p>
        </div>
      </section>

      {/* Manifesto Section */}
      <section className="w-full py-24 md:py-40 bg-background">
        <div className="max-w-[120rem] mx-auto px-4 md:px-8 grid grid-cols-12 gap-x-8 gap-y-12">
          <div className="col-span-12 lg:col-span-5">
            <AnimatedElement>
              <h2 className="font-heading text-6xl md:text-7xl text-primary">POWER UP YOUR MIND.</h2>
            </AnimatedElement>
          </div>
          <div className="col-span-12 lg:col-span-6 lg:col-start-7">
            <AnimatedElement>
              <p className="text-lg text-light-gray leading-lg mb-6">This isn't school. This is an upgrade. VEDNIX dismantles traditional education and rebuilds it as a high-stakes cyberpunk saga. We've weaponized learning, turning passive consumption into active conquest.</p>
              <p className="text-lg text-light-gray leading-lg">Here, you don't just study—you strategize, you battle, you evolve. Our system is designed for the restless, the ambitious, the ones who know that in the future, the ultimate currency is knowledge.</p>
            </AnimatedElement>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full py-24 md:py-40 overflow-clip">
        <div className="max-w-[120rem] mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8">
          {features.map((feature, index) => (
            <AnimatedElement key={feature.id} className={`flex gap-6 md:gap-8 ${index % 2 !== 0 ? 'lg:translate-y-20' : ''}`}>
              <div className="text-primary font-heading text-2xl pt-1">{feature.id}</div>
              <div className="flex-1 border-t border-primary/20 pt-6">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-3xl font-heading font-bold mb-4 text-foreground">{feature.title}</h3>
                <p className="font-paragraph text-light-gray leading-relaxed max-w-md">{feature.description}</p>
              </div>
            </AnimatedElement>
          ))}
        </div>
      </section>

      {/* Avatar Showcase */}
      <section className="w-full py-24 md:py-40 bg-dark-gray/30">
        <div className="max-w-[120rem] mx-auto px-4 md:px-8">
            <AnimatedElement className="text-center mb-16">
                <h2 className="font-heading text-6xl md:text-7xl text-foreground">FORGE YOUR <span className="text-primary">LEGEND</span></h2>
                <p className="text-lg text-light-gray max-w-2xl mx-auto mt-4">Your avatar is more than a profile picture. It's your digital self, evolving with every skill you master.</p>
            </AnimatedElement>
            
            <div className="relative">
                <div className="relative w-full aspect-[16/9] md:aspect-[2/1] lg:h-[70vh] overflow-clip">
                    {avatars.map((avatar, index) => (
                        <div
                            key={avatar.name}
                            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentAvatar ? 'opacity-100' : 'opacity-0'}`}
                        >
                            <Image
                                src={avatar.imageSrc}
                                alt={`Full body portrait of the anime avatar: ${avatar.name}`}
                                width={1600}
                                height={900}
                                className="w-full h-full object-cover object-top"
                            />
                        </div>
                    ))}
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-gray/50 via-transparent to-transparent"></div>
                </div>

                <div className="relative lg:absolute lg:bottom-0 lg:left-0 lg:right-0 flex flex-col lg:flex-row justify-between items-center p-6 bg-background/50 backdrop-blur-sm border-t border-primary/20">
                    <div className="text-center lg:text-left mb-4 lg:mb-0">
                        <p className="font-paragraph text-sm uppercase tracking-widest text-primary">Character Profile</p>
                        <h3 className="font-heading text-3xl text-foreground">{avatars[currentAvatar].name}</h3>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" onClick={prevAvatar} aria-label="Previous Avatar" className="border-primary text-primary hover:bg-primary/10">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <p className="font-paragraph text-light-gray text-lg">{currentAvatar + 1} / {avatars.length}</p>
                        <Button variant="outline" size="icon" onClick={nextAvatar} aria-label="Next Avatar" className="border-primary text-primary hover:bg-primary/10">
                            <ArrowRight className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Skill Tree Section */}
      <section className="relative w-full py-24 md:py-40 overflow-clip">
        <div className="absolute inset-0 z-0 opacity-10">
            <Image 
                src="https://static.wixstatic.com/media/c5b305_49babfd82807424abd58731b35cc15c0~mv2.png?originWidth=768&originHeight=768"
                alt="Abstract network of glowing digital nodes and connections."
                width={1200}
                className="w-full h-full object-cover"
            />
        </div>
        <div className="relative z-10 max-w-[120rem] mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="max-w-lg">
                <AnimatedElement>
                    <h2 className="font-heading text-6xl md:text-7xl text-foreground mb-6">CHOOSE YOUR <span className="text-secondary">PATH</span>.</h2>
                    <p className="text-lg text-light-gray leading-lg mb-8">Unlock new abilities and watch your knowledge tree grow. Specialize as a Code Ronin, mastering languages and frameworks. Become a Data Ghost, manipulating information flows. Or rise as a Network Templar, defending digital frontiers. Your curriculum is your arsenal.</p>
                    <Link to="/advanced-learning">
                      <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary/10 px-8 py-3 text-base font-heading uppercase tracking-widest">
                          View Skill Trees
                      </Button>
                    </Link>
                </AnimatedElement>
            </div>
            <div className="relative h-[400px] md:h-[600px]">
                <AnimatedElement className="w-full h-full">
                    <Image 
                        src="https://static.wixstatic.com/media/c5b305_0d4d8615fe5e46469fb255164f3fb70b~mv2.png?originWidth=768&originHeight=768"
                        alt="A stylized visualization of a futuristic skill tree with glowing nodes and branching paths."
                        width={800}
                        height={800}
                        className="w-full h-full object-contain"
                    />
                </AnimatedElement>
            </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-32 md:py-48 bg-gradient-to-t from-primary/10 to-background">
        <div className="max-w-[120rem] mx-auto px-4 md:px-8 text-center">
          <AnimatedElement>
            <h2 className="text-5xl md:text-7xl font-heading font-black mb-6 text-foreground">
              Ready to Enter the Academy?
            </h2>
            <p className="text-lg font-paragraph text-light-gray mb-12 max-w-3xl mx-auto">
              Join thousands of students already leveling up their knowledge in the most immersive learning experience ever created. The future of education is here. Don't get left behind.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {!isAuthenticated ? (
                <Button onClick={actions.login} className="bg-primary text-primary-foreground hover:bg-primary/90 px-10 py-4 text-lg font-heading uppercase tracking-widest">
                  <span className="mr-3 text-xl">⚡</span>
                  Begin Your Adventure
                </Button>
              ) : (
                <Link to="/dashboard">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-10 py-4 text-lg font-heading uppercase tracking-widest">
                    <span className="mr-3 text-xl">▶️</span>
                    Continue Journey
                  </Button>
                </Link>
              )}
              
              {/* Pet Demo Button */}
              <Button 
                onClick={() => setShowPetModal(true)}
                variant="outline" 
                className="border-secondary text-secondary hover:bg-secondary/10 px-8 py-4 text-lg font-heading uppercase tracking-widest"
              >
                <span className="mr-3 text-xl">💖</span>
                Meet Your Pet
                <span className="ml-2 text-lg">✨</span>
              </Button>
            </div>
          </AnimatedElement>
        </div>
      </section>

      {/* Anime Pet Modal */}
      <AnimePet 
        isOpen={showPetModal} 
        onClose={() => setShowPetModal(false)}
      />
    </div>
  );
}