import React from 'react';
import {render, screen} from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import {buttonClick} from '../static/helpers/testActions';
import Home from '../Home';

const uOrgless = {email: 'test@test.com',
            firstName: 'Bob',
            lastName: 'Testy',
            superAdmin: false};

const uOrgs = {email: 'test@test.com',
            firstName: 'Bob',
            lastName: 'Testy',
            superAdmin: false, 
            organizations: {1: {adminLevel: 1, orgName: 'testOrg'}}};

const renderComponent = (user) => {
    return render(<BrowserRouter>
                        <Home user={user} />
                    </BrowserRouter>);
};


test('renders', () => {
    renderComponent();
    expect(screen.getByPlaceholderText('Organization Name')).toBeInTheDocument();
});

test('shows correct buttons anon', () => {
    renderComponent();
    expect(screen.getByText('Search Organizations')).toBeInTheDocument();
    expect(screen.queryByText('Create New Organization')).not.toBeInTheDocument();
    expect(screen.queryByText('My Organizations')).not.toBeInTheDocument();
    expect(screen.getByText('Build Season')).toBeInTheDocument();
});

test('shows correct buttons logged in, user has no orgs', () => {
    renderComponent(uOrgless);
    expect(screen.getByText('Search Organizations')).toBeInTheDocument();
    expect(screen.getByText('Create New Organization')).toBeInTheDocument();
    expect(screen.queryByText('My Organizations')).not.toBeInTheDocument();
    expect(screen.getByText('Build Season')).toBeInTheDocument();
});

test('shows correct buttons logged in, user has orgs', () => {
    renderComponent(uOrgs);
    expect(screen.getByText('Search Organizations')).toBeInTheDocument();
    expect(screen.getByText('Create New Organization')).toBeInTheDocument();
    expect(screen.getByText('My Organizations')).toBeInTheDocument();
    expect(screen.getByText('Build Season')).toBeInTheDocument();
});

test('buttons work', async () => {
    renderComponent(uOrgs);
    await buttonClick('My Organizations');
    expect(screen.getByText('testOrg')).toBeInTheDocument();
    expect(screen.queryByText('Search')).not.toBeInTheDocument();
    await buttonClick('Create New Organization');
    expect(screen.getByText('Submit')).toBeInTheDocument();
    expect(screen.queryByText('testOrg')).not.toBeInTheDocument();
    await buttonClick('Search Organizations');
    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.queryByText('Submit')).not.toBeInTheDocument();
    await buttonClick('Build Season');
    expect(screen.getByText("Seasons created here will not be saved. To save a season, navigate to your organization's home page.")).toBeInTheDocument();
    expect(screen.queryByText('Search')).not.toBeInTheDocument();
});