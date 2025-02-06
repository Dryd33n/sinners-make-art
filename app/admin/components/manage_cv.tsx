'use client';

import { CvData } from "@/db/schema";
import { useEffect, useState } from "react";
import ManageExhibition from "./manage_cv/manage_exhibition";
import ManageWork from "./manage_cv/manage_workexperience";
import ManageEducation from "./manage_cv/manage_education";
import ManageSkills from "./manage_cv/manage_skills";
import ManageAwards from "./manage_cv/manage_awards";

const ManageCv: React.FC = () => {
  const [cvData, setCvData] = useState<CvData>({
    exhibition: [],
    skills: [],
    awards: [],
    work: [],
    education: [],
  });

  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const submitCv = async () => {
    try {
      const response = await fetch('/api/cv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cvData),
      });

      if (!response.ok){
        const error = await response.json();
        console.error('Error updating CV:', error);
        setErrorMessage('Failed to update CV. Please try again.');
        setSuccessMessage('');
      }

      setSuccessMessage('CV updated successfully');
      setErrorMessage('');
    } catch (error) {
      console.error('Error submitting CV:', error);
      setErrorMessage('An error occurred while updating the CV. Please try again.');
      setSuccessMessage('');
    }
  };

  const fetchCv = async () => {
    try {
      const response = await fetch('/api/cv', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        setCvData(result.data); // Assuming the API returns { success: true, data: CvData }
        setSuccessMessage('CV data loaded successfully');
        setErrorMessage('');
      } else {
        const error = await response.json();
        console.error('Error fetching CV data:', error);
        setErrorMessage('Failed to fetch CV data. Please try again.');
        setSuccessMessage('');
      }
    } catch (error) {
      console.error('Error fetching CV:', error);
      setErrorMessage('An error occurred while fetching the CV. Please try again.');
      setSuccessMessage('');
    }
  };

  useEffect(() => {
    fetchCv(); // Fetch CV data when the component mounts
  }, []);





  return (<>
    <div className="flex flex-row gap-8">

      <div className="flex flex-col gap-8 basis-2/3">
        <ManageExhibition cvData={cvData} setCvData={setCvData}/>
        <ManageWork cvData={cvData} setCvData={setCvData}/>
        <ManageEducation cvData={cvData} setCvData={setCvData}/>
      </div>
      <div className="basis-1/3 flex flex-col gap-8">
        <ManageSkills cvData={cvData} setCvData={setCvData}/>
        <ManageAwards cvData={cvData} setCvData={setCvData}/>
      </div>
    </div>
    {successMessage && <p className="text-green-500">{successMessage}</p>}
    {errorMessage && <p className="text-red-500">{errorMessage}</p>}
    <button className="p-2 mt-8 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-20" onClick={submitCv}>
      Update CV
    </button>
  </>)

}
export default ManageCv;
