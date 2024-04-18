import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { PageLoader } from '../src/components/PageLoader';

describe('PageLoader 组件', () => {
  beforeEach(() => {
    render(<PageLoader />);
  });

  it('应该正确渲染加载图片', () => {
    const loadingImage = screen.getByRole('img');
    expect(loadingImage).toBeInTheDocument();
  });

  it('图像应具有正确的源和替代文本', () => {
    const expectedSrc = "https://cdn.auth0.com/blog/hello-auth0/loader.svg";
    const loadingImage = screen.getByRole('img');

    expect(loadingImage).toHaveAttribute('src', expectedSrc);
    expect(loadingImage).toHaveAttribute('alt', 'Loading...');
  });

  it('应该在正确的类名容器中包含图像', () => {
    const loaderDiv = screen.getByRole('img').parentElement;
    expect(loaderDiv).toHaveClass('loader');
  });
});