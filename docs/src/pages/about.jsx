import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const Page = () => {
  return (
    <div>
      <Helmet>
        <title>About</title>
      </Helmet>
      <Link to={'/'}>Homepage</Link>
      <h1>About us</h1>
      <p>
        Edit <code>src/pages/about.jsx</code> to get started
      </p>
    </div>
  );
};

export default Page;
