import { createContext, useContext, useState, useEffect } from 'react';
import API_URL from '../config/api';

/**
 * Contexto de autenticación con API real
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
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  /**
   * Inicializa el estado de autenticación al cargar la aplicación
   */
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('token');

      if (savedToken) {
        try {
          // Verificar token y obtener usuario
          const response = await fetch(`${API_URL}/auth/me`, {
            headers: {
              'Authorization': `Bearer ${savedToken}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data);
            setToken(savedToken);
          } else {
            // Token inválido, limpiar
            localStorage.removeItem('token');
            setToken(null);
          }
        } catch (error) {
          console.error('Error al verificar token:', error);
          localStorage.removeItem('token');
          setToken(null);
        }
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  /**
   * Función de login con API
   */
  const login = async (username, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }

      // Guardar token y usuario
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data);

      return data;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Función de registro con API
   */
  const register = async (userData) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al registrar usuario');
      }

      // No auto-login después del registro
      // El usuario debe hacer login manualmente
      return data;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Función de logout
   */
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  /**
   * Actualizar datos del usuario
   */
  const updateUser = async (updates) => {
    try {
      const response = await fetch(`${API_URL}/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al actualizar perfil');
      }

      setUser(data);
      return data;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Subir imagen de perfil
   */
  const uploadProfileImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${API_URL}/user/profile-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al subir imagen');
      }

      // Actualizar usuario con nueva imagen
      setUser(prev => ({ ...prev, profileImage: data.profileImage }));
      return data;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Subir imagen de portada
   */
  const uploadCoverImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${API_URL}/user/cover-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al subir imagen');
      }

      // Actualizar usuario con nueva imagen
      setUser(prev => ({ ...prev, coverImage: data.coverImage }));
      return data;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    loading,
    token,
    login,
    register,
    logout,
    updateUser,
    uploadProfileImage,
    uploadCoverImage,
    isAuthenticated: !!user && !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
