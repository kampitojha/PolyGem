import React, { useState } from 'react';
import { Tab } from './types';
import { SvgGenerator } from './components/SvgGenerator';
import { Tetris3D } from './components/Tetris3D';
import { Dashboard } from './components/Dashboard';
import { Layout, PenTool, Gamepad2, BarChart3, Menu, X } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.SVG_GEN);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: Tab.SVG_GEN, label: 'SVG Studio', icon: PenTool },
    { id: Tab.GAME, label: 'Block 3D', icon: Gamepad2 },
    { id: Tab.DASHBOARD, label: 'Analytics', icon: BarChart3 },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case Tab.SVG_GEN:
        return <SvgGenerator />;
      case Tab.GAME:
        return <Tetris3D />;
      case Tab.DASHBOARD:
        return <Dashboard />;
      default:
        return <SvgGenerator />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-indigo-900 text-white flex items-center justify-between px-4 z-50 shadow-md">
         <div className="flex items-center gap-2 font-bold text-lg">
            <Layout className="w-6 h-6 text-indigo-300" />
            <span>PolyGen</span>
         </div>
         <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
            {isMobileMenuOpen ? <X /> : <Menu />}
         </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-indigo-900 text-white transform transition-transform duration-300 ease-in-out shadow-xl
        md:translate-x-0 md:static md:shadow-none
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          {/* Logo Area */}
          <div className="h-20 flex items-center px-6 border-b border-indigo-800">
            <Layout className="w-8 h-8 text-indigo-400 mr-3" />
            <div>
               <h1 className="text-xl font-bold tracking-tight">PolyGen</h1>
               <p className="text-xs text-indigo-300">Creative Suite</p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 py-6 px-3 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`
                    w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'bg-indigo-700 text-white shadow-lg shadow-indigo-900/20' 
                      : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'}
                  `}
                >
                  <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : 'text-indigo-400'}`} />
                  <span className="font-medium">{item.label}</span>
                  {isActive && <span className="ml-auto w-1.5 h-1.5 bg-indigo-300 rounded-full shadow-[0_0_8px_rgba(165,180,252,0.8)]" />}
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-indigo-800">
             <div className="text-xs text-indigo-400 text-center">
               Powered by Gemini 2.5 Flash
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative min-w-0 overflow-hidden pt-16 md:pt-0">
        {/* Desktop Header (Visual only) */}
        <header className="hidden md:flex h-16 bg-white border-b border-gray-200 items-center justify-between px-8 shadow-sm z-10">
           <h2 className="text-xl font-semibold text-gray-800">
             {navItems.find(i => i.id === activeTab)?.label}
           </h2>
           <div className="flex items-center gap-4">
             <div className="text-sm text-gray-500">v1.0.0</div>
             <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold border border-indigo-200">
               AI
             </div>
           </div>
        </header>

        {/* Tab Content Container */}
        <div className="flex-1 overflow-auto p-0 md:p-0 bg-gray-50 scroll-smooth">
          {renderContent()}
        </div>
      </main>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
