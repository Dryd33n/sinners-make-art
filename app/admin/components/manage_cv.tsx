'use client';

import { CvData } from "@/db/schema";
import { useState } from "react";
import { ExperienceField, SkillField, AwardField, ProjectField, EducationField } from '@/db/schema';

const ManageCv: React.FC = () => {
    const [cvData, setCvData] = useState<CvData>({
      experience: [],
      skills: [],
      awards: [],
      projects: [],
      education: [],
    });
  
    const handleAddItem = <T extends keyof CvData>(field: T) => {
      setCvData((prev) => ({
        ...prev,
        [field]: [...prev[field], {} as CvData[T][number]],
      }));
    };
  
    const handleRemoveItem = <T extends keyof CvData>(field: T, index: number) => {
      setCvData((prev) => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index),
      }));
    };
  
    const handleFieldChange = <T extends keyof CvData>(
      field: T,
      index: number,
      key: keyof CvData[T][number],
      value: string | number
    ) => {
      setCvData((prev) => {
        const updatedField = [...prev[field]];
        updatedField[index] = {
          ...updatedField[index],
          [key]: value,
        };
        return {
          ...prev,
          [field]: updatedField,
        };
      });
    };
  
    const renderFieldList = <T extends keyof CvData>(field: T) => {
      return (
        <div>
          <h3>{field}</h3>
          {cvData[field].map((item, index) => (
            <div key={index} style={{ marginBottom: "1rem" }}>
              {Object.keys(item).map((key) => (
                <div key={key}>
                  <label>
                    {key}:
                    <input
                      type={typeof (item as any)[key] === "number" ? "number" : "text"}
                      value={(item as any)[key] as string | number}
                      onChange={(e) =>
                        handleFieldChange(field, index, key as keyof CvData[T][number],
                        typeof (item as any)[key] === "number"
                          ? Number(e.target.value)
                          : e.target.value
                        )
                      }
                    />
                  </label>
                </div>
              ))}
              <button onClick={() => handleRemoveItem(field, index)}>Remove</button>
            </div>
          ))}
          <button onClick={() => handleAddItem(field)}>Add {field.slice(0, -1)}</button>
        </div>
      );
    };
  
    return (
      <div>
        {renderFieldList("experience")}
        {renderFieldList("skills")}
        {renderFieldList("awards")}
        {renderFieldList("projects")}
        {renderFieldList("education")}
      </div>
    );
  };
  
  export default ManageCv;
  