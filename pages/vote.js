
// import styleSheet
import styles from "../styles/vote.module.css";
import H from "../styles/home.module.css";
import UD from "../styles/components/userDetail.module.css"
// next Image
import Image from 'next/image';
// next Head
import Head from 'next/head'
// react
import React, { useEffect, useState } from "react";
// mui
import Button from '@mui/material/Button'
// mui icons
import CloseIcon from '@mui/icons-material/Close';
// logo
const logo = "/icons/logo.png"
// next router
import { useRouter } from "next/router";
// firebase
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../firebaseConfig"
// react notification
import { toast, Toaster } from "react-hot-toast";
// call api
import { callAPI } from "../api/api";


// candidate list
const candidates = [
  {
    id: 1,
    name: 'Muskan Yadav',
    photo: '/images/MuskanYadav.jpeg',
  },
  {
    id: 2,
    name: 'Nirmal Chaudhary',
    photo: '/images/NirmalChaudhary.jpeg',
  },
  {
    id: 3,
    name: 'Siddhanth Pareek',
    photo: '/images/SiddhanthPareek.jpeg',
  },
  {
    id: 4,
    name: ' Gaurav Soni',
    photo: '/images/GauravSoni.jpeg',
  },
];




//  Vote Function
const Vote = () => {
  // roter
  const router = useRouter()
  // managing states
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [candidateName, setCandidateName] = useState("Muskan Yadav");
  const [userRegistered, setUserRegistered] = useState(null);
  const [userData, setUserData] = useState();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [showPhoneverified, setShowPhoneverified] = useState(false);
  const [voted, setVoted] = useState(false);



  const handleUserDetails = async (fields) => {
    const response = await callAPI(
      `http://localhost:3000/api/user?ph=${fields.phoneNumber}`
    );
    const { message, data, errors } = response;
    if (message === "success") {
      if (typeof data === "object") {
        if (data["data"] !== null) {
          toast.error("You have allready voted")
          setVoted(true)
        }
        else {
          setUserData(fields)
          setUserRegistered(true);
          setShowPhoneverified(true);
          setPhoneNumber(fields.phoneNumber)
        }
      }
      else if (message === "failed") {

      } else {
        alert("Some Server error");
      }
    }
  };

  const handleCandidateSelect = (event) => {
    setSelectedCandidateId(Number(event.target.value));
    if (selectedCandidateId) {
      if (selectedCandidateId === 1) {
        setCandidateName("Muskan Yadav")
      }
      else if (selectedCandidateId === 2) {
        setCandidateName("Nirmal Chaudhary")
      }
      else if (selectedCandidateId === 3) {
        setCandidateName("Siddhanth Pareek")
      }
      else if (selectedCandidateId === 4) {
        setCandidateName("Gaurav Soni")
      }
    }
  };

  // Handle vote submission logic here
  const handleVoteSubmit = async (event) => {
    event.preventDefault();
    if (selectedCandidateId === null) alert("please select a candidate");
    else {
      const params = {
        fullName: userData["fullName"],
        phoneNumber: phoneNumber,
        age: userData["age"],
        dob: userData["dob"],
        gender: userData["gender"],
        studentId: userData["studentId"],
        adharNo: userData["adharNo"],
        candidateName: candidateName,
        candidateId: selectedCandidateId
      };
      const response = await callAPI(
        'user',
        params
      );
      const { message, data, errors } = response;
      if (message === "success") {
        if (typeof data === "object") {
          toast.success("data saved sucessfully")
          setVoted(true);
        }
        else if (message === "failed") {
        } else {
          alert("Some Server error");
        }
      }
    }
  };

  // to verify mobile no
  const verifyPhoneNumber = () => {

    const handleOtp = () => {
      if (phoneNumber && phoneNumber.length === 10) {
        otpSend();
        setShowOTP(true);
      }
    }
    return (
      <div className={UD.glass}>
        <div className={styles.pBox}>
          <span> Verify your phone number.</span>
          <input
            className={styles.input}
            type="text"
            value={phoneNumber}
            name="phoneNumber"
            onChange={(event) => { setPhoneNumber(event.target.value) }}
          />
          <Button variant="contained" onClick={handleOtp} >Send OTP</Button>
        </div>
      </div>
    );
  }

  // check opt
  const verifyOtp = () => {

    const reSendOtp = () => {
      otpSend();
    }
    const handleOtp = () => {
      if (otp && otp.length === 6) {
        window.confirmationResult
          .confirm(otp)
          .then(async (res) => {
            toast.success("Phone Number verified");
            setShowOTP(false);
            setShowPhoneverified(false)
          })
          .catch((err) => {
            console.log(err);
            console.log("error");
          });
      }
      else {
        toast.error("Please enter a valid OTP");
      }
    }


    return (
      <div className={UD.glass}>
        <div className={styles.pBox}>
          <span> Enter OTP</span>
          <input
            className={styles.input}
            type="text"
            value={otp}
            name="phoneNumber"
            onChange={(event) => { setOtp(event.target.value) }}
          />
          <div style={{ width: '100%', display: "flex", justifyContent: 'space-evenly' }}>
            <Button variant="contained" onClick={handleOtp} >Check OTP</Button>
            <Button variant="contained" onClick={reSendOtp} >Resend OTP</Button>
          </div>
        </div>
      </div>
    );
  }

  const onCaptchVerify = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            otpSend();
          },
          "expired-callback": () => { },
        },
        auth
      );
    }
  }

  const otpSend = () => {
    onCaptchVerify();
    const appVerifier = window.recaptchaVerifier;
    const ph = "+91" + phoneNumber;
    signInWithPhoneNumber(auth, ph, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        toast.success("OTP sended successfully!");
        setShowOTP(true);
        setShowPhoneverified(false)
      })
      .catch((error) => {
        // console.log(error);
        // toast.error("Try again in some time");
      });

  }

  return (
    <React.Fragment>
      <Head>
        <title>Vote | Pollify</title>
      </Head>
      {showPhoneverified && verifyPhoneNumber()}
      <Toaster toastOptions={{ duration: 4000 }} />
      <div id="recaptcha-container"></div>
      <div className={H.screen} style={{ height: "auto" }} >
        < div className={H.contentBox} style={{ justifyContent: "space-between" }} >
          {/* navbar */}
          <div className={H.navbar} style={{ borderBottom: "1px solid #ccc" }} >
            <img src={logo} style={{ height: "60px", marginLeft: "10%" }} />

            <div className={H.navbarTitle}>
              <span onClick={() => { router.push("/home") }} >Home</span>
              {/* <span>Learn</span> */}
              <span onClick={() => { router.push("/about") }} >About</span>

              <span style={{ color: "#2791d4" }} >Vote</span>
            </div>
          </div>
          {/* vote */}

          <div className={styles.container}>
            <h1 className={styles.title}>Vote for your favorite candidate</h1>
            <form className={styles.form} onSubmit={handleVoteSubmit}>
              {candidates.map((candidate) => (
                <label key={candidate.id} className={styles.label}>
                  <input
                    type="radio"
                    name="candidate"
                    value={candidate.id}
                    checked={selectedCandidateId === candidate.id}
                    onChange={handleCandidateSelect}
                    className={styles.radio}
                  />
                  <Image
                    src={candidate.photo}
                    alt={`${candidate.name} photo`}
                    width={150}
                    height={150}
                    className={styles.image}
                  />
                  <span className={styles.name}>{candidate.name}</span>
                </label>
              ))}
              <button
                type="submit"
                className={styles.button}
              >
                Submit Vote
              </button>
            </form>
          </div>

          <div className={H.footer} style={{ marginTop: "5%" }} >
            Contact us : pg900051@gmail.com
          </div>
        </div>
      </div>
      {!userRegistered && <UserDetail
        submit={handleUserDetails}
      />}
      {showOTP && verifyOtp()}
      {voted && <div className={UD.glass}>
        <div className={styles.pBox}>
          <span> Your vote is saved successfully!!. </span>
          <Button variant="contained" onClick={() => { router.push("/home") }} >Go to Home</Button>
        </div>
      </div>
      }
    </React.Fragment>
  )
}

export default Vote;



const UserDetail = ({ submit }) => {
  const [fields, setFields] = useState({
    fullName: "",
    age: "",
    dob: "",
    gender: "",
    studentId: "",
    adharNo: "",
    phoneNumber: ""
  })

  const handlefields = (event) => {
    const { target } = event;
    const { name, value } = target;
    let newFields = { ...fields, [name]: value };
    setFields(newFields);
  };

  const handleSubmit = () => {
    if (fields.fullName !== "") {
      if (fields.dob !== "") {
        if (fields.gender !== "") {
          if (fields.studentId !== "") {
            if (fields.adharNo !== "") {
              if (fields.phoneNumber !== "" && fields.phoneNumber.length === 10) {
                if (fields.age !== "" && +fields.age >= 16) {
                  return submit(fields)
                }
                else {
                  return alert("Age should be 16 or above 16")
                }
              }
              else {
                return alert("Please enter correct phoneNumber")
              }
            }
            else {
              return alert("Please enter your adharNo")
            }
          }
          else {
            return alert("Please enter your studentId number")
          }
        }
        else {
          return alert("Please enter your gender")
        }
      }
      else {
        return alert("Please enter your Date of birth")
      }
    }
    else {
      return alert("Please enter your full name")
    }
  }

  return (
    <div className={UD.glass}>
      <h1>User registration</h1>
      <div className={UD.form}>
        <div className={UD.formGroup}>
          <label className={UD.label}>
            Full Name:
            <input
              className={UD.input}
              type="text"
              value={fields.fullName}
              onChange={handlefields}
              name="fullName"
            />
          </label>
        </div>
        <div className={UD.formGroup}>
          <label className={UD.label}>
            Age:
            <input
              className={UD.input}
              type="text"
              value={fields.age}
              name="age"
              onChange={handlefields}
            />
          </label>
        </div>
        <div className={UD.formGroup}>
          <label className={UD.label}>
            Date of Birth:
            <input
              className={UD.input}
              type="date"
              value={fields.dob}
              name="dob"
              onChange={handlefields}
            />
          </label>
        </div>
        <div className={UD.formGroup}>
          <label className={UD.label}>
            Gender:
            <select
              className={UD.select}
              value={fields.gender}
              onChange={handlefields}
              name="gender"
            >
              <option value="">--Select Gender--</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </label>
        </div>
        <div className={UD.formGroup}>
          <label className={UD.label}>
            Student ID No:
            <input
              className={UD.input}
              type="text"
              value={fields.studentId}
              onChange={handlefields}
              name="studentId"
            />
          </label>
        </div>
        <div className={UD.formGroup}>
          <label className={UD.label}>
            Aadhar Card No:
            <input
              className={UD.input}
              type="text"
              value={fields.adharNo}
              onChange={handlefields}
              name="adharNo"
            />
          </label>
        </div>
        <div className={UD.formGroup}>
          <label className={UD.label}>
            Phone Number:
            <input
              className={UD.input}
              type="text"
              value={fields.phoneNumber}
              onChange={handlefields}
              name="phoneNumber"
            />
          </label>
        </div>
        <div className={UD.formGroup}>
          <button className={UD.button}
            onClick={handleSubmit}
          >Submit</button>
        </div>
      </div>
    </div>
  );
}













