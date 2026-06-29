import { useState } from "react";
import Grid from "@mui/material/Grid2";
import ChatSidebar from "./ChatSidebar";
import ChatContent from "./ChatContent";

const Tab1 = () => {
  const [selectedSession, setSelectedSession] = useState(null);

  return (
    <Grid container sx={{ height: "75vh" }}>
      <Grid size={{ xs: 12, md: 2 }} sx={{ height: "100%" }}>
        <ChatSidebar
          selected={selectedSession}
          setSelected={setSelectedSession}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 10 }} sx={{ height: "100%" }}>
        <ChatContent sessionId={selectedSession} />
      </Grid>
    </Grid>
  );
};

export default Tab1;