import React from "react";

const Nav = () => {
    const signout = () => {
        alert("User signed out");
    };
    return(
        <nav className="navbar">
            <h2>FreeDorm</h2>
            <div className="navbarRight">
                <button onClick={signout}>Sign out</button>
            </div>
        </nav>

    );
};

export default Nav;