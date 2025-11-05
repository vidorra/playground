export default function HeatMapLegend() {
  const legendItems = [
    {
      color: 'bg-gradient-to-r from-orange-300 to-orange-400',
      label: 'Round trip < 1 hour',
      savings: '~€80',
      description: 'Very close to border',
    },
    {
      color: 'bg-gradient-to-r from-orange-400 to-red-500',
      label: 'Round trip 1-2 hours',
      savings: '~€70',
      description: 'Worth regular trips',
    },
    {
      color: 'bg-gradient-to-r from-red-500 to-red-700',
      label: 'Round trip 2-4 hours',
      savings: '~€55',
      description: 'For bulk shopping',
    },
  ];

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-900 mb-3">Monthly Savings:</h3>
      {legendItems.map((item, index) => (
        <div key={index} className="flex items-start gap-3">
          <div className={`w-12 h-12 rounded-lg shadow-sm ${item.color} flex-shrink-0`} />
          <div>
            <p className="font-semibold text-sm text-gray-900">{item.label}</p>
            <p className="text-xs text-gray-600">{item.description}</p>
            <p className="text-sm font-bold text-green-600 mt-1">{item.savings}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
