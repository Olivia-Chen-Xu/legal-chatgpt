'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface PerformanceAssessmentFormData {
  taskCompletion: number;
  workUnderPressure: number;
  performanceTargets: number;
  timeManagement: number;
  problemSolving: number;
  attitude: number;
  teamwork: number;
  contributions: number;
  initiative: number;
  policyAdherence: number;
  performanceElaboration: string;
  futureGoals: string;
  additionalInformation: string;
}

const PerformanceAssessmentForm = () => {
  const [formData, setFormData] = useState<PerformanceAssessmentFormData>({
    taskCompletion: 1,
    workUnderPressure: 1,
    performanceTargets: 1,
    timeManagement: 1,
    problemSolving: 1,
    attitude: 1,
    teamwork: 1,
    contributions: 1,
    initiative: 1,
    policyAdherence: 1,
    performanceElaboration: '',
    futureGoals: '',
    additionalInformation: '',
  });

  // Array containing 2 suggestion strings
  const suggestions = [
    "Describe recent achievements, strengths, and challenges faced during the evaluation period.",
    "Outline actionable steps and development plans to improve performance in key areas."
  ];

  const handleSliderChange = (name: keyof PerformanceAssessmentFormData, value: number[]) => {
    setFormData(prev => ({
      ...prev,
      [name]: value[0]
    }));
  };

  const handleTextChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  const ratingInputs = [
    {
      id: 'taskCompletion',
      label: 'Consistently completes assigned tasks within established deadlines'
    },
    {
      id: 'workUnderPressure',
      label: 'Maintains effectiveness and quality of work under pressure or tight deadlines'
    },
    {
      id: 'performanceTargets',
      label: 'Achieves or exceeds defined performance targets and expectations'
    },
    {
      id: 'timeManagement',
      label: 'Demonstrates effective time management and prioritization of responsibilities'
    },
    {
      id: 'problemSolving',
      label: 'Identifies and implements practical solutions to business challenges'
    },
    {
      id: 'attitude',
      label: 'Exhibits a constructive attitude and enthusiasm in daily work activities'
    },
    {
      id: 'teamwork',
      label: 'Works effectively with colleagues and contributes to team success'
    },
    {
      id: 'contributions',
      label: 'Makes meaningful contributions to departmental and organizational objectives'
    },
    {
      id: 'initiative',
      label: 'Shows initiative and proactively identifies opportunities for improvement'
    },
    {
      id: 'policyAdherence',
      label: 'Adheres to company policies and procedures'
    }
  ];

  return (
    <div className="min-h-screen w-full flex items-start justify-center overflow-x-hidden">
      <div className="p-10 bg-white shadow-md rounded-lg w-full max-w-2xl my-20">
        <h2 className="text-2xl font-bold mb-6 text-center">Performance Assessment Form</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {ratingInputs.map(({ id, label }) => (
            <div key={id} className="space-y-2">
              <div className="flex justify-between items-start gap-4">
                <label htmlFor={id} className="block font-medium text-sm flex-1">
                  {label}
                </label>
                <span className="text-sm font-medium w-8 text-center shrink-0">
                  {formData[id as keyof PerformanceAssessmentFormData]}
                </span>
              </div>
              <Slider
                id={id}
                min={1}
                max={5}
                step={1}
                value={[formData[id as keyof PerformanceAssessmentFormData]]}
                onValueChange={(value) => handleSliderChange(id as keyof PerformanceAssessmentFormData, value)}
                className="py-4"
              />
            </div>
          ))}

          {/* Performance Details */}
          <div className="space-y-2">
            <label htmlFor="performanceElaboration" className="block font-medium text-sm">
              Performance Details
            </label>
            <textarea
              id="performanceElaboration"
              name="performanceElaboration"
              value={formData.performanceElaboration}
              onChange={handleTextChange}
              className="w-full p-2 border rounded-md h-32"
              placeholder="Provide specific examples and details about the employee's performance..."
              required
            />
            {/* Suggestion Box */}
            <div className="mt-2 p-2 bg-gray-100 border border-gray-300 rounded-md">
              <label className="block text-gray-700 font-medium">Suggestion</label>
              <p className="text-gray-600">{suggestions[0]}</p>
            </div>
          </div>

          {/* Future Goals and Development */}
          <div className="space-y-2">
            <label htmlFor="futureGoals" className="block font-medium text-sm">
              Future Goals and Development
            </label>
            <textarea
              id="futureGoals"
              name="futureGoals"
              value={formData.futureGoals}
              onChange={handleTextChange}
              className="w-full p-2 border rounded-md h-32"
              placeholder="Outline specific goals and development areas for the upcoming period..."
              required
            />
            {/* Suggestion Box */}
            <div className="mt-2 p-2 bg-gray-100 border border-gray-300 rounded-md">
              <label className="block text-gray-700 font-medium">Suggestion</label>
              <p className="text-gray-600">{suggestions[1]}</p>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-2">
            <label htmlFor="additionalInformation" className="block font-medium text-sm">
              Add any Additional Information
            </label>
            <textarea
              id="additionalInformation"
              name="additionalInformation"
              value={formData.additionalInformation}
              onChange={handleTextChange}
              className="w-full p-2 border rounded-md h-32"
              placeholder="Provide any additional details or remarks..."
              required
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full">
            Submit Assessment
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PerformanceAssessmentForm;
