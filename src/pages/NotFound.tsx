import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="flex flex-col justify-center items-center gap-4">
            <h1 className="font-bold">404</h1>
            <p>Not Found</p>
            <Link to="/">Home</Link>
        </div>
    );
};

export default NotFound;
