import { createContext, useContext, useState, useEffect } from 'react';

/**
 * Contexto de autenticación
 * Maneja el estado global de autenticación del usuario
 */
const AuthContext = createContext(null);

/**
 * Hook personalizado para usar el contexto de autenticación
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

/**
 * Proveedor del contexto de autenticación
 * Envuelve la aplicación y proporciona funciones de autenticación
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Inicializa el estado de autenticación al cargar la aplicación
   * Verifica si hay una sesión guardada en localStorage
   */
  useEffect(() => {
    const initAuth = () => {
      try {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Error al cargar sesión:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Función de login tradicional
   * @param {string} username - Nombre de usuario
   * @param {string} password - Contraseña
   */
  const login = async (username, password) => {
    try {
      // Simular llamada a API
      // En producción, esto debería hacer una petición al backend
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Obtener usuarios registrados del localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');

      // Buscar usuario
      const foundUser = users.find(
        u => u.username === username && u.password === password
      );

      if (!foundUser) {
        throw new Error('Usuario o contraseña incorrectos');
      }

      // Crear objeto de usuario sin la contraseña
      const { password: _, ...userWithoutPassword } = foundUser;

      // Guardar sesión
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));

      return userWithoutPassword;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Función de registro de usuario
   * @param {Object} userData - Datos del usuario a registrar
   */
  const register = async (userData) => {
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Obtener usuarios existentes
      const users = JSON.parse(localStorage.getItem('users') || '[]');

      // Verificar si el usuario ya existe
      const userExists = users.some(
        u => u.username === userData.username || u.email === userData.email
      );

      if (userExists) {
        throw new Error('El usuario o email ya está registrado');
      }

      // Crear nuevo usuario con ID y fecha de creación
      const newUser = {
        id: Date.now().toString(),
        ...userData,
        createdAt: new Date().toISOString(),
        profileImage: null,
        projects: [],
        integrations: []
      };

      // Guardar usuario
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));

      return newUser;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Función de login con Google
   * Simula el flujo de OAuth con Google
   */
  const loginWithGoogle = async () => {
    try {
      // Simular autenticación con Google
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Crear usuario de prueba con datos de Google
      const googleUser = {
        id: 'google_' + Date.now(),
        username: 'usuario_google',
        email: 'usuario@gmail.com',
        firstName: 'Usuario',
        lastName: 'Google',
        profileImage: 'https://via.placeholder.com/150',
        provider: 'google',
        createdAt: new Date().toISOString(),
        projects: [],
        integrations: []
      };

      setUser(googleUser);
      localStorage.setItem('user', JSON.stringify(googleUser));

      return googleUser;
    } catch (error) {
      throw new Error('Error al iniciar sesión con Google');
    }
  };

  /**
   * Función de login con GitHub
   * Simula el flujo de OAuth con GitHub
   */
  const loginWithGithub = async () => {
    try {
      // Simular autenticación con GitHub
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Crear usuario de prueba con datos de GitHub
      const githubUser = {
        id: 'github_' + Date.now(),
        username: 'usuario_github',
        email: 'usuario@github.com',
        firstName: 'Usuario',
        lastName: 'GitHub',
        profileImage: 'https://via.placeholder.com/150',
        provider: 'github',
        createdAt: new Date().toISOString(),
        projects: [],
        integrations: []
      };

      setUser(githubUser);
      localStorage.setItem('user', JSON.stringify(githubUser));

      return githubUser;
    } catch (error) {
      throw new Error('Error al iniciar sesión con GitHub');
    }
  };

  /**
   * Función de logout
   * Limpia la sesión del usuario
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  /**
   * Función para actualizar datos del usuario
   * @param {Object} updates - Datos a actualizar
   */
  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // Valor del contexto que se proporciona a los componentes
  const value = {
    user,
    loading,
    login,
    register,
    loginWithGoogle,
    loginWithGithub,
    logout,
    updateUser,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
