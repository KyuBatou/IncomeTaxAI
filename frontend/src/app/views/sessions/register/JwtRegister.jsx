import React,{useState} from "react";
import {useNavigate} from "react-router-dom";
import {
  Box,
  Button,
  Card,
  Checkbox,
  Grid2 as Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
  Alert
} from "@mui/material";
import {styled} from "@mui/system";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {BASE_URL,STATES} from "app/utils/constant";
import LegalContent from "./TermsAndConditions";
import apiClient from "app/hooks/apiClient";

const StyledContainer=styled(Box)(()=>({
  minHeight:"100vh",
  padding:20,
  display:"flex",
  alignItems:"center",
  justifyContent:"center",
  background:"linear-gradient(135deg,#8B0016,#c2185b,#ff8a65)",
  ".card":{
    width:"100%",
    maxWidth:1100,
    borderRadius:25,
    overflow:"hidden",
    boxShadow:"0 20px 60px rgba(0,0,0,.25)"
  }
}));

const LeftPanel=styled(Box)(()=>({
  minHeight:650,
  padding:40,
  color:"#fff",
  background:"linear-gradient(160deg,#8B0016,#4a0010)",
  display:"flex",
  flexDirection:"column",
  justifyContent:"center",
  alignItems:"center",
  "@media(max-width:900px)":{
    display:"none"
  }
}));

const RightPanel=styled(Box)(()=>({
  padding:40,
  "@media(max-width:600px)":{
    padding:20
  }
}));

const inputStyle={
  "& .MuiOutlinedInput-root":{
    borderRadius:3,
    background:"#fafafa"
  }
};

const initialState={
  email:"",
  password:"",
  re_password:"",
  name:"",
  mobileno:"",
  company:"",
  address:"",
  city:"",
  state:"",
  pin:"",
  telephone:"",
  fax:"",
  remember:false
};

export default function SimpleRegister(){

  const navigate=useNavigate();

  const [formData,setFormData]=useState(initialState);
  const [errors,setErrors]=useState({});
  const [loading,setLoading]=useState(false);
  const [showPassword,setShowPassword]=useState(false);
  const [message,setMessage]=useState("");
  const [error,setError]=useState("");

  const validate=()=>{

    let e={};

    if(!formData.email)
      e.email="Email is required";
    else if(!/\S+@\S+\.\S+/.test(formData.email))
      e.email="Invalid email";

    if(!formData.password)
      e.password="Password is required";
    else if(formData.password.length<6)
      e.password="Minimum 6 characters required";

    if(formData.password!==formData.re_password)
      e.re_password="Passwords do not match";

    if(!formData.name)
      e.name="Name is required";

    if(!formData.mobileno)
      e.mobileno="Mobile required";
    else if(!/^[0-9]{10}$/.test(formData.mobileno))
      e.mobileno="Enter valid 10 digit mobile";

    if(!formData.address)
      e.address="Address required";

    if(!formData.city)
      e.city="City required";

    if(!formData.state)
      e.state="State required";

    if(!formData.pin)
      e.pin="Pincode required";
    else if(!/^[0-9]{6}$/.test(formData.pin))
      e.pin="Invalid pincode";

    if(!formData.remember)
      e.remember="Accept terms";

    setErrors(e);
    return Object.keys(e).length===0;
  };

  const handleChange=(e)=>{
    const {name,value,checked,type}=e.target;

    setFormData(prev=>({
      ...prev,
      [name]:type==="checkbox"?checked:value
    }));
  };

  const handleSubmit=async(e)=>{
    e.preventDefault();

    if(!validate()) return;

    setLoading(true);
    setMessage("");
    setError("");

    try{

      await apiClient.post(
        `${BASE_URL}/auth/user/`,
        formData
      );

      setMessage("Registration successful");

      setTimeout(()=>{
        navigate("/session/signin");
      },1500);

    }catch(err){

      setError(
        err.response?.data?.message ||
        "Registration failed"
      );

    }finally{
      setLoading(false);
    }
  };

  const fields=[
    ["email","Username/Email"],
    ["name","Name"],
    ["password","Password"],
    ["re_password","Confirm Password"],
    ["mobileno","Mobile"],
    ["company","Company"],
    ["address","Address"],
    ["city","City"],
    ["state","State"],
    ["pin","Pin Code"],
    ["telephone","Telephone"],
    ["fax","Fax"]
  ];

  return(
    <StyledContainer>
      <Card className="card">

        <Grid container>

          <Grid size={{sm:5,xs:12}}>
            <LeftPanel>

              <Typography
                variant="h5"
                textAlign="center"
                fontWeight={700}
              >
                Welcome Back!
              </Typography>

              <img
                src="/assets/images/logo-circle.png"
                width="120"
                alt="logo"
                style={{margin:30, borderRadius: '30%'}}
              />
              <img
                width="100%"
                alt="Register"
                src="/assets/images/illustrations/posting_photo.svg"
                style={{margin:30}}
              />

              <Typography textAlign="center">
                Empowering Your Legal Journey with Case Laws,
                Updates, and Expert Resources on Income Tax,
                GST & Company Law!
              </Typography>

            </LeftPanel>
          </Grid>

          <Grid size={{sm:7,xs:12}}>

            <RightPanel>

              <Typography variant="h4" mb={2}>
                Create Account
              </Typography>

              {message&&
                <Alert severity="success">
                  {message}
                </Alert>
              }

              {error&&
                <Alert severity="error">
                  {error}
                </Alert>
              }

              <Box
                component="form"
                onSubmit={handleSubmit}
                mt={2}
              >

                <Grid container spacing={2}>

                  {fields.map(([name,label])=>(

                    <Grid
                      size={{sm:6,xs:12}}
                      key={name}
                    >

                    {name==="state"?

                    <TextField
                      select
                      fullWidth
                      size="small"
                      name="state"
                      label="State"
                      value={formData.state}
                      onChange={handleChange}
                      error={!!errors.state}
                      helperText={errors.state}
                      sx={inputStyle}
                    >
                      {STATES.map(s=>
                        <MenuItem
                          key={s.value}
                          value={s.value}
                        >
                          {s.label}
                        </MenuItem>
                      )}
                    </TextField>

                    :

                    <TextField
                      fullWidth
                      size="small"
                      name={name}
                      label={label}
                      type={
                        name==="password"||name==="re_password"
                        ?
                        showPassword?"text":"password"
                        :
                        "text"
                      }
                      value={formData[name]}
                      onChange={handleChange}
                      error={!!errors[name]}
                      helperText={errors[name]}
                      sx={inputStyle}
                      InputProps={
                        name==="password"
                        ?
                        {
                          endAdornment:
                          <InputAdornment position="end">
                            <IconButton
                              onClick={()=>
                                setShowPassword(!showPassword)
                              }
                            >
                              {
                                showPassword
                                ?
                                <VisibilityOff/>
                                :
                                <Visibility/>
                              }
                            </IconButton>
                          </InputAdornment>
                        }
                        :
                        {}
                      }
                    />

                    }

                    </Grid>

                  ))}

                </Grid>

                <Box display="flex" alignItems="center" mt={2}>

                  <Checkbox
                    size="small"
                    name="remember"
                    checked={formData.remember}
                    onChange={handleChange}
                  />

                  <LegalContent/>

                </Box>

                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{
                    mt:2,
                    py:1.2,
                    borderRadius:3
                  }}
                >
                  {loading?"Registering...":"Register"}
                </Button>

                <Button
                  fullWidth
                  sx={{mt:1}}
                  onClick={()=>navigate("/session/signin")}
                >
                  Already have account? Login
                </Button>

              </Box>

            </RightPanel>

          </Grid>

        </Grid>

      </Card>
    </StyledContainer>
  );
}