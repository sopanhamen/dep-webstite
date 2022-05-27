import {
  IClientSummaryCardData,
  IClientSummaryCardProps,
} from '@shared/interfaces';
import React from 'react';
import ClientSummaryCard from './client-summary-card';

interface IClientSummaryArrayProps extends Partial<IClientSummaryCardProps> {
  dataArray: IClientSummaryCardData[];
}

function ClientSummaryArray(props: IClientSummaryArrayProps): JSX.Element {
  return (
    <section className="container" style={{ minHeight: '500px' }}>
      <div className="row gx-lg-5">
        {!props?.isLoading
          ? props?.dataArray?.map((e, i) => (
              <div key={`project-${i}`} className="col-md-6 mt-3">
                <ClientSummaryCard {...props} data={e} />
              </div>
            ))
          : Array(10)
              .fill('')
              .map((e, i) => (
                <div key={`project-${i}`} className="col-md-6 mt-3">
                  <ClientSummaryCard {...props} isLoading={true} />
                </div>
              ))}
      </div>
    </section>
  );
}

export default ClientSummaryArray;
