'use client'

import { useState } from "react";
import Footer from "../components/global/footer";
import Header from "../components/global/header"
import { AwardField, ProjectField, EducationField, ExperienceField } from "@/db/schema";



// const experienceData: ExperienceField[] = [
//     {
//         title: "Interoception",
//         location: "Uvic Audain Gallery",
//         date: "December 2024",
//         description: "306 and 395 come together with their works from the semester."
//     },
//     {
//         title: "Photo lab assistant",
//         location: "University of Victoria",
//         date: "September 2024",
//         description: "Large format printing assistant as well as large format lamination and di-bond mounting."
//     },
//     {
//         title: "Cognito",
//         location: "The Vault — Video Exhibition",
//         date: "February 2024",
//         description: "A group video exhibition at The Vault gallery with dueling video projectors curated by Leanne Olsen."
//     },
//     {
//         title: "Achievement Unlocked",
//         location: "Salmon Arm arts center",
//         date: "March 2022",
//         description: "Group exhibition of students with different works to show off their achievements."
//     }
// ]

// const skillData: string[] = [
//     "Sculpture - wire, welding, plasma cutting, polymer clay",
//     "Photography - scenery, portraits, events, urban, digital, analog",
//     "Videography - edits, montages, urban identities",
//     "Stained glass"
// ]

// const awardData: AwardField[] = [
//     {
//         title: "Alan Steven John Award in Fine Arts",
//         description: "Offered to students with a 4.0/9.0 GPA"
//     },
//     {
//         title: "District Authority Award in Fine Arts",
//         description: "Offered to grade 12 students going to post-secondary"
//     }
// ]

// const projectData: ProjectField[] = [
//     {
//         title: "Roger, as a Journal. Who is he?",
//         genre: "Journalistic Document",
//         description: "4th time working with the theme of roger"
//     }
// ]

// const educationData: EducationField[] = [
// {
//     title: "University of Victoria",
//     location: "Victoria",
//     type: "BFA in Visual Arts",
//     date: "September 2022 - Current"
// },
// {
//     title: "Salmon Arm Secondary",
//     location: "Salmon Arm",
//     type: "Dogwood",
//     date: "June 2022"
// }
// ]


export default function CVPage() {
    const [experienceData, setExperienceData] = useState<ExperienceField[]>([]);
    const [skillData, setSkillData] = useState<string[]>([]);
    const [awardData, setAwardData] = useState<AwardField[]>([]);
    const [projectData, setProjectData] = useState<ProjectField[]>([]);
    const [educationData, setEducationData] = useState<EducationField[]>([]);


    return (<>
        <Header mainText="CURRICULUM VITAE" />
        <div className="font-serif m-3 text-grey-200 sm:m-5 md:m-10 lg:m-20 xl:m-40 2xl:m-60">
            <div className="flex flex-col">
                <h1 className="text-5xl tracking-wider">Mary-Jane Laronde</h1>
                <p className="font-sans text-grey-300 font-medium text-xl tracking-wider mt-5 mb-2">Practicing Artist</p>
                <div className="w-full bg-grey-300 h-[0.5]"></div>
            </div>
            <div className="flex flex-row gap-4 pt-10">
                {/* LEFT SIDE */}
                <div className="flex flex-col basis-2/3">

                    {/* EXPERIENCE */}
                    <p className="font-semibold text-blue-400 tracking-wider font-sans text-sm mb-3">EXPERIENCE</p>
                    <div className="flex flex-col gap-3">
                        {experienceData.map((experience, index) => (
                            <div key={index} className="mb-5">
                                <div className="flex flex-row text-xl gap-1 flex-wrap">
                                    <h1 className="font-bold">{experience.title},</h1>
                                    <h1>{experience.location}</h1>
                                </div>
                                <p className="font-sans text-sm text-grey-300 my-1">{experience.date}</p>
                                <p>{experience.description}</p>
                            </div>
                        ))}
                    </div>

                    {/* EDUCATION */}
                    <p className="font-semibold text-blue-400 tracking-wider font-sans text-sm mt-12 mb-3">EDUCATION</p>
                    <div className="flex flex-col gap-3">
                        {educationData.map((education, index) => (
                            <div key={index} className="mb-5">
                                <div className="flex flex-row text-xl gap-1 flex-wrap">
                                    <h1 className="font-bold">{education.title},</h1>
                                    <h1>{education.location}</h1>
                                    <p>—</p>
                                    <h1 className="italic">{education.type}</h1>
                                </div>
                                <p className="font-sans text-sm text-grey-300 my-1">{education.date}</p>
                            </div>
                        ))}
                    </div>

                    {/* PROJECTS */}
                    <p className="font-semibold text-blue-400 tracking-wider font-sans text-sm mt-12 mb-3">PROJECTS</p>
                    <div className="flex flex-col gap-3">
                        {projectData.map((project, index) => (
                            <div key={index} className="mb-5">
                                <div className="flex flex-row text-xl gap-1 flex-wrap">
                                    <h1 className="font-bold">{project.title}</h1>
                                    <p>—</p>
                                    <h1 className="italic">{project.genre}</h1>
                                </div>
                                <p className="font-sans text-sm text-grey-300 my-1">{project.description}</p>
                            </div>
                        ))}
                    </div>

                </div>
                {/* RIGHT SIDE */}
                <div className="flex flex-col basis-1/3">

                    {/* SKILLS */}
                    <p className="font-semibold text-blue-400 tracking-wider font-sans text-sm">SKILLS</p>
                    <div className="flex flex-col gap-2 mt-5">
                        {skillData.map((skill, index) => (
                            <p key={index} className="text-grey-200 mb-7">{skill}</p>
                        ))}
                    </div>

                    {/* AWARDS */}
                    <p className="font-semibold text-blue-400 tracking-wider font-sans text-sm mt-56 mb-7 ">AWARDS</p>
                    <div>
                        {awardData.map((award, index) => (
                            <div key={index} className="mb-5">
                                <p className="font-bold inline mr-1">{award.title}</p>
                                <div className="inline-block w-[1px] h-full bg-white align-middle mx-2"> </div>
                                <p className="text-grey-300 inline">{award.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
        <Footer/>
    </>)
}