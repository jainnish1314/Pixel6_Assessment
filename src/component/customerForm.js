import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { addCustomer, editCustomer } from '../redux/customerSlice';
import axios from 'axios';
import { TextField, Button, Box, Typography, Grid } from '@mui/material';
import debounce from 'lodash/debounce';

const CustomerForm = ({ existingCustomer, onSave }) => {
    const dispatch = useDispatch();
    const [customer, setCustomer] = useState(existingCustomer || {
        PAN: '',
        fullName: '',
        email: '',
        mobileNumber: '',
        addresses: [{ addressLine1: '', addressLine2: '', postcode: '', state: '', city: '' }]
    });

    useEffect(() => {
        setCustomer(existingCustomer || {
            PAN: '',
            fullName: '',
            email: '',
            mobileNumber: '',
            addresses: [{ addressLine1: '', addressLine2: '', postcode: '', state: '', city: '' }]
        });
    }, [existingCustomer]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomer({ ...customer, [name]: value });
    };

    const handleAddressChange = (index, e) => {
        const { name, value } = e.target;
        const addresses = [...customer.addresses];
        addresses[index][name] = value;
        setCustomer({ ...customer, addresses });
    };

    const addAddress = () => {
        if (customer.addresses.length < 10) {
            setCustomer({ ...customer, addresses: [...customer.addresses, { addressLine1: '', addressLine2: '', postcode: '', state: '', city: '' }] });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (existingCustomer) {
            dispatch(editCustomer(customer));
        } else {
            dispatch(addCustomer(customer));
        }
        onSave();
    };

    const verifyPAN = async (pan) => {
        try {
            const response = await axios.post('https://lab.pixel6.co/api/verify-pan.php', { panNumber: pan });
            if (response.data.isValid) {
                setCustomer((prevState) => ({
                    ...prevState,
                    fullName: response.data.fullName
                }));
            }
        } catch (error) {
            console.error('Error verifying PAN:', error);
        }
    };

    const debouncedVerifyPAN = useCallback(debounce(verifyPAN, 500), []);

    useEffect(() => {
        if (customer.PAN.length === 10) {
            debouncedVerifyPAN(customer.PAN);
        }
    }, [customer.PAN, debouncedVerifyPAN]);

    const getPostcodeDetails = async (postcode) => {
        try {
            const response = await axios.post('https://lab.pixel6.co/api/get-postcode-details.php', { postcode });
            if (response.data.status === 'Success') {
                const addresses = [...customer.addresses];
                addresses[0].city = response.data.city[0].name;
                addresses[0].state = response.data.state[0].name;
                setCustomer({ ...customer, addresses });
            }
        } catch (error) {
            console.error('Error fetching postcode details:', error);
        }
    };

    const debouncedGetPostcodeDetails = useCallback(debounce(getPostcodeDetails, 500), []);

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>Customer Form</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        name="PAN"
                        label="PAN"
                        fullWidth
                        value={customer.PAN}
                        onChange={(e) => {
                            handleChange(e);
                            if (e.target.value.length === 10) {
                                debouncedVerifyPAN(e.target.value);
                            }
                        }}
                        inputProps={{ maxLength: 10 }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        name="fullName"
                        label="Full Name"
                        fullWidth
                        value={customer.fullName}
                        onChange={handleChange}
                        inputProps={{ maxLength: 140 }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        name="email"
                        label="Email"
                        fullWidth
                        value={customer.email}
                        onChange={handleChange}
                        inputProps={{ maxLength: 255 }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        name="mobileNumber"
                        label="Mobile Number"
                        fullWidth
                        value={customer.mobileNumber}
                        onChange={handleChange}
                        inputProps={{ maxLength: 10 }}
                    />
                </Grid>
                {customer.addresses.map((address, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>Address {index + 1}</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    name="addressLine1"
                                    label="Address Line 1"
                                    fullWidth
                                    value={address.addressLine1}
                                    onChange={(e) => handleAddressChange(index, e)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="addressLine2"
                                    label="Address Line 2"
                                    fullWidth
                                    value={address.addressLine2}
                                    onChange={(e) => handleAddressChange(index, e)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    name="postcode"
                                    label="Postcode"
                                    fullWidth
                                    value={address.postcode}
                                    onChange={(e) => {
                                        handleAddressChange(index, e);
                                        if (e.target.value.length === 6) {
                                            debouncedGetPostcodeDetails(e.target.value);
                                        }
                                    }}
                                    inputProps={{ maxLength: 6 }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <TextField
                                    required
                                    name="state"
                                    label="State"
                                    fullWidth
                                    value={address.state}
                                    onChange={(e) => handleAddressChange(index, e)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <TextField
                                    required
                                    name="city"
                                    label="City"
                                    fullWidth
                                    value={address.city}
                                    onChange={(e) => handleAddressChange(index, e)}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                ))}
                <Button variant="contained" color="primary" onClick={addAddress}>Add Address</Button>
                <Grid item xs={12}>
                    <Button type="submit" variant="contained" color="secondary">Save</Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default CustomerForm;
