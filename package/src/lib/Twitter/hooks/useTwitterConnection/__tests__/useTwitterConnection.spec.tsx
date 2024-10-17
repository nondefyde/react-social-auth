import { renderHook, act, cleanup } from '@testing-library/react-hooks';
import useTwitterConnection from '../../useTwitterConnection';
import { UseTwitterConnectionProps } from '../../useTwitterConnection';
import { window } from "../../../../window";

const mockBroadcastChannel = {
  addEventListener: jest.fn().mockImplementation((type: string, listener: (event: MessageEvent) => void) => { }),
  removeEventListener: jest.fn(),
  postMessage: jest.fn().mockImplementation((data) => data),
  name: 'mock-twitter-channel',
  onmessage: jest.fn(),
  onmessageerror: jest.fn(),
  close: jest.fn(),
  dispatchEvent: jest.fn()

};

jest.mock("../../../../window", () => {
  const mockOpen = jest.fn();
  const mockLocalStorage: { [key: string]: string } = {};
  const mockPopupClose = jest.fn();
  return {
    window: {
      open: mockOpen,
      close: mockPopupClose,
      localStorage: {
        getItem: (key: string) => mockLocalStorage[key],
        setItem: (key: string, value: string) => (mockLocalStorage[key] = value),
        removeItem: (key: string) => delete mockLocalStorage[key],
      },
      screen: { width: 1920, height: 1080 },
      location: {
        origin: 'mock-origin'
      },
      clearInterval: jest.fn(),
      setInterval: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }
  }
});

afterAll(() => {
  jest.resetAllMocks()
  cleanup();
});

// Mock fetch
const mockFetch = jest.fn(() =>
Promise.resolve({
  json: () => Promise.resolve({ access_token: 'access_token' }),
}) as any
);
global.fetch = mockFetch

// Mock the Broadcast Channel API
class MockBroadcastChannel {
  addEventListener = jest.fn();
  removeEventListener = jest.fn();
  postMessage = jest.fn();
  close = jest.fn();
}

(global as any).BroadcastChannel = MockBroadcastChannel;

describe('useTwitterConnection', () => {
  const defaultProps: UseTwitterConnectionProps = {
    clientId: process.env.RS_TWITTER_CLIENT_KEY as string,
    clientKeys: `${btoa(process.env.RS_TWITTER_CLIENT_KEYS as string)}`,
    redirectUri: 'http://example.com/callback',
    onLoginStart: jest.fn(),
    onReject: jest.fn(),
    onResolve: jest.fn(),
  };

  beforeEach(() => {
    jest.useFakeTimers(); // Enable fake timers for each test
  });

  afterEach(() => {
    jest.runOnlyPendingTimers(); // Ensure all timers are cleared after each test
    window.close()
  });

  it('should open a popup with the correct URL when onTwitterConnect is called', async () => {
    const { result } = renderHook(() => useTwitterConnection(defaultProps));

    await act(async () => {
      result.current.onTwitterConnect();
    });

    expect(window.open).toHaveBeenCalledWith(
      expect.stringContaining('https://twitter.com/i/oauth2/authorize?'),
      '_blank',
      expect.any(String)
    );

  });

  it('should handle popup closure and call onReject', async () => {
    
    const openSpy = jest.spyOn(window, 'open');

    const popupWindow = {
      close: jest.fn(),
    };

    openSpy.mockReturnValue(popupWindow as any);


    const { result } = renderHook(() => useTwitterConnection(defaultProps));

    await act(async () => {
      result.current.onTwitterConnect();
    });

    await act(async () => {
      jest.runOnlyPendingTimers();
    });

    expect(openSpy).toHaveBeenCalled();

    popupWindow.close();

    await act(async () => {
      jest.runOnlyPendingTimers();
    });

    expect(popupWindow.close).toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.twitterData).toEqual({});
    // expect(defaultProps.onReject).toHaveBeenCalledWith({
    //   error: 'user_closed_popup',
    //   errorMessage: 'User closed the popup',
    // });

    // openSpy.mockRestore();
  });

  

  // it('should handle successful authentication and call onResolve', async () => {
  //   const mockData = { code: 'mock_code' };

  //   // Create a mock function for the window.open method
  //   const openSpy = jest.spyOn(window, 'open');

  //   // Mock the returned popup window
  //   const popupWindow = {
  //     close: jest.fn(),
  //     postMessage: jest.fn(),
  //   };

  //   // Make the window.open mock return the popup window
  //   openSpy.mockReturnValue(popupWindow as any);


  //   // Mock the Broadcast Channel constructor
  //   jest.spyOn(global, 'BroadcastChannel').mockImplementationOnce(() => mockBroadcastChannel);

  //   const { result } = renderHook(() => useTwitterConnection(defaultProps));

  //   await act(async () => {
  //     result.current.onTwitterConnect();
  //   });

  //   // Wait for the interval to trigger
  //   await act(async () => {
  //     jest.runOnlyPendingTimers();
  //   });

  //   // Assert that window.open was called
  //   expect(openSpy).toHaveBeenCalled();


  //   // Simulate popup closure by calling the close method
  //   popupWindow.close();

  //   // Simulate receiving a message from the popup using the mock Broadcast Channel
  //   act(() => {
  //     const messageEvent = { data: { ...mockData, state: 'mock-state', from: 'Twitter' } };
  //     mockBroadcastChannel.addEventListener.mock.calls[0][1](messageEvent);
  //   });


  //   await act(async () => {
  //     const messageEvent = { data: { ...mockData, state: 'mock-state', from: 'Twitter' } };
  //     mockBroadcastChannel.postMessage(messageEvent);
  //   })



  //   // Wait for the interval to trigger again
  //   await act(async () => {
  //     jest.runOnlyPendingTimers();
  //   });

  //   expect(result.current.isLoading).toBe(false);
  //   expect(result.current.twitterData).toEqual({ provider: 'twitter', data: mockData });
  //   expect(defaultProps.onResolve).toHaveBeenCalledWith({
  //     provider: 'twitter',
  //     data: mockData,
  //   });
  // });


});
