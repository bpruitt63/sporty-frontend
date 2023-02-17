import {useState, useCallback} from 'react';

function useHandleChange(initialState={}) {
    const [data, setData] = useState(initialState);
    const handleChange = (e) => {
        const {name, value} = e.target;
        setData(d => ({
            ...d,
            [name]: value
        }));
    };
    return [data, handleChange, setData];
};

function useValidate() {
    const [formErrors, setFormErrors] = useState({});

    /** Validation for RegisterForm and UserUpdateForm.
     * Sets state to object with all form errors.
     */
    function validate(data, isSignUpForm) {
        let err = {};

        if (data.email && !data.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)){
            err.email = "Must be valid email address";
        } else {
            delete(err.email);
        };
        if (data.pwd !== data.pwd2){
            err.pwds = "Passwords must match";
        } else {
            delete(err.passwords);
        };
        if (!data.firstName || data.firstName.length > 30){
            err.firstName = "First name must be between 1 and 30 characters";
        } else {
            delete(err.firstName);
        };
        if (!data.lastName || data.lastName.length > 30){
            err.lastName = "Last name must be between 1 and 30 characters";
        } else {
            delete(err.lastName);
        };
        if (isSignUpForm) {
            if (!data.pwd || data.pwd.length < 6 || data.pwd.length > 20) {
                err.pwd = "Password must be between 6 and 20 characters";
            } else {
                delete(err.pwd);
            };
            if (!data.email || data.email.length < 6 || data.email.length > 60) {
                err.emailLength = "Email must be between 6 and 60 characters";
            } else {
                delete(err.emailLength);
            };
        } else {
            if (data.pwd && (data.pwd.length < 6 || data.pwd.length > 20)) {
                err.pwd = "Password must be between 6 and 20 characters";
            } else {
                delete(err.pwd);
            };
        }
        setFormErrors(err);
        return err;
    };
    return [formErrors, validate];
};

function useErrors() {
    const [apiErrors, setApiErrors] = useState({});

    /** Sets state with object containing all errors returned from API calls */
    const getApiErrors = useCallback(e => {
        const errors = {...e};
        setApiErrors(errors);
    }, [setApiErrors]);
    return [apiErrors, getApiErrors, setApiErrors];
};

function useToggle(initialState, toggleState=initialState) {
    const [isOpen, setIsOpen] = useState(initialState);

    function toggle(section){
        setIsOpen({...toggleState, 
            [section]: !isOpen[section]});
    };
    return [toggle, isOpen];
};

function useToast() {
    const [message, setMessage] = useState();

    function toast(msg) {
        setMessage(msg);
        setTimeout(() => {setMessage('')}, 2500);
    };
    return [message, toast, setMessage];
};

export {useHandleChange, useValidate, useErrors, useToggle, useToast};