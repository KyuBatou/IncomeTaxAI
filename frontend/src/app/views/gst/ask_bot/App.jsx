import { styled, useTheme } from "@mui/material/styles";
import { SimpleCard } from "app/components";
import { Fragment, useState } from "react";
import { Tab, Tabs } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Tab1 from "./shared/Tab1";

// STYLED COMPONENTS
const ContentBox = styled("div")(({ theme }) => ({
  margin: "10px",
  padding: '0px',
  [theme.breakpoints.down("sm")]: { margin: "10px" }
}));


export default function App() {
  const { palette } = useTheme();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Fragment>
      <ContentBox className="analytics" >
        <Grid container>
          <Grid size={{ md: 12, xs: 12 }}>
              <SimpleCard title="">
                {/* <Divider sx={{ bgcolor: 'secondary.dark' }} /> */}
                <Tabs value={value} onChange={handleChange} sx={{ justifyContent: 'space-between' }} >
                  <Tab label="Ask Bot" sx={{ flex: 1 }} />
                  <Tab label="Summerizer" sx={{ flex: 1 }} />
                  <Tab label="Draft Assistant" sx={{ flex: 1 }} />
                  <Tab label="Case Law Research" sx={{ flex: 1 }} />
                </Tabs>
                {value === 0 && <Tab1 /> }
              </SimpleCard>
          </Grid>
        </Grid>
      </ContentBox>
    </Fragment>
  
  );
}
