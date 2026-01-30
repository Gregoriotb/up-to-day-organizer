import { useState, useRef, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import LeftPanel from './panels/LeftPanel';
import RightPanel from './panels/RightPanel';
import TabSystem from './TabSystem';

/**
 * Componente principal del Dashboard
 * Maneja la vista principal de la aplicación con paneles colapsables y sistema de pestañas
 */
const Dashboard = () => {
  const { user } = useAuth();

  // Estados para controlar la visibilidad de los paneles
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [fullscreenMode, setFullscreenMode] = useState(false);

  // Estado para las pestañas abiertas (cargar desde localStorage)
  const [openTabs, setOpenTabs] = useState(() => {
    const saved = localStorage.getItem('dashboardTabs');
    if (saved) {
      try {
        const tabs = JSON.parse(saved);
        return tabs.length > 0 ? tabs : [{ id: 'home', title: 'Inicio', component: 'Home' }];
      } catch (error) {
        console.error('Error al cargar pestañas:', error);
      }
    }
    return [{ id: 'home', title: 'Inicio', component: 'Home' }];
  });

  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('dashboardActiveTab') || 'home';
  });

  // Estados para modal de confirmación y doble click
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const clickTimeoutRef = useRef(null);

  /**
   * Guardar estado de pestañas en localStorage cuando cambien
   */
  useEffect(() => {
    localStorage.setItem('dashboardTabs', JSON.stringify(openTabs));
  }, [openTabs]);

  /**
   * Guardar pestaña activa en localStorage cuando cambie
   */
  useEffect(() => {
    localStorage.setItem('dashboardActiveTab', activeTab);
  }, [activeTab]);

  /**
   * Alterna la visibilidad del panel izquierdo
   */
  const toggleLeftPanel = () => {
    setLeftPanelOpen(!leftPanelOpen);
    if (fullscreenMode) setFullscreenMode(false);
  };

  /**
   * Alterna la visibilidad del panel derecho
   */
  const toggleRightPanel = () => {
    setRightPanelOpen(!rightPanelOpen);
    if (fullscreenMode) setFullscreenMode(false);
  };

  /**
   * Alterna el modo pantalla completa (oculta ambos paneles)
   */
  const toggleFullscreen = () => {
    const newFullscreenState = !fullscreenMode;
    setFullscreenMode(newFullscreenState);

    if (newFullscreenState) {
      setLeftPanelOpen(false);
      setRightPanelOpen(false);
    } else {
      setLeftPanelOpen(true);
      setRightPanelOpen(true);
    }
  };

  /**
   * Abre una nueva pestaña o activa una existente
   * @param {Object} tab - Datos de la pestaña a abrir
   */
  const openTab = (tab) => {
    const existingTab = openTabs.find(t => t.id === tab.id);

    if (existingTab) {
      // Si la pestaña ya existe, solo la activa
      setActiveTab(tab.id);
    } else {
      // Si no existe, la crea y la activa
      setOpenTabs([...openTabs, tab]);
      setActiveTab(tab.id);
    }
  };

  /**
   * Cierra una pestaña
   * @param {string} tabId - ID de la pestaña a cerrar
   */
  const closeTab = (tabId) => {
    const newTabs = openTabs.filter(t => t.id !== tabId);
    setOpenTabs(newTabs);

    // Si se cierra la pestaña activa, activar otra
    if (activeTab === tabId && newTabs.length > 0) {
      setActiveTab(newTabs[newTabs.length - 1].id);
    }
  };

  /**
   * Maneja el click en el logo: 1 click = ir a inicio, 2 clicks = pantalla completa
   */
  const handleLogoClick = () => {
    if (clickTimeoutRef.current) {
      // Es un doble click
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;

      // Mostrar confirmación antes de cambiar a pantalla completa
      if (openTabs.length > 1 || activeTab !== 'home') {
        setShowConfirmModal(true);
      } else {
        toggleFullscreen();
      }
    } else {
      // Es un click simple
      clickTimeoutRef.current = setTimeout(() => {
        clickTimeoutRef.current = null;
        goToHome();
      }, 250);
    }
  };

  /**
   * Va a la vista de inicio y limpia todas las pestañas excepto Home
   */
  const goToHome = () => {
    setOpenTabs([{ id: 'home', title: 'Inicio', component: 'Home' }]);
    setActiveTab('home');
  };

  /**
   * Confirma y ejecuta la acción de pantalla completa
   */
  const confirmFullscreen = (saveProgress) => {
    if (!saveProgress) {
      // Si no guarda progreso, limpiar pestañas
      goToHome();
    }
    toggleFullscreen();
    setShowConfirmModal(false);
  };

  return (
    <div className="h-screen flex flex-col bg-neutral-100 dark:bg-darkTheme-bg overflow-hidden transition-colors duration-200">

      {/* Barra de navegación superior transparente */}
      <nav className="bg-white/80 dark:bg-darkTheme-card/80 backdrop-blur-sm border-b border-neutral-200 dark:border-darkTheme-border px-6 py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">

        {/* Izquierda: Miniatura de foto de perfil - Toggle panel izquierdo */}
        <button
          onClick={toggleLeftPanel}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200 group"
          title={leftPanelOpen ? 'Ocultar panel de perfil' : 'Mostrar panel de perfil'}
        >
          <div className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all duration-200 ${
            leftPanelOpen
              ? 'border-primary shadow-md shadow-primary/30'
              : 'border-neutral-300 dark:border-darkTheme-border hover:border-primary dark:hover:border-primary'
          }`}>
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt={user?.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-bold">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
            )}
          </div>
        </button>

        {/* Centro: Logo con funcionalidad - 1 click = inicio, 2 clicks = pantalla completa */}
        <button
          onClick={handleLogoClick}
          className="absolute left-1/2 transform -translate-x-1/2 hover:scale-105 transition-transform duration-200 focus:outline-none outline-none p-2"
          title="Click: Ir a inicio | Doble click: Pantalla completa"
        >
          <img
            src="/assets/logo.png"
            alt="UP TO DAY"
            className="h-14 select-none"
            draggable="false"
          />
        </button>

        {/* Derecha: Botón libro - Toggle panel de herramientas */}
        <button
          onClick={toggleRightPanel}
          className={`p-2.5 rounded-lg transition-all duration-200 ${
            rightPanelOpen
              ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md'
              : 'bg-neutral-100 dark:bg-darkTheme-card text-neutral-600 dark:text-darkTheme-text hover:bg-neutral-200 dark:hover:bg-darkTheme-bg border border-neutral-200 dark:border-darkTheme-border'
          }`}
          title={rightPanelOpen ? 'Ocultar herramientas' : 'Mostrar herramientas'}
        >
          <BookOpen size={22} />
        </button>
      </nav>

      {/* Modal de confirmación para doble click */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-[100] backdrop-blur-sm">
          <div className="bg-white dark:bg-darkTheme-card rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 border border-neutral-200 dark:border-darkTheme-border">
            <h3 className="text-xl font-bold text-primary-dark dark:text-primary-light mb-3">
              Modo Pantalla Completa
            </h3>
            <p className="text-neutral-600 dark:text-darkTheme-text mb-6">
              ¿Deseas guardar el progreso de las pestañas abiertas antes de continuar?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => confirmFullscreen(true)}
                className="flex-1 bg-gradient-to-r from-primary to-secondary text-white px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity font-medium"
              >
                Guardar y Continuar
              </button>
              <button
                onClick={() => confirmFullscreen(false)}
                className="flex-1 bg-neutral-100 dark:bg-darkTheme-bg text-neutral-700 dark:text-darkTheme-text px-4 py-2.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-darkTheme-card transition-colors border border-neutral-200 dark:border-darkTheme-border font-medium"
              >
                No Guardar
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2.5 rounded-lg text-neutral-500 dark:text-darkTheme-muted hover:bg-neutral-100 dark:hover:bg-darkTheme-bg transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contenedor principal con paneles */}
      <div className="flex flex-1 overflow-hidden">

        {/* Panel izquierdo - Perfil y proyectos */}
        <div
          className={`transition-all duration-300 ease-in-out ${
            leftPanelOpen ? 'w-80' : 'w-0'
          } overflow-hidden`}
        >
          <LeftPanel onOpenTab={openTab} />
        </div>

        {/* Área de contenido principal */}
        <main className="flex-1 overflow-hidden flex flex-col">
          {/* Sistema de pestañas */}
          <TabSystem
            tabs={openTabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onTabClose={closeTab}
          />
        </main>

        {/* Panel derecho - Herramientas */}
        <div
          className={`transition-all duration-300 ease-in-out ${
            rightPanelOpen ? 'w-96' : 'w-0'
          } overflow-hidden`}
        >
          <RightPanel onOpenTab={openTab} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
