import ResourcehubCard from '@shared/components/cards/resource-hub';
import { IProjectNewsCardCommon } from '@shared/interfaces';
import { ResourceHubCardModel } from '@shared/models/resource-hub-card.model';
import { Fragment } from 'react';

interface IResourceHub extends IProjectNewsCardCommon {
  data: ResourceHubCardModel[];
}

function ResourceHubList({ data, isLoading, showImage }: IResourceHub) {
  return (
    <div className="container ">
      <div className="row my-4 g-3 g-md-4">
        {data.map((e, i) => (
          <div key={i} className="col-md-6 mt-3">
            <Fragment key={i}>
              <section className="resouce-hub">
                <ResourcehubCard
                  data={e}
                  index={i}
                  isLoading={true}
                  showImage={showImage}
                  readLessMore={(x) => {}}
                />
              </section>
            </Fragment>
          </div>
        ))}
      </div>
    </div>
  );
}
export default ResourceHubList;
