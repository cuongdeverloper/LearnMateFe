import { useEffect } from "react";
import { useSelector } from "react-redux"
import { Outlet, useNavigate } from "react-router-dom"

const Main = () => {
    const checkRole = useSelector(user => user.user.account.role);
    const navigate = useNavigate();
    useEffect(() => {
        if (checkRole && checkRole === 'tutor') {
            navigate('/TutorHomepage');
        }
        if (checkRole && checkRole === 'student') {
            navigate('/StudentHomepage');
        }
    }, [checkRole, navigate])

    return (
        <>
            <Outlet />
        </>
    )
}
export default Main