import React from 'react';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import NewSeason from '../NewSeason';


const user = userEvent.setup();

const renderComponent = (orgId) => {
    return render(<BrowserRouter>
                    <NewSeason orgId={orgId} />
                </BrowserRouter>);
};


/** ACTIONS */
const buttonClick = async (buttonText) => {
    const button = screen.getByText(buttonText);
    await user.click(button);
};

const formInput = async (identifier, message) => {
    const input = identifier.placeholder ? 
                    screen.getByPlaceholderText(identifier.placeholder)
                    : screen.getByLabelText(identifier.label);
    await user.click(input);
    await user.keyboard(message);
};

const bulletClick = async (labelText) => {
    const bullet = screen.getByLabelText(labelText);
    await user.click(bullet);
};



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

test('requires season name anon', async () => {
    renderComponent();
    await buttonClick('Next');
    const error = screen.getByText('Season title must be between 2 and 100 characters');
    expect(error).toBeInTheDocument();
});

test('requires season name from org', async () => {
    renderComponent(1);
    await buttonClick('Next');
    const error = screen.getByText('Season title must be between 2 and 100 characters');
    expect(error).toBeInTheDocument();
});

test('name input works', async () => {
    renderComponent();
    await formInput({placeholder: 'Season Title'}, 'Test Season');
    await buttonClick('Next');
    expect(screen.getByLabelText('Number of Teams')).toBeInTheDocument();
});

test('anon keeps subnav', () => {
    renderComponent();
    expect(screen.queryByText('Cancel Season Create')).not.toBeInTheDocument();
});

test('no subnav from org', () => {
    renderComponent(1);
    expect(screen.getByText('Cancel Season Create')).toBeInTheDocument();
});

test('can skip team naming', async () => {
    renderComponent();
    await formInput({placeholder: 'Season Title'}, 'Test Season');
    await buttonClick('Next');
    await formInput({label: 'Number of Teams'}, '30');
    await buttonClick('Next');
    expect(screen.getByLabelText('Number of Weeks/Rounds')).toBeInTheDocument();
    expect(screen.queryByText('Enter Team Names')).not.toBeInTheDocument();
});

test('no manual game entry anon', async () => {
    renderComponent();
    await formInput({placeholder: 'Season Title'}, 'Test Season');
    await buttonClick('Next');
    await formInput({label: 'Number of Teams'}, '30');
    await buttonClick('Next');
    expect(screen.getByLabelText('Number of Weeks/Rounds')).toBeInTheDocument();
    expect(screen.queryByLabelText('Manually Enter Season Info')).not.toBeInTheDocument();
});

test('can manually enter games for an organization', async () => {
    renderComponent(1);
    await formInput({placeholder: 'Season Title'}, 'Test Season');
    await buttonClick('Next');
    await formInput({label: 'Number of Teams'}, '30');
    await buttonClick('Next');
    expect(screen.getByLabelText('Number of Weeks/Rounds')).toBeInTheDocument();
    expect(screen.getByLabelText('Manually Enter Season Info')).toBeInTheDocument();
});

test('allows team naming', async () => {
    renderComponent();
    await formInput({placeholder: 'Season Title'}, 'Test Season');
    await buttonClick('Next');
    await formInput({label: 'Number of Teams'}, '30');
    await bulletClick('Name Teams');
    await buttonClick('Next');
    const teams = screen.getAllByLabelText('Team Name');
    expect(teams.length).toEqual(30);
    expect(screen.getByText('Enter Team Names')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Team 1')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Team 23')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Team 30')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Team 31')).not.toBeInTheDocument();
});