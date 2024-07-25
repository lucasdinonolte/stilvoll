import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Helmet } from 'react-helmet-async';
import { useRoutes } from 'react-router-dom';

import './styles/reset.css';
import './styles/fonts.css';
import './styles/variables.css';
import './styles/globals.css';
import 'virtual:util.css';

import routes from '@routes';

const App = () => {
  return (
    <HelmetProvider>
      <div>
        <Helmet>
          <title>__My Project__</title>
        </Helmet>
        {useRoutes(routes)}
      </div>
    </HelmetProvider>
  );
};

export default App;
