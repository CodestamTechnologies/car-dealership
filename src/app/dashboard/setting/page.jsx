'use client'
import React from 'react'

const SettingsPage = () => {

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        localStorage.setItem('login-background', reader.result);
        alert('Background image updated!');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Settings Page</h1>
      <div className="mt-4">
        <label htmlFor="bg-upload" className="block text-sm font-medium text-gray-700">
          Upload Login Background
        </label>
        <div className="mt-1 flex items-center">
          <input
            id="bg-upload"
            name="bg-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
          />
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
