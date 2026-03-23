import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { staffService, roleService } from '../services/api';
import { Table } from '../components/shared/Table';
import { Card, Button, Input, Modal } from '../components/shared/UIComponents';
import Search from '../components/shared/Search';
import Pagination from '../components/shared/Pagination';
import { Plus, Edit2, Trash2, UserPlus, Mail, Phone, Shield } from 'lucide-react';

const Staff = () => {
    const { user } = useAuth();
    const isAdmin = user?.role?.roleName === 'Admin';
    
    const [staff, setStaff] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState('');
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        mobileNumber: '',
        role: '',
    });

    const fetchStaff = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await staffService.getStaff({
                page,
                limit,
                search,
            });
            setStaff(data.data);
            setTotal(data.total);
            setTotalPages(data.pages);
        } catch (error) {
            console.error('Error fetching staff', error);
        } finally {
            setLoading(false);
        }
    }, [page, limit, search]);

    const fetchRoles = async () => {
        try {
            const { data } = await roleService.getRoles({ limit: 1000 });
            setRoles(data.data);
        } catch (error) {
            console.error('Error fetching roles', error);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, [fetchStaff]);

    useEffect(() => {
        fetchRoles();
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
            fetchStaff();
        } catch (error) {
            alert(error.response?.data?.message || 'Action failed');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this staff member?')) {
            try {
                await staffService.deleteStaff(id);
                fetchStaff();
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
                    <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 font-bold border border-primary-100 shadow-sm">
                        {row.name[0].toUpperCase()}
                    </div>
                    <div>
                        <p className="font-bold text-slate-800">{row.name}</p>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                            <Mail size={10} />
                            {row.email}
                        </div>
                    </div>
                </div>
            )
        },
        { 
            header: 'Contact', 
            render: (row) => (
                <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                    <Phone size={12} className="text-slate-400" />
                    {row.mobileNumber}
                </div>
            )
        },
        {
            header: 'Role',
            render: (row) => (
                <div className="flex items-center gap-1.5">
                    <Shield size={12} className="text-indigo-500" />
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {row.role?.roleName || 'No Role'}
                    </span>
                </div>
            )
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Staff Directory</h1>
                    <p className="text-slate-500">Manage team members and system access</p>
                </div>
                <Button onClick={() => handleOpenModal()} className="gap-2">
                    <UserPlus size={18} />
                    Add Staff Member
                </Button>
            </div>

            <div className="flex gap-4">
                <Search onSearch={setSearch} placeholder="Search by name or email..." />
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
                                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all text-sm"
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
