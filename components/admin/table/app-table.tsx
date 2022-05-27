import { ITableHeader } from '@shared/interfaces';
import React from 'react';
import AppLoading from '../../../shared/components/loadings/app-loading';

interface IAppTableProps {
  headers?: ITableHeader[];
  children?: React.ReactNode;
  loading?: boolean;
  total?: number;
  isResponsive?: boolean;
}

function renderHeader(headers?: ITableHeader[]) {
  return headers?.map((h) => {
    return (
      <th key={h?.name} className={h?.class} style={h?.style}>
        {h?.name}
      </th>
    );
  });
}

export default function AppTable({
  headers,
  children,
  loading,
  total,
  isResponsive = false,
}: IAppTableProps) {
  return (
    <>
      <div className="app-table position-relative">
        <div className={`${isResponsive && 'table-responsive'}`}>
          <table className="table">
            <thead>
              <tr>{renderHeader(headers)}</tr>
            </thead>
            <tbody>{children || ''}</tbody>
            <tbody>
              {!total && (
                <tr className="no-data">
                  <td colSpan={100}>No data</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {loading && <AppLoading />}
      </div>
    </>
  );
}
