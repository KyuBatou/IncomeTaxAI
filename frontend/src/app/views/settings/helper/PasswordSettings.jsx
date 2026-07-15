import React, { useState } from 'react';
import {
  Button, Box, Grid, Card, Typography, Divider, TextField
} from '@mui/material';
import { updatePassword } from '../services/apiService';

const PasswordSettings = () => {
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const [loading, setLoading] = useState(false);

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   setFormData(prev => ({ ...prev, [name]: value }));
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await updatePassword(formData);
      alert(res?.detail || 'Password updated successfully!');
      setFormData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
    } catch (err) {
      alert(err.response?.detail || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card sx={{ mt: 3 }}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Password Settings</Typography>
        <Divider sx={{ mb: 3 }} />
        <form>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Current Password"
                type="password"
                variant="outlined"
                name="current_password"
                value={formData.current_password}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="New Password"
                type="password"
                variant="outlined"
                name="new_password"
                value={formData.new_password}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                variant="outlined"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" onClick={handleSubmit} disabled={loading}>
                {loading ? 'Updating...' : 'Update Password'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Card>
  );
};

export default PasswordSettings;
