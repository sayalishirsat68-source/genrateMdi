import React, { useState } from 'react';
import { Prescription } from '../types';

interface CartScreenProps {
  items: Prescription[];
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

export const CartScreen: React.FC<CartScreenProps> = ({
  items,
  onRemoveItem,
  onClearCart,
}) => {
  const [deliveryType, setDeliveryType] = useState<'drone' | 'express'>('drone');
  const [orderPlaced, setOrderPlaced] = useState(false);

  const subtotal = items.reduce((acc, item) => acc + item.directGenericPrice, 0);
  const brandSubtotal = items.reduce((acc, item) => acc + item.innovatorPrice, 0);
  const deliveryFee = deliveryType === 'drone' ? 2.50 : 0.00;
  const total = subtotal + deliveryFee;
  const totalSavings = brandSubtotal - subtotal;

  const handleCheckout = () => {
    setOrderPlaced(true);
    setTimeout(() => {
      onClearCart();
    }, 4000);
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto px-space-md pt-space-md pb-24 space-y-space-md">
      <div className="bg-surface-card p-space-md rounded-xl border border-border-crisp shadow-sm">
        <h2 className="text-headline-md font-semibold text-on-surface">Refill Dispatch & Cart</h2>
        <p className="text-body-sm text-on-surface-variant mt-0.5">
          Review scheduled refills, drone courier dispatch, and direct generic savings.
        </p>
      </div>

      {orderPlaced ? (
        <div className="bg-status-verified-bg p-6 rounded-2xl border border-status-verified-border text-center space-y-3">
          <div className="w-16 h-16 bg-status-verified text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
            <span className="material-symbols-outlined text-3xl">done_all</span>
          </div>
          <h3 className="font-bold text-lg text-emerald-950">Dispatch Scheduled!</h3>
          <p className="text-xs text-emerald-800 max-w-xs mx-auto">
            Order #GM-REF-2026-99 is routed to SkyRoute Drone Hub. Authenticated cold-chain tracking is active.
          </p>
          <div className="bg-white/80 p-3 rounded-xl text-left text-xs space-y-1 font-mono text-emerald-950 border border-emerald-200">
            <div>Tracking ID: SKY-DRONE-88192</div>
            <div>Estimated Arrival: Within 45 minutes</div>
            <div>Delivery Zone: Robert C. (Residential Pad)</div>
          </div>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-surface-card p-8 rounded-xl border border-border-crisp text-center space-y-2">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant/40">
            shopping_bag
          </span>
          <h4 className="font-semibold text-sm text-on-surface">No Refills in Queue</h4>
          <p className="text-xs text-on-surface-variant">
            Tap "Refill Now" on any prescription card in your Rx Vault to add it here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-surface-card p-3 rounded-xl border border-border-crisp shadow-sm flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-12 h-12 rounded-lg object-cover border border-border-crisp flex-shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="font-semibold text-xs text-on-surface truncate">{item.name}</h4>
                  <p className="text-[11px] text-on-surface-variant truncate">{item.dosage}</p>
                  <span className="text-[11px] font-bold text-secondary">${item.directGenericPrice.toFixed(2)}</span>
                  <span className="text-[10px] line-through text-on-surface-variant/60 ml-1.5">
                    ${item.innovatorPrice.toFixed(2)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => onRemoveItem(item.id)}
                className="text-on-surface-variant hover:text-status-critical p-1"
                title="Remove item"
              >
                <span className="material-symbols-outlined text-[18px]">delete</span>
              </button>
            </div>
          ))}

          {/* Delivery Method Selector */}
          <div className="bg-surface-card p-3 rounded-xl border border-border-crisp space-y-2 text-xs">
            <span className="font-bold text-on-surface block">Delivery Route:</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setDeliveryType('drone')}
                className={`p-2.5 rounded-lg border text-left flex flex-col gap-0.5 transition-colors ${
                  deliveryType === 'drone'
                    ? 'border-secondary bg-secondary/5 font-semibold text-secondary'
                    : 'border-border-crisp bg-surface-canvas text-on-surface-variant'
                }`}
              >
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">mode_fan</span>
                  SkyRoute Drone
                </span>
                <span className="text-[10px]">Under 45 mins • $2.50</span>
              </button>

              <button
                onClick={() => setDeliveryType('express')}
                className={`p-2.5 rounded-lg border text-left flex flex-col gap-0.5 transition-colors ${
                  deliveryType === 'express'
                    ? 'border-secondary bg-secondary/5 font-semibold text-secondary'
                    : 'border-border-crisp bg-surface-canvas text-on-surface-variant'
                }`}
              >
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                  Courier Courier
                </span>
                <span className="text-[10px]">Tomorrow morning • Free</span>
              </button>
            </div>
          </div>

          {/* Cost Summary */}
          <div className="bg-surface-card p-4 rounded-xl border border-border-crisp space-y-2 text-xs">
            <div className="flex justify-between text-on-surface-variant">
              <span>Generic Refill Subtotal</span>
              <span className="font-mono">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-on-surface-variant">
              <span>Delivery Fee</span>
              <span className="font-mono">${deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-status-verified font-medium bg-status-verified-bg p-2 rounded">
              <span>Bio-Parity Savings vs Brand:</span>
              <span className="font-bold">-${totalSavings.toFixed(2)}</span>
            </div>
            <div className="border-t border-border-crisp pt-2 flex justify-between font-bold text-sm text-on-surface">
              <span>Total Payable</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full mt-2 py-3 rounded-xl bg-secondary hover:bg-secondary/90 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">verified</span>
              Confirm & Dispatch Refill (${total.toFixed(2)})
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
