import AddProject from '@components/admin/projects/add-project';
import AdminListCard from '@shared/components/cards/admin-list-card';
import CmsPageTitle from '@shared/components/cards/cms-page-title';
import { permissionChecker } from '@shared/custom-function/common';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { projectActions } from 'store/admin/project/project.actions';
import { ProjectState } from 'store/admin/project/project.reducers';
import { StoreState } from 'store/root-reducer';

interface IProjectDetails extends Partial<ProjectState> {
  getProjectDetailsById: (id: string) => void;
}

function ProjectDetails({
  projectInfoCMS,
  getProjectDetailsById,
}: IProjectDetails) {
  const router = useRouter();
  const { id } = router.query;
  const childFunc = useRef<any>(null);

  useEffect(() => {
    if (id) getProjectDetailsById(String(id));
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const [isEdit, setIsEdit] = useState(false);

  const handleButtonChange = () => {
    if (!isEdit) return setIsEdit(true);
    childFunc.current();
  };

  const handleCancel = () => {
    setIsEdit(!isEdit);
    if (id) getProjectDetailsById(String(id));
  };

  return (
    <AdminListCard>
      <AdminListCard.Header className="d-flex flex-wrap align-items-center justify-content-between">
        <CmsPageTitle title="Project Detail" hasBackIcon />
        <div className="d-flex flex-wrap align-items-center">
          {isEdit && (
            <button
              className="admin-btn-cancel ctrl-mr"
              onClick={() => handleCancel()}
            >
              Cancel
            </button>
          )}
          {permissionChecker([
            'WEB-PROJECT-UPDATE',
            'WEB-PROJECT-UPDATE-ASSIGNED',
          ]) && (
            <button className="admin-btn-add" onClick={handleButtonChange}>
              {isEdit ? 'Save' : 'Edit'}
            </button>
          )}
        </div>
      </AdminListCard.Header>
      <hr className="break-line ctrl-mt" />
      <AdminListCard.Body xScrollable={false} className="pt-3">
        <AddProject
          isBeingEdited={isEdit}
          isDetailsPage={true}
          isEditDone={() => setIsEdit(false)}
          projectInfoCMS={projectInfoCMS}
          addProjectRef={childFunc}
        />
      </AdminListCard.Body>
    </AdminListCard>
  );
}

const mapStateToProps = (store: StoreState) => {
  const { projectInfoCMS } = store.project;

  return { projectInfoCMS };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  const { getProjectDetailByIdCMS } = projectActions;

  return {
    getProjectDetailsById: (id: string) =>
      dispatch(getProjectDetailByIdCMS(id) as any),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectDetails);
