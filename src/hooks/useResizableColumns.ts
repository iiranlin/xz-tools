import ResizableTitle from '@/components/ResizableTitle';
import type { ProColumns } from '@ant-design/pro-components';
import type { ResizeCallbackData } from 'react-resizable';
import { useState } from 'react';

/**
 * 为 ProTable 列添加拖拽调整宽度功能的 Hook
 * @param initialColumns 初始列配置
 * @returns 包含列配置和 components 配置的对象
 */
export function useResizableColumns<T = any>(initialColumns: ProColumns<T>[]) {
    const [columns, setColumns] = useState<ProColumns<T>[]>(
        initialColumns.map((col) => ({
            ...col,
            // 如果列没有指定 width,为其设置一个默认宽度以支持拖拽
            width: col.width || 150,
        })),
    );

    const handleResize =
        (index: number) =>
            (_: React.SyntheticEvent, { size }: ResizeCallbackData) => {
                setColumns((prevColumns) => {
                    const newColumns = [...prevColumns];
                    newColumns[index] = {
                        ...newColumns[index],
                        width: size.width,
                    };
                    return newColumns;
                });
            };

    const mergedColumns = columns.map((col, index) => ({
        ...col,
        onHeaderCell: (column: ProColumns<T>) => ({
            width: column.width,
            onResize: handleResize(index),
        }),
    })) as ProColumns<T>[];

    const components = {
        header: {
            cell: ResizableTitle,
        },
    };

    return {
        columns: mergedColumns,
        components,
    };
}
