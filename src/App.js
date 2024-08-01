import React, { useState } from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';
import CustomerForm from './component/customerForm';
import CustomerList from './component/customerList';
import { Container, Typography, Box, Paper } from '@mui/material';

const App = () => {
    const [editingCustomer, setEditingCustomer] = useState(null);

    return (
      <Provider store={store}>
      <Container maxWidth="md">
          <Box sx={{ my: 4 }}>
              <Typography variant="h3" component="h1" gutterBottom>
                  Customer Management
              </Typography>
              <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
                  <CustomerForm existingCustomer={editingCustomer} onSave={() => setEditingCustomer(null)} />
              </Paper>
              <Paper elevation={3} sx={{ p: 2 }}>
                  <CustomerList onEdit={setEditingCustomer} />
              </Paper>
          </Box>
      </Container>
  </Provider>
    );
};

export default App;
