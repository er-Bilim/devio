export function StripSection() {

  
  
  const stripItems = [
    { title: 'направления открыты', count: 2 },
    { title: 'станций с материалами', count: 14 },
    { title: 'человек уже в пути', count: 1248 },
  ];

  return (
    <div className="border-t border-b border-line bg-panel-2">
      <div className="wrap grid grid-cols-3 gap-6 py-6.5">
        {stripItems.map((item, index) => (
          <div key={index} className="flex items-baseline gap-3 justify-center">
            <span className="font-mono text-[26px] text-mist">
              {item.count}
            </span>
            <span className="text-mist-soft text-[14px]">{item.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
