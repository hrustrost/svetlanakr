
import React from 'react';

interface NavbarProps {
  isAdmin: boolean;
  onToggleAdmin: () => void;
  onScrollTo: (section: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ isAdmin, onToggleAdmin, onScrollTo }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          <div className="flex items-center space-x-4 cursor-pointer group" onClick={() => onScrollTo('hero')}>
            <div className="bg-slate-950 text-amber-400 w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg transition-transform group-hover:scale-110">
              С
            </div>
            <div className="flex flex-col">
              <span className="font-black text-sm tracking-tighter text-slate-950 uppercase">kruchina svetlana online</span>
              <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Teacher of the Year 2024</span>
            </div>
          </div>
          
          <div className="hidden md:flex space-x-12">
            <button onClick={() => onScrollTo('about')} className="text-xs font-black text-slate-500 hover:text-slate-950 transition-colors uppercase tracking-widest">Портфолио</button>
            <button onClick={() => onScrollTo('projects')} className="text-xs font-black text-slate-500 hover:text-slate-950 transition-colors uppercase tracking-widest">Проекты</button>
            <button onClick={() => onScrollTo('materials')} className="text-xs font-black text-slate-500 hover:text-slate-950 transition-colors uppercase tracking-widest">Методики</button>
          </div>

          <div className="flex items-center space-x-6">
            <button
              onClick={onToggleAdmin}
              className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl ${
                isAdmin 
                ? 'bg-rose-600 text-white hover:bg-rose-700' 
                : 'bg-slate-950 text-white hover:bg-slate-800'
              }`}
            >
              {isAdmin ? 'Выход' : 'Личный кабинет'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
