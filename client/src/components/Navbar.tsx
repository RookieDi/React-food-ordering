import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type NavbarProps = {
  cartItemCount: number;
  onCartClick: () => void;
};

export function Navbar({ cartItemCount, onCartClick }: NavbarProps) {
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/">
            <a className="text-2xl font-bold bg-gradient-to-r from-orange-500 to 
              red-600 bg-clip-text text-transparent">
              FoodieHub
            </a>
          </Link>
          <div className="hidden md:flex gap-4">
            <Link href="/"><a className="text-sm">Menu</a></Link>
            <Link href="/orders"><a className="text-sm">Orders</a></Link>
            <Link href="/admin"><a className="text-sm">Admin</a></Link>
          </div>
        </div>
        <Button variant="outline" className="relative" onClick={onCartClick}>
          <ShoppingBag className="h-5 w-5" />
          {cartItemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground 
              rounded-full h-5 w-5 text-xs flex items-center justify-center">
              {cartItemCount}
            </span>
          )}
        </Button>
      </div>
    </nav>
  );
}
