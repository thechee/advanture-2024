import { Link } from "react-router-dom";
import { FaFolder, FaGithub, FaLinkedin } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import './Footer.css'

export const Footer = () => {
    return (
        <footer className="footer">
            <div>
                <h2>Portfolio Project by:</h2>
                <h3>Chase Agee</h3>
                <p>chase.agee@gmail.com</p>
            </div>
            <div className="footer-links">
                <Tooltip id="portfolio-tt" />
                <Link 
                    to='https://thechee.github.io/' 
                    data-tooltip-id="portfolio-tt" 
                    data-tooltip-content="Portfolio" 
                    data-tooltip-place="top"
                    >
                    <FaFolder id="folder"/>
                </Link>
                <Tooltip id="github-tt" />
                <Link 
                    to='https://github.com/thechee'
                    data-tooltip-id="github-tt" 
                    data-tooltip-content="GitHub" 
                    data-tooltip-place="top"
                    >
                    <FaGithub id="github-tt"/>
                </Link>
                <Tooltip id="linkedin-tt" />
                <Link 
                    to='https://www.linkedin.com/in/chase-agee/'
                    data-tooltip-id="linkedin-tt" 
                    data-tooltip-content="LinkedIn" 
                    data-tooltip-place="top"
                    >
                    <FaLinkedin id="linkedin"/>
                </Link>
            </div>
        </footer>
    )
}