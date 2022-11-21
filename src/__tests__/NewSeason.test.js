import React from 'react';
import {render, screen} from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NewSeason from '../NewSeason';

const component = <BrowserRouter>
                        <NewSeason />
                    </BrowserRouter>

const renderComponent = (orgId) => {
    return render(<BrowserRouter>
                    <NewSeason orgId={orgId} />
                </BrowserRouter>)
}

test('renders from home', () => {
    renderComponent();
    const warning = screen.getByText(
        "Seasons created here will not be saved. To save a season, navigate to your organization's home page.");
    expect(warning).toBeInTheDocument();
});

test('renders from org', () => {
    renderComponent(1);
    const warning = screen.queryByText(
        "Seasons created here will not be saved. To save a season, navigate to your organization's home page.");
    expect(warning).not.toBeInTheDocument();
});

test('matches snapshot', () => {
    const {asFragment} = renderComponent();;
    expect(asFragment()).toMatchSnapshot();
});