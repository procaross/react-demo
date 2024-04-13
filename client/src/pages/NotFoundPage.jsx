import React from 'react';
import { PageLayout } from '../components/PageLayout';

const NotFoundPage = () => (
  <PageLayout>
    <div className="content-layout">
      <h1 id="page-title" className="content__title">
        404 - Page Not Found
      </h1>
    </div>
  </PageLayout>
);

export default NotFoundPage;