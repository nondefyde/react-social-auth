import React, { useContext } from 'react';
import { render } from '@testing-library/react';
import FacebookContext, { FacebookContextInterface } from '../FacebookContext';

const mockContextValue: FacebookContextInterface = {
  isLoading: false,
  error: undefined,
  init: jest.fn().mockResolvedValue(undefined),
  api: undefined,
  parse: jest.fn().mockResolvedValue(undefined),
};

const ConsumerComponent: React.FC = () => {
  const context = useContext(FacebookContext);
  return (
    <div data-testid="context-values">
      <span data-testid="isLoading">{String(context?.isLoading)}</span>
      <span data-testid="error">{String(context?.error)}</span>
      <span data-testid="api">{String(context?.api)}</span>
    </div>
  );
};

describe('FacebookContext', () => {
  it('should provide the correct context values', () => {
    const { getByTestId } = render(
      <FacebookContext.Provider value={mockContextValue}>
        <ConsumerComponent />
      </FacebookContext.Provider>
    );

    const isLoading = getByTestId('isLoading').textContent;
    const error = getByTestId('error').textContent;
    const api = getByTestId('api').textContent;

    expect(isLoading).toBe('false');
    expect(error).toBe('undefined');
    expect(api).toBe('undefined');
  });
});
