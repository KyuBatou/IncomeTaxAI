import { styled } from "@mui/material/styles";
import { Fragment } from "react";
import Grid from "@mui/material/Grid2";
import { Divider } from "@mui/material";
import { SimpleCard } from "app/components";
import ProfilePage from "./helper/ProfilePage";

// STYLED COMPONENTS
const ContentBox = styled("div")(({ theme }) => ({
  margin: "10px",
  padding: '0px',
  [theme.breakpoints.down("sm")]: { margin: "10px" }
}));


export default function AppTable() {

  return (
    <Fragment>
      <ContentBox className="analytics" >
        <Grid container>
          <Grid size={{ md: 12, xs: 12 }}>
            <SimpleCard title="User Settings">
            <Divider sx={{ bgcolor: 'secondary.dark' }} />
            <ProfilePage />
            </SimpleCard>
          </Grid>
        </Grid>
      </ContentBox>
    </Fragment>
  
  );
}
