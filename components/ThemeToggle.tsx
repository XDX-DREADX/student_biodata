'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="p-2 rounded-full bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 backdrop-blur-md opacity-0 transition-opacity">
        <div className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 backdrop-blur-md hover:bg-black/10 dark:hover:bg-white/20 transition-all flex items-center justify-center text-foreground"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Moon className="w-5 h-5 text-indigo-400" />
      ) : (
        <Sun className="w-5 h-5 text-amber-500" />
      )}
    </button>
  );
}
