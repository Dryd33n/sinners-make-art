'use client'

import { useEffect, useState } from "react";
import Footer from "../components/global/footer";
import Header from "../components/global/header"
import { AwardField, EducationField, ExhibitionField, WorkField, SkillField, CvData } from "@/db/schema";
import NavBar from "../components/global/navBar";


export default function CVPage() {
    const [cvData, setCvData] = useState<CvData>({
        exhibition: [],
        skills: [],
        awards: [],
        work: [],
        education: [],
    });

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
          } else {
            const error = await response.json();
            console.error('Error fetching CV data:', error);
            alert('Failed to fetch CV data. Please try again.');
          }
        } catch (error) {
          console.error('Error fetching CV:', error);
          alert('An error occurred while fetching the CV. Please try again.');
        }
      };
    
      useEffect(() => {
        const sortCvData = () => {
            //sort each array in cv data by order property
            cvData.exhibition.sort((a, b) => a.order - b.order);
            cvData.skills.sort((a, b) => a.order - b.order);
            cvData.awards.sort((a, b) => a.order - b.order);
            cvData.work.sort((a, b) => a.order - b.order);
            cvData.education.sort((a, b) => a.order - b.order);
          };

          fetchCv(); // Fetch CV data when the component mounts
          sortCvData();
          document.title = "CV | Mary-Jane Laronde";
      });


    return (<>
        <Header mainText="CURRICULUM VITAE" />
        <NavBar/>
        <div className="font-serif mt-0 m-3 text-grey-200 sm:mt-20 sm:m-5 md:mt-20 md:m-10 lg:mt-20 lg:m-20 xl:mt-20 xl:m-40 2xl:mt-20 2xl:m-60">
            <div className="flex flex-col">
                <h1 className="text-5xl tracking-wider">Mary-Jane Laronde</h1>
                <p className="font-sans text-grey-300 font-medium text-xl tracking-wider mt-5 mb-2">Practicing Artist</p>
                <div className="w-full bg-grey-300 h-[0.5]"></div>
            </div>
            <div className="flex flex-row gap-4 pt-10">
                {/* LEFT SIDE */}
                <div className="flex flex-col basis-2/3">

                    {/* EXPERIENCE */}
                    <p className=" text-white tracking-wider font-sans mb-8 font-extralight underline text-xl">EXHIBITIONS</p>
                    <div className="flex flex-col gap-3">
                        {cvData.exhibition.map((exhibition: ExhibitionField, index: number) => (
                            <div key={index} className="mb-5">
                                <div className="flex flex-row text-xl gap-1 flex-wrap">
                                    <h1 className="font-bold">{exhibition.title},</h1>
                                    <h1>{exhibition.location}</h1>
                                </div>
                                <p className="font-sans text-sm text-grey-300 my-1">{exhibition.date}</p>
                                <p>{exhibition.description}</p>
                            </div>
                        ))}
                    </div>

                    {/* PROJECTS */}
                    <p className=" text-white tracking-wider font-sans mt-12 mb-8 font-extralight underline text-xl">WORK EXPERIENCE</p>
                    <div className="flex flex-col gap-3">
                        {cvData.work.map((work: WorkField, index) => (
                            <div key={index} className="mb-5">
                                <div className="flex flex-row text-xl gap-1 flex-wrap">
                                    <h1 className="font-bold">{work.title},</h1>
                                    <h1>{work.location}</h1>
                                </div>
                                <p className="font-sans text-sm text-grey-300 my-1">{work.date}</p>
                                <p>{work.description}</p>
                            </div>
                        ))}
                    </div>

                    {/* EDUCATION */}
                    <p className=" text-white tracking-wider font-sans mt-12 mb-8 font-extralight underline text-xl">EDUCATION</p>
                    <div className="flex flex-col gap-3">
                        {cvData.education.map((education: EducationField, index) => (
                            <div key={index} className="mb-5">
                                <div className="flex flex-row text-xl gap-1 flex-wrap">
                                    <h1 className="font-bold">{education.title},</h1>
                                    <h1>{education.location}</h1>
                                    <p>—</p>
                                    <h1 className="font-extralight">{education.type}</h1>
                                </div>
                                <p className="font-sans text-sm text-grey-300 my-1">{education.date}</p>
                            </div>
                        ))}
                    </div>
                </div>
                {/* RIGHT SIDE */}
                <div className="flex flex-col basis-1/3">

                    {/* SKILLS */}
                    <div className="flex-basis-1">
                        <p className=" text-white tracking-wider font-sans mb-8 font-extralight underline text-xl">SKILLS</p>
                        <div className="flex flex-col gap-2 mt-5">
                            {cvData.skills.map((skill: SkillField, index) => (
                                <p key={index} className="text-grey-200 mb-7">{skill.skill}</p>
                            ))}
                        </div>
                    </div>

                    {/* AWARDS */}
                    <div className="mt-auto">
                        <p className=" text-white tracking-wider font-sans  mt-56 mb-8 font-extralight underline text-xl">AWARDS</p>
                        <div>
                            {cvData.awards.map((award: AwardField, index) => (
                                <div key={index} className="mb-5">
                                    <p className="font-bold inline mr-1">{award.title}</p>
                                    <br />
                                    <p className="text-grey-300 inline">{award.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Footer />
    </>)
}