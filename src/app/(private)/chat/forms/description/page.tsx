'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button"; // Import Button from your UI library

interface JobDescriptionFormData {
  duties: string;
  values: string;
  compensation: string;
  businessDetails: string;
  additionalInformation: string;
}

const JobDescriptionForm: React.FC = () => {
  const [formData, setFormData] = useState<JobDescriptionFormData>({
    duties: '',
    values: '',
    compensation: '',
    businessDetails: '',
    additionalInformation: '',
  });

  // Array containing 4 suggestion strings
  const suggestions = [
    "Ensure employees meet all deadlines and project milestones.",
    "Maintain an inclusive and diverse work environment.",
    "Offer health insurance, paid leave, and promotion pathways.",
    "Provide exceptional customer service and business transparency."
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
    <div className="max-h-screen overflow-auto mt-5 pt-5 w-full flex items-center justify-center">
      <div className="p-10 bg-white shadow-md rounded-lg w-full max-w-2xl">
        
        {/* Header Section */}
        <h2 className="text-2xl font-bold mb-6 text-center">Job Description Form</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-2xl">
          
          {/* Duties */}
          <div>
            <label htmlFor="duties" className="block font-medium">
              Specific Duties or Responsibilities Critical to the Job
            </label>
            <textarea
              id="duties"
              name="duties"
              value={formData.duties}
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

          {/* Business Details */}
          <div>
            <label htmlFor="businessDetails" className="block font-medium">
              Details of Business
            </label>
            <textarea
              id="businessDetails"
              name="businessDetails"
              value={formData.businessDetails}
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

          {/* Values */}
          <div>
            <label htmlFor="values" className="block font-medium">
              Values or Aspects of Workplace Culture
            </label>
            <textarea
              id="values"
              name="values"
              value={formData.values}
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

          {/* Compensation */}
          <div>
            <label htmlFor="compensation" className="block font-medium">
              Compensation, Benefits, Advancement Opportunities
            </label>
            <textarea
              id="compensation"
              name="compensation"
              value={formData.compensation}
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
            Submit Job Description
          </Button>
        </form>
      </div>
    </div>
  );
};

export default JobDescriptionForm;
