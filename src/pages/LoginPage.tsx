import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { setToken } from '../services/auth';
import './LoginPage.css';

interface LoginResponse {
    access_token: string;
}

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // estado para mostrar/ocultar contraseña
    const navigate = useNavigate();

    const login = async () => {
        try {
            const res = await axios.post<LoginResponse>('https://restaurante-api.desarrollo-software.xyz/users/login', {
                username,
                password,
            });

            setToken(res.data.access_token);
            navigate('/admin');
        } catch (err) {
            alert('Credenciales inválidas');
        }
    };

    return (
        <>
            <div className="header-imagen-container">
                <img className="imagen-header" src="/logos/header_menu.jpg" alt="Encabezado menú" />
                <h1 className="titulo-superpuesto">MENÚ</h1>
            </div>
            <div className="loginpage-container">
                <div className="loginpage-box">
                    <h2 className="loginpage-title">Iniciar Sesión</h2>
                    <input
                        className="loginpage-input"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        placeholder="Usuario"
                        autoComplete="username"
                    />
                    <div className="password-wrapper">
                        <input
                            className="loginpage-input"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Contraseña"
                            autoComplete="current-password"
                        />
                        <button
                            type="button"
                            className="toggle-password-btn"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                        >
                            {showPassword ? '🙈' : '👁️'}
                        </button>
                    </div>

                    <div className="loginpage-remember">
                        <input type="checkbox" id="remember" />
                        <label htmlFor="remember">Remember me</label>
                    </div>

                    <button className="loginpage-button" onClick={login}>
                        ENTRAR
                    </button>
                </div>
            </div>
        </>
    );
}
