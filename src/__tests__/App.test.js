import {render, screen} from '@testing-library/react';
import App from '../App';
import { BrowserRouter } from 'react-router-dom';

test('renders', () => {
    render(<BrowserRouter>
        <App />
      </BrowserRouter>);
    const attribution = screen.getByText(/Background Photo by/);
    expect(attribution).toBeInTheDocument();
});