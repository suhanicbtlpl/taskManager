import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { roleService, permissionService } from '../services/api';
import { Table } from '../components/shared/Table';
import { Card, Button, Input, Modal } from '../components/shared/UIComponents';
import Search from '../components/shared/Search';
import Pagination from '../components/shared/Pagination';
import { ShieldCheck, Edit2, Trash2, Plus, Check, Square, CheckSquare } from 'lucide-react';

const Roles = () => {
    const { user } = useAuth();
    const isAdmin = user?.role?.roleName === 'Admin';

    const [roles, setRoles] = useState([]);
    const [availablePermissions, setAvailablePermissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState(null);
    const [formData, setFormData] = useState({
        roleName: '',
        status: 'active',
        permissions: [], // Array of { name: 'Resource', actions: ['create', 'read', ...] }
    });

    const ACTIONS = ['create', 'read', 'update', 'delete'];

    const fetchRoles = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await roleService.getRoles({
                page,
                limit,
                search,
            });
            setRoles(data.data);
            setTotal(data.total);
            setTotalPages(data.pages);
        } catch (error) {
            console.error('Error fetching roles', error);
        } finally {
            setLoading(false);
        }
    }, [page, limit, search]);

    const fetchAllPermissions = async () => {
        try {
            const { data } = await permissionService.getPermissions({ limit: 1000 });
            setAvailablePermissions(data.data);
        } catch (error) {
            console.error('Error fetching dynamic permissions', error);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, [fetchRoles]);

    useEffect(() => {
        fetchAllPermissions();
    }, []);

    const handleOpenModal = (role = null) => {
        if (role) {
            setEditingRole(role);
            // Normalize permissions to ensure legacy string-based permissions don't break validation
            const normalizedPermissions = (role.permissions || []).map(p => {
                if (typeof p === 'string') return null;
                return p;
            }).filter(Boolean);

            setFormData({
                roleName: role.roleName || '',
                status: role.status || 'active',
                permissions: normalizedPermissions,
            });
        } else {
            setEditingRole(null);
            setFormData({
                roleName: '',
                status: 'active',
                permissions: [],
            });
        }
        setIsModalOpen(true);
    };

    const handleActionToggle = (resourceName, action) => {
        setFormData(prev => {
            const permissions = [...prev.permissions];
            const resourceIndex = permissions.findIndex(p => p.name === resourceName);

            if (resourceIndex > -1) {
                const resource = { ...permissions[resourceIndex] };
                if (resource.actions.includes(action)) {
                    resource.actions = resource.actions.filter(a => a !== action);
                } else {
                    resource.actions = [...resource.actions, action];
                }

                if (resource.actions.length === 0) {
                    permissions.splice(resourceIndex, 1);
                } else {
                    permissions[resourceIndex] = resource;
                }
            } else {
                permissions.push({
                    name: resourceName,
                    actions: [action]
                });
            }

            return { ...prev, permissions };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingRole) {
                await roleService.updateRole(editingRole._id, formData);
            } else {
                await roleService.createRole(formData);
            }
            setIsModalOpen(false);
            fetchRoles();
        } catch (error) {
            alert(error.response?.data?.message || 'Action failed');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this role?')) {
            try {
                await roleService.deleteRole(id);
                fetchRoles();
            } catch (error) {
                alert('Delete failed');
            }
        }
    };

    const columns = [
        {
            header: 'Role Name',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                        <ShieldCheck size={18} />
                    </div>
                    <span className="font-bold text-slate-800">{row.roleName}</span>
                </div>
            )
        },
        {
            header: 'Status',
            render: (row) => (
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${row.status === 'active'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                    {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                </span>
            )
        },
        {
            header: 'Permissions',
            render: (row) => (
                <div className="flex flex-wrap gap-1 max-w-sm">
                    {(row.permissions || []).map(p => (
                        <div key={p.name} className="flex items-center bg-slate-100 rounded overflow-hidden border border-slate-200">
                            <span className="px-1.5 py-0.5 text-[9px] font-bold bg-slate-200 text-slate-700 border-r border-slate-200">
                                {p.name}
                            </span>
                            <span className="px-1.5 py-0.5 text-[8px] font-medium text-slate-500">
                                {p.actions.length === 4 ? 'FULL' : p.actions.join(', ')}
                            </span>
                        </div>
                    ))}
                    {(row.permissions || []).length === 0 && (
                        <span className="text-[10px] text-slate-400 italic">No permissions</span>
                    )}
                </div>
            )
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Roles & Access</h1>
                    <p className="text-slate-500">Define granular access levels for team members</p>
                </div>
                <Button onClick={() => handleOpenModal()} className="gap-2">
                    <Plus size={18} />
                    Create New Role
                </Button>
            </div>

            <div className="flex gap-4">
                <Search onSearch={setSearch} placeholder="Search roles..." />
            </div>

            <Card className="p-0">
                <Table
                    columns={columns}
                    data={roles}
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
                title={editingRole ? 'Edit Role' : 'Create Role'}
                size="lg"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSubmit}>{editingRole ? 'Update Role' : 'Create Role'}</Button>
                    </>
                }
            >
                <form className="space-y-6">
                    <Input
                        label="Role Name"
                        placeholder="e.g., Project Lead"
                        value={formData.roleName}
                        onChange={(e) => setFormData({ ...formData, roleName: e.target.value })}
                        required
                    />

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Status</label>
                        <div className="flex gap-4">
                            {['active', 'inactive'].map(s => (
                                <label key={s} className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${formData.status === s
                                    // ? 'bg-primary-50 border-primary-200 text-primary-700'
                                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                    }`}>
                                    <input
                                        type="radio"
                                        name="status"
                                        value={s}
                                        checked={formData.status === s}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="hidden"
                                    />
                                    {formData.status === s && <Check size={14} className="animate-in zoom-in duration-300" />}
                                    <span className="text-sm font-medium capitalize">{s}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-sm font-semibold text-slate-700 block">Grant Permissions</label>
                        
                        <div className="overflow-hidden border border-slate-200 rounded-xl bg-slate-50">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-100 border-b border-slate-200">
                                        <th className="px-4 py-3 text-xs font-bold text-slate-600 uppercase tracking-wider">Resource</th>
                                        {ACTIONS.map(action => (
                                            <th key={action} className="px-4 py-3 text-xs font-bold text-slate-600 uppercase tracking-wider text-center">
                                                {action}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-100">
                                    {availablePermissions.map(permission => {
                                        const resourcePerm = formData.permissions.find(p => p.name === permission.name);
                                        return (
                                            <tr key={permission._id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-4 py-3">
                                                    <span className="text-sm font-bold text-slate-700">{permission.name}</span>
                                                </td>
                                                {ACTIONS.map(action => (
                                                    <td key={action} className="px-4 py-3 text-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleActionToggle(permission.name, action)}
                                                            className={`p-1 rounded transition-all ${
                                                                resourcePerm?.actions.includes(action)
                                                                // ? 'text-primary-600 bg-primary-50 scale-110'
                                                                ? 'text-indigo-600 bg-indigo-50 scale-110'
                                                                : 'text-slate-300 hover:text-slate-400'
                                                            }`}
                                                        >
                                                            {resourcePerm?.actions.includes(action) 
                                                                ? <CheckSquare size={20} strokeWidth={2.5} /> 
                                                                : <Square size={20} strokeWidth={2.5} />
                                                            }
                                                        </button>
                                                    </td>
                                                ))}
                                            </tr>
                                        );
                                    })}
                                    {availablePermissions.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-8 text-center text-slate-400 italic text-sm">
                                                No resources found. Create some in the Permissions module first.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Roles;
