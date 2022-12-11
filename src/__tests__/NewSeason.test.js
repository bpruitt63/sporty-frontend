import React from 'react';
import {render, screen} from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import {buttonClick, formInput, bulletClick} from '../static/helpers/testActions';
import NewSeason from '../NewSeason';


const renderComponent = (orgId) => {
    return render(<BrowserRouter>
                    <NewSeason orgId={orgId} />
                </BrowserRouter>);
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

test('no cancel button anon', () => {
    renderComponent();
    expect(screen.queryByText('Cancel Season Create')).not.toBeInTheDocument();
});

test('org has cancel button', () => {
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
    expect(screen.queryByPlaceholderText('Team 0')).not.toBeInTheDocument();
});

test('name entry works', async () => {
    renderComponent();
    await formInput({placeholder: 'Season Title'}, 'Test Season');
    await buttonClick('Next');
    await formInput({label: 'Number of Teams'}, '2');
    await bulletClick('Name Teams');
    await buttonClick('Next');
    await buttonClick('Submit Teams');
    expect(screen.queryByLabelText('Number of Weeks/Rounds')).not.toBeInTheDocument();
    await formInput({placeholder: 'Team 1'}, 'test1');
    await formInput({placeholder: 'Team 2'}, 'test2');
    await buttonClick('Submit Teams');
    expect(screen.getByLabelText('Number of Weeks/Rounds')).toBeInTheDocument();
});

test('generates season anon, even team number', async () => {
    renderComponent();
    await formInput({placeholder: 'Season Title'}, 'Test Season');
    await buttonClick('Next');
    await formInput({label: 'Number of Teams'}, '4');
    await buttonClick('Next');
    await formInput({label: 'Number of Weeks/Rounds'}, '6');
    await buttonClick('Generate Season');
    const games = screen.getAllByText('Date TBA');
    expect(games.length).toEqual(12);
    expect(screen.queryByText('Bye')).not.toBeInTheDocument();
    expect(screen.queryByText('Save Season')).not.toBeInTheDocument();
});

test('generates season anon, odd team number', async () => {
    renderComponent();
    await formInput({placeholder: 'Season Title'}, 'Test Season');
    await buttonClick('Next');
    await formInput({label: 'Number of Teams'}, '5');
    await buttonClick('Next');
    await formInput({label: 'Number of Weeks/Rounds'}, '6');
    await buttonClick('Generate Season');
    const games = screen.getAllByText('Date TBA');
    const gamesAndByes = screen.getAllByText('Notes:');
    const byes = screen.getAllByText('Bye');
    expect(games.length).toEqual(12);
    expect(gamesAndByes.length).toEqual(18);
    expect(byes.length).toEqual(6);
    expect(screen.queryByText('Save Season')).not.toBeInTheDocument();
});

test('generates season for org', async () => {
    renderComponent(1);
    await formInput({placeholder: 'Season Title'}, 'Test Season');
    await buttonClick('Next');
    await formInput({label: 'Number of Teams'}, '4');
    await buttonClick('Next');
    await formInput({label: 'Number of Weeks/Rounds'}, '6');
    await buttonClick('Next');
    const games = screen.getAllByText('Date TBA');
    expect(games.length).toEqual(12);
    expect(screen.queryByText('Bye')).not.toBeInTheDocument();
    expect(screen.getAllByText('Save Season').length).toEqual(2);
});
