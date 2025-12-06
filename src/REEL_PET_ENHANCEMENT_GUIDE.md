# Anime Pet & Reel Enhancement Implementation Guide

## Overview
This guide explains the new components and features added to enhance the anime pet system and reel interactions.

---

## 1. Pet Preset System

### File: `/src/lib/pet-presets.ts`

**Purpose**: Defines 8 customizable pet templates that users can select from.

**Key Features**:
- 8 unique pet types (Cat, Dragon, Robot, Phoenix, Wolf, Fox, Bunny, Panda)
- Each pet has predefined personality, abilities, and appearance
- Easy to extend with new pet types
- Helper functions for pet lookup

**Usage**:
```typescript
import { PET_PRESETS, getPetPresetById, getRandomPetPreset } from '@/lib/pet-presets';

// Get all presets
const allPets = PET_PRESETS;

// Get specific pet
const cyberCat = getPetPresetById('cyber-cat');

// Get random pet
const randomPet = getRandomPetPreset();
```

**Pet Types**:
1. **Cyber Cat** 🐱 - Playful, curious, agile
2. **Data Dragon** 🐉 - Wise, powerful, protective
3. **Study Bot** 🤖 - Energetic, logical, efficient
4. **Code Phoenix** 🔥 - Resilient, inspiring, fiery
5. **Wisdom Wolf** 🐺 - Loyal, determined, strong
6. **Cyber Fox** 🦊 - Clever, mischievous, quick
7. **Quantum Bunny** 🐰 - Fast, energetic, bouncy
8. **Zen Panda** 🐼 - Calm, balanced, peaceful

---

## 2. Pet Selector Modal

### File: `/src/components/ui/pet-selector-modal.tsx`

**Purpose**: Beautiful modal interface for selecting and previewing pet companions.

**Features**:
- Grid display of all 8 pets
- Pet preview with emoji and animations
- Personality and ability display
- Selection indicator
- Hover animations
- Responsive design

**Props**:
```typescript
interface PetSelectorModalProps {
  isOpen: boolean;              // Modal visibility
  onClose: () => void;          // Close handler
  onSelectPet: (pet: PetPreset) => void;  // Selection callback
  selectedPetId?: string;       // Currently selected pet ID
}
```

**Usage**:
```typescript
import { PetSelectorModal } from '@/components/ui/pet-selector-modal';

function MyComponent() {
  const [showPetSelector, setShowPetSelector] = useState(false);
  const [selectedPet, setSelectedPet] = useState<PetPreset | null>(null);

  return (
    <>
      <Button onClick={() => setShowPetSelector(true)}>
        Choose Pet
      </Button>
      
      <PetSelectorModal
        isOpen={showPetSelector}
        onClose={() => setShowPetSelector(false)}
        onSelectPet={(pet) => {
          setSelectedPet(pet);
          setShowPetSelector(false);
        }}
        selectedPetId={selectedPet?.id}
      />
    </>
  );
}
```

**Styling**:
- Responsive grid (1 col mobile, 2 col tablet, 4 col desktop)
- Hover animations with scale and rotation
- Selection highlight with glow effect
- Floating particle effects on hover
- Smooth transitions

---

## 3. Enhanced Reel Card Component

### File: `/src/components/ui/reel-card-enhanced.tsx`

**Purpose**: Instagram-like reel card with engagement features.

**Features**:
- Anime-style cover images
- Like, Save, Share buttons with animations
- Replay and engagement buttons
- Mentor access and explain differently options
- View count, like count, save count display
- XP reward badge
- Difficulty color coding
- Hover animations

**Props**:
```typescript
interface ReelCardEnhancedProps {
  id: string;                    // Unique reel ID
  title: string;                 // Reel title
  topic: string;                 // Learning topic
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Epic';
  duration: number;              // Duration in seconds
  coverImage: string;            // Cover image URL
  topicIcon: string;             // Emoji icon for topic
  topicColor: string;            // Tailwind gradient class
  description?: string;          // Optional description
  viewCount?: number;            // Number of views
  likeCount?: number;            // Number of likes
  saveCount?: number;            // Number of saves
  onPlay?: () => void;           // Play button handler
  onMentorAccess?: () => void;   // Mentor button handler
  onExplainDifferently?: () => void;  // Explain button handler
}
```

**Usage**:
```typescript
import { ReelCardEnhanced } from '@/components/ui/reel-card-enhanced';

function ReelGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ReelCardEnhanced
        id="reel-1"
        title="Algebra Fundamentals"
        topic="Algebra"
        difficulty="Easy"
        duration={420}
        coverImage="https://example.com/algebra-cover.jpg"
        topicIcon="📐"
        topicColor="from-cyan-500/30 to-blue-500/30"
        description="Learn the fundamentals of algebra"
        viewCount={1250}
        likeCount={340}
        saveCount={120}
        onPlay={() => console.log('Play reel')}
        onMentorAccess={() => console.log('Access mentor')}
        onExplainDifferently={() => console.log('Explain differently')}
      />
    </div>
  );
}
```

**Interaction Features**:

1. **Like Button**
   - Toggle like state
   - Increment/decrement counter
   - Heart fill animation
   - Color change to secondary

2. **Save Button**
   - Toggle save state
   - Increment/decrement counter
   - Bookmark fill animation
   - Color change to neon-green

3. **Share Button**
   - Dropdown menu with options
   - Copy to clipboard
   - Share on Twitter/X
   - Share on Facebook
   - Confirmation message

4. **Replay Button**
   - Restart video
   - Rotation animation
   - Calls onPlay handler

5. **Explain Differently**
   - Alternative explanation
   - Opens explanation modal
   - Calls onExplainDifferently handler

6. **Mentor Access**
   - Get mentor help
   - Opens mentor modal
   - Calls onMentorAccess handler

**Styling**:
- Difficulty color coding:
  - Easy: Cyber Yellow
  - Medium: Neon Green
  - Hard: Primary Cyan
  - Epic: Secondary Magenta
- Hover effects with scale and shadow
- Smooth transitions
- Responsive button layout

---

## 4. Integration with Dashboard

### Update Dashboard to Show Pet Selector

```typescript
// In DashboardPage.tsx
import { PetSelectorModal } from '@/components/ui/pet-selector-modal';
import { PET_PRESETS } from '@/lib/pet-presets';

function DashboardPage() {
  const [showPetSelector, setShowPetSelector] = useState(false);
  const [selectedPet, setSelectedPet] = useState<PetPreset | null>(null);

  // Load selected pet from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('selectedPet');
    if (saved) {
      setSelectedPet(JSON.parse(saved));
    }
  }, []);

  const handleSelectPet = (pet: PetPreset) => {
    setSelectedPet(pet);
    localStorage.setItem('selectedPet', JSON.stringify(pet));
  };

  return (
    <div>
      {/* Pet Display Section */}
      <Card className="p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-6xl">{selectedPet?.emoji || '🐱'}</div>
            <div>
              <h3 className="font-heading font-bold text-foreground text-2xl">
                {selectedPet?.name || 'Choose Your Pet'}
              </h3>
              <p className="text-light-gray">
                {selectedPet?.description || 'Select a pet companion'}
              </p>
            </div>
          </div>
          <Button onClick={() => setShowPetSelector(true)}>
            Change Pet
          </Button>
        </div>
      </Card>

      <PetSelectorModal
        isOpen={showPetSelector}
        onClose={() => setShowPetSelector(false)}
        onSelectPet={handleSelectPet}
        selectedPetId={selectedPet?.id}
      />
    </div>
  );
}
```

---

## 5. Integration with Reel Pages

### Update AnimeReelsPage to Use Enhanced Cards

```typescript
// In AnimeReelsPage.tsx
import { ReelCardEnhanced } from '@/components/ui/reel-card-enhanced';

function AnimeReelsPage() {
  const reels = [
    {
      id: 'reel-1',
      title: 'Algebra Fundamentals',
      topic: 'Algebra',
      difficulty: 'Easy' as const,
      duration: 420,
      coverImage: 'https://example.com/algebra.jpg',
      topicIcon: '📐',
      topicColor: 'from-cyan-500/30 to-blue-500/30',
      description: 'Learn the fundamentals of algebra',
      viewCount: 1250,
      likeCount: 340,
      saveCount: 120
    },
    // ... more reels
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reels.map(reel => (
        <ReelCardEnhanced
          key={reel.id}
          {...reel}
          onPlay={() => handlePlayReel(reel.id)}
          onMentorAccess={() => handleMentorAccess(reel.id)}
          onExplainDifferently={() => handleExplainDifferently(reel.id)}
        />
      ))}
    </div>
  );
}
```

---

## 6. Data Storage

### User Pet Selection
```typescript
// Store in localStorage
localStorage.setItem('selectedPet', JSON.stringify(pet));

// Retrieve
const savedPet = localStorage.getItem('selectedPet');
const pet = savedPet ? JSON.parse(savedPet) : null;
```

### Reel Engagement
```typescript
// Store engagement data
const engagement = {
  reelId: 'reel-1',
  liked: true,
  saved: true,
  viewCount: 1250,
  likeCount: 340,
  saveCount: 120
};

localStorage.setItem(`reel-engagement-${reelId}`, JSON.stringify(engagement));
```

---

## 7. Customization Options

### Adding New Pet Types

```typescript
// In pet-presets.ts
export const PET_PRESETS: PetPreset[] = [
  // ... existing pets
  {
    id: 'new-pet',
    type: 'newtype',
    name: 'New Pet Name',
    emoji: '🆕',
    description: 'Description of new pet',
    personality: 'playful',
    color: '#NEWCOLOR',
    secondaryColor: '#NEWSECONDARY',
    specialAbilities: ['Ability 1', 'Ability 2'],
    backstory: 'Pet backstory',
    favoriteActivity: 'Favorite activity',
    appearance: {
      eyes: 'sparkly',
      expression: 'happy',
      pattern: 'cyber',
      size: 'medium'
    }
  }
];
```

### Customizing Reel Colors

```typescript
// Topic color mapping
const topicColors = {
  'Algebra': 'from-cyan-500/30 to-blue-500/30',
  'Geometry': 'from-green-500/30 to-emerald-500/30',
  'Calculus': 'from-purple-500/30 to-pink-500/30',
  'Statistics': 'from-yellow-500/30 to-amber-500/30',
  'Physics': 'from-red-500/30 to-orange-500/30'
};
```

---

## 8. Performance Tips

1. **Lazy Load Images**: Use Image component with loading="lazy"
2. **Memoize Components**: Wrap reel cards with React.memo
3. **Debounce Interactions**: Debounce like/save handlers
4. **Cache Pet Data**: Store selected pet in localStorage
5. **Optimize Animations**: Use GPU-accelerated transforms

---

## 9. Accessibility

- Add ARIA labels to all buttons
- Ensure color contrast meets WCAG AA
- Keyboard navigation support
- Screen reader friendly descriptions
- Focus indicators on interactive elements

---

## 10. Testing Checklist

- [ ] Pet selector opens and closes
- [ ] Pet selection persists
- [ ] Reel cards render correctly
- [ ] Like/save buttons toggle
- [ ] Share menu appears
- [ ] Animations are smooth
- [ ] Mobile responsive
- [ ] Accessibility compliant
- [ ] Performance acceptable

---

## 11. Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 12. Future Enhancements

1. **Pet Evolution**: Level up pets with XP
2. **Pet Customization**: Customize pet appearance
3. **Pet Interactions**: Feed, play, train pets
4. **Reel Comments**: User feedback system
5. **Reel Playlists**: Create custom playlists
6. **Social Features**: Share with friends
7. **Achievements**: Unlock pet-related achievements
8. **Leaderboards**: Track engagement metrics

---

**Last Updated**: December 6, 2025
**Version**: 1.0
**Status**: Ready for Implementation
