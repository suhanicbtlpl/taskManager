import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ total, page, pages, limit, onPageChange, onLimitChange }) => {
    if (pages <= 0) return null;

    const limitOptions = [5, 10, 15, 20];

    return (
        <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-slate-100 rounded-b-xl">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-500">Rows per page:</span>
                    <select
                        className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-1 outline-none"
                        value={limit}
                        onChange={(e) => onLimitChange(Number(e.target.value))}
                    >
                        {limitOptions.map((opt) => (
                            <option key={opt} value={opt}>
                                {opt}
                            </option>
                        ))}
                    </select>
                </div>
                <span className="text-xs font-medium text-slate-500">
                    Showing <span className="text-slate-900">{total > 0 ? (page - 1) * limit + 1 : 0}</span> to{' '}
                    <span className="text-slate-900">{Math.min(page * limit, total)}</span> of{' '}
                    <span className="text-slate-900">{total}</span> results
                </span>
            </div>

            <div className="flex items-center gap-2">
                <button
                    disabled={page === 1}
                    onClick={() => onPageChange(page - 1)}
                    className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                >
                    <ChevronLeft size={18} />
                </button>
                <div className="flex items-center gap-1">
                    {[...Array(pages)].map((_, i) => {
                        const pageNum = i + 1;
                        // Simple pagination logic for many pages
                        if (
                            pages > 7 &&
                            pageNum !== 1 &&
                            pageNum !== pages &&
                            (pageNum < page - 1 || pageNum > page + 1)
                        ) {
                            if (pageNum === page - 2 || pageNum === page + 2) {
                                return <span key={pageNum} className="px-2 text-slate-400">...</span>;
                            }
                            return null;
                        }

                        return (
                            <button
                                key={pageNum}
                                onClick={() => onPageChange(pageNum)}
                                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                                    page === pageNum
                                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                                        : 'hover:bg-slate-100 text-slate-600'
                                }`}
                            >
                                {pageNum}
                            </button>
                        );
                    })}
                </div>
                <button
                    disabled={page === pages}
                    onClick={() => onPageChange(page + 1)}
                    className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                >
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
};

export default Pagination;
