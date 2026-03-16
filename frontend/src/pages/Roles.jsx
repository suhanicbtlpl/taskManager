import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { roleService } from '../services/api';
import { Table } from '../components/shared/Table';
import { Card, Button, Input, Modal } from '../components/shared/UIComponents';
import { ShieldCheck, Edit2, Trash2, Plus } from 'lucide-react';

const Roles = () => {
    const { user } = useAuth();
    const isAdmin = user?.role?.roleName === 'Admin';
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState(null);
    const [formData, setFormData] = useState({
        roleName: '',
        status: 'active',
        permissions: [],
    });

    const permissionList = [
        'CREATE_STAFF', 'VIEW_STAFF', 'UPDATE_STAFF', 'DELETE_STAFF',
        'CREATE_PROJECT', 'VIEW_PROJECT', 'UPDATE_PROJECT', 'DELETE_PROJECT',
        'CREATE_TASK', 'VIEW_TASK', 'UPDATE_TASK', 'DELETE_TASK',
        'CREATE_ROLE', 'VIEW_ROLE', 'UPDATE_ROLE', 'DELETE_ROLE'
    ];

    const fetchRoles = async () => {
        setLoading(true);
        try {
            const { data } = await roleService.getRoles();
            setRoles(data);
        } catch (error) {
            console.error('Error fetching roles', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    const handleOpenModal = (role = null) => {
        if (role) {
            setEditingRole(role);
            setFormData({
                roleName: role.roleName,
                status: role.status,
                permissions: role.permissions,
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

    const handlePermissionToggle = (permission) => {
        const updatedPermissions = formData.permissions.includes(permission)
            ? formData.permissions.filter(p => p !== permission)
            : [...formData.permissions, permission];
        setFormData({ ...formData, permissions: updatedPermissions });
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
        { header: 'Role Name', key: 'roleName' },
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
                <div className="flex flex-wrap gap-1 max-w-xs">
                    {row.permissions.slice(0, 3).map(p => (
                        <span key={p} className="px-1.5 py-0.5 bg-slate-100 text-[10px] rounded text-slate-500 font-medium">
                            {p.split('_')[0]}
                        </span>
                    ))}
                    {row.permissions.length > 3 && (
                        <span className="text-[10px] text-slate-400">+{row.permissions.length - 3} more</span>
                    )}
                </div>
            )
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Roles & Permissions</h1>
                    <p className="text-slate-500">Define access levels and system permissions</p>
                </div>
                <Button onClick={() => handleOpenModal()} className="gap-2">
                    <ShieldCheck size={18} />
                    Create New Role
                </Button>
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
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingRole ? 'Edit Role' : 'Create Role'}
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
                        placeholder="e.g., Project Manager"
                        value={formData.roleName}
                        onChange={(e) => setFormData({ ...formData, roleName: e.target.value })}
                        required
                    />

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Status</label>
                        <div className="flex gap-4">
                            {['active', 'inactive'].map(s => (
                                <label key={s} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="status"
                                        value={s}
                                        checked={formData.status === s}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="text-primary-600 focus:ring-primary-500"
                                    />
                                    <span className="text-sm text-slate-600 capitalize">{s}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-slate-700">Permissions</label>
                        <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto p-4 bg-slate-50 rounded-xl border border-slate-100">
                            {permissionList.map(permission => (
                                <label key={permission} className="flex items-center gap-2 group cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.permissions.includes(permission)}
                                        onChange={() => handlePermissionToggle(permission)}
                                        className="rounded border-slate-300 text-primary-600 focus:ring-primary-500 h-4 w-4"
                                    />
                                    <span className="text-xs text-slate-600 group-hover:text-slate-900 transition-colors">
                                        {permission.replace(/_/g, ' ')}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Roles;
