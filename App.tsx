
import React, { useState, useEffect, useRef } from 'react';
import { SiteContent, ViewMode } from './types';
import { INITIAL_CONTENT, ADMIN_PASSWORD } from './constants';
import Navbar from './components/Navbar';
import AdminPanel from './components/AdminPanel';

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginPwd, setLoginPwd] = useState('');
  const [loginError, setLoginError] = useState('');
  const [content, setContent] = useState<SiteContent>(INITIAL_CONTENT);
  
  const heroRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const teachingRef = useRef<HTMLDivElement>(null);
  const materialsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('director_site_content');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setContent({ ...INITIAL_CONTENT, ...parsed });
      } catch (e) { console.error(e); }
    }
  }, []);

  const handleUpdateContent = (newContent: SiteContent) => {
    setContent(newContent);
    localStorage.setItem('director_site_content', JSON.stringify(newContent));
  };

  const scrollTo = (section: string) => {
    const refs: Record<string, React.RefObject<HTMLDivElement>> = {
      hero: heroRef,
      about: aboutRef,
      projects: projectsRef,
      teaching: teachingRef,
      materials: materialsRef,
    };
    refs[section]?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
  };

  const nameParts = content.profile.name.split(' ');
  const surname = nameParts[0] || '';
  const firstName = nameParts[1] || '';
  const patronymic = nameParts[2] || '';

  return (
    <div className="min-h-screen selection:bg-amber-400 selection:text-slate-950 bg-white text-slate-950">
      <Navbar 
        isAdmin={isAdmin} 
        onRequestAdmin={() => {
          if (isAdmin) {
            setIsAdmin(false);
          } else {
            setShowLogin(true);
          }
        }}
        onScrollTo={scrollTo} 
      />

      <main>
        {isAdmin ? (
          <div className="max-w-screen-2xl mx-auto p-4 md:p-12 animate-in slide-in-from-top-4 duration-500">
            <AdminPanel content={content} onUpdate={handleUpdateContent} />
          </div>
        ) : (
          <>
            {/* HERO SECTION */}
            <div ref={heroRef} className="relative min-h-screen sm:h-screen flex items-center overflow-hidden bg-slate-950">
              <div className="absolute inset-0 z-0">
                <img src={content.heroImageUrl} className="w-full h-full object-cover opacity-50 scale-105" alt="Hero" />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/40 to-slate-950"></div>
              </div>
              
              <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 lg:pt-36 flex flex-col items-center text-center text-white space-y-8 sm:space-y-12">
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                  <div className="inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                    <span className="px-6 sm:px-8 py-2 sm:py-3 bg-amber-400 text-slate-950 text-[10px] sm:text-xs font-black tracking-[0.3em] uppercase rounded-full shadow-2xl">
                      Teacher of the Year 2024
                    </span>
                    <span className="px-6 sm:px-8 py-2 sm:py-3 border-2 border-white/30 text-white text-[9px] sm:text-[10px] font-black tracking-[0.3em] uppercase rounded-full backdrop-blur-md">
                      Director Participant 2026
                    </span>
                  </div>
                  <h1 className="text-5xl sm:text-6xl lg:text-[10rem] font-black leading-[0.85] sm:leading-[0.8] tracking-tighter drop-shadow-2xl">
                    {surname} <br/>
                    <span className="text-amber-400">{firstName}</span> <br/>
                    <span className="text-2xl sm:text-3xl lg:text-7xl font-extralight text-slate-400 block mt-4 sm:mt-6 uppercase tracking-[0.3em]">{patronymic}</span>
                  </h1>
                  <p className="text-base sm:text-lg lg:text-2xl font-light text-slate-300 tracking-tight max-w-3xl mx-auto italic border-l-2 border-amber-400 pl-5 sm:pl-8 text-left py-4">
                    «{content.profile.philosophy}»
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-6 sm:pt-10 w-full sm:w-auto">
                  <button onClick={() => scrollTo('about')} className="w-full sm:w-auto px-10 sm:px-16 py-4 sm:py-6 bg-white text-slate-950 rounded-full font-black text-base sm:text-xl hover:scale-105 transition-all shadow-[0_20px_60px_-15px_rgba(255,255,255,0.4)]">
                    ПОРТФОЛИО
                  </button>
                  <button onClick={() => scrollTo('materials')} className="w-full sm:w-auto px-10 sm:px-16 py-4 sm:py-6 border-2 border-white/30 hover:bg-white/10 rounded-full font-black text-base sm:text-xl transition-all">
                    МАТЕРИАЛЫ
                  </button>
                </div>
              </div>
            </div>

            {/* ACHIEVEMENTS / QUALIFICATIONS */}
            <div ref={aboutRef} className="py-24 sm:py-32 lg:py-48 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-24 items-start">
                  <div className="lg:col-span-5 relative group lg:sticky top-32">
                    <div className="absolute -inset-4 bg-slate-950 rounded-[4rem] rotate-2 group-hover:rotate-0 transition-transform duration-700 shadow-2xl"></div>
                    <img src={content.profile.avatarUrl} className="relative z-10 rounded-[3.5rem] w-full aspect-[4/5] object-cover shadow-2xl" alt="Avatar" />
                    <div className="absolute -bottom-6 -right-6 sm:-bottom-8 sm:-right-8 bg-amber-400 text-slate-950 p-6 sm:p-10 rounded-[2.5rem] shadow-2xl z-20 border-8 border-white">
                      <p className="text-2xl sm:text-4xl font-black">2024</p>
                      <p className="text-[10px] font-black uppercase tracking-widest leading-none">Year of Triumph</p>
                    </div>
                  </div>
                  <div className="lg:col-span-7 space-y-10 sm:space-y-16 lg:space-y-20">
                    <div className="space-y-6">
                      <h2 className="text-3xl sm:text-4xl lg:text-6xl font-black text-slate-950 tracking-tighter leading-none text-balance">Квалификации и достижения</h2>
                      <div className="w-32 h-3 bg-amber-400 rounded-full"></div>
                    </div>
                    <p className="text-lg sm:text-xl lg:text-3xl text-slate-600 font-light leading-relaxed">{content.profile.bio}</p>
                    <div className="grid gap-4">
                       {content.profile.achievements.map((a, i) => (
                         <div key={i} className="flex gap-4 sm:gap-6 p-6 sm:p-10 bg-slate-50 rounded-[3rem] border border-slate-100 items-center hover:bg-slate-950 hover:text-white transition-all group cursor-default">
                           <span className="text-3xl group-hover:scale-125 transition-transform">⭐</span>
                           <p className="font-black text-sm uppercase tracking-wider">{a}</p>
                         </div>
                       ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RESOURCES / LIBRARY */}
            <div ref={materialsRef} className="py-24 sm:py-32 lg:py-48 bg-slate-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16 sm:space-y-24">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 sm:gap-10">
                   <div className="space-y-4">
                     <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black text-slate-950 tracking-tighter">Методический хаб</h2>
                     <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Knowledge Base for Educators</p>
                   </div>
                   <div className="bg-white p-3 rounded-full flex border border-slate-200 shadow-sm">
                     <button className="px-12 py-5 bg-slate-950 text-white rounded-full font-black text-[10px] uppercase tracking-widest shadow-2xl">База знаний</button>
                   </div>
                </div>

                <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12">
                  {content.media.map(item => {
                    const youtubeEmbed = item.type === 'video' ? getYouTubeEmbedUrl(item.url) : null;
                    
                    return (
                      <div key={item.id} className="bg-white rounded-[3rem] sm:rounded-[4rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group flex flex-col">
                        <div className="aspect-video bg-slate-100 relative group">
                          {youtubeEmbed ? (
                            <iframe 
                              src={youtubeEmbed} 
                              className="w-full h-full" 
                              title={item.title}
                              frameBorder="0" 
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                              allowFullScreen
                            ></iframe>
                          ) : item.type === 'image' ? (
                            <img src={item.url} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
                               <div className="w-24 h-24 bg-indigo-50 text-indigo-500 rounded-3xl flex items-center justify-center text-5xl">📄</div>
                               <p className="font-black text-[10px] uppercase tracking-widest text-slate-400">Документ/Презентация</p>
                            </div>
                          )}
                        </div>
                        <div className="p-6 sm:p-12 space-y-6 sm:space-y-8 flex-1 flex flex-col justify-between">
                          <div className="space-y-4">
                            <h4 className="text-2xl sm:text-3xl font-black tracking-tighter uppercase leading-none">{item.title}</h4>
                            <p className="text-slate-500 text-base sm:text-lg font-medium">{item.description}</p>
                          </div>
                          <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-6 font-black text-[11px] text-slate-950 border-b-4 border-amber-400 pb-3 hover:gap-10 transition-all uppercase tracking-widest w-fit">
                            {item.type === 'video' ? 'Смотреть на YouTube' : 'Открыть ресурс'} <span>→</span>
                          </a>
                        </div>
                      </div>
                    );
                  })}
                  
                  {content.media.length === 0 && (
                    <div className="col-span-full py-16 sm:py-32 text-center border-8 border-dashed border-slate-200 rounded-[4rem] sm:rounded-[5rem]">
                       <p className="text-slate-200 font-black text-2xl sm:text-4xl uppercase tracking-[0.2em]">Library is Empty</p>
                       <p className="text-slate-400 mt-4 font-bold uppercase tracking-widest text-xs sm:text-sm">Используйте Кабинет, чтобы добавить материалы</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <footer className="py-20 sm:py-32 lg:py-40 bg-slate-950 text-white border-t border-white/5">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center gap-12 sm:gap-20">
                 <div className="bg-amber-400 text-slate-950 w-24 h-24 sm:w-32 sm:h-32 rounded-[3rem] flex items-center justify-center font-black text-4xl sm:text-6xl shadow-[0_0_80px_rgba(251,191,36,0.2)]">С</div>
                 <div className="text-center space-y-8">
                    <h3 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tighter uppercase">{content.profile.name}</h3>
                    <div className="flex flex-wrap justify-center gap-6">
                      <span className="text-amber-400 font-black uppercase tracking-[0.4em] text-[10px] sm:text-xs">Teacher of the Year 2024</span>
                      <span className="text-white/30 font-black uppercase tracking-[0.4em] text-xs">•</span>
                      <span className="text-white/60 font-black uppercase tracking-[0.4em] text-[10px] sm:text-xs">{content.settings.region}</span>
                    </div>
                 </div>
                 <div className="flex flex-col md:flex-row gap-6 sm:gap-20 font-black text-[10px] sm:text-[11px] text-white/30 uppercase tracking-[0.4em] border-t border-white/5 pt-12 sm:pt-24 w-full justify-center text-center">
                    <a href={`mailto:${content.settings.contactEmail}`} className="hover:text-amber-400 transition-colors">Business Contact</a>
                    <a href="#" className="hover:text-amber-400 transition-colors">School Educational Hub</a>
                    <a href="#" className="hover:text-amber-400 transition-colors">Professional Blog</a>
                 </div>
                 <p className="text-white/10 font-black text-[8px] sm:text-[9px] uppercase tracking-[0.5em] text-center">© 2026 KRUCHINA SVETLANA • PORTFOLIO CORE</p>
              </div>
            </footer>
          </>
        )}

        {/* Login Modal (global) */}
        {showLogin && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 px-4">
            <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-black mb-4">Вход в личный кабинет</h3>
              <p className="text-sm text-slate-500 mb-4">Введите пароль для доступа к кабинету.</p>
              <input
                type="password"
                value={loginPwd}
                onChange={(e) => setLoginPwd(e.target.value)}
                className="w-full px-6 py-3 border rounded-2xl mb-4 outline-none"
                placeholder="Пароль"
              />
              {loginError && <p className="text-rose-600 mb-2 text-sm">{loginError}</p>}
              <div className="flex gap-4 justify-end">
                <button onClick={() => { setShowLogin(false); setLoginPwd(''); setLoginError(''); }} className="px-6 py-3 rounded-2xl border">Отмена</button>
                <button
                  onClick={() => {
                    if (loginPwd === ADMIN_PASSWORD) {
                      setIsAdmin(true);
                      setShowLogin(false);
                      setLoginPwd('');
                      setLoginError('');
                    } else {
                      setLoginError('Неправильный пароль');
                    }
                  }}
                  className="px-6 py-3 rounded-2xl bg-amber-400 text-slate-900 font-black"
                >Войти</button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default App;
