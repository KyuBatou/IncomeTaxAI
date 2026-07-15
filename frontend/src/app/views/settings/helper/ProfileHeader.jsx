import React, { useState } from 'react';
import {
  Box, Card, Typography, LinearProgress, Badge, IconButton, Avatar, Modal, Grid, Button
} from '@mui/material';
import {
  CameraAlt, Work, LocationOn, CalendarToday
} from '@mui/icons-material';

const avatarOptions = [
  '/assets/images/avatars/001-man.svg',
  '/assets/images/avatars/002-woman.svg',
  '/assets/images/avatars/003-boy.svg',
  '/assets/images/avatars/004-girl.svg'
];

const InfoItem = ({ icon: Icon, text }: { icon: any, text: string }) => (
  <Box display="flex" alignItems="center">
    <Icon fontSize="small" style={{ marginRight: 4 }} />
    <Typography variant="body2">{text}</Typography>
  </Box>
);

const ProfileHeader = () => {
  const [avatar, setAvatar] = useState(avatarOptions[0]);
  const [selectedAvatar, setSelectedAvatar] = useState(avatar);
  const [open, setOpen] = useState(false);

  const saveAvatar = () => {
    setAvatar(selectedAvatar);
    setOpen(false);
  };

  return (
    <>
      <Card>
        {/* Cover & Avatar */}
        <Box position="relative">
          <Box component="img" src="/assets/images/study-2.jpg" alt="Cover" sx={{ width: '100%', height: 200, objectFit: 'cover' }} />
          <Box position="absolute" bottom={-50} left="50%" sx={{ transform: 'translateX(-50%)', textAlign: 'center' }}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <IconButton onClick={() => setOpen(true)}><CameraAlt fontSize="small" /></IconButton>
              }
            >
              <Avatar src={avatar} sx={{ width: 100, height: 100, border: '3px solid white' }} />
            </Badge>
          </Box>
        </Box>

        {/* Info Section */}
        <Box sx={{ pt: 6, pb: 2, px: 3, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>Pixy Krovasky</Typography>
          <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap" mb={2}>
            <InfoItem icon={Work} text="Developer" />
            <InfoItem icon={LocationOn} text="New York" />
            <InfoItem icon={CalendarToday} text="Joined March 17" />
          </Box>

          {/* Progress */}
          <Box mb={3}>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="caption">Profile Completion</Typography>
              <Typography variant="caption">50%</Typography>
            </Box>
            <LinearProgress value={50} variant="determinate" color="success" sx={{ height: 8, borderRadius: 4 }} />
          </Box>
        </Box>
      </Card>

      {/* Avatar Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            p: 4, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 24,
            textAlign: 'center', width: 400, mx: 'auto', mt: '15%'
          }}
        >
          <Typography variant="h6" gutterBottom>Select Avatar</Typography>
          <Grid container spacing={2} justifyContent="center" mb={3}>
            {avatarOptions.map((src) => (
              <Grid item key={src}>
                <Avatar
                  src={src}
                  onClick={() => setSelectedAvatar(src)}
                  sx={{
                    width: 60, height: 60, cursor: 'pointer',
                    border: selectedAvatar === src ? '3px solid #1976d2' : '2px solid transparent',
                    transition: 'border 0.3s ease'
                  }}
                />
              </Grid>
            ))}
          </Grid>
          <Button variant="contained" onClick={saveAvatar}>Save Avatar</Button>
        </Box>
      </Modal>
    </>
  );
};

export default ProfileHeader;
