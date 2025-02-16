'use client';

import React, { useState } from "react";
import { useRouter } from 'next/navigation';

const FormSelector: React.FC = () => {
  const [selectedForms, setSelectedForms] = useState<string[]>([]);
  const [employeePosition, setEmployeePosition] = useState(""); // Text input state
  const [error, setError] = useState(""); // Error message state
  const router = useRouter();

  const toggleForm = (form: string) => {
    if (selectedForms.includes(form)) {
      setSelectedForms(selectedForms.filter((f) => f !== form));
    } else {
      setSelectedForms([...selectedForms, form]);
    }
  };

  const handleNavigation = (formId: string) => {
    if (!employeePosition.trim()) {
      setError("You must enter an employee position before selecting a form.");
      return;
    }

    setError(""); // Clear error if input is valid


    const encodedPosition = encodeURIComponent(employeePosition); // URL-safe
    let targetRoute = "";

    switch (formId) {
      case "form1":
        targetRoute = `/chat/forms/description?position=${encodedPosition}`;
        break;
      case "form2":
        targetRoute = `/chat/forms/onboarding?position=${encodedPosition}`;
        break;
      case "form3":
        targetRoute = `/chat/forms/performance?position=${encodedPosition}`;
        break;
      case "form4":
        targetRoute = `/chat/forms/termination?position=${encodedPosition}`;
        break;
      default:
        return;
    }

    router.push(targetRoute);
    
  };

  const renderForms = () => {
    const forms = [
      { id: "form1", title: "Employee Job Description", component: <Form1 /> },
      { id: "form2", title: "Employee Onboarding", component: <Form2 /> },
      { id: "form3", title: "Employee Performance Analysis", component: <Form3 /> },
      { id: "form4", title: "Employee Termination", component: <Form4 /> },
    ];

    return (
      <div className="flex flex-col items-center space-y-4 w-full">
        {forms.map((form) => (
          <div key={form.id} className="w-full max-w-md">
            <button
              className={`w-full px-6 py-3 rounded-lg transition-colors duration-300 mb-2 ${
                employeePosition.trim()
                  ? "bg-white text-black hover:bg-gray-500 hover:text-white"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
              onClick={() => handleNavigation(form.id)}
              disabled={!employeePosition.trim()} // Disable if input is empty
            >
              {form.title}
            </button>
            {selectedForms.includes(form.id) && (
              <div className="mt-2 p-4 border border-gray-300 rounded-lg">
                {form.component}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex items-center justify-center h-screen w-full bg-gray-100">
      <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Select Forms to Display</h2>
        
        {/* Employee Position Input */}
        <div className="flex flex-col items-center w-full mb-4">
          <label className="text-lg font-semibold mb-2">Give Employee Position</label>
          <input
            type="text"
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter employee position"
            value={employeePosition}
            onChange={(e) => setEmployeePosition(e.target.value)}
          />
          {/* Error Message */}
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        {renderForms()}
      </div>
    </div>
  );
};

interface FormProps {
  onBack?: () => void;
}

const Form1: React.FC<FormProps> = () => (
  <div>
    <h2 className="text-xl font-semibold">Form 1</h2>
    <p>Content of Form 1</p>
  </div>
);

const Form2: React.FC<FormProps> = () => (
  <div>
    <h2 className="text-xl font-semibold">Form 2</h2>
    <p>Content of Form 2</p>
  </div>
);

const Form3: React.FC<FormProps> = () => (
  <div>
    <h2 className="text-xl font-semibold">Form 3</h2>
    <p>Content of Form 3</p>
  </div>
);

const Form4: React.FC<FormProps> = () => (
  <div>
    <h2 className="text-xl font-semibold">Form 4</h2>
    <p>Content of Form 4</p>
  </div>
);

export default FormSelector;
