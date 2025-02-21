import StatsSection from "../../../../components/StatsSection"
import ChartsSection from "../../../../components/ChartsSection"

const Dashboard = ({ company, theme }) => {
    return (
        <>
            <StatsSection company={company} theme={theme} />
            <ChartsSection />
        </>
    );
};

export default Dashboard;