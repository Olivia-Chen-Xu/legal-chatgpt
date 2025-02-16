'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";  // Importing the same Button component

interface JobDetailsFormData {
  jobTitle: string;
  responsibilities: string;
  companyDescription: string;
  internalSystems: string;
  additionalInformation: string;
}

const JobDetailsForm: React.FC = () => {
  const [formData, setFormData] = useState<JobDetailsFormData>({
    jobTitle: '',
    responsibilities: '',
    companyDescription: '',
    internalSystems: '',
    additionalInformation: '',
  });

  // Array containing 4 suggestion strings
  const suggestions = [
    "Enter the official job title as listed in the company's directory.",
    "List 3-5 key responsibilities expected from this role.",
    "Provide a brief history and mission statement of the company.",
    "Mention software, tools, or platforms that the employee will use daily."
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="max-h-screen overflow-auto mt-10 pt-10 w-full flex items-center justify-center">
      <div className="p-10 bg-white shadow-md rounded-lg w-full max-w-2xl">
        
        {/* Header Section */}
        <h2 className="text-2xl font-bold mb-6 text-center">Onboarding Form</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-2xl">
          
          {/* Job Title */}
          <div>
            <label htmlFor="jobTitle" className="block font-medium">
              Job Title
            </label>
            <input
              type="text"
              id="jobTitle"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
            {/* Suggestion Box */}
            <div className="mt-2 p-2 bg-gray-100 border border-gray-300 rounded-md">
              <label className="block text-gray-700 font-medium">Suggestion</label>
              <p className="text-gray-600">{suggestions[0]}</p>
            </div>
          </div>

          {/* Responsibilities */}
          <div>
            <label htmlFor="responsibilities" className="block font-medium">
              Key Responsibilities
            </label>
            <textarea
              id="responsibilities"
              name="responsibilities"
              value={formData.responsibilities}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
            {/* Suggestion Box */}
            <div className="mt-2 p-2 bg-gray-100 border border-gray-300 rounded-md">
              <label className="block text-gray-700 font-medium">Suggestion</label>
              <p className="text-gray-600">{suggestions[1]}</p>
            </div>
          </div>

          {/* Company Description */}
          <div>
            <label htmlFor="companyDescription" className="block font-medium">
              Company Description
            </label>
            <textarea
              id="companyDescription"
              name="companyDescription"
              value={formData.companyDescription}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
            {/* Suggestion Box */}
            <div className="mt-2 p-2 bg-gray-100 border border-gray-300 rounded-md">
              <label className="block text-gray-700 font-medium">Suggestion</label>
              <p className="text-gray-600">{suggestions[2]}</p>
            </div>
          </div>

          {/* Internal Systems */}
          <div>
            <label htmlFor="internalSystems" className="block font-medium">
              Internal Systems and Tools Available
            </label>
            <textarea
              id="internalSystems"
              name="internalSystems"
              value={formData.internalSystems}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
            {/* Suggestion Box */}
            <div className="mt-2 p-2 bg-gray-100 border border-gray-300 rounded-md">
              <label className="block text-gray-700 font-medium">Suggestion</label>
              <p className="text-gray-600">{suggestions[3]}</p>
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <label htmlFor="additionalInformation" className="block font-medium">
              Add any Additional Information
            </label>
            <textarea
              id="additionalInformation"
              name="additionalInformation"
              value={formData.additionalInformation}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full mt-4">
            Submit Job Details
          </Button>
        </form>
      </div>
    </div>
  );
};

export default JobDetailsForm;
