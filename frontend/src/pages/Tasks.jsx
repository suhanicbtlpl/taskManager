import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { taskService, projectService, staffService } from '../services/api';
import { Table } from '../components/shared/Table';
import { Card, Button, Input, Modal } from '../components/shared/UIComponents';
import { CheckSquare, Edit2, Trash2, Plus, Filter } from 'lucide-react';

const Tasks = () => {
    const { user } = useAuth();
    const isAdmin = user?.role?.roleName === 'Admin';
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [filterProject, setFilterProject] = useState('');
    const [formData, setFormData] = useState({
        taskName: '',
        projectId: '',
        assignedTo: '',
        status: 'Pending',
    });

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [tasksRes, projectsRes, staffRes] = await Promise.all([
                taskService.getTasks(),
                projectService.getProjects(),
                staffService.getStaff()
            ]);
            setTasks(tasksRes.data);
            setProjects(projectsRes.data);
            setStaff(staffRes.data);
        } catch (error) {
            console.error('Error fetching data', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
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
            fetchAllData();
        } catch (error) {
            alert(error.response?.data?.message || 'Action failed');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await taskService.deleteTask(id);
                fetchAllData();
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

    const filteredTasks = filterProject
        ? tasks.filter(t => t.projectId?._id === filterProject)
        : tasks;

    const columns = [
        {
            header: 'Task Name',
            render: (row) => (
                <span className="font-bold text-slate-800">{row.taskName}</span>
            )
        },
        {
            header: 'Project',
            render: (row) => (
                <span className="text-xs font-semibold text-slate-500 uppercase">
                    {row.projectId?.projectName || 'N/A'}
                </span>
            )
        },
        {
            header: 'Assigned To',
            render: (row) => (
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold">
                        {row.assignedTo?.name?.[0].toUpperCase()}
                    </div>
                    <span className="text-sm text-slate-600">{row.assignedTo?.name}</span>
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
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Task Management</h1>
                    <p className="text-slate-500">Track and manage task progress across projects</p>
                </div>
                <div className="flex gap-3">
                    <select
                        className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-primary-500"
                        value={filterProject}
                        onChange={(e) => setFilterProject(e.target.value)}
                    >
                        <option value="">All Projects</option>
                        {projects.map(p => (
                            <option key={p._id} value={p._id}>{p.projectName}</option>
                        ))}
                    </select>
                    <Button onClick={() => handleOpenModal()} className="gap-2">
                        <Plus size={18} />
                        Add Task
                    </Button>
                </div>
            </div>

            <Card className="p-0">
                <Table
                    columns={columns}
                    data={filteredTasks}
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
                <form className="space-y-4">
                    <Input
                        label="Task Name"
                        placeholder="e.g., Design UI Mockups"
                        value={formData.taskName}
                        onChange={(e) => setFormData({ ...formData, taskName: e.target.value })}
                        required
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700">Project</label>
                            <select
                                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-primary-500 transition-all"
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
                                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-primary-500 transition-all"
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
                        <select
                            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-primary-500 transition-all"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            required
                        >
                            <option value="Pending">Pending</option>
                            <option value="InProgress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Tasks;
