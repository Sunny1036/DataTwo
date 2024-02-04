// ParentComponent.js
import React from 'react';
import Database from '../db/database'
import ApiFactory from '../../ApiFactory/ApiFactory';

const ParentComponent = () => {
  return (
    <>
      <Database />
      <ApiFactory/>
    </>
  );
};

export default ParentComponent;
