import Main from "@/components/Main";
import Dashboard from "@/components/Dashboard";
import Login from "@/components/Login";

export const metadata = {
    title: "WSEI · Next.js · Dashboard",
};

export default function DashboardPage() {
    
    const isAuthenticated = true;

    let children = (
        <Login />
    );

    if (isAuthenticated) {
        children = (
            <Dashboard />
        );
    }

    return (
        <Main>
            {children}
        </Main>
    )
}