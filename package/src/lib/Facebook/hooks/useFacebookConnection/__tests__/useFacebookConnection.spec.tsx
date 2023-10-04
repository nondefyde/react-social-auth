import { renderHook, act, cleanup } from '@testing-library/react-hooks';
import useFacebookConnection from '../useFacebookConnection';

jest.mock('../../useFacebook/useFacebook', () => {
  return {
    __esModule: true,
    default: () => ({
      isLoading: false,
      init: async () => ({
        getFB: async () => ({
          login: (callback: Function, options: object) => {
            callback({ authResponse: { accessToken: 'mockAccessToken' } });
          },
        }),
      }),
    }),
  };
});

describe('useFacebookConnection', () => {
  it('should return the correct initial values', () => {
    const { result } = renderHook(() => useFacebookConnection({}));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.facebookData).toEqual({});
  });

  it('should call onFacebookConnect and update facebookData', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useFacebookConnection({}));

    expect(result.current.facebookData).toEqual({});

    await act(async () => {
      result.current.onFacebookConnect();
      await waitForNextUpdate();
    });

    expect(result.current.facebookData).toEqual({ accessToken: 'mockAccessToken' });
  });
});
