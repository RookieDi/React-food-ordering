import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import { type MenuItem } from "@shared/schema";
import { X } from "lucide-react";

type CartItem = {
  item: MenuItem;
  quantity: number;
};

type CartSheetProps = {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (itemId: number, quantity: number) => void;
};

const orderFormSchema = z.object({
  customerName: z.string().min(1, "Name is required"),
  customerEmail: z.string().email("Invalid email address"),
});

export function CartSheet({ open, onClose, items, onUpdateQuantity }: CartSheetProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof orderFormSchema>>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
    },
  });

  const total = items.reduce(
    (sum, { item, quantity }) => sum + item.price * quantity,
    0
  );

  async function onSubmit(data: z.infer<typeof orderFormSchema>) {
    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add some items to your cart first",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const orderData = {
        order: {
          ...data,
          total,
          status: "pending",
        },
        items: items.map(({ item, quantity }) => ({
          menuItemId: item.id,
          quantity,
          price: item.price,
        })),
      };

      await apiRequest("POST", "/api/orders", orderData);
      
      toast({
        title: "Order placed successfully!",
        description: "You can track your order in the Orders page",
      });
      
      onClose();
      form.reset();
    } catch (error) {
      toast({
        title: "Failed to place order",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>
        
        <div className="mt-8 flex-1 overflow-y-auto">
          {items.map(({ item, quantity }) => (
            <div key={item.id} className="flex items-center gap-4 py-4">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="h-16 w-16 rounded-md object-cover"
              />
              <div className="flex-1">
                <h4 className="font-medium">{item.name}</h4>
                <p className="text-sm text-muted-foreground">
                  ${item.price.toFixed(2)} x {quantity}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onUpdateQuantity(item.id, 0)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <Separator className="my-4" />
        
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="font-medium">Total</span>
            <span className="font-medium">${total.toFixed(2)}</span>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="customerEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                Place Order
              </Button>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
