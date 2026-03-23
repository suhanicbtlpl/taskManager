import React, { useState, useEffect, useCallback } from 'react';
import { permissionService } from '../services/api';
import { Table } from '../components/shared/Table';
import { Card, Button, Input, Modal } from '../components/shared/UIComponents';
import Search from '../components/shared/Search';
import Pagination from '../components/shared/Pagination';
import { Shield, Plus, Edit2, Trash2 } from 'lucide-react';

const Permissions = () => {
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPermission, setEditingPermission] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
    });

    const fetchPermissions = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await permissionService.getPermissions({
                page,
                limit,
                search,
            });
            setPermissions(data.data);
            setTotal(data.total);
            setTotalPages(data.pages);
        } catch (error) {
            console.error('Error fetching permissions', error);
        } finally {
            setLoading(false);
        }
    }, [page, limit, search]);

    useEffect(() => {
        fetchPermissions();
    }, [fetchPermissions]);

    const handleOpenModal = (permission = null) => {
        if (permission) {
            setEditingPermission(permission);
            setFormData({
                name: permission.name,
            });
        } else {
            setEditingPermission(null);
            setFormData({
                name: '',
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingPermission) {
                await permissionService.updatePermission(editingPermission._id, formData);
            } else {
                await permissionService.createPermission(formData);
            }
            setIsModalOpen(false);
            fetchPermissions();
        } catch (error) {
            alert(error.response?.data?.message || 'Action failed');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this permission resource? This might affect existing roles.')) {
            try {
                await permissionService.deletePermission(id);
                fetchPermissions();
            } catch (error) {
                alert('Delete failed');
            }
        }
    };

    const columns = [
        {
            header: 'Resource Name',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary-50 text-primary-600">
                        <Shield size={18} />
                    </div>
                    <div>
                        <p className="font-bold text-slate-800">{row.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium italic">Base Resource</p>
                    </div>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Permissions</h1>
                    <p className="text-slate-500">Manage base resources for access control</p>
                </div>
                <Button onClick={() => handleOpenModal()} className="gap-2">
                    <Plus size={18} />
                    Add Resource
                </Button>
            </div>

            <div className="flex gap-4">
                <Search onSearch={setSearch} placeholder="Search resources..." />
            </div>

            <Card className="p-0">
                <Table
                    columns={columns}
                    data={permissions}
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
                title={editingPermission ? 'Edit Resource' : 'Add New Resource'}
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSubmit}>{editingPermission ? 'Update' : 'Create'}</Button>
                    </>
                }
            >
                <form className="space-y-4">
                    <Input
                        label="Resource Name"
                        placeholder="e.g., Staff, Project, Document"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 flex gap-3">
                        <p className="text-[10px] text-blue-700 leading-relaxed italic">
                            Adding a resource here will automatically make it available for configuration in the Roles module with Create, Read, Update, and Delete actions.
                        </p>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Permissions;
