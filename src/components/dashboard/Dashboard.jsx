import { useState } from 'react';
import { PanelLeftClose, PanelRightClose, Maximize2 } from 'lucide-react';
import LeftPanel from './panels/LeftPanel';
import RightPanel from './panels/RightPanel';
import TabSystem from './TabSystem';

/**
 * Componente principal del Dashboard
 * Maneja la vista principal de la aplicación con paneles colapsables y sistema de pestañas
 */
const Dashboard = () => {
  // Estados para controlar la visibilidad de los paneles
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [fullscreenMode, setFullscreenMode] = useState(false);

  // Estado para las pestañas abiertas
  const [openTabs, setOpenTabs] = useState([
    { id: 'home', title: 'Inicio', component: 'Home' }
  ]);
  const [activeTab, setActiveTab] = useState('home');

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

  return (
    <div className="h-screen flex flex-col bg-neutral-100 dark:bg-darkTheme-bg overflow-hidden transition-colors duration-200">

      {/* Barra de navegación superior transparente */}
      <nav className="bg-white/80 dark:bg-darkTheme-card/80 backdrop-blur-sm border-b border-neutral-200 dark:border-darkTheme-border px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        {/* Botones de control de paneles */}
        <div className="flex items-center gap-2">
          {/* Botón panel izquierdo */}
          <button
            onClick={toggleLeftPanel}
            className={`p-2 rounded-lg transition-all duration-200 ${
              leftPanelOpen
                ? 'bg-primary text-white'
                : 'bg-neutral-100 dark:bg-darkTheme-card text-neutral-600 dark:text-darkTheme-text hover:bg-neutral-200 dark:hover:bg-darkTheme-card/80'
            }`}
            title={leftPanelOpen ? 'Ocultar panel izquierdo' : 'Mostrar panel izquierdo'}
          >
            <PanelLeftClose size={20} />
          </button>

          {/* Logo central - Botón de pantalla completa */}
          <button
            onClick={toggleFullscreen}
            className={`p-2 rounded-lg transition-all duration-200 mx-2 ${
              fullscreenMode
                ? 'bg-secondary text-white'
                : 'bg-neutral-100 dark:bg-darkTheme-card text-neutral-600 dark:text-darkTheme-text hover:bg-neutral-200 dark:hover:bg-darkTheme-card/80'
            }`}
            title={fullscreenMode ? 'Salir de pantalla completa' : 'Modo pantalla completa'}
          >
            <Maximize2 size={20} />
          </button>

          {/* Botón panel derecho */}
          <button
            onClick={toggleRightPanel}
            className={`p-2 rounded-lg transition-all duration-200 ${
              rightPanelOpen
                ? 'bg-primary text-white'
                : 'bg-neutral-100 dark:bg-darkTheme-card text-neutral-600 dark:text-darkTheme-text hover:bg-neutral-200 dark:hover:bg-darkTheme-card/80'
            }`}
            title={rightPanelOpen ? 'Ocultar panel derecho' : 'Mostrar panel derecho'}
          >
            <PanelRightClose size={20} />
          </button>
        </div>

        {/* Logo central */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <img
            src="/assets/logo.png"
            alt="UP TO DAY"
            className="h-10"
          />
        </div>

        {/* Espacio para futuras opciones */}
        <div className="w-32"></div>
      </nav>

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
