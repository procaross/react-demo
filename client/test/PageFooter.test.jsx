import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { PageFooter } from '../src/components/PageFooter';

describe('PageFooter 组件', () => {
  beforeEach(() => {
    render(<PageFooter />);
  });

  it('应该渲染 footer 元素', () => {
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('应该包含版权信息和当前年份', () => {
    const year = new Date().getFullYear();
    const copyright = screen.getByText(`© ${year} HAHA Cinema. All rights reserved.`);
    expect(copyright).toBeInTheDocument();
  });
});