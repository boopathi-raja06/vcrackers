import React from 'react';

const dos = [
  { title: 'Instructions', desc: 'Display fireworks as per the instructions mentioned on the pack.', icon: '📦' },
  { title: 'Outdoor', desc: 'Use fireworks only outdoor.', icon: '🌳' },
  { title: 'Branded Fireworks', desc: 'Buy fireworks from authorized / reputed manufacturers only.', icon: '🏭' },
  { title: 'Distance', desc: 'Light only one firework at a time, by one person. Others should watch from a safe distance.', icon: '📏' },
  { title: 'Water', desc: 'Keep two buckets of water handy. In the event of fire or any mishap.', icon: '💧' },
];

const donts = [
  { title: "Don't make tricks", desc: 'Never make your own fireworks.', icon: '🚫' },
  { title: "Don't relight", desc: 'Never try to re-light or pick up fireworks that have not ignited fully.', icon: '🔥' },
  { title: "Don't carry it", desc: 'Never carry fireworks in your pockets.', icon: '👖' },
  { title: "Don't Touch it", desc: 'After fireworks display never pick up fireworks that may be left over, they still may be active.', icon: '✋' },
  { title: "Don't wear loose clothes", desc: 'Do not wear loose clothing while using fireworks.', icon: '👕' },
];

const Safety = () => (
  <div className="flex flex-col items-center px-4 py-8 bg-white min-h-screen">
    <h1 className="text-4xl font-bold text-red-700 mb-2">Veena Crackers</h1>
    <p className="text-lg text-gray-700 mb-6 max-w-2xl text-center">
      There are certain Do's & Don’ts to follow while purchasing, bursting and storing crackers. Thus, it is very important to follow the precautions while bursting crackers. A little negligence, ignorance and carelessness can cause a fatal injury.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mb-8">
      <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-green-700 mb-4">Do's</h2>
        <ul className="space-y-4">
          {dos.map((item) => (
            <li key={item.title} className="flex items-start gap-4">
              <span className="text-3xl">{item.icon}</span>
              <div>
                <span className="font-bold text-lg">{item.title}</span>
                <p className="text-gray-700">{item.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-red-700 mb-4">Don'ts</h2>
        <ul className="space-y-4">
          {donts.map((item) => (
            <li key={item.title} className="flex items-start gap-4">
              <span className="text-3xl">{item.icon}</span>
              <div>
                <span className="font-bold text-lg">{item.title}</span>
                <p className="text-gray-700">{item.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
    <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6 w-full max-w-2xl text-center text-yellow-800 font-semibold rounded-lg">
      Please follow our safety tips do's and dont's
    </div>
  </div>
);

export default Safety;
