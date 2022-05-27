import { EStatus } from '@shared/enum';
import { IAction } from '@shared/interfaces';
import React from 'react';
import { Dropdown } from 'react-bootstrap';

interface IMore {
  actions: IAction[];
  selectedActions: (value: EStatus) => void;
}

/**
 *
 * @param actions type of IAction
 * @returns selectedActions value of selected dropdown value
 */
function MoreDropDown({ actions, selectedActions }: IMore) {
  const checkSelected = (e: any) => {
    switch (String(e)) {
      case 'Public':
      case 'Activate':
        return selectedActions(EStatus.ACTIVE);
      case 'Private':
      case 'Deactivate':
      case 'Delete':
        return selectedActions(EStatus.INACTIVE);
      case 'Pending':
        return selectedActions(EStatus.PENDING);
      default:
        return selectedActions(e);
    }
  };

  return (
    <Dropdown className="app-table-dropdown" onSelect={checkSelected}>
      <Dropdown.Toggle variant="link">More</Dropdown.Toggle>
      <Dropdown.Menu className="text-center">
        {actions.map((e, i) => (
          <Dropdown.Item key={i} eventKey={e.name}>
            <p className={`color-${e.color}`}>{e.name}</p>
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default MoreDropDown;
