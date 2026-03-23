import React, { useState, useEffect, useCallback } from 'react';
import { documentService } from '../services/api';
import { Table } from '../components/shared/Table';
import { Card, Button, Input, Modal } from '../components/shared/UIComponents';
import Search from '../components/shared/Search';
import Pagination from '../components/shared/Pagination';
import { FileText, Upload, Download, Trash2, File, FileImage, FileCode } from 'lucide-react';

const Documents = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [uploading, setUploading] = useState(false);

    const fetchDocuments = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await documentService.getDocuments({
                page,
                limit,
                search,
            });
            setDocuments(data.data);
            setTotal(data.total);
            setTotalPages(data.pages);
        } catch (error) {
            console.error('Error fetching documents', error);
        } finally {
            setLoading(false);
        }
    }, [page, limit, search]);

    useEffect(() => {
        fetchDocuments();
    }, [fetchDocuments]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        if (e.target.files[0] && !title) {
            setTitle(e.target.files[0].name.split('.')[0]);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file || !title) return alert('Please provide a title and select a file');

        const formData = new FormData();
        formData.append('title', title);
        formData.append('file', file);

        setUploading(true);
        try {
            await documentService.uploadDocument(formData);
            setIsModalOpen(false);
            setFile(null);
            setTitle('');
            fetchDocuments();
        } catch (error) {
            alert(error.response?.data?.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this document?')) {
            try {
                await documentService.deleteDocument(id);
                fetchDocuments();
            } catch (error) {
                alert('Delete failed');
            }
        }
    };

    const handleDownload = async (id, fileName) => {
        try {
            const response = await documentService.downloadDocument(id);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            alert('Download failed');
        }
    };

    const getFileIcon = (type) => {
        if (type?.includes('image')) return <FileImage size={18} className="text-blue-500" />;
        if (type?.includes('pdf')) return <FileText size={18} className="text-red-500" />;
        if (type?.includes('javascript') || type?.includes('html')) return <FileCode size={18} className="text-amber-500" />;
        return <File size={18} className="text-slate-400" />;
    };

    const formatSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const columns = [
        {
            header: 'Title',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-50">
                        {getFileIcon(row.fileType)}
                    </div>
                    <div>
                        <p className="font-bold text-slate-800">{row.title}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{row.fileName}</p>
                    </div>
                </div>
            )
        },
        {
            header: 'Size',
            render: (row) => <span className="text-xs text-slate-500">{formatSize(row.fileSize)}</span>
        },
        {
            header: 'Uploaded By',
            render: (row) => (
                <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-600">{row.uploadedBy?.name}</span>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Documents</h1>
                    <p className="text-slate-500">Securely upload and share project files</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="gap-2">
                    <Upload size={18} />
                    Upload File
                </Button>
            </div>

            <div className="flex gap-4">
                <Search onSearch={setSearch} placeholder="Search documents..." />
            </div>

            <Card className="p-0">
                <Table
                    columns={columns}
                    data={documents}
                    loading={loading}
                    actions={(row) => (
                        <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleDownload(row._id, row.fileName)}>
                                <Download size={16} />
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
                title="Upload Document"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleUpload} disabled={uploading}>
                            {uploading ? 'Uploading...' : 'Upload'}
                        </Button>
                    </>
                }
            >
                <form className="space-y-6">
                    <Input
                        label="Document Title"
                        placeholder="e.g., Project Proposal"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Select File</label>
                        <div className="relative">
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="hidden"
                                id="file-upload"
                            />
                            <label
                                htmlFor="file-upload"
                                className="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-slate-200 border-dashed rounded-xl appearance-none cursor-pointer hover:border-primary-500 focus:outline-none group"
                            >
                                <span className="flex items-center space-x-2">
                                    <Upload className="w-6 h-6 text-slate-400 group-hover:text-primary-500" />
                                    <span className="font-medium text-slate-600 group-hover:text-primary-500">
                                        {file ? file.name : 'Click to select or drag and drop'}
                                    </span>
                                </span>
                                {file && (
                                    <span className="text-xs text-slate-400 mt-2">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </span>
                                )}
                            </label>
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Documents;
