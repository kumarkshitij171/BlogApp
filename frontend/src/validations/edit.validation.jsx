import * as yup from 'yup';

export const EditValidation = yup.object().shape({
    name: yup.string().min(3,'Enter a valid name').required('Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
});