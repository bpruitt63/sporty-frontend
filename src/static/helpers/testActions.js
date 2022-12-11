import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const user = userEvent.setup();

export const buttonClick = async (buttonText) => {
    const button = screen.getByText(buttonText);
    await user.click(button);
};

export const formInput = async (identifier, message) => {
    const input = identifier.placeholder ? 
                    screen.getByPlaceholderText(identifier.placeholder)
                    : screen.getByLabelText(identifier.label);
    await user.click(input);
    await user.keyboard(message);
};

export const bulletClick = async (labelText) => {
    const bullet = screen.getByLabelText(labelText);
    await user.click(bullet);
};