import '@testing-library/jest-dom'
import { render, screen } from "@testing-library/react"
import App from '../App';

describe('Example component', () => {
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
    render(<App />);
  });

  it('Should match snapshot', () => {
    expect(screen).toMatchSnapshot();
  });

  it('Renders the App component', () => {
    expect(true).toBeTruthy()
  });

  it('Renders App component with App header', () => {
    const { container } = render(<App/>);
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
