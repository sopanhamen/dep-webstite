import AppTable from '@components/admin/table/app-table';
import AdminTableImg from '@shared/components/table/admin-table-img';
import { organizationHeader } from '@shared/constant';
import { toTitleCase } from '@shared/custom-function/conversion';
import { IMetadata } from '@shared/interfaces';
import { MAboutTeams } from '@shared/models/about-us/about-team';
import React from 'react';
import { connect } from 'react-redux';
import { StoreState } from 'store/root-reducer';

interface IAboutTeamTableProps {
  // redux props
  aboutTeams?: MAboutTeams[];
  isLoading?: boolean;
  metadata?: IMetadata;
}

function AboutTeamTable(props: IAboutTeamTableProps) {
  const { aboutTeams, isLoading, metadata } = props;

  return (
    <AppTable
      headers={organizationHeader}
      loading={isLoading}
      total={metadata?.total}
    >
      {aboutTeams?.map((item, index) => {
        return (
          <tr key={item?.id}>
            <td>{(metadata?.offset || 0) + index + 1}</td>
            <td>
              <AdminTableImg src={item?.imageUrl} alt={item?.name} />
            </td>
            <td>{item?.name}</td>
            <td>{item?.typeName}</td>
            <td>{item?.pillarName}</td>
            <td>
              {item?.sector?.map((e, i) => (
                <p key={i}>{e}</p>
              ))}
            </td>
            <td
              onClick={(evt) => {
                evt.stopPropagation();
              }}
            >
              <a href={item?.website} target="_blank" rel="noreferrer">
                {item?.website}
              </a>
            </td>
            <td>{item?.description}</td>
            <td className={`color-${item?.status?.toLowerCase()}`}>
              {toTitleCase(item?.status)}
            </td>
          </tr>
        );
      })}
    </AppTable>
  );
}

// store section
const mapStateToProps = (state: StoreState) => {
  return { ...state?.aboutUs?.aboutTeams };
};

export default connect(mapStateToProps, null)(AboutTeamTable);
