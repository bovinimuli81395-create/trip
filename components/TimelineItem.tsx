import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Copy, Utensils, Train, Bed, Info, AlertTriangle, Edit2, Check, X, Snowflake, Map as MapIcon, Trash2 } from 'lucide-react';
import { TravelItem, ItemType } from '../types';

interface Props {
  item: TravelItem;
  onUpdate: (updatedItem: TravelItem) => void;
  onDelete: () => void;
}

const TimelineItem: React.FC<Props> = ({ item, onUpdate, onDelete }) => {
  // Auto-edit if it's a new item (title is '新行程')
  const [isEditing, setIsEditing] = useState(item.title === '新行程');
  const [editedItem, setEditedItem] = useState(item);
  const [showToast, setShowToast] = useState(false);
  const [showMapOptions, setShowMapOptions] = useState(false);

  // Sync editedItem with item prop whenever the item changes (e.g., after save)
  useEffect(() => {
    setEditedItem(item);
  }, [item]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const openMap = (type: 'amap' | 'baidu') => {
    const address = item.address || item.title;
    const encodedQuery = encodeURIComponent(address);
    
    let url = '';
    
    if (type === 'amap') {
      url = `https://uri.amap.com/search?keyword=${encodedQuery}`;
    } else {
      url = `http://api.map.baidu.com/geocoder?address=${encodedQuery}&output=html&src=webapp.travel_app`;
    }
    
    window.open(url, '_blank');
    setShowMapOptions(false);
  };

  const handleSave = () => {
    onUpdate(editedItem);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedItem(item);
    setIsEditing(false);
  };
  
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };

  const handleTipsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    // Split by newline to create array
    const tipsArray = val.split('\n');
    setEditedItem({ ...editedItem, tips: tipsArray });
  };

  if (isEditing) {
    return (
      <div className="bg-white p-5 rounded-2xl shadow-lg border border-primary/10 mb-6 relative z-10 mx-2 animate-in fade-in zoom-in-95 duration-200">
        <div className="space-y-3">
          <div className="flex gap-3">
            <input
              autoFocus
              type="text"
              value={editedItem.time}
              onChange={(e) => setEditedItem({ ...editedItem, time: e.target.value })}
              className="w-1/3 p-2.5 border border-stone-200 rounded-lg text-sm bg-stone-50 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              placeholder="时间"
            />
            <input
              type="text"
              value={editedItem.title}
              onChange={(e) => setEditedItem({ ...editedItem, title: e.target.value })}
              className="w-2/3 p-2.5 border border-stone-200 rounded-lg font-bold text-stone-800 bg-stone-50 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              placeholder="标题"
            />
          </div>
          
          <textarea
            value={editedItem.description || ''}
            onChange={(e) => setEditedItem({ ...editedItem, description: e.target.value })}
            className="w-full p-2.5 border border-stone-200 rounded-lg text-sm bg-stone-50 focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
            rows={2}
            placeholder="描述"
          />
          
          <input
            type="text"
            value={editedItem.address || ''}
            onChange={(e) => setEditedItem({ ...editedItem, address: e.target.value })}
            className="w-full p-2.5 border border-stone-200 rounded-lg text-sm bg-stone-50 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            placeholder="地址 (用于导航)"
          />

          <div className="space-y-2 pt-2 border-t border-dashed border-stone-100">
            <div>
               <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1 block">警告信息 (红色高亮)</label>
               <input
                type="text"
                value={editedItem.warning || ''}
                onChange={(e) => setEditedItem({ ...editedItem, warning: e.target.value })}
                className="w-full p-2.5 border border-red-200 rounded-lg text-sm bg-red-50 text-red-800 placeholder-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
                placeholder="例如：周一闭馆"
              />
            </div>
            
            <div>
              <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1 block">攻略贴士 (每行一条)</label>
              <textarea
                value={editedItem.tips?.join('\n') || ''}
                onChange={handleTipsChange}
                className="w-full p-2.5 border border-orange-200 rounded-lg text-sm bg-orange-50/30 focus:border-orange-400 focus:ring-1 focus:ring-orange-400 outline-none resize-none"
                rows={4}
                placeholder="输入贴士..."
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <button 
              type="button"
              onClick={handleDeleteClick}
              className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors cursor-pointer active:scale-95"
              title="删除此项"
            >
              <Trash2 size={16} />
            </button>
            <div className="flex gap-3">
              <button onClick={handleCancel} className="px-4 py-2 text-stone-500 hover:bg-stone-100 rounded-lg text-sm font-medium transition-colors">
                取消
              </button>
              <button onClick={handleSave} className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-rose-600 transition-colors shadow-md shadow-rose-200">
                保存
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative pl-8 pb-8 border-l-[2px] border-stone-200 last:border-0 last:pb-0 group">
      {/* Timeline Dot */}
      <div className={`absolute -left-[9px] top-0 w-[18px] h-[18px] rounded-full border-[3px] border-white shadow-sm flex items-center justify-center transition-colors
        ${item.type === 'food' ? 'bg-orange-400' :
          item.type === 'activity' ? 'bg-primary' :
          item.type === 'transport' ? 'bg-blue-400' : 
          item.type === 'hotel' ? 'bg-indigo-400' : 'bg-stone-400'}`}>
      </div>

      <div className="bg-paper rounded-2xl shadow-sm border border-stone-100/50 overflow-hidden transition-all hover:shadow-md hover:border-stone-200">
        
        {/* Card Header */}
        <div className="p-4 flex justify-between items-start">
          <div className="flex-1 pr-2">
            <div className="flex items-center gap-2 mb-1.5">
               <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest bg-stone-100 px-1.5 py-0.5 rounded-sm">
                 {item.time}
               </span>
               {item.cost && (
                <span className="text-[10px] font-medium text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-sm">
                  {item.cost}
                </span>
               )}
            </div>
            
            <h3 className="text-[17px] font-bold text-stone-800 leading-snug mb-1.5">{item.title}</h3>
            
            {item.description && (
              <p className="text-sm text-stone-600 leading-relaxed">{item.description}</p>
            )}
          </div>
          <button 
            onClick={() => setIsEditing(true)} 
            className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity p-2 text-stone-300 hover:text-primary hover:bg-rose-50 rounded-lg"
            aria-label="Edit"
          >
            <Edit2 size={16} />
          </button>
        </div>

        {/* Location / Action Bar */}
        {(item.address || item.locationName) && (
          <div className="px-4 pb-4 pt-1 flex flex-col gap-3">
            <div className="flex items-start gap-2 text-sm text-stone-500">
              <MapPin size={15} className="shrink-0 text-primary mt-0.5" />
              <span className="leading-snug select-all">{item.address || item.locationName}</span>
            </div>
            
            {item.address && (
              <div className="flex gap-2 relative">
                <button 
                  onClick={() => handleCopy(item.address!)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 bg-white border border-stone-200 rounded-xl text-xs font-semibold text-stone-600 active:bg-stone-50 active:scale-[0.98] transition-all touch-manipulation shadow-sm"
                >
                  <Copy size={14} className={showToast ? 'text-green-500' : ''} /> 
                  {showToast ? '已复制' : '复制地址'}
                </button>
                
                <div className="flex-1 relative">
                  <button 
                    onClick={() => setShowMapOptions(!showMapOptions)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-primary text-white rounded-xl text-xs font-semibold active:bg-rose-600 active:scale-[0.98] transition-all touch-manipulation shadow-md shadow-rose-200"
                  >
                    <Navigation size={14} /> 
                    导航
                  </button>
                  
                  {/* Map Options Dropdown */}
                  {showMapOptions && (
                    <div className="absolute bottom-full mb-2 right-0 w-32 bg-white rounded-xl shadow-xl border border-stone-100 overflow-hidden z-20 animate-in slide-in-from-bottom-2 fade-in duration-200">
                      <button 
                        onClick={() => openMap('amap')}
                        className="w-full text-left px-4 py-3 text-xs font-medium text-stone-700 hover:bg-stone-50 border-b border-stone-50 flex items-center gap-2"
                      >
                         <MapIcon size={12} className="text-blue-500" /> 高德地图
                      </button>
                      <button 
                        onClick={() => openMap('baidu')}
                        className="w-full text-left px-4 py-3 text-xs font-medium text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                      >
                         <MapIcon size={12} className="text-red-500" /> 百度地图
                      </button>
                    </div>
                  )}
                  {/* Click outside closer */}
                  {showMapOptions && (
                    <div className="fixed inset-0 z-10" onClick={() => setShowMapOptions(false)}></div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Critical Warnings */}
        {item.warning && (
          <div className="px-4 py-3 bg-red-50 border-t border-red-100 flex gap-3 items-start animate-pulse">
            <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
            <p className="text-xs text-red-700 font-bold leading-relaxed">{item.warning}</p>
          </div>
        )}

        {/* Tips Section */}
        {item.tips && item.tips.length > 0 && item.tips.some(t => t.trim() !== '') && (
          <div className="px-4 py-3 bg-orange-50/40 border-t border-orange-100/50">
            <div className="flex items-center gap-1.5 mb-2 text-orange-800/70 text-xs font-bold uppercase tracking-wide">
              <Info size={12} />
              <span>攻略贴士</span>
            </div>
            <ul className="space-y-1.5">
              {item.tips.filter(t => t.trim() !== '').map((tip, idx) => (
                <li key={idx} className="text-[13px] text-stone-600 pl-3 relative leading-relaxed">
                  <span className="absolute left-0 top-1.5 w-1 h-1 rounded-full bg-orange-300"></span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelineItem;