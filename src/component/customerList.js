import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteCustomer } from '../redux/customerSlice';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Typography, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const CustomerList = ({ onEdit }) => {
    const dispatch = useDispatch();
    const customers = useSelector(state => state.customers.customers);

    return (
        <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>Customer List</Typography>
            <List>
                {customers.map(customer => (
                    <ListItem key={customer.PAN} divider>
                        <ListItemText primary={customer.fullName} secondary={customer.email} />
                        <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="edit" onClick={() => onEdit(customer)}>
                                <EditIcon />
                            </IconButton>
                            <IconButton edge="end" aria-label="delete" onClick={() => dispatch(deleteCustomer(customer.PAN))}>
                                <DeleteIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default CustomerList;
