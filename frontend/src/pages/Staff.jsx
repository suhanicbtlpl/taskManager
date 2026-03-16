import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { staffService, roleService } from '../services/api';
import { Table } from '../components/shared/Table';
import { Card, Button, Input, Modal } from '../components/shared/UIComponents';
import { Plus, Edit2, Trash2, UserPlus } from 'lucide-react';

const Staff = () => {
    const { user } = useAuth();
    const isAdmin = user?.role?.roleName === 'Admin';
    const [staff, setStaff] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        mobileNumber: '',
        role: '',
    });

    const fetchStaffAndRoles = async () => {
        setLoading(true);
        try {
            const [staffRes, rolesRes] = await Promise.all([
                staffService.getStaff(),
                roleService.getRoles()
            ]);
            setStaff(staffRes.data);
            setRoles(rolesRes.data);
        } catch (error) {
            console.error('Error fetching data', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaffAndRoles();
    }, []);

    const handleOpenModal = (staffMember = null) => {
        if (staffMember) {
            setEditingStaff(staffMember);
            setFormData({
                name: staffMember.name,
                email: staffMember.email,
                password: '',
                mobileNumber: staffMember.mobileNumber,
                role: staffMember.role?._id || '',
            });
        } else {
            setEditingStaff(null);
            setFormData({
                name: '',
                email: '',
                password: '',
                mobileNumber: '',
                role: '',
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingStaff) {
                await staffService.updateStaff(editingStaff._id, formData);
            } else {
                await staffService.createStaff(formData);
            }
            setIsModalOpen(false);
            fetchStaffAndRoles();
        } catch (error) {
            alert(error.response?.data?.message || 'Action failed');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this staff member?')) {
            try {
                await staffService.deleteStaff(id);
                fetchStaffAndRoles();
            } catch (error) {
                alert('Delete failed');
            }
        }
    };

    const columns = [
        {
            header: 'Staff Member',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">
                        {row.name[0].toUpperCase()}
                    </div>
                    <div>
                        <p className="font-semibold text-slate-800">{row.name}</p>
                        <p className="text-xs text-slate-500">{row.email}</p>
                    </div>
                </div>
            )
        },
        { header: 'Mobile', key: 'mobileNumber' },
        {
            header: 'Role',
            render: (row) => (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-50 text-primary-700 border border-primary-100">
                    {row.role?.roleName || 'No Role'}
                </span>
            )
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Staff Management</h1>
                    <p className="text-slate-500">Manage your team members and their roles</p>
                </div>
                <Button onClick={() => handleOpenModal()} className="gap-2">
                    <UserPlus size={18} />
                    Add Staff Member
                </Button>
            </div>

            <Card className="p-0">
                <Table
                    columns={columns}
                    data={staff}
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
                title={editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSubmit}>{editingStaff ? 'Update Staff' : 'Create Staff'}</Button>
                    </>
                }
            >
                <form className="space-y-4">
                    <Input
                        label="Full Name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <Input
                        label="Email Address"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        type="email"
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Mobile Number"
                            placeholder="+1 234 567 890"
                            value={formData.mobileNumber}
                            onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                            required
                        />
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700">Role</label>
                            <select
                                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                required
                            >
                                <option value="">Select Role</option>
                                {roles.map(role => (
                                    <option key={role._id} value={role._id}>{role.roleName}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {!editingStaff && (
                        <Input
                            label="Password"
                            placeholder="••••••••"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    )}
                </form>
            </Modal>
        </div>
    );
};

export default Staff;
