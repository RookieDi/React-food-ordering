import { useQuery } from "@tanstack/react-query";
import { type MenuItem } from "@shared/schema";
import { MenuCard } from "@/components/MenuCard";
import { useState } from "react";
import { CartSheet } from "@/components/CartSheet";
import { Navbar } from "@/components/Navbar";

export default function Home() {
  const [cart, setCart] = useState<Map<number, number>>(new Map());
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { data: menuItems, isLoading } = useQuery<MenuItem[]>({ 
    queryKey: ["/api/menu"]
  });

  function updateCartQuantity(itemId: number, quantity: number) {
    setCart(prev => {
      const next = new Map(prev);
      if (quantity === 0) {
        next.delete(itemId);
      } else {
        next.set(itemId, quantity);
      }
      return next;
    });
  }

  const cartItems = menuItems
    ? Array.from(cart.entries()).map(([id, quantity]) => ({
        item: menuItems.find(item => item.id === id)!,
        quantity,
      }))
    : [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        cartItemCount={Array.from(cart.values()).reduce((a, b) => a + b, 0)}
        onCartClick={() => setIsCartOpen(true)}
      />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto mb-8">
          <h1 className="text-4xl font-bold text-center mb-2">
            Delicious Food,
            <br />
            Delivered Fast
          </h1>
          <p className="text-center text-muted-foreground">
            Browse our menu and order your favorite dishes
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-[360px] rounded-lg bg-muted animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems?.map(item => (
              <MenuCard
                key={item.id}
                item={item}
                quantity={cart.get(item.id) || 0}
                onAdd={() => 
                  updateCartQuantity(item.id, (cart.get(item.id) || 0) + 1)
                }
                onRemove={() => 
                  updateCartQuantity(item.id, (cart.get(item.id) || 1) - 1)
                }
              />
            ))}
          </div>
        )}
      </main>

      <CartSheet
        open={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateCartQuantity}
      />
    </div>
  );
}
