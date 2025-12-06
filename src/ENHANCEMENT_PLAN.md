# Anime Pet & Reel Enhancement Plan

## Overview
This document outlines the enhancements to:
1. **Anime Pet Feature** - Make pets fully customizable with preset options
2. **Reel Cards** - Add anime-style cover images based on topics
3. **Reel Interactions** - Instagram-like animations with engagement buttons

## 1. Pet Customization Enhancement

### Current State
- Pet customization exists but needs refinement
- Limited preset options
- No clear pet selection from predefined set

### Improvements
- [ ] Create preset pet templates (8 types)
- [ ] Add pet selection modal to dashboard
- [ ] Store selected pet in user data
- [ ] Display pet on dashboard with stats
- [ ] Pet interaction animations

### Pet Types
1. **Cyber Cat** 🐱 - Agile, curious, playful
2. **Data Dragon** 🐉 - Wise, powerful, protective
3. **Study Bot** 🤖 - Efficient, logical, helpful
4. **Code Phoenix** 🔥 - Resilient, inspiring, fiery
5. **Wisdom Wolf** 🐺 - Loyal, determined, strong
6. **Cyber Fox** 🦊 - Clever, mischievous, quick
7. **Quantum Bunny** 🐰 - Fast, energetic, bouncy
8. **Zen Panda** 🐼 - Calm, balanced, peaceful

---

## 2. Reel Card Enhancements

### Current State
- Basic reel cards with minimal styling
- No cover images
- Limited visual hierarchy

### Improvements
- [ ] Generate anime-style cover images per topic
- [ ] Add gradient overlays based on difficulty
- [ ] Display topic icon prominently
- [ ] Show reel metadata (duration, difficulty, views)
- [ ] Add hover animations
- [ ] Implement lazy loading for images

### Topic-Based Styling
```
Algebra → Cyan/Blue gradient with 📐 icon
Geometry → Green/Emerald gradient with △ icon
Calculus → Purple/Pink gradient with ∑ icon
Statistics → Yellow/Amber gradient with 📊 icon
Physics → Red/Orange gradient with ⚡ icon
```

---

## 3. Instagram-Like Reel Interactions

### Features to Add
- [ ] **Like Button** - Heart icon with animation
- [ ] **Share Button** - Share to clipboard/social
- [ ] **Save Button** - Bookmark reel
- [ ] **Replay Button** - Restart video
- [ ] **Explain Differently** - Alternative explanation
- [ ] **Mentor Access** - Get mentor help
- [ ] **View Count** - Display engagement
- [ ] **Comment Section** - User feedback

### Interaction Animations
- Like: Heart burst animation
- Share: Slide-out menu
- Save: Bookmark animation
- Replay: Spin animation
- Mentor: Modal popup

### Engagement Tracking
- Track likes per reel
- Track saves per user
- Track shares
- Display engagement metrics

---

## 4. Implementation Details

### Files to Create/Modify

#### New Components
- `/src/components/ui/reel-card-enhanced.tsx` - Enhanced reel card with interactions
- `/src/components/ui/pet-selector-modal.tsx` - Pet selection interface
- `/src/components/ui/reel-interactions.tsx` - Engagement buttons

#### Modified Components
- `/src/components/pages/DashboardPage.tsx` - Add pet selector
- `/src/components/ui/anime-trial-reels.tsx` - Update with new cards
- `/src/stores/userDataStore.ts` - Add pet selection storage

#### New Utilities
- `/src/lib/reel-images.ts` - Generate anime cover images
- `/src/lib/pet-presets.ts` - Pet template definitions

---

## 5. Data Structure Updates

### User Pet Selection
```typescript
interface UserPet {
  type: 'cat' | 'dragon' | 'robot' | 'phoenix' | 'wolf' | 'fox' | 'bunny' | 'panda';
  name: string;
  level: number;
  selectedAt: Date;
}
```

### Reel Engagement
```typescript
interface ReelEngagement {
  reelId: string;
  likes: number;
  saves: number;
  shares: number;
  views: number;
  userLiked: boolean;
  userSaved: boolean;
}
```

---

## 6. Animation Specifications

### Like Animation
- Heart icon scales up (1 → 1.5)
- Color changes (gray → red)
- Particle burst effect
- Counter increments

### Save Animation
- Bookmark icon fills
- Color transition
- Subtle bounce

### Share Animation
- Slide-out menu from right
- Fade in options
- Copy to clipboard feedback

### Replay Animation
- Spin 360°
- Video resets
- Play button shows

---

## 7. Responsive Design

### Mobile (< 768px)
- Single column reel cards
- Bottom action bar for interactions
- Vertical scroll for reels

### Tablet (768px - 1024px)
- 2 column grid
- Side action buttons
- Optimized spacing

### Desktop (> 1024px)
- 3-4 column grid
- Hover interactions
- Full feature set

---

## 8. Performance Considerations

- Lazy load reel images
- Debounce interaction handlers
- Cache engagement data
- Optimize animations with GPU acceleration
- Use React.memo for reel cards

---

## 9. Testing Checklist

- [ ] Pet selection works
- [ ] Pet persists across sessions
- [ ] Reel images load correctly
- [ ] Like/save/share animations smooth
- [ ] Engagement counts update
- [ ] Mobile responsive
- [ ] Accessibility (ARIA labels)
- [ ] Performance (Lighthouse > 90)

---

## 10. Deployment Steps

1. Create enhanced reel card component
2. Add pet selector modal
3. Update dashboard with pet display
4. Implement engagement tracking
5. Add animations
6. Test on all devices
7. Deploy to production
8. Monitor performance

---

**Status**: Planning Phase
**Priority**: High
**Estimated Time**: 4-6 hours
**Complexity**: Medium-High
