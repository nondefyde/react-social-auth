import { renderHook } from '@testing-library/react-hooks';
import useFacebook from '../../../lib/Facebook/hooks/useFacebook';
import { FacebookContextInterface } from '../../../lib/Facebook/components/FacebookContext';
import { useContext } from 'react';

jest.mock('react', () => {
  const originalModule = jest.requireActual('react');
  return {
    ...originalModule,
    useContext: jest.fn(),
  };
});

describe('useFacebook', () => {
  it('should throw an error if used outside FacebookProvider', () => {
    (useContext as jest.Mock).mockReturnValue(undefined);

    const { result } = renderHook(() => useFacebook());

    expect(result.error).toMatchInlineSnapshot(
      `[Error: useFacebook must be used within a FacebookProvider]`
    );
  });

  it('should return the FacebookContextInterface', () => {
    const mockContextValue: FacebookContextInterface = {
      isLoading: false,
      error: undefined,
      init: jest.fn().mockResolvedValue(undefined),
      api: undefined,
      parse: jest.fn().mockResolvedValue(undefined),
    };

    (useContext as jest.Mock).mockReturnValue(mockContextValue);

    const { result } = renderHook(() => useFacebook());

    expect(result.current).toEqual(mockContextValue);
  });

  it('should call context.init when lazy is false', () => {
    const mockContextValue: FacebookContextInterface = {
      isLoading: false,
      error: undefined,
      init: jest.fn().mockResolvedValue(undefined),
      api: undefined,
      parse: jest.fn().mockResolvedValue(undefined),
    };

    (useContext as jest.Mock).mockReturnValue(mockContextValue);

    renderHook(() => useFacebook({ lazy: false }));

    expect(mockContextValue.init).toHaveBeenCalledTimes(1);
  });

  it('should not call context.init when lazy is true', () => {
    const mockContextValue: FacebookContextInterface = {
      isLoading: false,
      error: undefined,
      init: jest.fn().mockResolvedValue(undefined),
      api: undefined,
      parse: jest.fn().mockResolvedValue(undefined),
    };

    (useContext as jest.Mock).mockReturnValue(mockContextValue);

    renderHook(() => useFacebook({ lazy: true }));

    expect(mockContextValue.init).not.toHaveBeenCalled();
  });
});
