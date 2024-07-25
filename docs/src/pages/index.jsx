import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import { sv } from 'stilvoll';

const Page = () => {
  return (
    <div>
      <Helmet>
        <title>Stilvoll</title>
      </Helmet>
      <Link to={'/about'}>Go to /about</Link>
      <h1>Home page</h1>
      <p>
        Edit <code>src/pages/index.jsx</code> to get started
      </p>
      <p>Here’s my public Env Variable:</p>
      <pre>{import.meta.env.PUBLIC_ENV_VARIABLE}</pre>
    </div>
  );
};

export default Page;
