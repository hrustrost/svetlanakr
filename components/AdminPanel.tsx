
/// <reference types="vite/client" />
import React, { useState } from 'react';
import { SiteContent, MediaItem } from '../types';

interface AdminPanelProps {
  content: SiteContent;
  onUpdate: (newContent: SiteContent) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ content, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'projects' | 'library' | 'settings' | 'deploy'>('profile');
  const [newUrl, setNewUrl] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [showExport, setShowExport] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onUpdate({
      ...content,
      profile: { ...content.profile, [name]: value }
    });
  };

  const updateAchievement = (index: number, value: string) => {
    const newAch = [...content.profile.achievements];
    newAch[index] = value;
    onUpdate({ ...content, profile: { ...content.profile, achievements: newAch } });
  };

  const addAchievement = () => {
    onUpdate({ ...content, profile: { ...content.profile, achievements: [...content.profile.achievements, 'Новая квалификация'] } });
  };

  const removeAchievement = (index: number) => {
    onUpdate({ ...content, profile: { ...content.profile, achievements: content.profile.achievements.filter((_, i) => i !== index) } });
  };

  const addExternalLink = () => {
    if (!newUrl) return;
    const type: 'image' | 'video' | 'document' = 
      newUrl.includes('youtube.com') || newUrl.includes('youtu.be') || newUrl.includes('.mp4') ? 'video' : 
      newUrl.match(/\.(jpeg|jpg|gif|png)$/) ? 'image' : 'document';

    const newItem: MediaItem = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      url: newUrl,
      title: newTitle || 'Материал по ссылке',
      description: 'Внешний ресурс',
      category: 'leadership'
    };
    onUpdate({ ...content, media: [newItem, ...content.media] });
    setNewUrl('');
    setNewTitle('');
  };

  const uploadFileToCloudinary = async (file?: File) => {
    if (!file) return;
    // Quick setup: hardcoded Cloudinary values (replace with env vars for production)
    const cloudName = 'dtgdv49fh';
    const uploadPreset = 'unsigned_preset';
    if (!cloudName || !uploadPreset) {
      alert('Cloudinary не настроен. Установите VITE_CLOUDINARY_CLOUD_NAME и VITE_CLOUDINARY_UPLOAD_PRESET.');
      return;
    }

    try {
      setUploading(true);
      const fd = new FormData();
      fd.append('file', file);
      fd.append('upload_preset', uploadPreset);

      // choose resource type for better behavior (images -> image/upload, video -> video/upload, others -> raw)
      const resourceType = file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'raw';
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
        method: 'POST',
        body: fd,
      });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      const returnedUrl = data.secure_url || data.url;
      const inferredType: MediaItem['type'] = resourceType === 'image' ? 'image' : resourceType === 'video' ? 'video' : 'document';
      const newItem: MediaItem = {
        id: Math.random().toString(36).substr(2, 9),
        type: inferredType,
        url: returnedUrl,
        title: newTitle || file.name,
        description: 'Загруженный файл',
        category: 'leadership'
      };
      onUpdate({ ...content, media: [newItem, ...content.media] });
      setNewTitle('');
      setNewUrl('');
    } catch (err) {
      console.error(err);
      alert('Ошибка при загрузке файла');
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'avatar' | 'hero') => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (target === 'avatar') onUpdate({ ...content, profile: { ...content.profile, avatarUrl: url } });
      if (target === 'hero') onUpdate({ ...content, heroImageUrl: url });
    }
  };

  const copyToClipboard = () => {
    const data = JSON.stringify(content, null, 2);
    const code = `export const INITIAL_CONTENT: SiteContent = ${data};`;
    navigator.clipboard.writeText(code);
    alert('Код для файла constants.ts скопирован! Замените содержимое файла constants.ts этим кодом на GitHub.');
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 flex flex-col md:flex-row min-h-[85vh]">
      <aside className="w-full md:w-80 bg-slate-900 text-white p-10 flex flex-col justify-between">
        <div className="space-y-12">
          <div>
            <h2 className="text-3xl font-black tracking-tighter italic">Cabinet</h2>
            <p className="text-amber-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Professional Control</p>
          </div>
          <nav className="space-y-3">
            {[
              { id: 'profile', label: 'Профиль', icon: '👤' },
              { id: 'library', label: 'Файлы', icon: '📂' },
              { id: 'deploy', label: 'Домен', icon: '🌐' },
              { id: 'settings', label: 'Стиль', icon: '⚙️' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-5 px-8 py-5 rounded-[1.5rem] text-[10px] font-black transition-all uppercase tracking-widest ${
                  activeTab === tab.id ? 'bg-amber-400 text-slate-900 shadow-xl scale-105' : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="text-xl">{tab.icon}</span> {tab.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="bg-white/5 p-6 rounded-3xl space-y-4 border border-white/5">
          <button onClick={() => setShowExport(!showExport)} className="w-full py-4 bg-indigo-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-400 transition-all">
            🚀 Опубликовать
          </button>
        </div>
      </aside>

      <main className="flex-1 p-16 overflow-y-auto bg-slate-50/50">
        {showExport && (
          <div className="mb-12 p-10 bg-indigo-900 text-white rounded-[3rem] shadow-2xl animate-in zoom-in-95 duration-300">
            <h3 className="text-2xl font-black mb-4">Фиксация изменений</h3>
            <p className="text-indigo-200 mb-8 font-medium">После того как вы настроили сайт, нажмите кнопку ниже, чтобы получить код для GitHub. Это сделает ваши правки доступными для всех.</p>
            <div className="flex gap-4">
              <button onClick={copyToClipboard} className="px-10 py-5 bg-amber-400 text-slate-900 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all">Скопировать код для constants.ts</button>
              <button onClick={() => setShowExport(false)} className="px-10 py-5 bg-white/10 rounded-2xl font-black uppercase text-[10px] tracking-widest">Закрыть</button>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="max-w-4xl space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
              <div className="space-y-2">
                <h3 className="text-4xl font-black tracking-tight text-slate-900">Ваш Профиль</h3>
                <p className="text-slate-400 font-medium">Обновите фото и данные для жюри.</p>
              </div>
              <label className="cursor-pointer relative group">
                <div className="w-40 h-40 rounded-[2.5rem] overflow-hidden border-8 border-slate-50 group-hover:border-amber-400 transition-all shadow-xl">
                  <img src={content.profile.avatarUrl} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-black uppercase tracking-widest">Заменить</div>
                </div>
                <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'avatar')} />
              </label>
            </div>
            <div className="grid gap-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ФИО</label>
                  <input name="name" value={content.profile.name} onChange={handleProfileChange} className="w-full px-8 py-5 bg-white rounded-3xl border-2 border-slate-100 font-bold focus:border-amber-400 outline-none shadow-sm" />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Статус</label>
                  <input name="title" value={content.profile.title} onChange={handleProfileChange} className="w-full px-8 py-5 bg-white rounded-3xl border-2 border-slate-100 font-bold focus:border-amber-400 outline-none shadow-sm" />
                </div>
              </div>
              <div className="space-y-6 bg-white p-12 rounded-[3.5rem] border border-slate-100">
                <div className="flex justify-between items-center border-b border-slate-50 pb-8 mb-8">
                  <h4 className="text-xl font-black uppercase">Регалии и достижения</h4>
                  <button onClick={addAchievement} className="px-6 py-3 bg-indigo-50 text-indigo-600 rounded-2xl text-[10px] font-black uppercase">+ Добавить</button>
                </div>
                {content.profile.achievements.map((ach, idx) => (
                  <div key={idx} className="flex gap-4">
                    <input value={ach} onChange={(e) => updateAchievement(idx, e.target.value)} className="flex-1 px-8 py-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-400 outline-none font-bold" />
                    <button onClick={() => removeAchievement(idx)} className="w-16 h-16 text-slate-300 hover:text-rose-500 transition-colors">🗑️</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'library' && (
          <div className="max-w-5xl space-y-16 animate-in fade-in duration-500">
            <div className="bg-indigo-600 p-12 rounded-[4rem] text-white shadow-2xl relative overflow-hidden">
               <div className="relative z-10 space-y-10">
                 <h3 className="text-4xl font-black tracking-tight">Библиотека ресурсов</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <input placeholder="Заголовок" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="px-8 py-5 bg-white/10 border-2 border-white/20 rounded-3xl outline-none placeholder:text-white/40 font-bold" />
                   <div className="flex gap-4 items-center">
                     <input placeholder="Ссылка (YouTube/Drive)" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} className="flex-1 px-8 py-5 bg-white/10 border-2 border-white/20 rounded-3xl outline-none placeholder:text-white/40 font-bold" />
                     <button onClick={addExternalLink} className="px-6 bg-amber-400 text-slate-900 rounded-3xl font-black uppercase text-[10px]">OK</button>
                     <label className="ml-2 px-4 py-3 bg-white/10 rounded-3xl cursor-pointer text-[10px] font-black">
                       {uploading ? 'Загрузка...' : 'Загрузить файл'}
                       <input type="file" className="hidden" onChange={(e) => uploadFileToCloudinary(e.target.files?.[0])} />
                     </label>
                   </div>
                 </div>
               </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {content.media.map(m => (
                <div key={m.id} className="p-8 bg-white rounded-[3rem] border border-slate-100 flex items-center gap-8 group shadow-sm hover:shadow-xl transition-all">
                  <div className="w-20 h-20 rounded-[1.5rem] overflow-hidden flex items-center justify-center">
                    {m.type === 'image' ? (
                      <img src={m.url} className="w-full h-full object-cover" alt={m.title} />
                    ) : m.type === 'video' ? (
                      <div className="w-full h-full bg-rose-50 text-rose-500 flex items-center justify-center text-2xl">🎥</div>
                    ) : (
                      <div className="w-full h-full bg-indigo-50 text-indigo-500 flex items-center justify-center text-sm font-black">{(m.title || m.url).split('.').pop()?.toUpperCase() || 'DOC'}</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-lg truncate">{m.title}</p>
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{m.type === 'video' ? 'Видео' : m.type === 'image' ? 'Изображение' : 'Файл'}</p>
                    <a href={m.url} target="_blank" rel="noreferrer" className="text-xs text-slate-500 mt-1 inline-block truncate">Открыть / Скачать</a>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm('Удалить этот файл из библиотеки?')) {
                        onUpdate({...content, media: content.media.filter(x => x.id !== m.id)});
                      }
                    }}
                    className="p-4 text-slate-200 hover:text-rose-500"
                  >🗑️</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'deploy' && (
          <div className="max-w-4xl space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <h3 className="text-4xl font-black text-slate-900">Настройка домена</h3>
             <div className="bg-white p-12 rounded-[4rem] border-2 border-amber-200 shadow-xl space-y-10">
                <p className="font-bold text-slate-600">В Namecheap, в разделе <span className="font-black text-slate-900">Advanced DNS</span>, добавьте эти записи:</p>
                <div className="grid gap-6">
                  <div className="p-8 bg-slate-50 rounded-3xl flex justify-between items-center border border-slate-200">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">A Record (@)</p>
                      <code className="text-xl font-black text-indigo-600">76.76.21.21</code>
                    </div>
                  </div>
                  <div className="p-8 bg-slate-50 rounded-3xl flex justify-between items-center border border-slate-200">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">CNAME (www)</p>
                      <code className="text-xl font-black text-indigo-600">cname.vercel-dns.com</code>
                    </div>
                  </div>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'settings' && (
           <div className="max-w-4xl space-y-16 animate-in fade-in duration-500">
             <h3 className="text-4xl font-black text-slate-900">Стиль сайта</h3>
             <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm space-y-12">
               <div className="space-y-6">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Главный фон (Hero Image)</label>
                  <div className="flex gap-6 items-center">
                    <img src={content.heroImageUrl} className="w-32 h-20 rounded-2xl object-cover border-2 border-slate-100" />
                    <label className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase cursor-pointer">Загрузить<input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'hero')} /></label>
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-10">
                 <div className="space-y-4">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email для связи</label>
                   <input value={content.settings.contactEmail} onChange={(e) => onUpdate({...content, settings: {...content.settings, contactEmail: e.target.value}})} className="w-full px-8 py-5 bg-slate-50 rounded-3xl font-bold" />
                 </div>
                 <div className="space-y-4">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Регион</label>
                   <input value={content.settings.region} onChange={(e) => onUpdate({...content, settings: {...content.settings, region: e.target.value}})} className="w-full px-8 py-5 bg-slate-50 rounded-3xl font-bold" />
                 </div>
               </div>
             </div>
           </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
