import React, { useState } from 'react';
import { StatusDropdown } from "./SharedComponenets/StatusDropdown.jsx";
const baseUrl = import.meta.env.VITE_API_BASE_URL;



const JobApplicationForm = () => {
    const [formData, setFormData] = useState({
        companyName: '',
        position: '',
        appliedDate: new Date().toISOString().split('T')[0],  // Default to today's date
        jobLink: '',
        documents: null,
        status: 'Applied',
        atsScore: '',
        isGermanRequired: false,
        isRefered: false,
        referedBy: ''
    });

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files : value,  // If it's a file input, store files, otherwise store value
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const submitData = new FormData();
        submitData.append('companyName', formData.companyName);
        submitData.append('position', formData.position);
        submitData.append('appliedDate', formData.appliedDate);
        submitData.append('jobLink', formData.jobLink);
        submitData.append('status', formData.status);
        submitData.append('comments', formData.comments);
        submitData.append('atsScore', formData.atsScore);
        submitData.append('requiredExpereince', formData.requiredExpereince);
        submitData.append('isGermanRequired', formData.isGermanRequired);
        submitData.append('germanLevel', formData.germanLevel);
        submitData.append('isRefered', formData.isRefered);
        submitData.append('referedBy', formData.referedBy);

        // Append documents if they exist
        if (formData.documents) {
            for (let i = 0; i < formData.documents.length; i++) {
                submitData.append('documentFile', formData.documents[i]);
            }
        }

        // Send form data to the backend API
        try {
            const response = await fetch(`${baseUrl}/api/JobApplications`, {
                method: 'POST',
                body: submitData,
            });
            if (response.ok) {
                setErrorMessage('');
                setSuccessMessage('Application submitted successfully!');
                setFormData({
                    companyName: '',
                    position: '',
                    appliedDate: new Date().toISOString().split('T')[0],
                    jobLink: '',
                    documents: null,
                    status: '',
                    comments: '',
                    atsScore: '',
                    requiredExpereince: '',
                    isGermanRequired: false,
                    germanLevel: '',
                    isRefered: false,
                    referedBy: ''
                });

                // Clear file input manually
                document.querySelector('input[name="documents"]').value = '';

                // Automatically clear the message after 3 seconds
                setTimeout(() => {
                    setSuccessMessage('');
                }, 3000);
            } else {
                console.error('Error: Server responded with status', response.status);
                const errorText = await response.text(); // This can help debug the response content
                setErrorMessage(errorText);
                console.error('Server Error Response:', errorText);
            }
        } catch (error) {
            setErrorMessage(error);
            console.error('Error submitting form:', error);
        }
    };

    return (
        <div className="container mt-4">
            {successMessage && (
                <div className="alert alert-success" role="alert">
                    {successMessage}
                </div>
            )}
            {errorMessage && (
                <div className="alert alert-danger" role="alert">
                    {errorMessage}
                </div>
            )}
            <h2 className="mb-4">Job Application Form</h2>
            <form onSubmit={handleSubmit}>
                <div className="row">
                    {/* Company & Position */}
                    <div className="col-md-6 mb-3 d-flex align-items-center">
                        <label htmlFor="companyName" className="me-3" style={{ minWidth: '130px' }}>
                            Company
                        </label>
                        <input
                            type="text"
                            id="companyName"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="col-md-6 mb-3 d-flex align-items-center">
                        <label htmlFor="position" className="me-3" style={{ minWidth: '130px' }}>
                            Position
                        </label>
                        <input
                            type="text"
                            id="position"
                            name="position"
                            value={formData.position}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>

                    {/* Applied Date & Job Link */}
                    <div className="col-md-6 mb-3 d-flex align-items-center">
                        <label htmlFor="appliedDate" className="me-3" style={{ minWidth: '130px' }}>
                            Applied On
                        </label>
                        <input
                            type="date"
                            id="appliedDate"
                            name="appliedDate"
                            value={formData.appliedDate}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="col-md-6 mb-3 d-flex align-items-center">
                        <label htmlFor="jobLink" className="me-3" style={{ minWidth: '130px' }}>
                            Job Link
                        </label>
                        <input
                            type="url"
                            id="jobLink"
                            name="jobLink"
                            value={formData.jobLink}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>

                    {/* Documents & ATS Score */}
                    <div className="col-md-6 mb-3 d-flex align-items-center">
                        <label htmlFor="documents" className="me-3" style={{ minWidth: '130px' }}>
                            Documents
                        </label>
                        <input
                            type="file"
                            id="documents"
                            name="documents"
                            multiple
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                    <div className="col-md-6 mb-3 d-flex align-items-center">
                        <label htmlFor="atsScore" className="me-3" style={{ minWidth: '130px' }}>
                            Resume ATS Score
                        </label>
                        <input
                            type="text"
                            id="atsScore"
                            name="atsScore"
                            value={formData.atsScore}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>

                    {/* Experience & German Level */}
                    <div className="col-md-6 mb-3 d-flex align-items-center">
                        <label htmlFor="requiredExpereince" className="me-3" style={{ minWidth: '130px' }}>
                            Experience Required
                        </label>
                        <input
                            type="text"
                            id="requiredExpereince"
                            name="requiredExpereince"
                            value={formData.requiredExpereince}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                    <div className="col-md-6 mb-3 d-flex align-items-center">

                        <label className="me-3" style={{ minWidth: '130px' }}>
                            Status
                        </label>
                        <StatusDropdown
                            currentStatus={formData.status}
                            onChange={(newStatus) => handleChange({ target: { name: "status", value: newStatus } })}
                        />
                    </div>

                    {/* Checkboxes */}
                    <div className="col-md-6 mb-3 d-flex align-items-center">
                        <div className="form-check ms-3 mt-3">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="isGermanRequired"
                                name="isGermanRequired"
                                checked={formData.isGermanRequired}
                                onChange={(e) => setFormData({ ...formData, isGermanRequired: e.target.checked })}
                            />
                            <label className="form-check-label" htmlFor="isGermanRequired">
                                Is German Required?
                            </label>
                        </div>
                    </div>
                    <div className="col-md-6 mb-3 d-flex align-items-center">
                        <label htmlFor="germanLevel" className="me-3" style={{ minWidth: '130px' }}>
                            German Level
                        </label>
                        <input
                            type="text"
                            id="germanLevel"
                            name="germanLevel"
                            value={formData.germanLevel}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>

                    <div className="col-md-6 mb-3 d-flex align-items-center">
                        <div className="form-check ms-3 mt-3">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="isRefered"
                                name="isRefered"
                                checked={formData.isRefered}
                                onChange={(e) => setFormData({ ...formData, isRefered: e.target.checked })}
                            />
                            <label className="form-check-label" htmlFor="isRefered">
                                Is Referred?
                            </label>
                        </div>
                    </div>

                    {/* Referred By */}
                    <div className="col-md-6 mb-1 d-flex align-items-center">
                        <label htmlFor="referedBy" className="me-3" style={{ minWidth: '130px' }}>
                            Referred By
                        </label>
                        <input
                            type="text"
                            id="referedBy"
                            name="referedBy"
                            value={formData.referedBy}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>

                    {/* Comments (Full Width) */}
                    <div className="col-12 mb-3">
                        <label htmlFor="comments" className="form-label">
                            Comments
                        </label>
                        <textarea
                            id="comments"
                            rows={4}
                            className="form-control"
                            placeholder="Enter additional notes..."
                            value={formData.comments}
                            onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="col-12 text-end">
                        <button type="submit" className="btn btn-primary">
                            Submit
                        </button>
                    </div>
                </div>
            </form>


        </div>
    );
};

export default JobApplicationForm;
