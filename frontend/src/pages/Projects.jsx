import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { projectService, staffService } from '../services/api';
import { Table } from '../components/shared/Table';
import { Card, Button, Input, Modal } from '../components/shared/UIComponents';
import { Briefcase, Edit2, Trash2, Plus, Users } from 'lucide-react';

const Projects = () => {
    const { user } = useAuth();
    const isAdmin = user?.role?.roleName === 'Admin';
    const [projects, setProjects] = useState([]);
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [formData, setFormData] = useState({
        projectName: '',
        assignedStaff: [],
    });

    const fetchProjectsAndStaff = async () => {
        setLoading(true);
        try {
            const [projectsRes, staffRes] = await Promise.all([
                projectService.getProjects(),
                staffService.getStaff()
            ]);
            setProjects(projectsRes.data);
            setStaff(staffRes.data);
        } catch (error) {
            console.error('Error fetching data', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjectsAndStaff();
    }, []);

    const handleOpenModal = (project = null) => {
        if (project) {
            setEditingProject(project);
            setFormData({
                projectName: project.projectName,
                assignedStaff: project.assignedStaff.map(s => s._id),
            });
        } else {
            setEditingProject(null);
            setFormData({
                projectName: '',
                assignedStaff: [],
            });
        }
        setIsModalOpen(true);
    };

    const handleStaffToggle = (staffId) => {
        const updatedStaff = formData.assignedStaff.includes(staffId)
            ? formData.assignedStaff.filter(id => id !== staffId)
            : [...formData.assignedStaff, staffId];
        setFormData({ ...formData, assignedStaff: updatedStaff });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProject) {
                await projectService.updateProject(editingProject._id, formData);
            } else {
                await projectService.createProject(formData);
            }
            setIsModalOpen(false);
            fetchProjectsAndStaff();
        } catch (error) {
            alert(error.response?.data?.message || 'Action failed');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                await projectService.deleteProject(id);
                fetchProjectsAndStaff();
            } catch (error) {
                alert('Delete failed');
            }
        }
    };

    const columns = [
        {
            header: 'Project Name',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                        <Briefcase size={18} />
                    </div>
                    <span className="font-bold text-slate-800">{row.projectName}</span>
                </div>
            )
        },
        {
            header: 'Assigned Staff',
            render: (row) => (
                <div className="flex -space-x-2 overflow-hidden">
                    {row.assignedStaff.slice(0, 3).map((s, i) => (
                        <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600" title={s.name}>
                            {s.name[0].toUpperCase()}
                        </div>
                    ))}
                    {row.assignedStaff.length > 3 && (
                        <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                            +{row.assignedStaff.length - 3}
                        </div>
                    )}
                </div>
            )
        },
        {
            header: 'Tasks',
            render: (row) => (
                <span className="text-sm font-medium text-slate-500">
                    {row.tasks?.length || 0} Tasks
                </span>
            )
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Project Management</h1>
                    <p className="text-slate-500">Organize projects and assign team members</p>
                </div>
                <Button onClick={() => handleOpenModal()} className="gap-2">
                    <Plus size={18} />
                    New Project
                </Button>
            </div>

            <Card className="p-0">
                <Table
                    columns={columns}
                    data={projects}
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
                title={editingProject ? 'Edit Project' : 'Create Project'}
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSubmit}>{editingProject ? 'Update Project' : 'Create Project'}</Button>
                    </>
                }
            >
                <form className="space-y-6">
                    <Input
                        label="Project Name"
                        placeholder="e.g., E-commerce Redesign"
                        value={formData.projectName}
                        onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                        required
                    />

                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <Users size={16} />
                            Assign Staff
                        </label>
                        <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto p-4 bg-slate-50 rounded-xl border border-slate-100">
                            {staff.map(s => (
                                <label key={s._id} className="flex items-center justify-between p-2 hover:bg-white rounded-lg transition-colors cursor-pointer group">
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={formData.assignedStaff.includes(s._id)}
                                            onChange={() => handleStaffToggle(s._id)}
                                            className="rounded border-slate-300 text-primary-600 focus:ring-primary-500 h-4 w-4"
                                        />
                                        <div>
                                            <p className="text-sm font-medium text-slate-700">{s.name}</p>
                                            <p className="text-xs text-slate-400">{s.role?.roleName}</p>
                                        </div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Projects;
