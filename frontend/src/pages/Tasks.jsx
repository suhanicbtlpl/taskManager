import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { taskService, projectService, staffService } from '../services/api';
import { Table } from '../components/shared/Table';
import { Card, Button, Input, Modal } from '../components/shared/UIComponents';
import Search from '../components/shared/Search';
import Pagination from '../components/shared/Pagination';
import { CheckSquare, Edit2, Trash2, Plus, Filter, Layout, User } from 'lucide-react';

const Tasks = () => {
    const { user } = useAuth();
    const isAdmin = user?.role?.roleName === 'Admin';
    
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState('');
    const [projectId, setProjectId] = useState('');
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [formData, setFormData] = useState({
        taskName: '',
        projectId: '',
        assignedTo: '',
        status: 'Pending',
    });

    const fetchTasks = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await taskService.getTasks({
                page,
                limit,
                search,
                projectId,
            });
            setTasks(data.data);
            setTotal(data.total);
            setTotalPages(data.pages);
        } catch (error) {
            console.error('Error fetching tasks', error);
        } finally {
            setLoading(false);
        }
    }, [page, limit, search, projectId]);

    const fetchProjectsAndStaff = async () => {
        try {
            const [projectsRes, staffRes] = await Promise.all([
                projectService.getProjects({ limit: 1000 }),
                staffService.getStaff({ limit: 1000 })
            ]);
            setProjects(projectsRes.data.data);
            setStaff(staffRes.data.data);
        } catch (error) {
            console.error('Error fetching support data', error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    useEffect(() => {
        fetchProjectsAndStaff();
    }, []);

    const handleOpenModal = (task = null) => {
        if (task) {
            setEditingTask(task);
            setFormData({
                taskName: task.taskName,
                projectId: task.projectId?._id || '',
                assignedTo: task.assignedTo?._id || '',
                status: task.status,
            });
        } else {
            setEditingTask(null);
            setFormData({
                taskName: '',
                projectId: '',
                assignedTo: '',
                status: 'Pending',
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingTask) {
                await taskService.updateTask(editingTask._id, formData);
            } else {
                await taskService.createTask(formData);
            }
            setIsModalOpen(false);
            fetchTasks();
        } catch (error) {
            alert(error.response?.data?.message || 'Action failed');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await taskService.deleteTask(id);
                fetchTasks();
            } catch (error) {
                alert('Delete failed');
            }
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'InProgress': return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'Completed': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            default: return 'bg-slate-50 text-slate-700 border-slate-100';
        }
    };

    const columns = [
        {
            header: 'Task Details',
            render: (row) => (
                <div className="flex flex-col">
                    <span className="font-bold text-slate-800">{row.taskName}</span>
                    <div className="flex items-center gap-1.5 mt-1">
                        <Layout size={10} className="text-slate-400" />
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                            {row.projectId?.projectName || 'No Project'}
                        </span>
                    </div>
                </div>
            )
        },
        {
            header: 'Assignee',
            render: (row) => (
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 border border-slate-200">
                        {row.assignedTo?.name?.[0].toUpperCase() || '?'}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-700">{row.assignedTo?.name || 'Unassigned'}</span>
                        <span className="text-[9px] text-slate-400 font-medium">{row.assignedTo?.email}</span>
                    </div>
                </div>
            )
        },
        {
            header: 'Status',
            render: (row) => (
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(row.status)}`}>
                    {row.status}
                </span>
            )
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Tasks</h1>
                    <p className="text-slate-500">Track and manage project deliverables</p>
                </div>
                <Button onClick={() => handleOpenModal()} className="gap-2">
                    <Plus size={18} />
                    Add Task
                </Button>
            </div>

            <div className="flex gap-4 flex-col sm:flex-row">
                <Search onSearch={setSearch} placeholder="Search tasks..." />
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
                    <Filter size={16} className="text-slate-400" />
                    <select
                        className="bg-transparent border-none text-sm font-semibold text-slate-600 outline-none cursor-pointer"
                        value={projectId}
                        onChange={(e) => setProjectId(e.target.value)}
                    >
                        <option value="">All Projects</option>
                        {projects.map(p => (
                            <option key={p._id} value={p._id}>{p.projectName}</option>
                        ))}
                    </select>
                </div>
            </div>

            <Card className="p-0">
                <Table
                    columns={columns}
                    data={tasks}
                    loading={loading}
                    actions={(row) => (
                        <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleOpenModal(row)}>
                                <Edit2 size={16} />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50" onClick={() => handleDelete(row._id)}>
                                <Trash2 size={16} />
                            </Button>
                        </div>
                    )}
                />
                <Pagination
                    total={total}
                    page={page}
                    pages={totalPages}
                    limit={limit}
                    onPageChange={setPage}
                    onLimitChange={(l) => {
                        setLimit(l);
                        setPage(1);
                    }}
                />
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingTask ? 'Edit Task' : 'Create Task'}
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSubmit}>{editingTask ? 'Update Task' : 'Create Task'}</Button>
                    </>
                }
            >
                <form className="space-y-6">
                    <Input
                        label="Task Name"
                        placeholder="e.g., Implement Search functionality"
                        value={formData.taskName}
                        onChange={(e) => setFormData({ ...formData, taskName: e.target.value })}
                        required
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700">Project</label>
                            <select
                                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-primary-500 transition-all text-sm"
                                value={formData.projectId}
                                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                                required
                            >
                                <option value="">Select Project</option>
                                {projects.map(p => (
                                    <option key={p._id} value={p._id}>{p.projectName}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700">Assign To</label>
                            <select
                                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-primary-500 transition-all text-sm"
                                value={formData.assignedTo}
                                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                                required
                            >
                                <option value="">Select Staff</option>
                                {staff.map(s => (
                                    <option key={s._id} value={s._id}>{s.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Status</label>
                        <div className="flex gap-2">
                            {['Pending', 'InProgress', 'Completed'].map(s => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, status: s })}
                                    className={`flex-1 px-3 py-2 rounded-lg border text-[10px] font-bold transition-all ${
                                        formData.status === s
                                        ? getStatusColor(s) + ' shadow-sm'
                                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                                    }`}
                                >
                                    {s === 'InProgress' ? 'In Progress' : s}
                                </button>
                            ))}
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Tasks;
