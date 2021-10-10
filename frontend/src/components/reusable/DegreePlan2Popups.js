/* eslint-disable no-unused-vars */
/* * * *  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DegreePlan2Popups.js
 *
 *
 */

import { useEffect, useState } from "react";
import {
  Button,
  InputAdornment,
  TextField,
  IconButton,
  CircularProgress,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import AddBoxIcon from "@material-ui/icons/AddBox";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import IndeterminateCheckBoxIcon from "@material-ui/icons/IndeterminateCheckBox";
import CancelIcon from "@material-ui/icons/Cancel";
import ArrowLeftIcon from "@material-ui/icons/ArrowLeft";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";

import pStyle from "../reusable/reusableStyles/Popup.module.css";
import Popup from "../reusable/Popup";
import PlanCard from "../reusable/PlanCard";
import Dropdown from "../reusable/Dropdown";
import CourseSearchBar from "../reusable/CourseSearchBar";
import SnackBarAlert from "../reusable/SnackBarAlert";
import DegreeReqDisplay from "../reusable/DegreeReqDisplay";
import JarUserLogin from "../reusable/JarUserLogin";

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                                           *
 *                          Add PlanCard Popup                               *
 *                                                                           *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function AddSemester(props) {
  const { onClose, planID, planName, refreshPlans,
    onShowAlert,
    setAlertMessage,
    setAlertSeverity, } = props;

  /* Year Dropdown */
  const [yearOptions, setYearOptions] = useState([
    2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026,
  ]); // will be replaced by API?!
  const [selectedYear, setSelectedYear] = useState(yearOptions[0]);
  const [selectedYearIdx, setSelectedYearIdx] = useState(0);
  /* Term Dropdown */
  const [termOptions, setTermOptions] = useState([
    "Fall",
    "Spring",
    "Summer",
    "Annual",
  ]); // possible semesters
  const [selectedTerm, setSelectedTerm] = useState(termOptions[0]);

  const handleTermChange = (e) => {
    setSelectedTerm(e.target.value);
  };

  const handleYearChange = (e) => {
    setSelectedYearIdx(e.target.selectedIndex);
    setSelectedYear(e.target.value);
  };

  const handleAdd = () => {
    /* do something API??  */
    fetchAdd();
  };

  const fetchAdd = async () => {
    const yearTerm = yearOptions[selectedYearIdx] + " " + selectedTerm;
    console.log("yearTerm: ", yearTerm);
    console.log("planID: ", planID);
    const value = { plan_id: planID, term: yearTerm };
    const requestOption = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(value),
    };
    console.log("requestOption for fetchCreatePrivateReqs", requestOption);
    await fetch("https://jarney.club/api/degreeplan/term", requestOption)
      .then((response) => response.json())
      .then((result) => {
        refreshPlans();
        console.log("result from fetchAdd", result);
        setAlertMessage("Term added!");
        setAlertSeverity("success");
        onShowAlert();
        onClose();
      })
      .catch((error) => console.log("error from fetchAdd", error));
  };
  return (
    <div className={pStyle.loginContainer}>
      <div className={pStyle.headerContainer}>
        <IconButton
          type="button"
          onClick={onClose}
          className={pStyle.closeButton}
        >
          <CancelIcon />
        </IconButton>
        <div className={pStyle.headerBody}>Add Card to {planName}</div>
        <div />
      </div>
      <div className={pStyle.formContainer}>
        <div className={pStyle.dropdownContainer}>
          <Dropdown
            options={termOptions}
            selectedOption={selectedTerm}
            onOptionChange={handleTermChange}
          />
          <Dropdown
            options={yearOptions}
            selectedOption={selectedYear}
            onOptionChange={handleYearChange}
          />
        </div>

        <Button value="ADD" className={pStyle.submitButton} onClick={handleAdd}>
          ADD
        </Button>
      </div>
    </div>
  );
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                                           *
 *                            Remove PlanCard Popup                          *
 *                                                                           *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function RemoveSemester(props) {
  const { onClose, cardOptions, planName, planID, refreshPlans, onShowAlert,
    setAlertMessage,
    setAlertSeverity, } = props;
  console.log("cardoptions from removeSemester: ", cardOptions);
  /*  Stores the cards to be deleted  */
  const [selectedCards, setSelectedCards] = useState([]);

  const handleCardChange = (e) => {
    const val = e.target.id;
    const pos = selectedCards.indexOf(val);
    if (pos === -1) {
      /* was not in selectedCards array, aka was not selected, now select */
      setSelectedCards((prev) => prev.concat(val));
      e.target.style.backgroundColor = "#5A32BF";
      e.target.style.color = "#ffffff";
    } else {
      /* found in selectedCards array, aka was selected, now unselect */
      setSelectedCards((prev) => prev.filter((card) => card !== val));
      e.target.style.backgroundColor = "#ffffff";
      e.target.style.color = "#5A32BF";
    }
  };

  const handleClose = () => {
    onClose();
  };

  const handleRemove = () => {
    /* do something API?? pass in the selectedCards arr */

    fetchDeleteTerms();
  };

  const fetchDeleteTerms = async () => {
    const requestOption = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        plan_term_ids: selectedCards,
        plan_id: planID,
      }),
    }; 
    await fetch("https://jarney.club/api/degreeplan/terms", requestOption)
      .then((response) => response.json())
      .then((result) => {
        console.log("result from Degree Plan Terms remove", result);
        refreshPlans();
        setAlertMessage("Term(s) removed!");
        setAlertSeverity("success");
        onShowAlert();
        onClose();
      });
  };

  return (
    <div className={pStyle.loginContainer}>
      <div className={pStyle.headerContainer}>
        <IconButton onClick={handleClose} className={pStyle.closeButton}>
          <CancelIcon />
        </IconButton>
        <div className={pStyle.headerBody}>Remove Cards from {planName}</div>
        <div />
      </div>
      <div className={pStyle.formContainer}>
        <div className={pStyle.inputBarContainer}>
          {cardOptions.map((card) => (
            <input
              type="button"
              value={card.term}
              id={card.plan_term_id}
              key={card}
              className={pStyle.inputBar}
              onClick={(e) => handleCardChange(e)}
            />
          ))}
        </div>
        <Button className={pStyle.cancelButton} onClick={handleClose}>
          CANCEL
        </Button>
        <br />
        <Button className={pStyle.submitButton} onClick={handleRemove}>
          REMOVE
        </Button>
      </div>
    </div>
  );
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                                           *
 *                           Edit Plan Name Popup                            *
 *                                                                           *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function EditPlanName(props) {
  const { onClose, refreshPlans, planName, planID, onShowAlert,
    setAlertMessage,
    setAlertSeverity, } = props;

  const [editName, setEditName] = useState(planName);

  const handleClose = () => {
    onClose();
  };
  const handleEdit = (e) => {
    setEditName(e.target.value);
  };
  const handleSaveEdit = () => {
    /* do something API?? pass in the selectedCards arr */
    patchEditName();
    
    /* Then Close */
    
  };

  const patchEditName = async () => {
    const requestOption = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
    };
    const url = "https://jarney.club/api/degreeplan/"
      .concat(planID)
      .concat("/plan_name/")
      .concat(editName);
    console.log("requestOption for fetchCreatePrivateReqs", requestOption);
    await fetch(url, requestOption)
      .then((response) => response.json())
      .then((result) => {
        console.log("result from editPlanName: ", result)
        refreshPlans();
        setAlertMessage("Plan name changed successfully!");
        setAlertSeverity("success");
        onShowAlert();
        onClose();
      })
      .catch((error) => console.log("error from editPlanName: ", error));
  };

  return (
    <div className={pStyle.loginContainer}>
      <div className={pStyle.headerContainer}>
        <IconButton onClick={handleClose} className={pStyle.closeButton}>
          <CancelIcon />
        </IconButton>
        <div className={pStyle.headerBody}>EDIT PLAN NAME</div>

        <div />
      </div>
      <div className={pStyle.formContainer}>
        <div className={pStyle.inputBarContainer}>
          <TextField value={editName} onChange={handleEdit} />
        </div>

        <Button className={pStyle.submitButton} onClick={handleSaveEdit}>
          SAVE CHANGE
        </Button>
      </div>
    </div>
  );
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                                           *
 *                              Add Plan Popup                               *
 *                                                                           *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function AddPlan(props) {
  const { onClose, createNewPlan } = props;

  const [planName, setPlanName] = useState("");

  const handleClose = () => {
    onClose();
  };
  const handleNameChange = (e) => {
    setPlanName(e.target.value);
  };

  const handleAdd = () => {
    /* do something API?? pass in the selectedCards arr */
    createNewPlan(planName);

    /* Then Close */
    onClose();
  };

  return (
    <div className={pStyle.loginContainer}>
      <div className={pStyle.headerContainer}>
        <IconButton onClick={handleClose} className={pStyle.closeButton}>
          <CancelIcon />
        </IconButton>
        <div className={pStyle.headerBody}>ADD PLAN</div>
        <div />
      </div>
      <div className={pStyle.formContainer}>
        <div className={pStyle.inputBarContainer}>
          <TextField value={planName} onChange={handleNameChange} />
        </div>
        <Button className={pStyle.submitButton} onClick={handleAdd}>
          ADD
        </Button>
      </div>
    </div>
  );
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                                           *
 *                                Remove Plan Popup                          *
 *                                                                           *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function RemovePlan(props) {
  const { onClose, planName, planID, refreshPlans, onShowAlert,
    setAlertMessage,
    setAlertSeverity, } = props;

  const handleClose = () => {
    onClose();
  };

  const handleRemove = () => {
    /* do something API?? pass in the selectedCards arr */
    fetchDelete();
  };

  const fetchDelete = async () => {
    const requestOption = {
      method: "DELETE",
      headers: { "accept": "*/*" },
    };
    await fetch("https://jarney.club/api/degreeplan?plan_id=".concat(planID), requestOption)
      .then((response) => response.json())
      .then((result) => {
        console.log("result from Degree plan Delete", result);
        refreshPlans();
        setAlertMessage("Plan removed!");
        setAlertSeverity("success");
        onShowAlert();
        onClose();
      })
      .catch((error) => console.log("error from Degree Plan Delete", error));
  };

  return (
    <div className={pStyle.loginContainer}>
      <div className={pStyle.headerContainer}>
        <IconButton onClick={handleClose} className={pStyle.closeButton}>
          <CancelIcon />
        </IconButton>
        <div className={pStyle.headerBody}>&nbsp;</div>
        <div />
      </div>
      <div className={pStyle.formContainer}>
        <div className={pStyle.inputBarContainer}>
          Are you sure you want to remove {planName}?
        </div>
        <Button className={pStyle.cancelButton} onClick={handleClose}>
          CANCEL
        </Button>
        <br />
        <Button className={pStyle.submitButton} onClick={handleRemove}>
          REMOVE
        </Button>
      </div>
    </div>
  );
}

export { AddSemester, RemoveSemester, EditPlanName, AddPlan, RemovePlan };
