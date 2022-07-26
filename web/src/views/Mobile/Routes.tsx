import React from 'react';
import { Route } from 'react-router-dom';

const MobileRoutes = () => {
  return (
    <>
      <Route path="/" component={() => <span>Dashboard</span>} />
      <Route path="/accounts" component={() => <span>accounts</span>} />
    </>
  );
};

export default MobileRoutes;
