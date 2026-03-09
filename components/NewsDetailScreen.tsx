
import React, { useState, useEffect } from 'react';
import { ScreenName } from '../types';
import {
  ArrowLeft,
  Share2,
  Calendar,
  Clock,
  ChevronRight,
  ExternalLink,
  FileText,
  Download,
  AlertCircle,
  Quote,
  Loader2,
  WifiOff,
  Image as ImageIcon,
  MapPin
} from 'lucide-react';

interface NewsDetailScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

// --- TYPES BASED ON SPEC ---
type BlockType = 'text' | 'image' | 'quote' | 'list' | 'separator' | 'header';

interface ContentBlock {
  type: BlockType;
  content?: string;      // for text, quote, header
  url?: string;          // for image
  caption?: string;      // for image
  items?: string[];      // for list
  author?: string;       // for quote
}

interface Attachment {
  id: number;
  type: 'pdf' | 'img' | 'doc';
  name: string;
  size: string;
  url: string;
}

interface CTA {
  label: string;
  type: 'internal' | 'external' | 'webview';
  action: string; // ScreenName or URL
}

interface NewsData {
  id: number;
  title: string;
  category: string;
  date: string;
  readTime: string;
  coverUrl?: string;
  content: ContentBlock[];
  attachments?: Attachment[];
  cta?: CTA;
}

const NewsDetailScreen: React.FC<NewsDetailScreenProps> = ({ onNavigate }) => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'deleted' | 'offline'>('loading');
  const [data, setData] = useState<NewsData | null>(null);

  // --- MOCK DATA FETCHING ---
  useEffect(() => {
    // Simulate API Call
    const fetchData = async () => {
      setStatus('loading');

      // Simulate network delay
      await new Promise(r => setTimeout(r, 800));

      // MOCK DATA RESPONSE
      const mockResponse: NewsData = {
        id: 99,
        title: 'Technogym Live: Massive Cardio Zone Update',
        category: 'Equipment',
        date: 'Sep 12',
        readTime: '3 min',
        coverUrl: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=2000&auto=format&fit=crop',
        content: [
          {
            type: 'text',
            content: 'We are happy to announce that a major update of the cardio zone has been completed in our club. The newest Technogym Excite Live Run treadmills are now available for you.'
          },
          {
            type: 'quote',
            content: 'Our goal is to provide clients with the best fitness experience using cutting-edge technologies. The new treadmills are simply cosmic!',
            author: 'Ivan Petrov, Club Director'
          },
          {
            type: 'header',
            content: 'What\'s New?'
          },
          {
            type: 'list',
            items: [
              'Wireless charging for smartphones directly on the console.',
              'Synchronization with Apple Watch and Samsung Health.',
              'Virtual routes around the world (HD quality).',
              'Built-in Technogym Coach training programs.'
            ]
          },
          {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop',
            caption: 'New Technogym Live console interface'
          },
          {
            type: 'text',
            content: 'Come and test the new products today! Duty trainers will be happy to conduct an introductory briefing for you and help set up your profile.'
          },
          {
            type: 'separator'
          }
        ],
        attachments: [
          { id: 1, type: 'pdf', name: 'Technogym Live Manual.pdf', size: '2.4 MB', url: '#' },
          { id: 2, type: 'doc', name: 'Safety Rules.docx', size: '0.5 MB', url: '#' }
        ],
        cta: {
          label: 'Book a Test Drive',
          type: 'internal',
          action: 'booking_schedule'
        }
      };

      // For demo purposes, we always show success. 
      // In a real scenario, handle error/404 based on response.
      setData(mockResponse);
      setStatus('success');

      // Logic: Mark as read
      // api.post(`/club/news/${id}/read`)
    };

    fetchData();
  }, []);

  const handleShare = () => {
    // Native share simulation
    if (navigator.share) {
      navigator.share({
        title: data?.title,
        text: 'Check out this news in Atletika+',
        url: window.location.href,
      }).catch(console.error);
    } else {
      alert('Share News (Native Share Sheet)');
    }
  };

  const handleCTA = () => {
    if (!data?.cta) return;
    if (data.cta.type === 'internal') {
      onNavigate(data.cta.action as ScreenName);
    } else {
      window.open(data.cta.action, '_blank');
    }
  };

  // --- RENDER STATES ---

  if (status === 'loading') {
    return (
      <div className="bg-zinc-950 min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-500 animate-spin mb-4" />
        <p className="text-zinc-500 text-sm font-medium">Loading...</p>
      </div>
    );
  }

  if (status === 'deleted' || status === 'error') {
    return (
      <div className="bg-zinc-950 min-h-screen flex flex-col">
        <div className="p-4">
          <button onClick={() => onNavigate('BACK')} className="p-2 -ml-2 rounded-full hover:bg-zinc-900 w-fit">
            <ArrowLeft className="w-6 h-6 text-zinc-300" />
          </button>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center -mt-20">
          <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6 border border-zinc-800">
            <AlertCircle className="w-10 h-10 text-zinc-600" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">News unavailable</h2>
          <p className="text-zinc-500 mb-8 text-sm max-w-xs">
            The publication may have expired or been deleted.
          </p>
          <button
            onClick={() => onNavigate('club_news')}
            className="bg-white text-black px-8 py-3 rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-transform hover:bg-zinc-200"
          >
            Back to News
          </button>
        </div>
      </div>
    );
  }

  if (status === 'offline') {
    return (
      <div className="bg-zinc-950 min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <WifiOff className="w-12 h-12 text-zinc-600 mb-4" />
        <h2 className="text-lg font-bold text-white">No Connection</h2>
        <p className="text-zinc-500 text-sm mb-6">Failed to load news. Check your internet.</p>
        <button
          onClick={() => window.location.reload()}
          className="text-cyan-500 font-bold text-sm bg-cyan-950/30 px-6 py-3 rounded-xl hover:bg-cyan-900/50 transition-colors border border-cyan-900/50"
        >
          Retry
        </button>
      </div>
    );
  }

  // --- SUCCESS RENDER ---

  return (
    <div className="bg-zinc-950 min-h-screen flex flex-col relative pb-24">

      {/* Navbar (Fixed & Transparent initially, but simplified for MVP) */}
      <div className="fixed top-0 left-0 right-0 p-4 flex justify-between items-center z-20 pointer-events-none safe-area-top">
        <button
          onClick={() => onNavigate('BACK')}
          className="w-10 h-10 bg-black/40 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center pointer-events-auto hover:bg-black/60 transition-colors text-white"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <button
          onClick={handleShare}
          className="w-10 h-10 bg-black/40 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center pointer-events-auto hover:bg-black/60 transition-colors text-white"
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      {/* Hero Section */}
      {data?.coverUrl && (
        <div className="relative h-[45vh] w-full shrink-0">
          <img
            src={data.coverUrl}
            alt={data.title}
            className="w-full h-full object-cover grayscale transition-all duration-1000 hover:grayscale-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent"></div>

          <div className="absolute bottom-0 left-0 right-0 p-6 pb-10 text-white z-10 w-full max-w-lg">
            <div className="flex items-center gap-3 mb-3">
              <span className="px-2.5 py-1 bg-cyan-600 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm text-white">
                {data.category}
              </span>
              <span className="flex items-center gap-1 text-xs font-medium text-zinc-300">
                <Calendar className="w-3.5 h-3.5" /> {data.date}
              </span>
              <span className="flex items-center gap-1 text-xs font-medium text-zinc-300">
                <Clock className="w-3.5 h-3.5" /> {data.readTime}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black italic uppercase leading-tight shadow-sm text-white">
              {data.title}
            </h1>
          </div>
        </div>
      )}

      {/* Content Body */}
      <div className={`px-5 relative z-10 bg-zinc-950 flex-1 ${data?.coverUrl ? '-mt-6 rounded-t-3xl pt-8 border-t border-zinc-900' : 'pt-20'}`}>

        {/* Render Blocks */}
        <div className="space-y-6 text-zinc-300 leading-relaxed text-[15px]">
          {data?.content.map((block: ContentBlock, idx: number) => {
            switch (block.type) {
              case 'header':
                return <h3 key={idx} className="text-xl font-bold text-white mt-6 mb-2 uppercase tracking-wide">{block.content}</h3>;

              case 'text':
                return <p key={idx} className="text-zinc-300">{block.content}</p>;

              case 'quote':
                return (
                  <div key={idx} className="relative pl-5 border-l-4 border-cyan-500 my-6 py-2 bg-cyan-950/10 rounded-r-xl">
                    <Quote className="w-6 h-6 text-cyan-600 absolute top-2 right-2 opacity-50" />
                    <p className="font-serif italic text-lg text-zinc-200 mb-2 leading-relaxed">"{block.content}"</p>
                    {block.author && <p className="text-xs font-bold text-zinc-500 uppercase tracking-wide">— {block.author}</p>}
                  </div>
                );

              case 'list':
                return (
                  <ul key={idx} className="space-y-3 my-4 pl-1">
                    {block.items?.map((item, i) => (
                      <li key={i} className="flex gap-3 items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2.5 shrink-0 shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
                        <span className="text-zinc-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                );

              case 'image':
                return (
                  <div key={idx} className="my-6 -mx-5 sm:mx-0 bg-zinc-900">
                    <img src={block.url} alt={block.caption || 'Image'} className="w-full h-auto object-cover sm:rounded-2xl grayscale hover:grayscale-0 transition-all duration-500" />
                    {block.caption && (
                      <p className="text-xs text-zinc-500 mt-2 text-center px-4 italic flex items-center justify-center gap-1">
                        <ImageIcon className="w-3 h-3" /> {block.caption}
                      </p>
                    )}
                  </div>
                );

              case 'separator':
                return <div key={idx} className="h-px bg-zinc-800 my-8 w-2/3 mx-auto"></div>;

              default:
                return null;
            }
          })}
        </div>

        {/* Attachments */}
        {data?.attachments && data.attachments.length > 0 && (
          <div className="mt-10 pt-6 border-t border-zinc-800">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wide mb-4 flex items-center gap-2">
              <Download className="w-3.5 h-3.5" /> Attachments
            </h3>
            <div className="space-y-3">
              {data.attachments.map((file: Attachment) => (
                <button
                  key={file.id}
                  onClick={() => alert(`Downloading ${file.name}`)}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/5 transition-all text-left group active:scale-[0.99]"
                >
                  <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center text-cyan-500 border border-zinc-700 shadow-sm shrink-0 group-hover:text-cyan-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-zinc-200 truncate group-hover:text-white transition-colors">{file.name}</p>
                    <p className="text-xs text-zinc-500 uppercase font-medium mt-0.5">{file.type} • {file.size}</p>
                  </div>
                  <Download className="w-5 h-5 text-zinc-600 group-hover:text-cyan-500 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky CTA (If exists) */}
      {data?.cta && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-zinc-950 border-t border-zinc-900 safe-area-bottom z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom-4 duration-500">
          <div className="max-w-md mx-auto">
            <button
              onClick={handleCTA}
              className="w-full bg-white text-black py-4 rounded-xl font-bold text-sm shadow-lg shadow-white/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2 hover:bg-zinc-200"
            >
              {data.cta.label}
              {data.cta.type === 'external' ? <ExternalLink className="w-4 h-4 opacity-60" /> : <ChevronRight className="w-4 h-4 opacity-60" />}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default NewsDetailScreen;
