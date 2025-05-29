import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
const baseUrl = import.meta.env.VITE_API_BASE_URL;

const InterviewSchedule = () => {
    const { jobApplicationID } = useParams();

    const [isFormOpen, setIsFormOpen] = useState(true);  // <-- new state to toggle form

    const [formData, setFormData] = useState({
        id: null,
        jobApplicationID: '',
        interviewRound: '',
        notes: '',
        interviewDate: new Date().toISOString().split('T')[0],
        interviewer: '',
        isPassThrough: false
    });

    const [interviews, setInterviews] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (jobApplicationID) {
            setFormData(prev => ({ ...prev, jobApplicationID }));

            fetch(`${baseUrl}/api/Interview/${jobApplicationID}`)
                .then(res => res.json())
                .then(data => setInterviews(data))
                .catch(err => console.error(err));
        }
    }, [jobApplicationID]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let response;

            if (formData.id) {
                response = await fetch(`${baseUrl}/api/Interview/${formData.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
            } else {
                response = await fetch(`${baseUrl}/api/Interview`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
            }

            if (response.ok) {
                const result = await response.json();
                setSuccessMessage(formData.id ? 'Interview updated successfully!' : 'Interview scheduled successfully!');
                setErrorMessage('');

                setFormData({
                    id: null,
                    jobApplicationID: jobApplicationID,
                    interviewRound: '',
                    notes: '',
                    interviewDate: new Date().toISOString().split('T')[0],
                    interviewer: '',
                    isPassThrough: false,
                });

                const updated = await fetch(`${baseUrl}/api/Interview/${jobApplicationID}`);
                const updatedData = await updated.json();
                setInterviews(updatedData);

                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                const errorText = await response.text();
                setErrorMessage(errorText);
            }
        } catch (error) {
            setErrorMessage(error.message || 'An error occurred');
        }
    };

    const handleRowClick = (interview) => {
        setFormData({
            id: interview.id || null,
            jobApplicationID: jobApplicationID,
            interviewRound: interview.interviewRound || '',
            notes: interview.notes || '',
            interviewDate: interview.interviewDate ? interview.interviewDate.split('T')[0] : new Date().toISOString().split('T')[0],
            interviewer: interview.interviewer || '',
            isPassThrough: interview.isPassThrough || false,
        });
        setIsFormOpen(true);  // open form on selecting interview
    };

    return (
        <div className="container mt-4">
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

            <h2 className="mb-3">Interview Schedule</h2>

            {/* Toggle button */}
            <button
                className="btn btn-secondary mb-3"
                onClick={() => setIsFormOpen(!isFormOpen)}
            >
                {isFormOpen ? 'Hide Form' : 'Show Form'}
            </button>

            {/* Conditionally render the form */}
            {isFormOpen && (
                <form onSubmit={handleSubmit}>
                    {/* Your form inputs here (same as before) */}
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label className="form-label">Interview Round</label>
                            <input
                                type="text"
                                name="interviewRound"
                                value={formData.interviewRound}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="Round"
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Interview Date</label>
                            <input
                                type="date"
                                name="interviewDate"
                                value={formData.interviewDate}
                                onChange={handleChange}
                                className="form-control"
                                required
                            />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label className="form-label">Interviewer</label>
                            <input
                                type="text"
                                name="interviewer"
                                value={formData.interviewer}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="Interviewer"
                                required
                            />
                        </div>
                        <div className="col-md-6 d-flex align-items-center">
                            <div className="form-check mt-4">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="isPassThrough"
                                    name="isPassThrough"
                                    checked={formData.isPassThrough}
                                    onChange={handleChange}
                                />
                                <label className="form-check-label" htmlFor="isPassThrough">
                                    Is Pass Through
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Notes</label>
                        <textarea
                            rows={4}
                            className="form-control"
                            placeholder="Enter additional notes..."
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="d-flex justify-content-end">
                        <button type="submit" className="btn btn-primary">
                            {formData.id ? 'Update' : 'Submit'}
                        </button>
                    </div>
                </form>
            )}

            {/* Interview Grid */}
            {interviews.length > 0 && (
                <>
                    <h4 className="mt-5">Previous Interviews</h4>
                    <table className="table table-bordered table-striped mt-3">
                        <thead>
                            <tr>
                                <th className="col-sm-2">Round</th>
                                <th className="col-sm-2">Date</th>
                                <th className="col-sm-2">Interviewer</th>
                                <th className="col-sm-5">Notes</th>
                                <th className="col-sm-1">Pass Through</th>
                            </tr>
                        </thead>
                        <tbody>
                            {interviews.map((item, index) => (
                                <tr
                                    key={index}
                                    onClick={() => handleRowClick(item)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <td>{item.interviewRound}</td>
                                    <td>{new Date(item.interviewDate).toLocaleDateString()}</td>
                                    <td>{item.interviewer}</td>
                                    <td style={{ whiteSpace: 'pre-wrap' }}>{item.notes}</td>
                                    <td>{item.isPassThrough ? 'Yes' : 'No'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
};

export default InterviewSchedule;
