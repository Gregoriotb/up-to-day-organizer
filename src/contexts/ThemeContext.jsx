import { createContext, useContext, useState, useEffect } from 'react';

/**
 * Contexto de tema (claro/oscuro)
 * Maneja el estado global del tema de la aplicación
 */
const ThemeContext = createContext(null);

/**
 * Hook personalizado para usar el contexto de tema
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe ser usado dentro de un ThemeProvider');
  }
  return context;
};

/**
 * Proveedor del contexto de tema
 * Envuelve la aplicación y proporciona funciones de gestión de tema
 */
export const ThemeProvider = ({ children }) => {
  // Inicializar tema desde localStorage o por defecto 'light'
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  /**
   * Aplica el tema al documento y guarda en localStorage
   */
  useEffect(() => {
    // Añadir o quitar clase 'dark' del elemento html
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Guardar preferencia en localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  /**
   * Alterna entre tema claro y oscuro
   */
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  /**
   * Establece un tema específico
   * @param {string} newTheme - 'light' o 'dark'
   */
  const setSpecificTheme = (newTheme) => {
    if (newTheme === 'light' || newTheme === 'dark') {
      setTheme(newTheme);
    }
  };

  // Valor del contexto que se proporciona a los componentes
  const value = {
    theme,
    toggleTheme,
    setTheme: setSpecificTheme,
    isDark: theme === 'dark'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
