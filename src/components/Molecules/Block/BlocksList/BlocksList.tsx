import { Address } from "@/components/Atoms";
import { Timestamp } from "@/components/Atoms";
import { TableHeaderSorting, TableList } from "@/components/Shared";
import { defaultErrorMessage } from "@/utils/constants/shared.constants";
import { actionableWrapper, timestampParser } from "@/utils/functions";
import { None, Some, type Option } from "@/utils/option";
import { useGoldRush } from "@/utils/store";
import { type BlocksListProps } from "@/utils/types/molecules.types";
import { type CovalentAPIError } from "@/utils/types/shared.types";
import { type Pagination, type Block } from "@covalenthq/client-sdk";
import { type ColumnDef } from "@tanstack/react-table";
import { useCallback, useEffect, useState } from "react";

export const BlocksList: React.FC<BlocksListProps> = ({
    chain_name,
    page_size = 10,
    actionable_block = () => null,
}) => {
    const { covalentClient } = useGoldRush();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [maybeResult, setMaybeResult] =
        useState<Option<Block[] | null>>(None);
    const [pagination, setPagination] = useState<Pagination | null>(null);

    useEffect(() => {
        updateResult(null);
    }, [chain_name, page_size]);

    const updateResult = useCallback(
        async (_pagination: Pagination | null) => {
            try {
                setMaybeResult(None);
                setErrorMessage(null);
                const { data, ...error } =
                    await covalentClient.BaseService.getBlockHeightsByPage(
                        chain_name,
                        timestampParser(new Date(), "YYYY MM DD"),
                        "2100-01-01",
                        {
                            pageNumber: _pagination?.page_number ?? 0,
                            pageSize: _pagination?.page_size ?? page_size,
                        }
                    );
                if (error.error) {
                    throw error;
                }
                setPagination(data.pagination);
                setMaybeResult(new Some(data.items));
            } catch (error: CovalentAPIError | any) {
                setErrorMessage(error?.error_message ?? defaultErrorMessage);
                setMaybeResult(new Some(null));
                console.error(error);
            }
        },
        [chain_name]
    );

    const handleOnChangePagination = (updatedPagination: Pagination) => {
        setPagination(updatedPagination);
        updateResult(updatedPagination);
    };

    const columns: ColumnDef<Block>[] = [
        {
            accessorKey: "height",
            id: "height",
            header: ({ column }) => (
                <TableHeaderSorting<Block>
                    align="left"
                    header="Height"
                    column={column}
                />
            ),
            cell: ({ row }) =>
                actionableWrapper(
                    actionable_block(row.original.height),
                    row.original.height.toLocaleString()
                ),
        },
        {
            accessorKey: "signed_at",
            id: "signed_at",
            header: ({ column }) => (
                <TableHeaderSorting<Block>
                    align="left"
                    header="Signed At"
                    column={column}
                />
            ),
            cell: ({ row }) => (
                <Timestamp
                    timestamp={row.original.signed_at}
                    defaultType="relative"
                />
            ),
        },
        {
            accessorKey: "block_hash",
            id: "block_hash",
            header: ({ column }) => (
                <TableHeaderSorting<Block>
                    align="left"
                    header="Block Hash"
                    column={column}
                />
            ),
            cell: ({ row }) => <Address address={row.original.block_hash} />,
        },
        {
            accessorKey: "gas_used",
            id: "gas_used",
            header: ({ column }) => (
                <TableHeaderSorting<Block>
                    align="left"
                    header="Gas Used"
                    column={column}
                />
            ),
            cell: ({ row }) =>
                `${((row.original.gas_used / row.original.gas_limit) * 100).toFixed(2)}%`,
        },
        {
            accessorKey: "gas_limit",
            id: "gas_limit",
            header: ({ column }) => (
                <TableHeaderSorting<Block>
                    align="left"
                    header="Gas Limit"
                    column={column}
                />
            ),
            cell: ({ row }) => row.original.gas_limit.toLocaleString(),
        },
    ];

    return (
        <TableList<Block>
            columns={columns}
            errorMessage={errorMessage}
            maybeData={maybeResult}
            pagination={pagination}
            onChangePaginationHandler={handleOnChangePagination}
        />
    );
};
