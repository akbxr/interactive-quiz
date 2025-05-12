'use client';

import { useQueryState, parseAsInteger } from 'nuqs';

export default function QueryDemo() {
  const [name, setName] = useQueryState('name', { defaultValue: '' });
  const [count, setCount] = useQueryState(
    'count',
    parseAsInteger.withDefault(0)
  );

  return (
    <div className="space-y-4 p-4 border rounded bg-white shadow">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value || null)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <div>
        <button
          onClick={() => setCount((c) => c + 1)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Count: {count}
        </button>
      </div>

      <div className="text-gray-800">
        <p>Hello, {name || 'anonymous visitor'}!</p>
        <p>You've clicked {count} times.</p>
      </div>

      <div>
        <button
          onClick={() => {
            setName(null);
            setCount(null);
          }}
          className="text-sm text-red-500 hover:underline"
        >
          Clear All
        </button>
      </div>
    </div>
  );
}