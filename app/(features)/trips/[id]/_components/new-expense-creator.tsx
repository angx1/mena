"use client";

import { Button } from "@/components/ui/button";
import { CirclePlus, Utensils, Wrench, Home, Car, Package } from "lucide-react";
import { createTripAction } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { useState, useRef } from "react";

const expenseCategories = [
  { value: "comida", label: "Food", icon: <Utensils className="h-4 w-4" /> },
  {
    value: "herramientas",
    label: "Tools",
    icon: <Wrench className="h-4 w-4" />,
  },
  {
    value: "alojamiento",
    label: "Accommodation",
    icon: <Home className="h-4 w-4" />,
  },
  {
    value: "transporte",
    label: "Transport",
    icon: <Car className="h-4 w-4" />,
  },
  { value: "otros", label: "Other", icon: <Package className="h-4 w-4" /> },
];

export default function NewExpenseButton() {
  const [open, setOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm();
    }
    setOpen(newOpen);
  };

  const handleSubmit = async (formData: FormData) => {
    const amount = formData.get("amount");
    const currency = formData.get("currency");
    const businessName = formData.get("businessName");
    const taxId = formData.get("taxId");

    if (!amount || !currency || !selectedCategory || !businessName || !taxId) {
      setFormError("Please fill all fields");
      return;
    }

    const expenseData = {
      amount: Number(amount),
      currency: String(currency),
      type: selectedCategory,
      businessName: String(businessName),
      taxId: String(taxId),
    };

    // await createExpenseAction(expenseData); // You'll need to create this action
    resetForm();
    setOpen(false);
  };

  const resetForm = () => {
    setFormError(null);
    setSelectedCategory(null);
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild className="m-auto">
        <Button className="">
          <CirclePlus className="mr-2 h-4 w-4" />
          new expense
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle>New Expense</DialogTitle>
        <DialogDescription className="font-mono mb-5">
          Register a new expense
        </DialogDescription>
        <form ref={formRef} className="flex-1 flex flex-col min-w-64 gap-4">
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name</Label>
            <Input
              id="businessName"
              name="businessName"
              type="text"
              required
              className="flex-1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="taxId">Tax ID (CIF)</Label>
            <Input
              id="taxId"
              name="taxId"
              type="text"
              required
              className="flex-1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="flex gap-2">
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                required
                className="flex-1"
              />
              <Select name="currency" required>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EUR">Euros (€)</SelectItem>
                  <SelectItem value="USD">Dollars ($)</SelectItem>
                  <SelectItem value="GBP">Pounds (£)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Expense Category</Label>
            <input
              type="hidden"
              name="expenseType"
              value={selectedCategory || ""}
            />
            <div className="flex gap-4 items-center">
              <TooltipProvider>
                <ToggleGroup
                  type="single"
                  variant="outline"
                  size="lg"
                  className="flex justify-start"
                  value={selectedCategory || ""}
                  onValueChange={(value) => {
                    if (value) setSelectedCategory(value);
                  }}
                >
                  {expenseCategories.map((category) => (
                    <Tooltip key={category.value}>
                      <TooltipTrigger asChild>
                        <ToggleGroupItem
                          value={category.value}
                          aria-label={category.label}
                          className={`p-2 rounded-md hover:bg-gray-100 ${
                            selectedCategory === category.value
                              ? "bg-[var(--accent-foreground)] text-primary-foreground hover:bg-[var(--accent-foreground)] hover:text-primary-foreground"
                              : ""
                          }`}
                        >
                          {category.icon}
                        </ToggleGroupItem>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{category.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </ToggleGroup>
              </TooltipProvider>
              {selectedCategory && (
                <span className="text-sm text-muted-foreground font-mono">
                  --{" "}
                  {
                    expenseCategories.find((c) => c.value === selectedCategory)
                      ?.label
                  }
                </span>
              )}
            </div>
            {!selectedCategory && formError && (
              <p className="text-xs text-red-500 mt-1">
                Please select a category
              </p>
            )}
          </div>

          {formError && <p className="text-sm text-red-500">{formError}</p>}

          <SubmitButton
            pendingText="Creating expense..."
            formAction={handleSubmit}
            className="mt-7"
          >
            Create expense
          </SubmitButton>
        </form>
      </DialogContent>
    </Dialog>
  );
}
