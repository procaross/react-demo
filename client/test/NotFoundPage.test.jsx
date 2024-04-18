import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';

import NotFoundPage from '../src/pages/NotFoundPage';

describe('NotFoundPage 组件', () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );
  });

  it('应该渲染一个包含404 - Page Not Found的标题', () => {
    const title = screen.getByText("404 - Page Not Found", { selector: 'h1' });
    expect(title).toBeInTheDocument();
  });

  it('标题应该具有适当的ID和类名', () => {
    const title = screen.getByRole('heading', { name: "404 - Page Not Found" });
    expect(title).toHaveAttribute('id', 'page-title');
    expect(title).toHaveClass('content__title');
  });
});