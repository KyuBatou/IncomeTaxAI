import React, { useEffect, useState } from 'react';
import {
  Box, Grid, Card, Typography, Divider, TextField, Button
} from '@mui/material';
import { fetchBasicSettings, patchBasicSettings } from '../services/apiService';
import { MatxLoading } from "app/components";
import { useNavigate } from 'react-router-dom';
import { MenuItem } from '@mui/material';
import { STATES } from "app/utils/constant";

const BasicInformation = () => {
  const [data, setData] = useState({
    email: '',
    name: '',
    company: '',
    address: '',
    city: '',
    state: '',
    pin: '',
    telephone: '',
    mobileno: '',
    fax: '',
    regdate: '',
    valid_date: ''
  });

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const basicSettings = async () => {
        const res = await fetchBasicSettings();
        console.log(res);
        setData(res);
        setLoading(false);
    };
    basicSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await patchBasicSettings(data);
      console.log('Updated successfully:', res);
      alert('Changes saved!');
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to save changes.');
    } finally {
      setLoading(false);
    }
  };
  const handleCancel = () => {
    navigate('/');
  };

  if (loading) return <MatxLoading />;

  return (
    <Card sx={{ mt: 3 }}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Basic Information</Typography>
        <Divider sx={{ mb: 3 }} />
        <form>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Email" name="email" value={data.email} disabled />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Name" name="name" value={data.name} disabled />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Company" name="company" value={data.company} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Address" name="address" value={data.address} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="City" name="city" value={data.city} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    select
                    fullWidth
                    label="State"
                    name="state"
                    value={data.state}
                    onChange={handleChange}
                >
                    {STATES.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Pin" name="pin" value={data.pin} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Telephone No." name="telephone" value={data.telephone} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Mobile No." name="mobile" value={data.mobileno} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Fax" name="fax" value={data.fax} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Join Date" value={data.regdate} disabled />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Expiry Date" value={data.valid_date} disabled />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" onClick={handleSave} sx={{ mr: 2 }}>Save Changes</Button>
              <Button variant="outlined" onClick={handleCancel}>Cancel</Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Card>
  );
};

export default BasicInformation;
