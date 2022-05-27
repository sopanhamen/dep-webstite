import React, { useEffect, useState } from 'react';
import { Tab, TabContainer, TabPane, Tabs } from 'react-bootstrap';

interface IBaseTabs {
  tabs: string[];
  value: any;
  onChange: (evt: any) => void;
}

const BaseTabs = (props: IBaseTabs) => {
  const [key, setKey] = useState('home');

  useEffect(() => {
    console.log(key, 'keypanel');
  }, [key]);

  return (
    <>
      <Tabs activeKey={key} onSelect={(k: any) => setKey(k)} className="mb-3">
        <Tab eventKey="home" title="Home" />

        <Tab eventKey="profile" title="Profile" />
      </Tabs>

      <TabContainer>
        <TabPane eventKey={key}>home</TabPane>
        <TabPane active={true} eventKey={key}>
          profile
        </TabPane>
      </TabContainer>
    </>
  );
};

export default BaseTabs;
