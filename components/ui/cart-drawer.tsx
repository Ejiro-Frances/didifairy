"use client";

import Link from "next/link";
import { X, ShoppingBag } from "lucide-react";
import { useCart } from "@/stores/cart-store";
import { formatNGN } from "@/lib/utils";

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    totalItems,
    totalPrice,
  } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-[#1A1208]/50">
      <div className="ml-auto flex h-full w-full max-w-md flex-col bg-[#FDFAF5] p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#B8962E]">
              Cart
            </p>
            <h2 className="font-cormorant text-2xl">Your bag</h2>
          </div>
          <button
            onClick={closeCart}
            className="rounded-full border border-[#E8D5A3] p-2"
          >
            <X size={16} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="mt-10 flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-[#E8D5A3] p-8 text-center">
            <ShoppingBag size={24} className="mb-3 text-[#B8962E]" />
            <p className="text-sm text-[#7A6856]">Your cart is empty.</p>
          </div>
        ) : (
          <>
            <div className="mt-6 flex-1 space-y-3 overflow-y-auto">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="rounded-2xl border border-[#E8D5A3] bg-white p-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-[#7A6856]">
                        {formatNGN(item.product.price)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="text-sm text-[#5C3D2E]"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                        className="h-8 w-8 rounded border border-[#E8D5A3]"
                      >
                        -
                      </button>
                      <span className="min-w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                        className="h-8 w-8 rounded border border-[#E8D5A3]"
                      >
                        +
                      </button>
                    </div>
                    <p className="font-medium">
                      {formatNGN(item.product.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-[#E8D5A3] pt-4">
              <div className="flex items-center justify-between text-sm text-[#7A6856]">
                <span>{totalItems} item(s)</span>
                <span className="font-semibold text-[#1A1208]">
                  {formatNGN(totalPrice)}
                </span>
              </div>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="mt-4 block rounded bg-[#1A1208] px-4 py-3 text-center text-sm font-medium text-white"
              >
                Proceed to checkout
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
