import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { projectService, staffService } from '../services/api';
import { Table } from '../components/shared/Table';
import { Card, Button, Input, Modal } from '../components/shared/UIComponents';
import Search from '../components/shared/Search';
import Pagination from '../components/shared/Pagination';
import { Briefcase, Edit2, Trash2, Plus, Users, Calendar, CheckCircle2 } from 'lucide-react';

const Projects = () => {
    const { user } = useAuth();
    const isAdmin = user?.role?.roleName === 'Admin';
    
    const [projects, setProjects] = useState([]);
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState('');
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [formData, setFormData] = useState({
        projectName: '',
        assignedStaff: [],
    });

    const fetchProjects = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await projectService.getProjects({
                page,
                limit,
                search,
            });
            setProjects(data.data);
            setTotal(data.total);
            setTotalPages(data.pages);
        } catch (error) {
            console.error('Error fetching projects', error);
        } finally {
            setLoading(false);
        }
    }, [page, limit, search]);

    const fetchStaff = async () => {
        try {
            const { data } = await staffService.getStaff({ limit: 1000 });
            setStaff(data.data);
        } catch (error) {
            console.error('Error fetching staff', error);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    useEffect(() => {
        fetchStaff();
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
            fetchProjects();
        } catch (error) {
            alert(error.response?.data?.message || 'Action failed');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                await projectService.deleteProject(id);
                fetchProjects();
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
                    <div className="p-2 rounded-xl bg-primary-50 text-primary-600 border border-primary-100 shadow-sm">
                        <Briefcase size={18} />
                    </div>
                    <div>
                        <p className="font-bold text-slate-800">{row.projectName}</p>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                           <Calendar size={10} />
                           Created {new Date(row.createdAt).toLocaleDateString()}
                        </div>
                    </div>
                </div>
            )
        },
        {
            header: 'Staff',
            render: (row) => (
                <div className="flex -space-x-2 overflow-hidden py-1">
                    {row.assignedStaff.slice(0, 3).map((s, i) => (
                        <div key={i} className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600 shadow-sm" title={s.name}>
                            {s.name[0].toUpperCase()}
                        </div>
                    ))}
                    {row.assignedStaff.length > 3 && (
                        <div className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400 shadow-sm">
                            +{row.assignedStaff.length - 3}
                        </div>
                    )}
                    {row.assignedStaff.length === 0 && (
                        <span className="text-[10px] text-slate-400 italic">Unassigned</span>
                    )}
                </div>
            )
        },
        {
            header: 'Statistics',
            render: (row) => (
                <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tasks</span>
                        <div className="flex items-center gap-1">
                            <CheckCircle2 size={12} className="text-emerald-500" />
                            <span className="text-xs font-bold text-slate-700">{row.tasks?.length || 0}</span>
                        </div>
                    </div>
                </div>
            )
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Projects</h1>
                    <p className="text-slate-500">Manage and track your team's initiatives</p>
                </div>
                <Button onClick={() => handleOpenModal()} className="gap-2">
                    <Plus size={18} />
                    New Project
                </Button>
            </div>

            <div className="flex gap-4">
                <Search onSearch={setSearch} placeholder="Search projects..." />
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
                        placeholder="e.g., Q2 Marketing Campaign"
                        value={formData.projectName}
                        onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                        required
                    />

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <Users size={16} />
                                Assign Team Members
                            </label>
                            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                                {formData.assignedStaff.length} selected
                            </span>
                        </div>
                        <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto p-4 bg-slate-50 rounded-xl border border-slate-100">
                            {staff.map(s => (
                                <label key={s._id} className={`flex items-center justify-between p-3 rounded-lg transition-all cursor-pointer group ${
                                    formData.assignedStaff.includes(s._id)
                                    ? 'bg-white shadow-sm ring-1 ring-primary-500/10'
                                    : 'hover:bg-white/50'
                                }`}>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={formData.assignedStaff.includes(s._id)}
                                            onChange={() => handleStaffToggle(s._id)}
                                            className="rounded border-slate-300 text-primary-600 focus:ring-primary-500 h-4 w-4 cursor-pointer"
                                        />
                                        <div>
                                            <p className={`text-sm font-bold ${formData.assignedStaff.includes(s._id) ? 'text-slate-900' : 'text-slate-600'}`}>
                                                {s.name}
                                            </p>
                                            <p className="text-[10px] text-slate-400">{s.role?.roleName}</p>
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
