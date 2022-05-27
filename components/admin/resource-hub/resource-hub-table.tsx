import AppTable from '@components/admin/table/app-table';
import FileBadge from '@shared/components/badges/file-badge';
import FlagBadge from '@shared/components/badges/flag-badge';
import MoreDropDown from '@shared/components/drop-down-button';
import { resourceHubTableHeaders } from '@shared/constant';
import { formatISODate, toTitleCase } from '@shared/custom-function/conversion';
import { EStatus, ETextColor } from '@shared/enum';
import { IAction } from '@shared/interfaces';
import { MLanguage } from '@shared/models/language.model';
import { MResourceHub } from '@shared/models/resource-hub.model';
import { useRouter } from 'next/router';
import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import ResourceHubActions from 'store/admin/resource-hub/resource-hub.action';
import { StoreState } from 'store/root-reducer';

// ================ static data ===================
const activeAction: IAction = {
  name: 'Public',
  color: ETextColor.BLUE,
};
const inactiveAction: IAction = {
  name: 'Private',
  color: ETextColor.RED,
};
// =============== end static data ================

interface IResourceHubTable {
  // redux props
  toggleResourceHub?: (id: string) => void;
  resourceHubs?: MResourceHub[];
  isLoading?: boolean;
}

function ResourceHubTable(props: IResourceHubTable) {
  const { toggleResourceHub, resourceHubs, isLoading } = props;
  const router = useRouter();

  // functions section
  const handleMoreActions = (id: string) => {
    if (toggleResourceHub) toggleResourceHub(id);
  };

  // elements section
  const extensionBadges = (extensions: string[]): JSX.Element => {
    return (
      <>
        {extensions?.length
          ? extensions?.map((extension) => {
              return <FileBadge key={extension} label={extension} />;
            })
          : null}
      </>
    );
  };

  const flagBadges = (languages: MLanguage[]) => {
    return (
      <div className="d-inline-flex">
        {languages?.length
          ? languages?.map((language: MLanguage) => (
              <FlagBadge key={language?.id} src={language?.imageUrl} />
            ))
          : null}
      </div>
    );
  };

  const goToDetail = (id: string) => {
    router.push(`resource-hub/${id}`);
  };

  return (
    <AppTable
      headers={resourceHubTableHeaders}
      loading={isLoading}
      total={resourceHubs?.length}
    >
      {resourceHubs?.map((resource, index) => {
        return (
          <tr
            key={resource?.id}
            onClick={() => goToDetail(resource?.id)}
            className="cursor-pointer"
          >
            <td>{resource?.titleInKhmer}</td>
            <td>{resource?.titleInEnglish}</td>
            <td>{resource?.pillar}</td>
            <td>{resource?.types}</td>
            <td>{extensionBadges(resource?.extensions)}</td>
            <td>{flagBadges(resource?.languages)}</td>
            <td>{formatISODate(resource?.publishedAt)}</td>
            <td>{resource?.resourceOrg}</td>
            <td className={`color-${resource?.status?.toLowerCase()}`}>
              {toTitleCase(resource?.status)}
            </td>
            <td
              onClick={(evt) => {
                evt.preventDefault();
                evt.stopPropagation();
              }}
            >
              <MoreDropDown
                actions={[
                  resource?.status === EStatus.ACTIVE
                    ? inactiveAction
                    : activeAction,
                ]}
                selectedActions={() => handleMoreActions(resource?.id)}
              />
            </td>
          </tr>
        );
      })}
    </AppTable>
  );
}

// store section
const mapStateToProps = (state: StoreState) => {
  return { ...state?.resourceHub };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  const { toggleResourceHub } = ResourceHubActions;
  return {
    toggleResourceHub: (id: string) => dispatch(toggleResourceHub(id) as any),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ResourceHubTable);
