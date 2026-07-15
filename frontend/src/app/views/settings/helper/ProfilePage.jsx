import React, { useState } from 'react';
import {
  Box,
  Container,
  Tabs,
  Tab,
  Card,
  Typography
} from '@mui/material';
import {
  Person as PersonIcon,
  Lock as LockIcon,
  // Settings as SettingsIcon,
  // Devices as DevicesIcon,
  // Notifications as NotificationsIcon,
  // Security as SecurityIcon,
} from '@mui/icons-material';
import PasswordSettings from './PasswordSettings';
// import ProfileHeader from './ProfileHeader';
import BasicInformation from './BasicInformation';

const tabItems = [
  { id: 'basic', label: 'Basic Info', icon: <PersonIcon />, component: <BasicInformation /> },
  { id: 'password', label: 'Password', icon: <LockIcon />, component: <PasswordSettings /> },
  // { id: 'preferences', label: 'Preferences', icon: <SettingsIcon />, component: <div>Preferences Content</div> },
  // { id: 'devices', label: 'Devices', icon: <DevicesIcon />, component: <div>Devices Content</div> },
  // { id: 'notifications', label: 'Notifications', icon: <NotificationsIcon />, component: <div>Notifications Content</div> },
  // { id: 'security', label: '2-Step Verification', icon: <SecurityIcon />, component: <div>Security Content</div> },
];

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('basic');

  // const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
  //   setActiveTab(newValue);
  // };

  const handleTabChange = (_event, newValue) => {
    setActiveTab(newValue);
  };

  const activeContent = tabItems.find(item => item.id === activeTab)?.component;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* <ProfileHeader /> */}

      <Card variant="outlined" sx={{ mt: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="Profile Tabs"
        >
          {tabItems.map((tab) => (
            <Tab
              key={tab.id}
              value={tab.id}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {tab.icon}
                  <Typography variant="body2">{tab.label}</Typography>
                </Box>
              }
              sx={{ textTransform: 'none', py: 2 }}
            />
          ))}
        </Tabs>

        <Box sx={{ p: 3 }}>
          {activeContent}
        </Box>
      </Card>
    </Container>
  );
};

export default ProfilePage;
