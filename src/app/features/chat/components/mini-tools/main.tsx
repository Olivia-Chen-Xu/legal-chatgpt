import React, { useState } from "react";

const FormSelector: React.FC = () => {
  const [selectedForm, setSelectedForm] = useState<string | null>(null);

  const renderForm = () => {
    switch (selectedForm) {
      case "form1":
        return <Form1 />;
      case "form2":
        return <Form2 />;
      case "form3":
        return <Form3 />;
      case "form4":
        return <Form4 />;
      default:
        return <p>Select a form to begin.</p>;
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left side: Forms */}
      <div className="w-1/2 p-4 border-r border-gray-300">
        {renderForm()}
      </div>

      {/* Right side: Open Justice prompt */}
      <div className="w-1/2 p-4">
        <h2 className="text-lg font-semibold">Open Justice Prompt Page</h2>
        <p>This is where the Open Justice AI prompt remains active.</p>
      </div>

      {/* Buttons to Select Forms */}
      <div className="fixed bottom-4 left-4 flex gap-2">
        {["form1", "form2", "form3", "form4"].map((form) => (
          <button
            key={form}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
            onClick={() => setSelectedForm(form)}
          >
            Open {form}
          </button>
        ))}
      </div>
    </div>
  );
};

const Form1: React.FC = () => <div><h2>Form 1</h2><p>Content of Form 1</p></div>;
const Form2: React.FC = () => <div><h2>Form 2</h2><p>Content of Form 2</p></div>;
const Form3: React.FC = () => <div><h2>Form 3</h2><p>Content of Form 3</p></div>;
const Form4: React.FC = () => <div><h2>Form 4</h2><p>Content of Form 4</p></div>;

export default FormSelector;
