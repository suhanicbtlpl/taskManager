import { useState, useEffect } from 'react';
import { Card } from '../components/shared/UIComponents';
import {
    Users,
    Briefcase,
    CheckCircle2,
    Clock,
    AlertCircle
} from 'lucide-react';
import { staffService, projectService, taskService } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalStaff: 0,
        totalProjects: 0,
        totalTasks: 0,
        pendingTasks: 0,
        completedTasks: 0,
        inProgressTasks: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [staff, projects, tasks] = await Promise.all([
                    staffService.getStaff(),
                    projectService.getProjects(),
                    taskService.getTasks()
                ]);

                const taskData = tasks.data;
                setStats({
                    totalStaff: staff.data.length,
                    totalProjects: projects.data.length,
                    totalTasks: taskData.length,
                    pendingTasks: taskData.filter(t => t.status === 'Pending').length,
                    completedTasks: taskData.filter(t => t.status === 'Completed').length,
                    inProgressTasks: taskData.filter(t => t.status === 'InProgress').length
                });
            } catch (error) {
                console.error('Error fetching dashboard stats', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statCards = [
        { label: 'Total Staff', value: stats.totalStaff, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Total Projects', value: stats.totalProjects, icon: Briefcase, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Total Tasks', value: stats.totalTasks, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Pending Tasks', value: stats.pendingTasks, icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-50' },
        { label: 'Completed Tasks', value: stats.completedTasks, icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50' },
    ];

    const chartData = [
        { name: 'Pending', value: stats.pendingTasks, color: '#f59e0b' },
        { name: 'In Progress', value: stats.inProgressTasks, color: '#3b82f6' },
        { name: 'Completed', value: stats.completedTasks, color: '#10b981' },
    ];

    if (loading) return <div className="animate-pulse space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>)}
        </div>
        <div className="h-96 bg-slate-200 rounded-xl"></div>
    </div>;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Overview</h1>
                <p className="text-slate-500">Insights and management at a glance</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {statCards.map((stat, i) => (
                    <Card key={i} className="flex flex-col items-center justify-center text-center py-8">
                        <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} mb-4`}>
                            <stat.icon size={28} />
                        </div>
                        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</p>
                        <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card title="Task Distribution">
                    <div className="h-80 w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card title="Recent Activity" action={<button className="text-primary-600 text-sm font-semibold hover:underline">View All</button>}>
                    <div className="space-y-6 mt-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="flex items-start gap-4">
                                <div className="w-2 h-2 rounded-full bg-primary-500 mt-2"></div>
                                <div>
                                    <p className="text-sm font-medium text-slate-800">New project "Mobile App Redesign" created</p>
                                    <p className="text-xs text-slate-400">2 hours ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
