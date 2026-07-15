import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from "@mui/material";
import { MatxLoading } from "app/components";
import { fetchContentDetail } from "app/views/legal-content/services/apiService";

const LegalContent = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openPopup, setOpenPopup] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await fetchContentDetail("term-condition");
        setContent(data);
      } catch (error) {
        console.error("Error fetching content:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const handleOpenPopup = () => setOpenPopup(true);
  const handleClosePopup = () => setOpenPopup(false);

  return (
    <>
      <Typography variant="body1">
        I agree to the{" "}
        <Button
          onClick={handleOpenPopup}
          color="primary"
          size="small"
          sx={{
            textTransform: "none",
            padding: 0,
            minWidth: 0,
          }}
        >
          Terms and Conditions
        </Button>
      </Typography>
      {/* Terms and Conditions Popup */}
      <Dialog open={openPopup} onClose={handleClosePopup} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography color="primary">
            Terms and Conditions
          </Typography>
        </DialogTitle>
        <Divider />
        <DialogContent
          sx={{
            "& *": {
              color: "#000 !important",
            },
          }}
        >
            {loading ? (
            <MatxLoading />
          ) : (
            <Typography
              variant="body1"
              dangerouslySetInnerHTML={{ __html: content?.legal_content }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePopup} color="secondary" variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LegalContent;