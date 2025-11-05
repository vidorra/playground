'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Calculator from '@/components/Calculator';
import HeatMapLegend from '@/components/HeatMapLegend';

// Dynamically import map to avoid SSR issues
const DynamicMap = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => <div className="h-[600px] bg-gray-200 animate-pulse rounded-lg" />,
});

export default function Home() {
  const [distance, setDistance] = useState(30);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            🇩🇪 vs 🇳🇱 Grocery Savings Calculator
          </h1>
          <p className="text-xl sm:text-2xl text-blue-100 mb-6">
            Where the drive pays off
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-3xl">
            <p className="text-lg leading-relaxed">
              <strong className="text-yellow-300">Save €55-€80</strong> on groceries by shopping in Germany!
              A basket of drugstore items costs <strong>€85 more</strong> at Kruidvat (NL) than DM (DE).
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Heat Map Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left: Legend and Info */}
            <div className="lg:col-span-1 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  💰 Savings by Region
                </h2>
                <p className="text-gray-600 mb-6">
                  The map shows potential monthly savings based on your location in the Netherlands.
                </p>
              </div>

              <HeatMapLegend />

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="text-sm text-gray-700">
                  <strong className="text-blue-700">💡 Tip:</strong> Regions closer to the German border save more due to lower travel costs.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg text-xs text-gray-600">
                <p className="font-semibold mb-2">Assumptions:</p>
                <ul className="space-y-1">
                  <li>• Fuel: €2.10/L</li>
                  <li>• Consumption: 6.5 L/100km</li>
                  <li>• Average speed: 80 km/h</li>
                  <li>• Nearest DM: ~10km in DE</li>
                </ul>
                <p className="mt-2 italic">Source: Kassa (2025)</p>
              </div>
            </div>

            {/* Right: Map */}
            <div className="lg:col-span-3">
              <div className="relative">
                <DynamicMap
                  distance={distance}
                  onDistanceChange={setDistance}
                  onRegionSelect={setSelectedRegion}
                />
                {selectedRegion && (
                  <div className="absolute top-4 right-4 bg-white shadow-lg rounded-lg p-4 max-w-xs z-[1000]">
                    <h3 className="font-bold text-lg mb-2">{selectedRegion}</h3>
                    <p className="text-sm text-gray-600">
                      Click a destination below to calculate exact savings!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Calculator Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            🧮 Calculate Your Exact Savings
          </h2>
          <Calculator initialDistance={distance} />
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg">
            <div className="text-4xl mb-3">🛒</div>
            <h3 className="text-xl font-bold mb-2">20-30% Cheaper</h3>
            <p className="text-green-100">
              Groceries in Germany are significantly cheaper than in the Netherlands
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
            <div className="text-4xl mb-3">⛽</div>
            <h3 className="text-xl font-bold mb-2">€0.10/L Cheaper</h3>
            <p className="text-blue-100">
              Fuel prices are lower in Germany - fill up your tank while shopping!
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
            <div className="text-4xl mb-3">💶</div>
            <h3 className="text-xl font-bold mb-2">€800+ Yearly</h3>
            <p className="text-purple-100">
              Average Dutch families near the border can save over €800 per year
            </p>
          </div>
        </div>

        {/* Popular Stores */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 sm:p-8 mt-8 border border-orange-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            🏪 Popular German Stores
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['ALDI', 'Lidl', 'Kaufland', 'DM Drogerie', 'Rossmann', 'REWE', 'Netto', 'Penny'].map((store) => (
              <div key={store} className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow">
                <p className="font-semibold text-gray-800">{store}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-center text-sm">
            💡 This calculator helps Dutch residents determine if cross-border shopping in Germany is worth it.
            Prices and distances are approximate.
          </p>
        </div>
      </footer>
    </main>
  );
}
