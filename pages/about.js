// styles
import H from "../styles/home.module.css";
// next Head
import Head from 'next/head'
// react
import React, { useEffect, useState } from "react";
// logo
const logo = "/icons/logo.png"
// Images
const bannerImg = "/images/bannerImage.jpeg"
const thinkingThaught = "/images/img1.jpeg"
const register = "/images/img2.jpg"
const booth = "/images/img3.jpg"
// mui
import Button from '@mui/material/Button'
// next router
import { useRouter } from "next/router";


// Home Function
const About = () => {
  const router = useRouter()
  return (
    <React.Fragment>
      <Head>
        <title>About | Pollify</title>
      </Head>
      <div className={H.screen} style={{ height: "100vh" }} >
        < div className={H.contentBox} style={{justifyContent:"space-between"}} >
          {/* navbar */}
          <div className={H.navbar} style={{ width: "75%",borderBottom:"1px solid #ccc" }} >
            <img src={logo} style={{ height: "60px", marginLeft: "10%" }} />

            <div className={H.navbarTitle}>
              <span onClick={() => { router.push("/home") }} >Home</span>
              {/* <span>Learn</span> */}
              <span style={{ color: "#2791d4" }} >About</span>
              <span onClick={() => { router.push("/vote") }}  >Vote</span>
            </div>
          </div>
          {/* about */}
          <div className={H.aboutBox} >
            <h1>About:</h1>
            <span>
              Our online voting website provides a secure and convenient platform for organizations to conduct elections and polls. Our platform is designed to be user-friendly and accessible, allowing voters to cast their ballots quickly and easily from any device with an internet connection. With our advanced security measures, including two-factor authentication and encryption, we ensure the integrity and privacy of the voting process. Our platform also offers customizable options for administrators to set up and manage elections, including voter eligibility, candidate nomination, and result tabulation. With the use of otp login access to the voters we can ensure the security as one voter will be just allowed to vote once. The OTP will just be valid for a certain duration of the time and as the name says it is a one time password which can only be used once. This makes our webpage better than the EVM machines used right now for the voting purposes ,With the help of our website we will be able to prevent any kind of voting frauds like there will be no fake votes ,every vote will be counted and saved with the voter's information which the previously developed machine cannot do, which makes our website better and more advantageous than them.Whether you're running a small school election or a large-scale corporate poll, our online voting website provides a simple, efficient, and secure solution for all your election needs.
            </span>
          </div>
          <div className={H.footer} style={{marginTop:"5%"}} >
            Contact us : pg900051@gmail.com
          </div>
        </div>
      </div>

    </React.Fragment >
  )
}

// default exporting Home 
export default About;