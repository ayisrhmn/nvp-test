import { Table, flexRender } from "@tanstack/react-table";
import { ButtonProps, Input, Modal, Spin } from "antd";
import Button from "../atoms/Button";
import { PlusOutlined } from "@ant-design/icons";
import { SearchProps } from "antd/es/input";
import { Skeleton, Pagination, PaginationProps } from "antd";
import Alert from "@/components/atoms/Alert";
import { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import RowActions from "./RowActions";

const { Search } = Input;

interface TableProps {
  config: Table<any>;
  queryResults: UseQueryResult<
    {
      items: any;
      count: any;
    },
    Error
  >;
  page: number;
  pageSize: number;
  onSearch?: SearchProps["onSearch"];
  onClickAdd?: ButtonProps["onClick"];
  onConfirmDelete?: (id: number) => void;
  onPageChange: PaginationProps["onChange"];
}

export default function DataTable({
  config,
  queryResults,
  page,
  pageSize,
  onSearch,
  onClickAdd,
  onConfirmDelete,
  onPageChange,
}: TableProps) {
  const results = queryResults;
  return (
    <>
      <div className="mb-6 flex gap-12">
        <Search
          placeholder="Search by product title"
          enterButton
          size="large"
          onSearch={onSearch}
        />
        <Button
          icon={<PlusOutlined />}
          type="primary"
          size="large"
          onClick={onClickAdd}
        >
          Add Product
        </Button>
      </div>
      {results.status === "pending" ? (
        <Skeleton active />
      ) : results.status === "error" ? (
        <Alert
          message="Error"
          description={results.error?.message}
          type="error"
          showIcon
        />
      ) : (
        <Spin spinning={results.isFetching} size="large">
          <table className="min-w-full divide-y divide-gray-200 mb-8">
            <thead>
              {config.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              ))}
            </thead>
            <tbody>
              {config.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-6 py-4 whitespace-no-wrap border-b border-gray-200"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                    <RowActions
                      onClickDelete={() => {
                        Modal.confirm({
                          title: row.original.title,
                          content: "Are you sure delete this data?",
                          footer: (_, { OkBtn, CancelBtn }) => (
                            <>
                              <CancelBtn />
                              <OkBtn />
                            </>
                          ),
                          onOk: () => onConfirmDelete?.(row.original.id),
                        });
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Spin>
      )}
      <div className="flex items-center justify-center">
        <Pagination
          current={page}
          total={results.data?.count}
          pageSize={pageSize}
          pageSizeOptions={[5, 10, 20, 50]}
          onChange={onPageChange}
        />
      </div>
    </>
  );
}