import { styled, useTheme } from "@mui/material/styles";
import { SimpleCard } from "app/components";
import { Fragment, useState } from "react";
import { Tab, Tabs } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Tab1 from "./ask_bot/shared/Tab1";
import Tab2 from "./summerizer/shared/Tab2";
import Tab3 from "./draft_assistant/shared/Tab3";
import Tab4 from "./case_law_research/shared/Tab4";

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
                {/* {value === 1 && <Tab2 /> } */}
                {value === 2 && <Tab3 /> }
                {value === 3 && <Tab4 /> }
              </SimpleCard>
          </Grid>
        </Grid>
      </ContentBox>
    </Fragment>
  
  );
}
