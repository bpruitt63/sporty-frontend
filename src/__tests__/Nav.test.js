import React from 'react';
import {render, screen} from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import {buttonClick, uOrgless} from '../static/helpers/testActions';
import NavB from '../NavB';

const renderComponent = (user) => {
    return render(<BrowserRouter>
                    <NavB user={user} />
                </BrowserRouter>);
};


test('renders', () => {
    renderComponent();
    expect(screen.getByText('Sporty')).toBeInTheDocument();
});

test('has login dropdown if anon', async () => {
    renderComponent();
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.queryByText('Bob Testy')).not.toBeInTheDocument();
    expect(screen.queryByText('Edit Profile')).not.toBeInTheDocument();
    expect(screen.queryByText('Log Out')).not.toBeInTheDocument();
    expect(screen.queryByText('Admin')).not.toBeInTheDocument();
    await buttonClick('Users');
    expect(screen.getByText('Log In')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
});

test('login dropdown works', async () => {
    renderComponent();
    expect(screen.queryByPlaceholderText('Email')).not.toBeInTheDocument();
    await buttonClick('Users');
    await buttonClick('Log In');
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('First Name')).not.toBeInTheDocument();
    await buttonClick('Users');
    await buttonClick('Cancel Log In');
    expect(screen.queryByPlaceholderText('Email')).not.toBeInTheDocument();
});

test('has profile dropdown if logged in', async () => {
    renderComponent(uOrgless);
    expect(screen.queryByText('Users')).not.toBeInTheDocument();
    expect(screen.getByText('Bob Testy')).toBeInTheDocument();
    await buttonClick('Bob Testy');
    expect(screen.getByText('Edit Profile')).toBeInTheDocument();
    expect(screen.getByText('Log Out')).toBeInTheDocument();
    expect(screen.queryByText('Admin')).not.toBeInTheDocument();
    expect(screen.queryByText('Log In')).not.toBeInTheDocument();
    expect(screen.queryByText('Register')).not.toBeInTheDocument();
});

test('has admin dropdown if logged in super admin', async () => {
    const admin = {...uOrgless, superAdmin: true};
    renderComponent(admin);
    expect(screen.queryByText('Users')).not.toBeInTheDocument();
    expect(screen.getByText('Bob Testy')).toBeInTheDocument();
    await buttonClick('Bob Testy');
    expect(screen.getByText('Edit Profile')).toBeInTheDocument();
    expect(screen.getByText('Log Out')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.queryByText('Log In')).not.toBeInTheDocument();
    expect(screen.queryByText('Register')).not.toBeInTheDocument();
});