import { useMemo } from "react";
import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TableProps<T> {
    columns: string[];
    data: T[];
    itemsPerPage?: number;
    currentPage: number;
    totalPages: number;
    onPageChange: (direction: 'prev' | 'next') => void;
    actions?: (item: T) => ReactNode;
    renderRow: (item: T) => Record<string, ReactNode>;
}

const ITEMS_PER_PAGE = 10;

function Table<T>({
    columns,
    data,
    itemsPerPage = ITEMS_PER_PAGE,
    currentPage,
    totalPages,
    onPageChange,
    actions,
    renderRow
}: TableProps<T>) {
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return data.slice(startIndex, startIndex + itemsPerPage);
    }, [data, currentPage, itemsPerPage]);

    return (
        <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full border-collapse bg-card">
                <thead className="bg-muted text-muted-foreground">
                    <tr>
                        <th className="border-b border-border p-4 text-left text-sm font-medium">#</th>
                        {columns.map((column) => (
                            <th key={column} className="border-b border-border p-4 text-left text-sm font-medium">
                                {column}
                            </th>
                        ))}
                        {actions && (
                            <th className="border-b border-border p-4 text-left text-sm font-medium">Actions</th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.map((row, index) => (
                        <tr key={index} className="hover:bg-muted/50 transition-colors">
                            <td className="border-b border-border p-4 text-sm">
                                {(currentPage - 1) * itemsPerPage + index + 1}
                            </td>
                            {columns.map((column) => (
                                <td key={column} className="border-b border-border p-4 text-sm">
                                    {renderRow(row)[column]}
                                </td>
                            ))}
                            {actions && (
                                <td className="border-b border-border p-4 text-sm">
                                    {actions(row)}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex items-center justify-between p-4">
                <p className="text-sm text-muted-foreground">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
                    {Math.min(currentPage * itemsPerPage, data.length)} of{' '}
                    {data.length} entries
                </p>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => {
                            onPageChange('prev');
                        }}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-border disabled:opacity-50"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            onPageChange('next');
                        }}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-border disabled:opacity-50"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Table;
