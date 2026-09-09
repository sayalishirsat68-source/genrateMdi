import React, { useEffect, useState } from 'react';
import { Prescription } from '../types';

interface CartScreenProps {
  items: Prescription[];
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

interface DroneOrder {
  id: string;
  waybillId: string;
  deliveryFee: number;
}

interface Telemetry {
  status: 'dispatched' | 'in_transit' | 'delivered';
  progress: number;
  etaMinutes: number;
  altitudeM: number;
  airspeedKph: number;
  temperatureC: number;
  humidityPercent: number;
}

export const CartScreen: React.FC<CartScreenProps> = ({
  items,
  onRemoveItem,
  onClearCart,
}) => {
  const [deliveryType, setDeliveryType] = useState<'drone' | 'express'>('drone');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [droneOrder, setDroneOrder] = useState<DroneOrder | null>(null);
  const [telemetry, setTelemetry] = useState<Telemetry | null>(null);
  const [dispatchError, setDispatchError] = useState<string | null>(null);
  const [receiptId, setReceiptId] = useState<string | null>(null);

  const subtotal = items.reduce((acc, item) => acc + item.directGenericPrice, 0);
  const brandSubtotal = items.reduce((acc, item) => acc + item.innovatorPrice, 0);
  const deliveryFee = deliveryType === 'drone' ? 3.69 : 0.00;
  const total = subtotal + deliveryFee;
  const totalSavings = brandSubtotal - subtotal;

  useEffect(() => {
    if (!droneOrder) return;
    const stream = new EventSource(`/api/v1/orders/${droneOrder.id}/telemetry`);
    stream.addEventListener('telemetry', (event) => {
      const next = JSON.parse((event as MessageEvent<string>).data) as Telemetry;
      setTelemetry(next);
      if (next.status === 'delivered') {
        stream.close();
        onClearCart();
      }
    });
    stream.onerror = () => stream.close();
    return () => stream.close();
  }, [droneOrder, onClearCart]);

  const handleCheckout = async () => {
    if (deliveryType === 'express') {
      setOrderPlaced(true);
      setTimeout(onClearCart, 1500);
      return;
    }
    setDispatchError(null);
    try {
      const response = await fetch('/api/v1/orders/drone-dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prescriptionIds: items.map((item) => item.id), distanceKm: 8.4 }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) throw new Error(payload.error || 'Unable to create dispatch.');
      setDroneOrder(payload.data as DroneOrder);
      setOrderPlaced(true);
    } catch (error) {
      setDispatchError(error instanceof Error ? error.message : 'Unable to create dispatch.');
    }
  };

  const downloadReceipt = async () => {
    if (!droneOrder) return;
    const response = await fetch(`/api/v1/orders/${droneOrder.id}/receipt`);
    const payload = await response.json();
    if (response.ok) setReceiptId(payload.data.receiptId);
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
          <h3 className="font-bold text-lg text-emerald-950">{telemetry?.status === 'delivered' ? 'Delivered & Verified' : 'Dispatch Scheduled!'}</h3>
          <p className="text-xs text-emerald-800 max-w-xs mx-auto">
            {droneOrder ? 'SkyRoute telemetry and cold-chain monitoring are active.' : 'Express courier dispatch has been scheduled.'}
          </p>
          <div className="bg-white/80 p-3 rounded-xl text-left text-xs space-y-1 font-mono text-emerald-950 border border-emerald-200">
            <div>Waybill: {droneOrder?.waybillId || 'EXPRESS-REFILL'}</div>
            <div>ETA: {telemetry ? `${telemetry.etaMinutes} minutes` : 'Preparing route'}</div>
            <div>Delivery Zone: Robert C. (Residential Pad)</div>
          </div>
          {telemetry && (
            <div className="rounded-xl border border-emerald-200 bg-white/80 p-3 text-left text-xs text-emerald-950 space-y-2">
              <div className="flex justify-between font-semibold"><span>Live flight telemetry</span><span>{telemetry.progress}%</span></div>
              <div className="h-2 overflow-hidden rounded-full bg-emerald-100"><div className="h-full bg-secondary transition-all" style={{ width: `${telemetry.progress}%` }} /></div>
              <div className="grid grid-cols-2 gap-2 font-mono text-[10px]"><span>Altitude: {telemetry.altitudeM}m</span><span>Speed: {telemetry.airspeedKph} km/h</span><span>Temp: {telemetry.temperatureC}°C</span><span>Humidity: {telemetry.humidityPercent}%</span></div>
              <div className="h-12 rounded bg-slate-950 px-2 pt-1 flex items-end gap-1">{[5.2, 5.5, 4.8, telemetry.temperatureC, 5.1, 4.9].map((value, index) => <span key={index} className="flex-1 bg-brand-accent-cyan/80" style={{ height: `${Math.max(15, value * 15)}%` }} />)}</div>
              <p className="text-[10px]">Cold-chain target: 2°C–8°C · monitored continuously</p>
            </div>
          )}
          {telemetry?.status === 'delivered' && <button onClick={() => void downloadReceipt()} className="w-full rounded-xl border border-emerald-300 bg-white py-2 text-xs font-semibold text-emerald-900">{receiptId ? `${receiptId} · CoA verified` : 'Download receipt & verified CoA'}</button>}
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
                <span className="text-[10px]">8.4 km • Under 45 mins • $3.69</span>
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
                  Express Courier
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
            {dispatchError && <p className="pt-2 text-center text-xs text-status-critical">{dispatchError}</p>}
          </div>
        </div>
      )}
    </div>
  );
};
