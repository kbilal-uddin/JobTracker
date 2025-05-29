import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const JobApplicationsChart = ({ data }) => {
    return (
        <LineChart width={600} height={300} data={data}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#8884d8" />
        </LineChart>
    );
};

export default JobApplicationsChart;
