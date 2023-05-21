import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
// components
import Loader from "../components/loader";
// call api
import { callAPI } from "../api/api";
// next router
import { useRouter } from "next/router";
// styles
import R from "../styles/result.module.css";
import H from "../styles/Home.module.css";




const Result = () => {
  const [showSignin, setShowSignin] = useState(true);
  const [loader, setLoader] = useState(false);
  const [muskanVote, setmuskanVote] = useState(0);
  const [nirmalVote, setnirmalVote] = useState(0);
  const [siddhanthVote, setsiddhanthVote] = useState(0);
  const [candidateName, setCandidateName] = useState("");
  const [gauravVote, setgauravVote] = useState(0);
  const router = useRouter()

  const handleSubmit = async (auth) => {
    if (auth === "Admin") {
      setLoader(true);
      const response = await callAPI(
        `http://localhost:3000/api/result`
      );
      setLoader(false);

      const { message, data, errors } = response;
      if (message === "success") {
        if (data["data"] !== undefined) {
          let i = 0, countm = 0, countn = 0, counts = 0, countg = 0;
          while (i <= data["data"].length - 1) {
            if (data["data"][i].candidateId === '1') {
              countm++
            }
            else if (data["data"][i].candidateId === '2') {
              countn++
            }
            else if (data["data"][i].candidateId === '3') {
              counts++
            }
            else if (data["data"][i].candidateId === '4') {
              countg++
            }
            i++;
          }

          setmuskanVote(countm);
          setnirmalVote(countn);
          setsiddhanthVote(counts);
          setgauravVote(countg);

          if (countm > countn && countm > counts && countm > countg) {
            setCandidateName("Muskan Yadav")
          }
          else if (countn > countm && countn > counts && countn > countg) {
            setCandidateName("Nirmal Chaudhary")
          }
          else if (counts > countm && counts > countn && counts > countg) {
            setCandidateName("Siddhanth Pareek")
          }
          else if (countg > countm && countg > countn && counts < countg) {
            setCandidateName("Gaurav Soni")
          }


        }
      }
      else if (message === "failed") {
        alert("Some Server error");
      } else {
        alert("Some Server error");
      }
      setShowSignin(false);
    }

  }


  // if (data) {

  // }

  return (
    <React.Fragment>


      <div className={R.screen}>
        <div className={H.navbar}>
          <h3>Pollify</h3>

          <div className={H.navbarTitle}>
            <span onClick={() => { router.push("/home") }} >Home</span>
            <span onClick={() => { router.push("/about") }}>About</span>
            <span onClick={() => { router.push("/vote") }} >Vote</span>
            <span style={{ color: "#2791d4" }} >Result</span>
          </div>
        </div>

        <div className={R.box}>
          <div className={R.head}>Vote Results</div>
          <div className={R.resultB} >
            <div style={{ color: "black",fontWeight:"bold",fontSize:"22px"}}><span>candidateName</span> <span>Vote Count</span> </div>
            <div style={{ fontWeight:"bold",fontSize:"22px"}}><span>Muskan Yadav</span> <span>{muskanVote}</span> </div>
            <div style={{ fontWeight:"bold",fontSize:"22px"}}><span>Nirmal Chaudhary</span> <span>{nirmalVote}</span> </div>
            <div style={{ fontWeight:"bold",fontSize:"22px"}}><span>Siddhanth Pareek </span> <span>{siddhanthVote}</span> </div>
            <div style={{ fontWeight:"bold",fontSize:"22px"}}><span>Gaurav Soni</span> <span>{gauravVote}</span> </div>
          </div>
          <div className={R.head} style={{color:"red"}} >The person who has height vote is <u style={{textTransform:"uppercase"}}>{candidateName}</u> </div>
          <Button
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={()=>{router.push("/home")}}
            >
              Go to home
            </Button>
        </div>
        <div className={H.footer} style={{ width: "75%" }}>
          Contact us : pg900051@gmail.com
        </div>
        {showSignin && <SignIn submit={handleSubmit} />}
        {loader && <Loader />}

      </div>
    </React.Fragment>
  )
}

export default Result;

const SignIn = ({ submit }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (data.get('email') === "Admin" && data.get('password') === "@12345678") {
      return submit(data.get('email'));
    }
    else {
      alert("Please enter correct login details")
    }
  };

  return (
    <div style={{ background: "white", height: "100vh", width: "100vw", display: "flex", zIndex: "100", top: "0", position: 'fixed' }} >
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" color="primary" >
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="User Name"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <span style={{ color: "black", fontWeight: "bold", }} >
                  {"Note: Only admins can see the results"}
                </span>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </div>

  );
}