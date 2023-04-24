
// import styleSheet
import styles from "../styles/vote.module.css";
import H from "../styles/Home.module.css";
import UD from "../styles/components/userDetail.module.css"
import D from "../styles/components/detail.module.css";
// next Head
import Head from 'next/head'
// react
import React, { useState } from "react";
// mui
import Button from '@mui/material/Button'
// next router
import { useRouter } from "next/router";
// firebase
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../firebaseConfig"
// react notification
import { toast, Toaster } from "react-hot-toast";
// call api
import { callAPI } from "../api/api";
// components
import Loader from "../components/loader";

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


// instructions
const instructions = [
  "1. Make sure you are eligible to vote and are registered as a student at the institution.",

  "2. Make sure your device has a proper internet connection.",

  "3.  You need to fill in your required ID details properly.",

  "4. You need to have your mobile phone with you to verify yourself with the OTP sent on your phone number.",
  "5.  Review the list of candidates carefully.",
  "6. Select the candidate that you wish to vote for by clicking the corresponding button.",
  "7.  Before submitting your vote, make sure to review your selections and confirm your choices.",
  "8. After confirming your vote, submit your selections by clicking the 'submit' button.",
  "9. If you encounter any issues or concerns during the online voting process, follow the contact details.",
  '10. Now, click on the "Vote now" button.'
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
  const [loader, setLoader] = useState(false);
  const [confirmVote, setConfirmVote] = useState(false);
  const [instruction, setInstruction] = useState(true);



  const handleUserDetails = async (fields) => {
    setLoader(true)
    const response = await callAPI(
      `http://localhost:3000/api/user?phoneNumber=${fields.phoneNumber}&adharNo=${fields.adharNo}&studentId=${fields.studentId}`
    );
    setLoader(false);
    const { message, data, errors } = response;
    if (message === "success") {
      if (typeof data === "object") {
        if (data["data"] !== null) {
          toast.error("You have allready voted")
          setVoted(true)
        }
        else {
          setUserData(fields)
          setUserRegistered(false);
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
    if (Number(event.target.value)) {
      if (Number(event.target.value) === 1) {
        setCandidateName("Muskan Yadav")
      }
      else if (Number(event.target.value) === 2) {
        setCandidateName("Nirmal Chaudhary")
      }
      else if (Number(event.target.value) === 3) {
        setCandidateName("Siddhanth Pareek")
      }
      else if (Number(event.target.value) === 4) {
        setCandidateName("Gaurav Soni")
      }
    }
  };

  // Handle vote submission logic here
  const handleVoteSubmit = async (event) => {
    event.preventDefault();
    setConfirmVote(false);
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
      setLoader(true);
      const response = await callAPI(
        'user',
        params
      );
      setLoader(false);
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

    const handleOtp = async () => {
      if (phoneNumber && phoneNumber.length === 10) {
        const response = await callAPI(
          `http://localhost:3000/api/user?phoneNumber=${phoneNumber}`
        );
        setLoader(false);
        const { message, data, errors } = response;
        if (message === "success") {
          if (typeof data === "object") {
            if (data["data"] !== null) {
              toast.error("Vote have been submited already with this number.")
              // console.log(data);
            }
            else {

              otpSend();
              setShowOTP(true);

            }
          }
          else if (message === "failed") {

          } else {
            alert("Some Server error");
          }
        }
      }
      else {
        alert("enter phone number agian")
      }
    }
    return (
      <div className={UD.glass}>
        <div className={styles.pBox} style={{ marginTop: "20%" }} >
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
      if (phoneNumber.trim != "" && phoneNumber.length === 10)
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
            // console.log("a");
            // console.log(err);
            // console.log("a");
            if (err.code === "auth/code-expired") { toast.error("Opt expired. Click on resend otp") }
            if (err.code === "auth/invalid-verification-code") {
              toast.error("Please enter correct otp")
            }
          });
      }
      else {
        toast.error("Please enter a valid OTP");
      }
    }


    return (
      <div className={UD.glass}>
        <div className={styles.pBox} style={{ marginTop: "20%" }} >
          <span> Enter OTP</span>
          <input
            className={styles.input}
            type="text"
            value={otp}
            name="otp"
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

      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            otpSend()
          },
          "expired-callback": () => { },
        },
        auth
      );
    }
  

  const otpSend = () => {
    if (!phoneNumber && !phoneNumber.length === 10) return alert("Invalid phoneNumber");
    setLoader(true)
    onCaptchVerify();
    const appVerifier = window.recaptchaVerifier;
    const ph = "+91" + phoneNumber;
    signInWithPhoneNumber(auth, ph, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        toast.success("OTP sended successfully!");
        setShowPhoneverified(false)
        setLoader(false);
        setShowOTP(true);
      })
      .catch((error) => {
        // console.log("a");
        // console.log(error);

        if (error.code === "auth/too-many-requests") {
          toast.error("Too many requests!. Please try again later");
          setShowPhoneverified(true)
          setShowOTP(false);
          setLoader(false);
        }
        setLoader(false);
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
      {loader && <Loader />}
      <div id="recaptcha-container"></div>
      <div className={H.screen} style={{ height: "auto" }} >
        < div className={H.contentBox} style={{ justifyContent: "space-between" }} >
          {/* navbar */}
          <div className={H.navbar} style={{ borderBottom: "1px solid #ccc" }} >
            <h3>Pollify</h3>

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
            <div className={styles.form} >
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
                  <img
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
                onClick={() => { setConfirmVote(true) }}
              >
                Submit Vote
              </button>
            </div>
          </div>

          <div className={H.footer} style={{ marginTop: "5%" }} >
            Contact us : pg900051@gmail.com
          </div>
        </div>
      </div>
      {userRegistered && <UserDetail
        submit={handleUserDetails}
      />}
      {showOTP && verifyOtp()}
      {voted && <div className={UD.glass}>
        <div className={styles.pBox} style={{ width: "33%", marginTop: "20%" }}>
          <span> Your vote is saved successfully!!. </span>
          <Button variant="contained" onClick={() => { router.push("/home") }} >Go to Home</Button>
        </div>
      </div>
      }
      {confirmVote ? selectedCandidateId != null ? <div className={UD.glass}>
        <div className={styles.pBox} style={{ width: "33%", marginTop: "20%" }} >
          <span> You choose "{candidateName}" as your candidate. Are you sure you wanna proceed?. </span>
          <div style={{ width: '100%', display: 'flex', justifyContent: "space-evenly" }} >
            <Button variant="contained" onClick={() => { setConfirmVote(false) }} >Change candidate</Button>
            <Button variant="contained" onClick={handleVoteSubmit} >Submit</Button>
          </div>
        </div>
      </div>
        :
        <div className={UD.glass}>
          <div className={styles.pBox} style={{ width: "33%", marginTop: "20%" }} >
            <span> Select candidate first</span>

            <Button variant="contained" onClick={() => { setConfirmVote(false) }} >Ok</Button>
          </div>
        </div>
        :
        <></>
      }
      {instruction && <Detail details={instructions} click={() => { setInstruction(false); setUserRegistered(true) }} />}
    </React.Fragment>
  )
}

export default Vote;



const Detail = ({ details, click }) => {


  return (
    <div className={D.glass}>
      <div className={D.container}>
        <h1 className={D.topic}>{"instruction"}</h1>
        {details && details.map((object, index) => {
          return <p className={D.details} key={index} >{object}</p>;
        })}
        <Button variant="contained" sx={{ marginTop: "30px", marginBottom: "10px" }} onClick={click} color="primary" >Vote Now</Button>
      </div>
    </div>
  );
}



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
    if (fields.fullName.trim !== "") {
      if (fields.dob.trim !== "") {
        if (fields.gender.trim !== "") {
          if (fields.studentId.trim !== "") {
            if (fields.adharNo.trim !== "" && fields.adharNo.length === 12) {
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
              return alert("Please enter valid adharNo")
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













