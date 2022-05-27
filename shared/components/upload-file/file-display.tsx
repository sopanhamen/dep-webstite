import React from 'react';

interface IFileDisplay {
  value?: string;
}

function FileDisplay(props: IFileDisplay) {
  const { value } = props;
  return (
    <div className="d-flex align-items-center">
      <i className="fa fa-file-o me-2" aria-hidden="true"></i>
      <p className="file-display">{value}</p>
    </div>
  );
}

export default FileDisplay;
