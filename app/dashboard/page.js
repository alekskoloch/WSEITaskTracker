import Main from "@/components/Main";
import Dashboard from "@/components/Dashboard";
import Login from "@/components/Login";
import Loading from "@/components/Loading";

export const metadata = {
    title: "WSEI · Task Tracker · Dashboard",
};

export default function DashboardPage() {
    return (
        <Main>
            <Dashboard />
        </Main>
    )
}