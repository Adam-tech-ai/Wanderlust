import "./header.css";

// Displays the application header:
export function Header() {

    return (
        <div className="Header">

            {/* Application brand: */}
            <h1>Wanderlust<span>.</span></h1>

            {/* Application tagline: */}
            <p>Discover your next adventure</p>

        </div>
    );
}