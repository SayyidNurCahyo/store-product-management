import {Link, useLocation} from "react-router-dom";

function Breadcrumbs() {
    const location = useLocation();
    const pathNames = location.pathname.split('/').filter((x) => x);
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    return (
        <>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb my-3">
                    {pathNames.map((name, index) => {
                        const routeTo = `/${pathNames.slice(0, index + 1).join('/')}`;
                        const isLast = index === pathNames.length - 1;

                        return (
                            <li key={index} className={`breadcrumb-item ${isLast ? 'active' : ''}`}>
                                {isLast ? (
                                    capitalizeFirstLetter(name)
                                ) : (
                                    <Link to={routeTo}>{capitalizeFirstLetter(name)}</Link>
                                )}
                            </li>
                        );
                    })}
                </ol>
            </nav>
        </>
    );
}

export default Breadcrumbs;