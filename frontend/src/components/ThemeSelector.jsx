import React from 'react';
import { useThemeStore } from '../store/useThemeStore';
import { PaletteIcon } from 'lucide-react';
import { THEMES } from '../constants';

const ThemeSelector = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="dropdown dropdown-end">
      {/* Dropdown Trigger */}
      <label tabIndex={0} className="btn btn-ghost btn-circle">
        <PaletteIcon className="size-5" />
      </label>

      {/* Dropdown Content */}
      <ul
        tabIndex={0}
        className="dropdown-content mt-2 p-2 shadow-xl bg-base-100 backdrop-blur-md rounded-xl w-60 border border-base-300 max-h-80 overflow-y-auto space-y-1"
      >
        {THEMES.map((themeOption) => (
          <li key={themeOption.name}>
            <button
              className={`w-full px-4 py-2 rounded-lg flex items-center gap-3 text-left text-sm transition-colors duration-150 ease-in-out ${
                theme === themeOption.name
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'hover:bg-base-300'
              }`}
              onClick={() => setTheme(themeOption.name)}
            >
              <PaletteIcon className="size-4" />
              <span>{themeOption.label}</span>
              <div className="ml-auto flex gap-1">
                {themeOption.colors.map((color, i) => (
                  <span
                    key={i}
                    className="size-2 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ThemeSelector;
