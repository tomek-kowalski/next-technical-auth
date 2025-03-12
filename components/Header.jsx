import headerStyle from '../styles/Header.module.css'

export default function Header() {

    return (
        <header className={headerStyle.headerRow}>
            <h1 className={headerStyle.headerTitle} >Technical documentation</h1>
            <h2 className={headerStyle.headerLogin}>Login</h2>
        </header>
    );
}