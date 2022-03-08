import React, {useState} from 'react';
import Errors from './Errors';

function SeasonTeamsForm({season, handleChange, toggle, setSeason}) {

    const [errors, setErrors] = useState({});
    const [isOpen, setIsOpen] = useState(!season.generateNames || false);

    const handleNameChange = (e) => {
        let {name, value} = e.target;
        name = name.split(' ');
        let teams = season.teams;
        teams = {...teams,
                        [name[0]]: {
                            ...teams[name[0]],
                            [name[1]]: value
                        }};
        setSeason(d => ({...d, teams}));
    };

    const handleRadio = (val) => {
        setSeason({...season, generateNames: val});
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});

        if (!season.numTeams) {
            setErrors({error: 'Number of teams is required'});
            return false;
        };

        const teams = {};
        for (let team = 1; team <= season.numTeams; team++) {
            teams[team] = ({teamName: season.generateNames ? `Team ${team}` : '',
                            color: 'N/A'});
        };
        setSeason({...season, teams});

        if (season.generateNames) {
            toggle('seasonRounds');
        } else {
            setIsOpen(true);
        };
    };

    const handleNameSubmit = (e) => {
        e.preventDefault();
        setErrors({});

        const teamsArray = Object.values(season.teams);
        if (!validateTeams(teamsArray)) return false;
        toggle('seasonRounds');
    };

    const validateTeams = (teams) => {
        const names = [];
        for (let team of teams) {
            if (!team.teamName) {
                setErrors({error: 'All teams must have a name'});
                return false;
            };
            if (team.teamName.length < 4 || team.teamName.length > 50) {
                setErrors({error: 'Team names must be between 4 and 50 characters'});
                return false;
            };
            names.push(team.teamName);
        };
        const teamCheck = new Set(names);
        if (names.length !== teamCheck.size) {
            setErrors({error: 'Multiple teams cannot have the same name'});
            return false;
        };
        return true;
    };

    return (
        <div>
            <Errors formErrors={errors}/>
            <form onSubmit={handleSubmit}>
                <label htmlFor='numTeams'>Number of Teams</label>
                <input type='number'
                        name='numTeams'
                        id='numTeams'
                        min='2'
                        max='30'
                        value={season.numTeams}
                        onChange={handleChange} />
                <label>
                    <input type='radio' 
                            name='generateNames'
                            checked={season.generateNames === false}
                            onChange={() => handleRadio(false)} />
                    Name Teams
                </label>
                <label>
                    <input type='radio' 
                            name='generateNames'
                            checked={season.generateNames === true}
                            onChange={() => handleRadio(true)} />
                    Use Numbers for Team Names
                </label>
                <button type='submit'>
                    {isOpen ? 'Change' : 'Next'}
                </button>
                <button onClick={() => toggle('seasonName')}>
                    Back
                </button>
            </form>
            {isOpen && <>
                <p>Enter Team Names</p>
                <form onSubmit={handleNameSubmit}>
                    {Object.keys(season.teams).map(t =>
                        <div key={t}>
                            <label htmlFor={`${t} teamName`}>
                                Team Name
                                <input type='text'
                                        name={`${t} teamName`}
                                        id={`${t} teamName`}
                                        placeholder={`Team ${t}`}
                                        value={season.teams[t].teamName}
                                        onChange={handleNameChange}/>
                            </label>
                            <label htmlFor={`${t} color`}>
                                Team Color
                                <select value={season.teams[t].color}
                                        onChange={handleNameChange}
                                        name={`${t} color`}
                                        id={`${t} color`}>
                                    <option value='N/A'>N/A</option>
                                    <option value='black'>Black</option>
                                    <option value='white'>White</option>
                                    <option value='gray'>Gray</option>
                                    <option value='red'>Red</option>
                                    <option value='orange'>Orange</option>
                                    <option value='yellow'>Yellow</option>
                                    <option value='blue'>Blue</option>
                                    <option value='green'>Green</option>
                                    <option value='purple'>Purple</option>
                                </select>
                            </label>
                        </div>)} 
                    <button type='submit'>Submit Teams</button>   
                </form></>}
        </div>
    );
};

export default SeasonTeamsForm;