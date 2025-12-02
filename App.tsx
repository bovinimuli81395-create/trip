import React, { useState } from 'react';
import { Calendar, Map, Plus, CheckSquare } from 'lucide-react';
import TimelineItem from './components/TimelineItem';
import { DayPlan, TravelItem } from './types';

// --- Initial Data Loaded from User Images ---
const INITIAL_PLAN: DayPlan[] = [
  {
    id: 'pre-trip',
    date: '出行准备',
    weekday: 'Checklist',
    items: [
      {
        id: 'pre-1',
        time: '待办',
        title: '预订酒店',
        type: 'hotel',
        description: '建议入住同一家酒店 (3晚)。第一晚酒店待议。',
        tips: ['比价不同平台', '确认入住时间']
      },
      {
        id: 'pre-2',
        time: '待办',
        title: '购买往返车票',
        type: 'transport',
        description: '高铁或机票',
      }
    ]
  },
  {
    id: 'day-1',
    date: '12月21日',
    weekday: '周六',
    items: [
      {
        id: '1-2',
        time: 'Daytime',
        title: '太仓阿尔卑斯雪世界',
        type: 'activity',
        description: '滑雪行程。',
        address: '太仓阿尔卑斯国际度假区',
        tips: [
          '高铁：到【太仓南站】下车，距离雪场仅1km，步行或打车极近',
          '雪票：双人大概 ¥600',
          '行程：滑完雪后直接返回上海市区酒店'
        ],
        cost: '¥600 (2人)'
      }
    ]
  },
  {
    id: 'day-2',
    date: '12月22日',
    weekday: '周日',
    items: [
      {
        id: '2-1',
        time: 'Daytime',
        title: '电影：疯狂动物城2',
        type: 'activity',
        description: '周日放松行程，看电影《疯狂动物城2》。下午安排 KTV 唱歌。',
        locationName: '市区影院 (待定)'
      },
      {
        id: '2-2',
        time: 'Dinner',
        title: '我家餐厅',
        type: 'food',
        description: '上海本帮菜。',
        address: '上海市静安区华山路229弄7号',
        tips: [
          '交通：静安寺地铁站11号口出，步行140米',
          '建议提前取号或确认排队情况'
        ]
      }
    ]
  },
  {
    id: 'day-3',
    date: '12月23日',
    weekday: '周一',
    items: [
      {
        id: '3-1',
        time: 'Daytime',
        title: 'Citywalk / 自由活动',
        type: 'activity',
        description: '白天行程待定，可以在市区周边逛逛。',
      },
      {
        id: '3-2',
        time: 'Dinner',
        title: '兰心餐厅 (进贤路店)',
        type: 'food',
        description: '米其林一星本帮菜，口味偏甜。只推荐进贤路这家老店。',
        address: '进贤路130号',
        tips: [
          '营业时间：11:00-14:00 (13:30截单) / 17:00-21:00 (21:00截单)',
          '避雷：工作日18:30前去基本不排队，翻台快',
          '停车：无免费停车，路边贴条。建议停【花园饭店】 (20元/时, 步行5min)',
          '菜品：推荐【干烧鲳鱼】。口感偏甜，不建议点太多荤菜',
          '注意：只收现金 (最好备好)，装修较老'
        ]
      },
      {
        id: '3-3',
        time: 'Evening',
        title: '外滩源德国圣诞集市',
        type: 'activity',
        description: '圆明园路步行街，拍照出片。',
        address: '上海市黄浦区圆明园路步行街',
        warning: '严重警告：资料显示该集市【周一/周二休息】！今天是周一，请务必核实或调整至周日前往！',
        cost: '¥30/人 (预售)',
        tips: [
          '入口：北京东路圆明园路路口',
          '时间：周三-周五 15-22点 / 周六日 12-22点 (周一二闭园)',
          '亮点：晚上19点后有圣诞树人工降雪',
          '美食：热红酒、德国香肠、超大棉花糖',
          '交通：地铁2号线南京东路站 / 12号线天潼路站'
        ]
      }
    ]
  }
];

const App: React.FC = () => {
  const [days, setDays] = useState<DayPlan[]>(INITIAL_PLAN);

  const handleUpdateItem = (dayId: string, updatedItem: TravelItem) => {
    setDays(prevDays => prevDays.map(day => {
      if (day.id !== dayId) return day;
      return {
        ...day,
        items: day.items.map(item => item.id === updatedItem.id ? updatedItem : item)
      };
    }));
  };

  const handleAddItem = (dayId: string) => {
    // Generate a unique ID to avoid collisions
    const uniqueId = `${dayId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const newItem: TravelItem = {
      id: uniqueId,
      time: '待定',
      title: '新行程',
      type: 'activity',
      description: '点击编辑添加详细信息',
      tips: [],
    };

    setDays(prevDays => prevDays.map(day => {
      if (day.id !== dayId) return day;
      return {
        ...day,
        items: [...day.items, newItem]
      };
    }));
  };

  const handleDeleteItem = (dayId: string, itemId: string) => {
    // Check if it's a fresh new item to skip confirmation
    const day = days.find(d => d.id === dayId);
    const item = day?.items.find(i => i.id === itemId);
    
    if (item?.title === '新行程') {
       // Delete immediately without confirm for empty new items
       setDays(prevDays => prevDays.map(d => {
        if (d.id !== dayId) return d;
        return {
          ...d,
          items: d.items.filter(i => i.id !== itemId)
        };
      }));
      return;
    }

    if (window.confirm('确定要删除这个行程吗？')) {
      setDays(prevDays => prevDays.map(day => {
        if (day.id !== dayId) return day;
        return {
          ...day,
          items: day.items.filter(item => item.id !== itemId)
        };
      }));
    }
  };

  return (
    <div className="min-h-screen pb-24 max-w-lg mx-auto bg-secondary shadow-2xl relative overflow-hidden font-sans">
      
      {/* Header Image/Banner */}
      <div className="relative h-64 overflow-hidden group">
        <img 
          src="https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?q=80&w=2070&auto=format&fit=crop" 
          alt="Shanghai Winter" 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10"></div>
        
        {/* Text Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10 flex flex-col justify-end h-full">
          <p className="text-sm font-bold tracking-[0.2em] uppercase text-rose-200 mb-3 opacity-90">
            Dec 21 - 24, 2025
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight mb-4 leading-tight drop-shadow-md">
            Shanghai<br/>Winter Trip
          </h1>
          
          <div className="flex items-center gap-3 text-xs font-semibold tracking-wide">
             <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full">
               <Calendar size={13} className="text-rose-200"/> 
               <span>4 Days</span>
             </div>
             <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full">
               <Map size={13} className="text-rose-200"/> 
               <span>Shanghai</span>
             </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-5 pt-6 relative z-10 bg-secondary rounded-t-3xl -mt-6 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
        {days.map((day, index) => (
            <div key={day.id} className="mb-10 animate-in slide-in-from-bottom duration-500" style={{animationDelay: `${index * 100}ms`}}>
              {/* Day Header */}
              <div className="flex items-center justify-between mb-5 pl-1 sticky top-0 backdrop-blur-sm z-20 py-2 bg-secondary/95">
                <div>
                  {day.id === 'pre-trip' ? (
                     <h2 className="text-xl font-bold flex items-center gap-2 text-primary">
                        <CheckSquare size={20} />
                        {day.date}
                     </h2>
                  ) : (
                    <h2 className="text-2xl font-bold flex items-center gap-3 text-ink">
                      {day.date} 
                      <span className="text-xs font-bold text-primary bg-rose-50 border border-rose-100 px-3 py-1 rounded-full tracking-wide shadow-sm">{day.weekday}</span>
                    </h2>
                  )}
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-0">
                {day.items.map(item => (
                  <TimelineItem 
                    key={item.id} 
                    item={item} 
                    onUpdate={(updated) => handleUpdateItem(day.id, updated)}
                    onDelete={() => handleDeleteItem(day.id, item.id)}
                  />
                ))}
                
                {/* Add Item Button */}
                <div className="pl-8 pt-4">
                  <button 
                    onClick={() => handleAddItem(day.id)}
                    className="group flex items-center gap-2 text-subtle hover:text-primary text-sm font-medium transition-all border border-dashed border-stone-300 rounded-xl px-4 py-3 w-full justify-center hover:bg-white hover:border-primary/50 hover:shadow-sm active:scale-95"
                  >
                      <Plus size={16} className="group-hover:scale-110 transition-transform" /> 
                      添加新{day.id === 'pre-trip' ? '待办' : '行程'}
                  </button>
                </div>
              </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default App;