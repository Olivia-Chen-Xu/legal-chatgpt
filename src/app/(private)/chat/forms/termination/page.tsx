'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";

interface TerminationFormData {
  reasonForTermination: boolean; // Now a Yes/No Checkbox
  employmentStartDate: string;
  isContract: boolean; // New Field
  terminationNotificationDate: string; // Moved Up
  isEmployeePregnant: boolean; // New Field
  yearsEmployed: number;
  grossCompensation: number;
  employeeObligations: string[]; // Now an array (Multiple Choice)
}

const TerminationForm: React.FC = () => {
  const [formData, setFormData] = useState<TerminationFormData>({
    reasonForTermination: false, // Default No
    employmentStartDate: '',
    isContract: false, // New Field
    terminationNotificationDate: '', // Moved Up
    isEmployeePregnant: false, // New Field
    yearsEmployed: 0,
    grossCompensation: 0,
    employeeObligations: [], // Multiple Choice Selection
  });

  const employeeObligationOptions = [
    "Non-compete",
    "Non-solicit",
    "Protecting confidential information",
    "Non-disparagement",
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox" && e.target instanceof HTMLInputElement) {
      const newValue = e.target.checked;
      
      if (name === "isContract" || name === "isEmployeePregnant" || name === "reasonForTermination") {
        // Handle normal boolean checkboxes (Yes/No questions)
        setFormData((prevData) => ({
          ...prevData,
          [name]: newValue,
        }));
      } else {
        // Handle Employee Obligations Multiple Choice
        setFormData((prevData) => ({
          ...prevData,
          employeeObligations: newValue
            ? [...prevData.employeeObligations, name] // Add obligation
            : prevData.employeeObligations.filter((obligation) => obligation !== name), // Remove obligation
        }));
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="max-h-screen overflow-auto mt-20 pt-20 w-full flex items-center justify-center">
      <div className="p-10 bg-white shadow-md rounded-lg w-full max-w-2xl">

        {/* Header Section */}
        <h2 className="text-2xl font-bold mb-6 text-center">Termination Form</h2>

        <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-2xl">
          {/* Reason for Termination (Now Yes/No Checkbox) */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="reasonForTermination"
              name="reasonForTermination"
              checked={formData.reasonForTermination}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="reasonForTermination" className="font-medium">
              Is the employee being terminated for willful misconduct, disobedience, or willful neglect of a non-trivial duty?
            </label>
          </div>

          {/* Employment Start Date */}
          <div>
            <label htmlFor="employmentStartDate" className="block font-medium">
              Employment Start Date
            </label>
            <input
              type="date"
              id="employmentStartDate"
              name="employmentStartDate"
              value={formData.employmentStartDate}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>

          {/* Is there a contract? */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isContract"
              name="isContract"
              checked={formData.isContract}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="isContract" className="font-medium">
              Is there a contract?
            </label>
          </div>

          {/* Termination Notification Date (Moved Up) */}
          <div>
            <label htmlFor="terminationNotificationDate" className="block font-medium">
              Termination Notification Date
            </label>
            <input
              type="date"
              id="terminationNotificationDate"
              name="terminationNotificationDate"
              value={formData.terminationNotificationDate}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>

          {/* Is Employee Pregnant? */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isEmployeePregnant"
              name="isEmployeePregnant"
              checked={formData.isEmployeePregnant}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="isEmployeePregnant" className="font-medium">
              Is the employee pregnant?
            </label>
          </div>

          {/* Years Employed */}
          <div>
            <label htmlFor="yearsEmployed" className="block font-medium">
              Years Employed
            </label>
            <input
              type="number"
              id="yearsEmployed"
              name="yearsEmployed"
              value={formData.yearsEmployed}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>

          {/* Gross Compensation */}
          <div>
            <label htmlFor="grossCompensation" className="block font-medium">
              Gross Compensation (Salary)
            </label>
            <input
              type="number"
              id="grossCompensation"
              name="grossCompensation"
              value={formData.grossCompensation}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>

          {/* Employee Obligations - Multiple Choice */}
          <div>
            <label className="block font-medium">Employee Obligations</label>
            {employeeObligationOptions.map((obligation) => (
              <div key={obligation} className="flex items-center mt-2">
                <input
                  type="checkbox"
                  id={obligation}
                  name={obligation}
                  checked={formData.employeeObligations.includes(obligation)}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label htmlFor={obligation} className="font-medium">
                  {obligation}
                </label>
              </div>
            ))}
          </div>

          <Button type="submit" className="w-full mt-4">
            Submit Termination Form
          </Button>
        </form>
      </div>
    </div>
  );
};

export default TerminationForm;
