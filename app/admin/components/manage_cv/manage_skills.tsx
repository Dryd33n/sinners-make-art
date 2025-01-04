import { CvData, SkillField, WorkField } from "@/db/schema";
import { date } from "drizzle-orm/mysql-core";
import { useState } from "react";

type ManageSkillProps = {
    cvData: CvData;
    setCvData: React.Dispatch<React.SetStateAction<CvData>>;
};

export default function ManageSkills({ cvData, setCvData }: ManageSkillProps) {
    const [newSkill, setNewSkill] = useState<SkillField>({
        skill: '',
        order: 0,
    });

    const submitExperience = async (e: React.FormEvent) => {
        e.preventDefault();
        const maxOrder = cvData.skills.reduce((max, exp) => Math.max(max, exp.order), 0);

        setNewSkill({ skill: '', order: maxOrder + 1 });
        setCvData({ ...cvData, skills: [...cvData.skills, newSkill] });
    };

    const reOrder = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up') {
            const tempOrder = cvData.skills[index].order;
            cvData.skills[index].order = cvData.skills[index - 1].order;
            cvData.skills[index - 1].order = tempOrder;
        } else {
            const tempOrder = cvData.skills[index].order;
            cvData.skills[index].order = cvData.skills[index + 1].order;
            cvData.skills[index + 1].order = tempOrder;
        }

        // Sort the work experience by order
        const newSkill = [...cvData.skills];
        const temp = newSkill[index];
        if (direction === 'up') {
            newSkill[index] = newSkill[index - 1];
            newSkill[index - 1] = temp;
        } else {
            newSkill[index] = newSkill[index + 1];
            newSkill[index + 1] = temp;
        }
        setCvData({ ...cvData, skills: newSkill });
    }

    return (
        <div className="basis-2/3 bg-grey-900 rounded-md p-3">
            <h1 className="text-lg font-extralight">ENTER SKILLS:</h1>
            <div className="w-full h-[0.5] bg-white mt-1 mb-8"></div>

            <form onSubmit={submitExperience} className="flex flex-col gap-2">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-row gap-3">
                        <div className="flex flex-col gap-0 items-start w-full">
                            <h1 className="font-light">Skill Text:</h1>
                            <textarea
                                name="Skill"
                                placeholder="Sculpture - wire, welding, plasma cutting, polymer clay"
                                value={newSkill.skill}
                                rows={4}
                                onChange={(e) => setNewSkill({ ...newSkill, skill: e.target.value })}
                                className='p-2 border border-gray-300 rounded text-black m-1 w-full'>
                            </textarea>
                        </div>
                    </div>
                    <div className="flex flex-col gap-0 items-start w-full ">
                        <div className="flex flex-row gap-2 w-full ">
                            <button
                                type="submit"
                                className="p-2 w-full bg-green-500 text-white rounded hover:bg-green-600  disabled:opacity-20"
                                disabled={(newSkill.skill == '')}
                            >Add Skil</button>
                        </div>
                    </div>
                </div>
            </form>



            <h1 className="text-lg font-extralight mt-10">CURRENT SKILLS:</h1>
            <div className="w-full h-[0.5] bg-white mt-1 mb-8"></div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-3">
                    {(cvData.skills && cvData.skills.length > 0) ? cvData.skills.map((skill: SkillField, index: number) => (
                        <div key={index} className="flex flex-row gap-3 w-full mr-32">
                            <div className="mb-5 font-serif basis-5/6">
                                <p>{skill.skill}</p>
                            </div>
                            <div className="flex flex-row gap-1  min-w-32 p-2 basis-1/6">
                                    <div className="flex flex-col gap-1 basis-1/2">
                                        <button className="p-1 basis-1/2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-20"
                                                onClick={() => reOrder(index, "up")}
                                                disabled={index === 0}
                                                >↑</button>
                                        <button className="p-1 basis-1/2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-20"
                                                onClick={() => reOrder(index, 'down')}
                                                disabled={index === cvData.skills.length - 1}
                                                >↓</button>
                                    </div>
                                    <button
                                        className="p-1 bg-red-500 text-white rounded hover:bg-red-800 basis-1/2"
                                        onClick={() => setCvData({ ...cvData, skills: cvData.skills.filter((_, i) => i !== index) })}
                                    >
                                        ✖
                                    </button>
                            </div>
                        </div>


                    )): <div className="text-grey-300">No skills added yet.</div>}
                </div>
            </div>
        </div>
    )
}