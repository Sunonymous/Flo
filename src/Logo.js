import './Logo.css';

function Logo({ text, font }) {
    return <h1 className='logo' style={{fontFamily: font}}>{text}</h1>;
}

export default Logo;