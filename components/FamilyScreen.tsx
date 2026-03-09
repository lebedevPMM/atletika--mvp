
import React, { useState } from 'react';
import { ScreenName } from '../types';
import { useTheme } from './ThemeContext';
import {
  ArrowLeft,
  Users,
  Plus,
  Share2,
  MoreVertical,
  X,
  Check,
  Trash2,
  AlertTriangle,
  Smartphone,
  Baby,
  User,
  Clock,
  ShieldAlert,
  ChevronRight,
  Info
} from 'lucide-react';

interface FamilyScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

type MemberStatus = 'active' | 'pending' | 'rejected';
type Role = 'child' | 'spouse' | 'other';

interface FamilyMember {
  id: number;
  name: string;
  role: Role;
  status: MemberStatus;
  img?: string;
  age?: number;
  phone?: string;
  tariff?: string;
}

const FamilyScreen: React.FC<FamilyScreenProps> = ({ onNavigate }) => {
  const { isDarkMode } = useTheme();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'members' | 'invites'>('members');

  // Add Form State
  const [addStep, setAddStep] = useState(1);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberPhone, setNewMemberPhone] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<Role>('child');

  // Mock Data
  const [members, setMembers] = useState<FamilyMember[]>([
    {
      id: 1,
      name: 'Max Ivanov',
      role: 'child',
      status: 'active',
      age: 12,
      tariff: 'Junior Pass',
      img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Max'
    },
    {
      id: 2,
      name: 'Elena Ivanova',
      role: 'spouse',
      status: 'pending',
      phone: '+7 (912) 345-67-89',
      img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria'
    },
  ]);

  const handleAddSubmit = () => {
    if (newMemberName) {
      setMembers([...members, {
        id: Date.now(),
        name: newMemberName,
        role: newMemberRole,
        status: 'pending',
        phone: newMemberPhone,
        img: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newMemberName}`
      }]);
      resetAddForm();
    }
  };

  const resetAddForm = () => {
    setNewMemberName('');
    setNewMemberPhone('');
    setNewMemberRole('child');
    setAddStep(1);
    setShowAddModal(false);
  };

  const handleDelete = () => {
    if (showDeleteModal) {
      setMembers(members.filter(m => m.id !== showDeleteModal));
      setShowDeleteModal(null);
    }
  };

  const getRoleLabel = (role: Role) => {
    switch (role) {
      case 'child': return 'Child';
      case 'spouse': return 'Spouse';
      default: return 'Relative';
    }
  };

  const getStatusBadge = (status: MemberStatus) => {
    switch (status) {
      case 'active': return null;
      case 'pending':
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 px-2 py-0.5 rounded-full border border-yellow-500/20">
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
      case 'rejected':
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold bg-red-500/10 text-red-600 dark:text-red-500 px-2 py-0.5 rounded-full border border-red-500/20">
            <X className="w-3 h-3" /> Rejected
          </span>
        );
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-zinc-950 min-h-screen flex flex-col relative transition-colors duration-300">
      {/* Header */}
      <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md p-4 shadow-sm dark:shadow-lg border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between sticky top-0 z-10 transition-all">
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate('BACK')} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-zinc-300" />
          </button>
          <h1 className="text-xl font-black text-gray-900 dark:text-white italic uppercase tracking-tighter">Family</h1>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="p-2 bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-900/50 text-cyan-600 dark:text-cyan-500 rounded-full hover:bg-cyan-100 dark:hover:bg-cyan-900/50 transition-colors shadow-sm shadow-cyan-500/10"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">

        {/* Intro Block */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-900 dark:to-blue-900 rounded-2xl p-5 text-white shadow-xl mb-6 relative overflow-hidden border border-white/10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
          <div className="relative z-10 flex gap-4">
            <div className="w-12 h-12 bg-white/20 dark:bg-black/20 backdrop-blur-md rounded-xl flex items-center justify-center shrink-0 border border-white/20 dark:border-white/10">
              <Users className="w-6 h-6 text-white dark:text-cyan-300" />
            </div>
            <div>
              <h2 className="font-bold text-lg leading-tight uppercase italic">Family Access</h2>
              <p className="text-xs text-blue-100 dark:text-cyan-200/80 mt-1 leading-relaxed">
                Manage workouts for children and loved ones. Pay for their services from your account.
              </p>
            </div>
          </div>
        </div>

        {/* Member List */}
        {members.length > 0 ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <h3 className="font-bold text-gray-900 dark:text-white">My Family</h3>
              <span className="text-xs text-gray-500 dark:text-zinc-500">{members.length} / 5</span>
            </div>

            {members.map((member) => (
              <div key={member.id} className="bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-sm dark:shadow-lg border border-gray-200 dark:border-zinc-800 relative group overflow-hidden hover:border-gray-300 dark:hover:border-zinc-700 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-zinc-800 overflow-hidden ring-2 ring-white dark:ring-zinc-800 shadow-md">
                      <img src={member.img} alt={member.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                    </div>
                    {member.role === 'child' && (
                      <div className="absolute -bottom-1 -right-1 bg-cyan-100 dark:bg-cyan-900 text-cyan-600 dark:text-cyan-400 p-1 rounded-full border-2 border-white dark:border-zinc-900">
                        <Baby className="w-3 h-3" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-base truncate group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">{member.name}</h3>
                        <p className="text-xs text-gray-500 dark:text-zinc-500">{getRoleLabel(member.role)} {member.age ? `• ${member.age} y.o.` : ''}</p>
                      </div>
                      <button
                        onClick={() => setShowDeleteModal(member.id)}
                        className="p-2 text-gray-400 dark:text-zinc-600 hover:text-red-500 dark:hover:text-red-500 transition-colors -mr-2 -mt-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      {getStatusBadge(member.status)}
                      {member.status === 'active' && member.tariff && (
                        <span className="text-[10px] bg-green-500/10 text-green-600 dark:text-green-500 px-2 py-0.5 rounded font-medium border border-green-500/20">
                          {member.tariff}
                        </span>
                      )}
                      {member.status === 'active' && !member.tariff && (
                        <span className="text-[10px] bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-500 px-2 py-0.5 rounded font-medium border border-gray-200 dark:border-zinc-700">
                          No Tariff
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Additional Info for Pending */}
                {member.status === 'pending' && (
                  <div className="mt-4 pt-3 border-t border-gray-100 dark:border-zinc-800 flex justify-between items-center">
                    <p className="text-[10px] text-gray-500 dark:text-zinc-500">Invitation sent</p>
                    <button className="text-xs font-bold text-cyan-600 dark:text-cyan-500 flex items-center gap-1 hover:text-cyan-500 dark:hover:text-cyan-400">
                      <Share2 className="w-3 h-3" /> Resend
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-20 h-20 bg-gray-200 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-gray-300 dark:border-zinc-800">
              <Users className="w-10 h-10 text-gray-400 dark:text-zinc-700" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">List is empty</h3>
            <p className="text-sm text-gray-500 dark:text-zinc-500 max-w-[200px] mb-6">
              Add family members to book workouts for them via your account.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-cyan-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-cyan-500/20 active:scale-95 transition-transform hover:bg-cyan-500"
            >
              Add First Member
            </button>
          </div>
        )}
      </div>

      {/* --- ADD MEMBER MODAL --- */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4">
          <div className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm transition-opacity" onClick={resetAddForm}></div>
          <div className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-3xl p-6 relative animate-in slide-in-from-bottom duration-300 shadow-2xl border border-gray-100 dark:border-zinc-800">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {addStep === 1 ? 'Who to add?' : 'Member Details'}
              </h2>
              <button onClick={resetAddForm} className="p-2 bg-gray-100 dark:bg-zinc-800 rounded-full text-gray-500 dark:text-zinc-400 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {addStep === 1 ? (
              <div className="space-y-3">
                <button
                  onClick={() => { setNewMemberRole('child'); setAddStep(2); }}
                  className="w-full p-4 rounded-2xl border border-gray-200 dark:border-zinc-800 flex items-center gap-4 hover:border-cyan-500/50 hover:bg-cyan-50 dark:hover:bg-cyan-950/10 transition-all group"
                >
                  <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-500 rounded-full flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                    <Baby className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-gray-900 dark:text-white">Child</h3>
                    <p className="text-xs text-gray-500 dark:text-zinc-500">Under 18. Managed by parent.</p>
                  </div>
                  <ChevronRight className="ml-auto w-5 h-5 text-gray-400 dark:text-zinc-700 group-hover:text-cyan-500" />
                </button>

                <button
                  onClick={() => { setNewMemberRole('spouse'); setAddStep(2); }}
                  className="w-full p-4 rounded-2xl border border-gray-200 dark:border-zinc-800 flex items-center gap-4 hover:border-purple-500/50 hover:bg-purple-50 dark:hover:bg-purple-950/10 transition-all group"
                >
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-500 rounded-full flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-colors">
                    <User className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-gray-900 dark:text-white">Adult</h3>
                    <p className="text-xs text-gray-500 dark:text-zinc-500">Spouse or relative.</p>
                  </div>
                  <ChevronRight className="ml-auto w-5 h-5 text-gray-400 dark:text-zinc-700 group-hover:text-purple-500" />
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-zinc-500 uppercase mb-2">Full Name</label>
                  <input
                    type="text"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    placeholder="Ivan Ivanov"
                    className="w-full bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl p-3 text-sm focus:outline-none focus:border-cyan-500 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-600"
                    autoFocus
                  />
                </div>

                {newMemberRole === 'spouse' ? (
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-zinc-500 uppercase mb-2">Phone</label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={newMemberPhone}
                        onChange={(e) => setNewMemberPhone(e.target.value)}
                        placeholder="+7 (999) 000-00-00"
                        className="w-full bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl p-3 pl-10 text-sm focus:outline-none focus:border-cyan-500 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-600"
                      />
                      <Smartphone className="absolute left-3 top-3 w-4 h-4 text-gray-400 dark:text-zinc-500" />
                    </div>
                    <p className="text-[10px] text-gray-500 dark:text-zinc-500 mt-2">
                      We will send an SMS invitation to join your family account.
                    </p>
                  </div>
                ) : (
                  <div className="bg-yellow-50 dark:bg-yellow-500/10 p-3 rounded-xl border border-yellow-200 dark:border-yellow-500/20 flex gap-3 items-start">
                    <Info className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-yellow-800 dark:text-yellow-200/80 leading-snug">
                      For children without a phone, confirmation occurs via the club administrator.
                    </p>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setAddStep(1)}
                    className="flex-1 py-3 bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 font-bold rounded-xl text-sm hover:bg-gray-200 dark:hover:bg-zinc-700 hover:text-gray-900 dark:hover:text-white"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleAddSubmit}
                    disabled={!newMemberName}
                    className="flex-[2] py-3 bg-cyan-600 text-white font-bold rounded-xl text-sm shadow-lg shadow-cyan-500/20 disabled:opacity-50 hover:bg-cyan-500"
                  >
                    {newMemberRole === 'spouse' ? 'Invite' : 'Create'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm transition-opacity" onClick={() => setShowDeleteModal(null)}></div>
          <div className="bg-white dark:bg-zinc-900 w-full max-w-xs rounded-3xl p-6 relative animate-in zoom-in duration-300 shadow-2xl text-center border border-gray-100 dark:border-zinc-800">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-200 dark:border-red-500/20">
              <ShieldAlert className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Delete Member?</h2>
            <p className="text-sm text-gray-500 dark:text-zinc-500 mb-6 leading-relaxed">
              You will lose the ability to book workouts for this person and pay their bills.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="py-3 rounded-xl font-bold text-gray-600 dark:text-zinc-300 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="py-3 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-500/20"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default FamilyScreen;
