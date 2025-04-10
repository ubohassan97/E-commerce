import "./Error404.css"

export default function Error404(){
    return(
        <div className="page">
        <div className="container">
        <h1>404</h1>
        <p>Oops! The page you're looking for doesn't exist.</p>
        <a href="/" className="btn">Go Home</a>
    </div></div>
    )
}