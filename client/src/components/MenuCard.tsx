import { type MenuItem } from "@shared/schema";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";

type MenuCardProps = {
  item: MenuItem;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
};

export function MenuCard({ item, quantity, onAdd, onRemove }: MenuCardProps) {
  return (
    <Card className="overflow-hidden">
      <img 
        src={item.imageUrl} 
        alt={item.name}
        className="w-full h-48 object-cover"
      />
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{item.name}</h3>
          <span className="font-medium text-green-600">
            ${item.price.toFixed(2)}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{item.description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        {quantity > 0 ? (
          <div className="flex items-center gap-3">
            <Button size="icon" variant="outline" onClick={onRemove}>
              <Minus className="h-4 w-4" />
            </Button>
            <span className="font-medium">{quantity}</span>
            <Button size="icon" variant="outline" onClick={onAdd}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button onClick={onAdd} className="w-full">
            Add to Cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
