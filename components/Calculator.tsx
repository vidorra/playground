'use client';

import { useState, useEffect } from 'react';

interface CalculatorProps {
  initialDistance: number;
}

export default function Calculator({ initialDistance }: CalculatorProps) {
  const [groceryAmount, setGroceryAmount] = useState(400);
  const [savingsPercent, setSavingsPercent] = useState(25);
  const [tripsPerMonth, setTripsPerMonth] = useState(4);
  const [distance, setDistance] = useState(initialDistance);
  const [fuelConsumption, setFuelConsumption] = useState(7);
  const [fuelPriceNL, setFuelPriceNL] = useState(1.94);
  const [fuelPriceDE, setFuelPriceDE] = useState(1.84);
  const [fuelLocation, setFuelLocation] = useState<'NL' | 'DE'>('NL');

  useEffect(() => {
    setDistance(initialDistance);
  }, [initialDistance]);

  const calculate = () => {
    const nlCost = groceryAmount;
    const deCost = groceryAmount * (1 - savingsPercent / 100);
    const grocerySavings = nlCost - deCost;

    const roundTripDistance = distance * 2;
    const fuelPrice = fuelLocation === 'NL' ? fuelPriceNL : fuelPriceDE;
    const litersNeeded = (roundTripDistance / 100) * fuelConsumption;
    const fuelPerTrip = litersNeeded * fuelPrice;
    const totalFuelMonth = fuelPerTrip * tripsPerMonth;

    let fuelSavingsAmount = 0;
    if (fuelLocation === 'DE') {
      const averageTankSize = 50;
      const pricePerTankSavings = (fuelPriceNL - fuelPriceDE) * averageTankSize;
      fuelSavingsAmount = pricePerTankSavings * tripsPerMonth;
    }

    const netMonthly = grocerySavings - totalFuelMonth + fuelSavingsAmount;
    const netYearly = netMonthly * 12;

    return {
      nlCost,
      deCost,
      grocerySavings,
      fuelPerTrip,
      totalFuelMonth,
      fuelSavingsAmount,
      netMonthly,
      netYearly,
    };
  };

  const results = calculate();

  return (
    <div className="space-y-6">
      {/* Shopping Details */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="text-2xl">🛒</span>
          Your Shopping Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monthly grocery spending (NL)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={groceryAmount}
                onChange={(e) => setGroceryAmount(Number(e.target.value))}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                step="10"
              />
              <span className="text-gray-600 font-medium">€</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expected savings in Germany
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={savingsPercent}
                onChange={(e) => setSavingsPercent(Number(e.target.value))}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                max="50"
                step="1"
              />
              <span className="text-gray-600 font-medium">%</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shopping trips per month
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={tripsPerMonth}
                onChange={(e) => setTripsPerMonth(Number(e.target.value))}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
                max="30"
                step="1"
              />
              <span className="text-gray-600 font-medium">trips</span>
            </div>
          </div>
        </div>
      </div>

      {/* Travel Costs */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="text-2xl">⛽</span>
          Travel Costs
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Distance to German store (one way)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value))}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                min="0"
                step="1"
              />
              <span className="text-gray-600 font-medium">km</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Car fuel consumption
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={fuelConsumption}
                onChange={(e) => setFuelConsumption(Number(e.target.value))}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                min="0"
                step="0.1"
              />
              <span className="text-gray-600 font-medium text-sm">L/100km</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Where do you fill up?
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setFuelLocation('NL')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                  fuelLocation === 'NL'
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-white border border-gray-300 text-gray-700 hover:border-orange-500'
                }`}
              >
                🇳🇱 NL
              </button>
              <button
                onClick={() => setFuelLocation('DE')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                  fuelLocation === 'DE'
                    ? 'bg-red-500 text-white shadow-md'
                    : 'bg-white border border-gray-300 text-gray-700 hover:border-red-500'
                }`}
              >
                🇩🇪 DE
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`p-4 rounded-lg border-2 ${fuelLocation === 'NL' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-gray-50'}`}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🇳🇱 Netherlands fuel price
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={fuelPriceNL}
                onChange={(e) => setFuelPriceNL(Number(e.target.value))}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                min="0"
                step="0.01"
              />
              <span className="text-gray-600 font-medium">€/L</span>
            </div>
          </div>

          <div className={`p-4 rounded-lg border-2 ${fuelLocation === 'DE' ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'}`}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🇩🇪 Germany fuel price
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={fuelPriceDE}
                onChange={(e) => setFuelPriceDE(Number(e.target.value))}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                min="0"
                step="0.01"
              />
              <span className="text-gray-600 font-medium">€/L</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-600 mt-3 italic">
          💡 Prices updated Nov 2025. Fuel in Germany is typically €0.10/L cheaper.
        </p>
      </div>

      {/* Results */}
      <div className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-xl p-6 shadow-xl">
        <h3 className="text-2xl font-bold mb-6 text-center">📊 Your Savings Breakdown</h3>

        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center pb-3 border-b border-white/20">
            <span className="text-purple-100">Monthly grocery cost (NL)</span>
            <span className="text-xl font-bold">€{results.nlCost.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center pb-3 border-b border-white/20">
            <span className="text-purple-100">Monthly grocery cost (DE)</span>
            <span className="text-xl font-bold">€{results.deCost.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center pb-3 border-b border-white/20">
            <span className="text-purple-100">Grocery savings</span>
            <span className="text-xl font-bold text-green-300">+€{results.grocerySavings.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center pb-3 border-b border-white/20">
            <span className="text-purple-100">Fuel cost per trip</span>
            <span className="text-xl font-bold">€{results.fuelPerTrip.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center pb-3 border-b border-white/20">
            <span className="text-purple-100">Total fuel cost/month</span>
            <span className="text-xl font-bold text-red-300">-€{results.totalFuelMonth.toFixed(2)}</span>
          </div>

          {fuelLocation === 'DE' && results.fuelSavingsAmount > 0 && (
            <div className="flex justify-between items-center pb-3 border-b border-white/20">
              <span className="text-purple-100">Extra fuel savings (filling in DE)</span>
              <span className="text-xl font-bold text-green-300">+€{results.fuelSavingsAmount.toFixed(2)}</span>
            </div>
          )}
        </div>

        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 text-center">
          <div className="text-sm text-purple-100 mb-2">NET MONTHLY SAVINGS</div>
          <div className={`text-5xl font-bold mb-3 ${results.netMonthly > 0 ? 'text-green-300' : 'text-red-300'}`}>
            €{results.netMonthly.toFixed(2)}
          </div>
          <div className="text-purple-100">
            That's <strong className="text-yellow-300">€{results.netYearly.toFixed(2)}</strong> per year!
          </div>
        </div>
      </div>
    </div>
  );
}
