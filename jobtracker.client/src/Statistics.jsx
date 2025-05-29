import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faComments, faAdd } from "@fortawesome/free-solid-svg-icons";
import { StatusDropdown } from "./SharedComponenets/StatusDropdown.jsx";
const baseUrl = import.meta.env.VITE_API_BASE_URL;
import { Link } from 'react-router-dom';
import JobApplicationsChart from './SharedComponenets/JobApplicationsChart';
import './App.css';

function Statistics() {
    const [applications, setApplications] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [weeklyStats, setWeeklyStats] = useState([]);
    const [stats, setStats] = useState({
        totalJobs: 0,
        totalResumeRejected: 0,
        totalRejected: 0,
        totalAppliedJobs: 0,
        totalInterviewCalls: 0
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedComment, setSelectedComment] = useState('');
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

    const itemsPerPage = 10;

    useEffect(() => {
        populateApplicationsData();
        populateApplicationsDataStats();
    }, []);

    const populateApplicationsData = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/JobApplications/aged`);
            if (response.ok) {
                const data = await response.json();
                setApplications(data);
            } else {
                console.error('Error fetching data:', response.status);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    const populateApplicationsDataStats = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/JobApplications/job-stats`);
            if (response.ok) {
                const data = await response.json();
                setStats(data);
                setChartData(data.jobsPerDayResponses);
                setWeeklyStats(data.weeklyStats)
            } else {
                console.error('Error fetching data:', response.status);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    const handleDelete = async (applicationId) => {
        if (window.confirm("Are you sure you want to delete this job application?")) {
            try {
                const response = await fetch(`${baseUrl}/api/JobApplications/${applicationId}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    setApplications(applications.filter(app => app.id !== applicationId));
                } else {
                    console.error('Error deleting job application:', response.status);
                }
            } catch (error) {
                console.error('Error deleting job application:', error);
            }
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            const response = await fetch(`${baseUrl}/api/JobApplications/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                setApplications(applications.map(app =>
                    app.id === id ? { ...app, status: newStatus } : app
                ));
            } else {
                console.error('Failed to update status', response.status);
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleViewComment = (comment) => {
        setSelectedComment(comment);
        setIsCommentModalOpen(true);
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "Applied":
            case "Accepted":
                return "table-warning";
            case "Interview Scheduled":
            case "Hired":
                return "table-success";
            case "Phone Screen":
                return "table-info";
            case "Technical Interview":
                return "table-warning";
            case "Onsite Interview":
                return "table-secondary";
            case "Offer Received":
                return "table-primary";
            case "Withdrawn":
            case "Rejected":
                return "table-danger";
            case "Resume Rejected":
                return "rejected-after-interview";

            default:
                return "";
        }
    };


    // Filter and paginate
    const filteredApps = applications.filter(app =>
        app.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.position.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedApps = filteredApps.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const maxPage = Math.ceil(filteredApps.length / itemsPerPage);

    return (
        <div>
            <div className="text-center py-6 bg-gray-100 shadow-md">
                <h3 className="text-3xl font-bold text-gray-800">Applications Stats</h3>
            </div>
            {/*<JobApplicationsChart data={chartData} />*/}
            <div className="job-stats-wrapper p-3 mb-4">
                <h4>Overall Stats</h4>
                <div className="row">
                    <div className="col-md-3">
                        <div className="stat-box bg-primary text-white p-3 rounded shadow-sm">
                            <strong>Total Jobs Applied:</strong> {stats.totalJobs}
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="stat-box bg-success text-white p-3 rounded shadow-sm">
                            <strong>Total Interview Calls:</strong> {stats.totalInterviewCalls}
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="stat-box bg-info text-white p-3 rounded shadow-sm">
                            <strong>In Process:</strong> {stats.totalAppliedJobs}
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="stat-box bg-warning text-white p-3 rounded shadow-sm">
                            <strong>Resume Rejected:</strong> {stats.totalResumeRejected}
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="stat-box bg-danger text-white p-3 rounded shadow-sm">
                            <strong>Total Rejected:</strong> {stats.totalRejected}
                        </div>
                    </div>

                </div>
                <br></br>
                <h4>Last Week Stats</h4>
                <div className="row">
                    <div className="col-md-3">
                        <div className="stat-box bg-primary text-white p-3 rounded shadow-sm">
                            <strong>Total Jobs Applied This Week:</strong> {weeklyStats.totalJobsApplied}
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="stat-box bg-success text-white p-3 rounded shadow-sm">
                            <strong>Average Jobs Applied/Day:</strong> {weeklyStats.averageJobsAppliedPerDay}
                        </div>
                    </div>
                    

                </div>
            </div>
            <p>Below table is showing the application that are at least 1 week old and has Status other then "Rejected" or "Resume Rejected"</p>
            {/* Search Box */}
            <div className="mb-3">
                <input
                    type="text"
                    placeholder="Search by company or position..."
                    className="form-control"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                />
            </div>

            {/* Table */}
            <table className="table table-bordered" aria-labelledby="tableLabel">
                <thead>
                    <tr>
                        <th className="col-sm-1">ID</th>
                        <th className="col-sm-1">ATS</th>
                        <th className="col-sm-2">Company</th>
                        <th className="col-sm-2">Position</th>
                        <th className="col-sm-2">Applied On</th>
                        <th className="col-sm-1">Posting</th>
                        <th className="col-sm-1">Docs</th>
                        <th className="col-sm-1">Status</th>
                        <th className="col-sm-1">App. Update</th>
                        <th className="col-sm-1">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedApps.length > 0 ? (
                        paginatedApps.map((application) => (
                            <tr key={application.id} className={getStatusClass(application.status)}>
                                <td className="id-column">{application.id}</td>
                                <td className="id-column">{application.atsScore || "n.a"}</td>
                                <td className="wrap-col">{application.companyName}</td>
                                <td className="wrap-col">{application.position}</td>
                                <td>{new Date(application.appliedDate).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}</td>
                                <td>
                                    <a href={application.jobLink} target="_blank" rel="noreferrer">
                                        View
                                    </a>
                                </td>
                                <td className="wrap-col">
                                    {application.documents && application.documents.length > 0 ? (
                                        application.documents.map((path, index) => (
                                            <div key={index}>
                                                <a
                                                    href={`https://localhost:7012/files/${path.split("\\").pop()}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    Doc. {index + 1}
                                                </a>
                                            </div>
                                        ))
                                    ) : (
                                        "No document was uploaded"
                                    )}
                                </td>
                                <td>
                                    <StatusDropdown
                                        currentStatus={application.status}
                                        onChange={(newStatus) => handleStatusChange(application.id, newStatus)}
                                    />
                                </td>
                                <td className="wrap-col">
                                    <Link to={`/schedule-interview/${application.id}`} className="icon-button edit">
                                        <FontAwesomeIcon icon={faAdd} />
                                    </Link>
                                </td>
                                <td>
                                    <div className="button-container">
                                        <button className="icon-button edit">
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                        <button className="icon-button view-comment" onClick={() => handleViewComment(application.comments)}>
                                            <FontAwesomeIcon icon={faComments} />
                                        </button>
                                        <button className="icon-button delete" onClick={() => handleDelete(application.id)}>
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="10" >No job applications found.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="pagination-container d-flex justify-content-between align-items-center mt-3">
                {filteredApps.length > 0 && (
                    <>
                        <button
                            className="btn btn-outline-primary"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        <span>Page {currentPage} of {maxPage}</span>
                        <button
                            className="btn btn-outline-primary"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, maxPage))}
                            disabled={currentPage === maxPage}
                        >
                            Next
                        </button>
                    </>
                )}
            </div>


            {/* Modal */}
            {isCommentModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Notes</h3>
                        <p>{selectedComment || "No notes available."}</p>
                        <button className="btn btn-secondary" onClick={() => setIsCommentModalOpen(false)}>Close</button>
                    </div>
                </div>
            )}

            {/* New Job Button */}
            <Link to="/apply">
                <div className="right-align-container mt-4">
                    <button className="right-button btn btn-primary">
                        New Job
                    </button>
                </div>
            </Link>
        </div>
    );
}

export default Statistics;
