import '@testing-library/jest-dom'
import { render, screen } from "@testing-library/react"
import App from '../App';
import  FacebookProvider from '../../../package/src/lib/Facebook/components/FacebookProvider/FacebookProvider';

jest.mock('../../../package/src/lib/Facebook/hooks/useFacebookConnection/useFacebookConnection', () => {
  return {
    default: jest.fn(() => ({
      onFacebookConnect: jest.fn(),
      facebookData: {}
    }))
  }
});
describe('App component', () => {
  Object.defineProperty(window, 'matchMedia', {
    value: () => {
      return {
        matches: false,
        addListener: jest.fn(),
        removeListener: jest.fn(),
      };
    },
  });

  beforeEach(() => {
    render(
      <FacebookProvider appId={process.env.RS_FACEBOOK_APP_ID as string}>
        <App />
      </FacebookProvider>);
  })

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should match snapshot', () => {
    expect(screen).toMatchSnapshot();
  });

  it('Renders the App component', () => {
    expect(true).toBeTruthy()
  });

  it('Renders App component with App header', () => {
    const { container } = render(
      <FacebookProvider appId={process.env.RS_FACEBOOK_APP_ID as string}>
        <App />
      </FacebookProvider>
    );
    const headerElement = container.querySelector('.App-header');

    expect(headerElement).toBeInTheDocument();
    expect(headerElement).toHaveClass('App-header');

  });

  it('Renders App component with Greet component', () => {
    const appElement = screen.getByText('testing greeting here');
    const descriptionElement = screen.getByText('testing description here');

    expect(appElement).toBeInTheDocument();
    expect(descriptionElement).toBeInTheDocument();

  });

});
