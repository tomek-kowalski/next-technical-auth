import headerStyle from '../styles/Header.module.css'
import LogInOut from './LogInOut.jsx'

export default function Header() {

    return (
        <header className={headerStyle.headerRow}>
            <h1 className={headerStyle.headerTitle} >Technical documentation</h1>
            <LogInOut/>
        </header>
    );
}