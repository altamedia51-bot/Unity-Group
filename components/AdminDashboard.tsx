import React, { useState } from 'react';
import { 
  Users, 
  Activity, 
  Search, 
  LogOut, 
  ChevronRight, 
  Check, 
  MoreVertical,
  Plus,
  Terminal,
  ShieldAlert
} from 'lucide-react';
import { Button } from './Button';
import { Project, ProjectStep } from '../types';

interface AdminDashboardProps {
    onLogout: () => void;
}

// Mock Data
const MOCK_USERS = [
    { uid: 'USR-8821', name: 'Ahmad Dahlan', email: 'ahmad@gmail.com', status: 'Active', projects: 2 },
    { uid: 'USR-9932', name: 'Sarah Wijaya', email: 'sarah.w@corp.id', status: 'Active', projects: 1 },
    { uid: 'USR-1102', name: 'Budi Santoso', email: 'budi.santoso@gmail.com', status: 'Inactive', projects: 0 },
];

const INITIAL_PROJECTS: Project[] = [
    {
        id: 'PRJ-2023-001',
        userId: 'USR-8821',
        userName: 'Ahmad Dahlan',
        projectName: 'Pendirian PT Perorangan',
        currentStep: 2,
        lastUpdated: '2023-10-25 14:30',
        steps: [
            { name: 'Pemberkasan', status: 'completed', timestamp: '2023-10-20' },
            { name: 'Validasi Admin', status: 'completed', timestamp: '2023-10-21' },
            { name: 'Proses Notaris', status: 'active', timestamp: '2023-10-25' },
            { name: 'Drafting Akta', status: 'pending' },
            { name: 'SK Kemenkumham', status: 'pending' },
            { name: 'Selesai', status: 'pending' },
        ]
    }
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState<'users' | 'projects'>('projects');
    const [selectedProject, setSelectedProject] = useState<Project | null>(INITIAL_PROJECTS[0]);
    const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);

    // Function to update step
    const handleStepClick = (project: Project, stepIndex: number) => {
        const updatedProjects = projects.map(p => {
            if (p.id === project.id) {
                const newSteps = p.steps.map((step, idx) => ({
                    ...step,
                    status: idx < stepIndex ? 'completed' : idx === stepIndex ? 'active' : 'pending' as any
                }));
                return {
                    ...p,
                    currentStep: stepIndex,
                    steps: newSteps,
                    lastUpdated: new Date().toLocaleString()
                };
            }
            return p;
        });
        
        setProjects(updatedProjects);
        const updatedSelected = updatedProjects.find(p => p.id === project.id) || null;
        setSelectedProject(updatedSelected);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-slate-300 font-sans flex">
            {/* Command Sidebar */}
            <aside className="w-20 md:w-64 border-r border-white/10 flex flex-col bg-[#0a0a0a]">
                <div className="h-20 flex items-center justify-center md:justify-start md:px-6 border-b border-white/10">
                    <div className="w-10 h-10 rounded bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                        <Terminal size={20} />
                    </div>
                    <span className="hidden md:block ml-3 font-bold text-white tracking-widest text-sm">ADMIN<span className="text-red-500">_CMD</span></span>
                </div>

                <div className="flex-1 py-6 space-y-2">
                    <button 
                        onClick={() => setActiveTab('projects')}
                        className={`w-full flex items-center p-4 md:px-6 transition-all border-l-2 ${activeTab === 'projects' ? 'border-red-500 bg-white/5 text-white' : 'border-transparent hover:bg-white/5'}`}
                    >
                        <Activity size={20} className={activeTab === 'projects' ? 'text-red-500' : ''} />
                        <span className="hidden md:block ml-4 text-sm font-medium">Project Tracker</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('users')}
                        className={`w-full flex items-center p-4 md:px-6 transition-all border-l-2 ${activeTab === 'users' ? 'border-red-500 bg-white/5 text-white' : 'border-transparent hover:bg-white/5'}`}
                    >
                        <Users size={20} className={activeTab === 'users' ? 'text-red-500' : ''} />
                        <span className="hidden md:block ml-4 text-sm font-medium">User Database</span>
                    </button>
                </div>

                <div className="p-4 border-t border-white/10">
                    <button onClick={onLogout} className="flex items-center justify-center md:justify-start w-full text-slate-500 hover:text-red-400 transition-colors">
                        <LogOut size={20} />
                        <span className="hidden md:block ml-3 text-sm">Terminate Session</span>
                    </button>
                </div>
            </aside>

            {/* Main Command Center */}
            <main className="flex-1 overflow-hidden flex flex-col relative">
                {/* Header */}
                <header className="h-20 border-b border-white/10 flex items-center justify-between px-8 bg-[#0a0a0a]/50 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <h1 className="text-xl font-bold text-white tracking-wide uppercase">
                            {activeTab === 'projects' ? 'Project Operations' : 'User Database'}
                        </h1>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-500/10 text-red-500 border border-red-500/20 animate-pulse">
                            LIVE CONNECTED
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                            <input 
                                type="text" 
                                placeholder="Search UUID..." 
                                className="bg-[#050505] border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm focus:border-red-500/50 outline-none w-64 transition-all font-mono"
                            />
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10"></div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-8">
                    
                    {activeTab === 'users' && (
                        <div className="glass-card rounded-none border border-white/10 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-white/5 font-mono text-xs text-slate-500 uppercase">
                                    <tr>
                                        <th className="px-6 py-4">UID</th>
                                        <th className="px-6 py-4">Full Name</th>
                                        <th className="px-6 py-4">Email</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-sm">
                                    {MOCK_USERS.map(user => (
                                        <tr key={user.uid} className="hover:bg-white/5 group transition-colors">
                                            <td className="px-6 py-4 font-mono text-yellow-500/80">{user.uid}</td>
                                            <td className="px-6 py-4 font-bold text-white">{user.name}</td>
                                            <td className="px-6 py-4 text-slate-400 font-mono text-xs">{user.email}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-[10px] uppercase tracking-wider font-bold ${user.status === 'Active' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-slate-500/10 text-slate-500'}`}>
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-slate-500 hover:text-white"><MoreVertical size={16} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'projects' && (
                        <div className="flex flex-col xl:flex-row gap-8 h-full">
                            {/* Project List */}
                            <div className="w-full xl:w-1/3 flex flex-col gap-4">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-slate-400 text-xs font-mono uppercase tracking-widest">Active Projects</h3>
                                    <button className="text-red-500 hover:text-red-400 flex items-center gap-1 text-xs font-bold border border-red-500/20 bg-red-500/5 px-3 py-1 rounded-full transition-all hover:bg-red-500/10">
                                        <Plus size={12} /> NEW PROJECT
                                    </button>
                                </div>
                                {projects.map(project => (
                                    <div 
                                        key={project.id}
                                        onClick={() => setSelectedProject(project)}
                                        className={`p-5 rounded-sm border cursor-pointer transition-all duration-300 relative overflow-hidden group
                                        ${selectedProject?.id === project.id 
                                            ? 'bg-red-900/10 border-red-500/50' 
                                            : 'bg-[#0f0f0f] border-white/5 hover:border-white/20'}`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="font-mono text-xs text-slate-500 group-hover:text-red-400 transition-colors">{project.id}</span>
                                            <span className="text-[10px] font-mono text-slate-600">{project.lastUpdated}</span>
                                        </div>
                                        <h4 className="text-white font-bold mb-1">{project.projectName}</h4>
                                        <p className="text-sm text-slate-400 mb-4">{project.userName}</p>
                                        
                                        {/* Mini Progress Bar */}
                                        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-gradient-to-r from-red-600 to-yellow-500 transition-all duration-500"
                                                style={{ width: `${((project.currentStep + 1) / project.steps.length) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Project Detail / Interactive Stepper */}
                            <div className="w-full xl:w-2/3 glass-card border border-white/10 p-8 flex flex-col relative">
                                {selectedProject ? (
                                    <>
                                        {/* Background Grid Decoration */}
                                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-20"></div>
                                        
                                        <div className="relative z-10 flex justify-between items-end border-b border-white/10 pb-6 mb-8">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h2 className="text-2xl font-bold text-white">{selectedProject.projectName}</h2>
                                                    <span className="px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-500 text-xs border border-yellow-500/30 font-bold">
                                                        IN PROGRESS
                                                    </span>
                                                </div>
                                                <div className="flex gap-6 text-sm font-mono text-slate-400">
                                                    <span>User: <span className="text-white">{selectedProject.userName}</span></span>
                                                    <span>ID: <span className="text-white">{selectedProject.id}</span></span>
                                                </div>
                                            </div>
                                            <Button variant="outline" className="border-red-500/30 text-red-400 hover:border-red-500 hover:bg-red-500/10 text-xs px-4 py-2 h-auto">
                                                Edit Metadata
                                            </Button>
                                        </div>

                                        {/* INTERACTIVE TIMELINE */}
                                        <div className="relative z-10 flex-1 flex flex-col justify-center">
                                            <div className="relative">
                                                {/* Connecting Line */}
                                                <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-slate-800"></div>

                                                <div className="space-y-8 relative">
                                                    {selectedProject.steps.map((step, index) => {
                                                        const isCompleted = index < selectedProject.currentStep;
                                                        const isActive = index === selectedProject.currentStep;
                                                        const isFuture = index > selectedProject.currentStep;

                                                        return (
                                                            <div 
                                                                key={index} 
                                                                className={`flex items-center gap-6 group cursor-pointer`}
                                                                onClick={() => handleStepClick(selectedProject, index)}
                                                            >
                                                                {/* Node Indicator */}
                                                                <div className={`
                                                                    w-16 h-16 rounded-full flex items-center justify-center border-2 z-10 transition-all duration-300 relative
                                                                    ${isCompleted ? 'bg-[#050505] border-green-500 text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]' : ''}
                                                                    ${isActive ? 'bg-[#050505] border-yellow-500 text-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.5)] scale-110' : ''}
                                                                    ${isFuture ? 'bg-[#050505] border-slate-700 text-slate-700 hover:border-slate-500' : ''}
                                                                `}>
                                                                    {isCompleted ? <Check size={24} /> : 
                                                                     isActive ? <div className="w-3 h-3 bg-yellow-500 rounded-full animate-ping" /> : 
                                                                     <span className="font-mono text-xs">{index + 1}</span>}
                                                                </div>

                                                                {/* Content */}
                                                                <div className={`flex-1 p-4 rounded-lg border transition-all duration-300
                                                                    ${isActive ? 'bg-white/5 border-yellow-500/30 translate-x-2' : 'border-transparent hover:bg-white/5'}
                                                                `}>
                                                                    <div className="flex justify-between items-center mb-1">
                                                                        <h4 className={`font-bold text-lg ${isActive ? 'text-yellow-500' : isCompleted ? 'text-green-500' : 'text-slate-500'}`}>
                                                                            {step.name}
                                                                        </h4>
                                                                        {step.timestamp && (
                                                                            <span className="text-xs font-mono text-slate-500">{step.timestamp}</span>
                                                                        )}
                                                                    </div>
                                                                    <p className="text-sm text-slate-500">
                                                                        {isActive ? 'Current stage in progress.' : isCompleted ? 'Stage completed successfully.' : 'Waiting for previous steps.'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
                                            <div className="text-xs text-slate-500 font-mono">
                                                Last status update by ADMIN_CMD at {selectedProject.lastUpdated}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-slate-600">
                                        <ShieldAlert size={64} className="mb-4 opacity-20" />
                                        <p className="font-mono">SELECT A PROJECT TO INITIALIZE CONTROL</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};