import ResizableTitle from '@/components/ResizableTitle';
import type { ProColumns } from '@ant-design/pro-components';
import type { ResizeCallbackData } from 'react-resizable';
import { useMemo, useRef, useState } from 'react';

/**
 * 为 ProTable 列添加拖拽调整宽度功能的 Hook
 * @param initialColumns 初始列配置
 * @returns 包含列配置和 components 配置的对象
 */
export function useResizableColumns<T = any>(initialColumns: ProColumns<T>[]) {
    // 使用 ref 保存初始列配置，避免因为外部引用变化导致重新初始化
    const initialColumnsRef = useRef(initialColumns);

    // 仅存储宽度信息，不存储整个列配置
    const [columnWidths, setColumnWidths] = useState<Record<number, number>>(() => {
        const widths: Record<number, number> = {};
        initialColumns.forEach((col, index) => {
            widths[index] = (col.width as number) || 150;
        });
        return widths;
    });

    const handleResize = useMemo(
        () => (index: number) => (_: React.SyntheticEvent, { size }: ResizeCallbackData) => {
            setColumnWidths((prevWidths) => ({
                ...prevWidths,
                [index]: size.width,
            }));
        },
        [],
    );

    // 使用 useMemo 合并初始列配置和宽度信息
    const mergedColumns = useMemo(() => {
        return initialColumns.map((col, index) => ({
            ...col,
            width: columnWidths[index],
            onHeaderCell: (column: ProColumns<T>) => ({
                width: columnWidths[index],
                onResize: handleResize(index),
            }),
        })) as ProColumns<T>[];
    }, [initialColumns, columnWidths, handleResize]);

    const components = useMemo(
        () => ({
            header: {
                cell: ResizableTitle,
            },
        }),
        [],
    );

    return {
        columns: mergedColumns,
        components,
    };
}
