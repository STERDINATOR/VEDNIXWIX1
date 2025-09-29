import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Image } from '@/components/ui/image';
import { 
  ShoppingCart, 
  Star, 
  Zap, 
  Crown, 
  Palette, 
  Shirt,
  Heart,
  Search,
  Filter,
  Plus,
  Minus,
  Check,
  Gift,
  Sparkles
} from 'lucide-react';

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: 'xp' | 'gems' | 'coins';
  category: 'avatars' | 'pets' | 'cosmetics' | 'boosts' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  image: string;
  owned: boolean;
  limited?: boolean;
  discount?: number;
}

interface ShopProps {
  userXP?: number;
  userGems?: number;
  userCoins?: number;
  onPurchase?: (item: ShopItem) => void;
}

export function Shop({ 
  userXP = 15750, 
  userGems = 250, 
  userCoins = 1200,
  onPurchase 
}: ShopProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<ShopItem[]>([]);
  const [showCart, setShowCart] = useState(false);

  const shopItems: ShopItem[] = [
    {
      id: '1',
      name: 'Cyber Samurai Avatar',
      description: 'Legendary warrior avatar with glowing katana and neon armor',
      price: 5000,
      currency: 'xp',
      category: 'avatars',
      rarity: 'legendary',
      image: 'https://static.wixstatic.com/media/c5b305_3531d235a875473592f8fa71a02a4ea2~mv2.png?originWidth=192&originHeight=192',
      owned: false
    },
    {
      id: '2',
      name: 'Quantum Cat Pet',
      description: 'A mystical pet that phases between dimensions',
      price: 150,
      currency: 'gems',
      category: 'pets',
      rarity: 'epic',
      image: 'https://static.wixstatic.com/media/c5b305_83b9d1450c8f424d841cbd52c4ab153f~mv2.png?originWidth=192&originHeight=192',
      owned: false,
      limited: true
    },
    {
      id: '3',
      name: 'Neon Wings',
      description: 'Glowing cyberpunk wings for your avatar',
      price: 800,
      currency: 'coins',
      category: 'cosmetics',
      rarity: 'rare',
      image: 'https://static.wixstatic.com/media/c5b305_250ce96b9d044dd39f26c8889a4be084~mv2.png?originWidth=192&originHeight=192',
      owned: false,
      discount: 25
    },
    {
      id: '4',
      name: 'XP Boost (2x)',
      description: 'Double your XP gains for 24 hours',
      price: 50,
      currency: 'gems',
      category: 'boosts',
      rarity: 'common',
      image: 'https://static.wixstatic.com/media/c5b305_5a947d28a52444b598e8040ddd72d2ea~mv2.png?originWidth=128&originHeight=128',
      owned: false
    },
    {
      id: '5',
      name: 'Holographic Outfit',
      description: 'Shimmering holographic clothing set',
      price: 2000,
      currency: 'xp',
      category: 'cosmetics',
      rarity: 'epic',
      image: 'https://static.wixstatic.com/media/c5b305_07cbf53fdac9403280c3dd139e4cf584~mv2.png?originWidth=128&originHeight=128',
      owned: true
    },
    {
      id: '6',
      name: 'Dragon Companion',
      description: 'Legendary dragon pet with fire breath ability',
      price: 300,
      currency: 'gems',
      category: 'pets',
      rarity: 'mythic',
      image: 'https://static.wixstatic.com/media/c5b305_26d41712ff724ce9896152371682ddf1~mv2.png?originWidth=192&originHeight=192',
      owned: false,
      limited: true
    }
  ];

  const categories = [
    { id: 'all', name: 'All Items', icon: <ShoppingCart className="h-4 w-4" /> },
    { id: 'avatars', name: 'Avatars', icon: <Crown className="h-4 w-4" /> },
    { id: 'pets', name: 'Pets', icon: <Heart className="h-4 w-4" /> },
    { id: 'cosmetics', name: 'Cosmetics', icon: <Palette className="h-4 w-4" /> },
    { id: 'boosts', name: 'Boosts', icon: <Zap className="h-4 w-4" /> },
    { id: 'special', name: 'Special', icon: <Gift className="h-4 w-4" /> }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'mythic': return 'border-cyber-yellow bg-cyber-yellow/10 text-cyber-yellow';
      case 'legendary': return 'border-secondary bg-secondary/10 text-secondary';
      case 'epic': return 'border-primary bg-primary/10 text-primary';
      case 'rare': return 'border-neon-green bg-neon-green/10 text-neon-green';
      default: return 'border-light-gray bg-light-gray/10 text-light-gray';
    }
  };

  const getCurrencyIcon = (currency: string) => {
    switch (currency) {
      case 'xp': return <Zap className="h-4 w-4 text-primary" />;
      case 'gems': return <Star className="h-4 w-4 text-secondary" />;
      case 'coins': return <Crown className="h-4 w-4 text-cyber-yellow" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  const getUserCurrency = (currency: string) => {
    switch (currency) {
      case 'xp': return userXP;
      case 'gems': return userGems;
      case 'coins': return userCoins;
      default: return 0;
    }
  };

  const canAfford = (item: ShopItem) => {
    const userAmount = getUserCurrency(item.currency);
    const finalPrice = item.discount 
      ? Math.floor(item.price * (1 - item.discount / 100))
      : item.price;
    return userAmount >= finalPrice;
  };

  const filteredItems = shopItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (item: ShopItem) => {
    if (!cart.find(cartItem => cartItem.id === item.id)) {
      setCart([...cart, item]);
    }
  };

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const purchaseItem = (item: ShopItem) => {
    if (canAfford(item) && !item.owned) {
      onPurchase?.(item);
      removeFromCart(item.id);
    }
  };

  const getTotalCartValue = () => {
    return cart.reduce((total, item) => {
      const price = item.discount 
        ? Math.floor(item.price * (1 - item.discount / 100))
        : item.price;
      return total + price;
    }, 0);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-heading font-black text-primary mb-2">
            Cyber Shop
          </h1>
          <p className="font-paragraph text-light-gray">
            Upgrade your avatar and enhance your learning experience
          </p>
        </div>

        {/* Currency Display */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            <span className="font-heading font-bold text-foreground">{userXP.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-secondary" />
            <span className="font-heading font-bold text-foreground">{userGems}</span>
          </div>
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-cyber-yellow" />
            <span className="font-heading font-bold text-foreground">{userCoins}</span>
          </div>
          
          {/* Cart Button */}
          <Button
            onClick={() => setShowCart(true)}
            className="bg-primary text-primary-foreground relative"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Cart
            {cart.length > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground">
                {cart.length}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-light-gray" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items..."
            className="pl-10 bg-dark-gray border-primary/20"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
        <TabsList className="grid w-full grid-cols-6 bg-dark-gray">
          {categories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="flex items-center gap-2"
            >
              {category.icon}
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card className={`bg-dark-gray border-2 ${getRarityColor(item.rarity)} p-4 h-full relative overflow-hidden`}>
              {/* Limited Badge */}
              {item.limited && (
                <div className="absolute top-2 right-2 z-10">
                  <Badge className="bg-cyber-yellow text-black">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Limited
                  </Badge>
                </div>
              )}

              {/* Discount Badge */}
              {item.discount && (
                <div className="absolute top-2 left-2 z-10">
                  <Badge className="bg-destructive text-destructive-foreground">
                    -{item.discount}%
                  </Badge>
                </div>
              )}

              {/* Owned Badge */}
              {item.owned && (
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-neon-green text-black">
                    <Check className="h-3 w-3 mr-1" />
                    Owned
                  </Badge>
                </div>
              )}

              {/* Item Image */}
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg mb-4 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Item Info */}
              <div className="space-y-3">
                <div>
                  <h3 className="font-heading font-bold text-foreground mb-1">
                    {item.name}
                  </h3>
                  <p className="text-sm font-paragraph text-light-gray line-clamp-2">
                    {item.description}
                  </p>
                </div>

                {/* Rarity */}
                <Badge variant="outline" className={getRarityColor(item.rarity)}>
                  {item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)}
                </Badge>

                {/* Price */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getCurrencyIcon(item.currency)}
                    <span className="font-heading font-bold text-foreground">
                      {item.discount ? (
                        <>
                          <span className="line-through text-light-gray mr-2">
                            {item.price.toLocaleString()}
                          </span>
                          {Math.floor(item.price * (1 - item.discount / 100)).toLocaleString()}
                        </>
                      ) : (
                        item.price.toLocaleString()
                      )}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {item.owned ? (
                    <Button disabled className="flex-1 bg-neon-green text-black">
                      <Check className="h-4 w-4 mr-2" />
                      Owned
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={() => addToCart(item)}
                        variant="outline"
                        className="border-primary text-primary"
                        disabled={cart.find(cartItem => cartItem.id === item.id) !== undefined}
                      >
                        {cart.find(cartItem => cartItem.id === item.id) ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        onClick={() => purchaseItem(item)}
                        disabled={!canAfford(item)}
                        className={`flex-1 ${
                          canAfford(item)
                            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                            : 'bg-light-gray text-dark-gray cursor-not-allowed'
                        }`}
                      >
                        Buy Now
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Cart Modal */}
      <AnimatePresence>
        {showCart && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCart(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-dark-gray border border-primary/20 rounded-2xl w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-heading font-bold text-foreground">Shopping Cart</h3>
                <Button variant="ghost" onClick={() => setShowCart(false)}>
                  ✕
                </Button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 text-light-gray mx-auto mb-4" />
                  <p className="font-paragraph text-light-gray">Your cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 bg-background rounded">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-heading font-bold text-foreground text-sm">
                            {item.name}
                          </h4>
                          <div className="flex items-center gap-1">
                            {getCurrencyIcon(item.currency)}
                            <span className="text-sm font-paragraph text-light-gray">
                              {item.discount 
                                ? Math.floor(item.price * (1 - item.discount / 100)).toLocaleString()
                                : item.price.toLocaleString()
                              }
                            </span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFromCart(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-primary/20 pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-heading font-bold text-foreground">Total:</span>
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-primary" />
                        <span className="font-heading font-bold text-primary">
                          {getTotalCartValue().toLocaleString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setCart([])}
                        className="flex-1 border-destructive text-destructive"
                      >
                        Clear Cart
                      </Button>
                      <Button
                        onClick={() => {
                          cart.forEach(item => purchaseItem(item));
                          setShowCart(false);
                        }}
                        className="flex-1 bg-primary text-primary-foreground"
                      >
                        Buy All
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}