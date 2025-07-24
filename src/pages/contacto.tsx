import React, { useState } from 'react';
import './Nosotros.css'; 
const Contacto: React.FC = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        telefono: '',
        local: '',
        mensaje: '',
    });

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError(null);
        setSuccess(null);
    };

    const validateEmail = (email: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const { nombre, email, local, mensaje, telefono } = formData;

        if (!nombre || !email || !local || !mensaje || !validateEmail(email)) {
            setError(
                'Ocurrió un error de validación. Por favor, confirme los campos y envíe el formulario de nuevo.'
            );
            setSuccess(null);
            return;
        }

        
        if (!/^\d{10}$/.test(telefono)) {
            setError('El número de teléfono debe tener exactamente 10 dígitos.');
            setSuccess(null);
            return;
        }

        
        console.log('Formulario enviado:', formData);

        setSuccess('¡Mensaje enviado correctamente!');
        setError(null);
        setFormData({
            nombre: '',
            email: '',
            telefono: '',
            local: '',
            mensaje: '',
        });
    };

    return (
        <>
            
            <div className="header-imagen-container">
                <img
                    className="imagen-header"
                    src="/logos/header_contacto-1.jpg"
                    alt="Contacto"
                />
                <h1 className="titulo-superpuesto">CONTACTO</h1>
            </div>

            <div className="contacto-container">
                
                <div className="contacto-info">
                    <h3><em>Mántente en</em> contacto</h3>
                    <div className="direccion">
                        <p><strong>SAN ISIDRO DEL INCA</strong><br />
                            JOSE FELIX BARRERIRO E12-83 Y DE LOS ALAMOS <br />
                            Telf.: (+593 2) 281 0191 / (+593 2) 295 6132<br />
                            Celular: 098 622 1982
                        </p>
                        <p><strong>NAYON</strong><br />
                            CALLE QUITO Y GARCIA MORENO<br />
                            Telf.: (+593 2) 202 2410 / (+593 2) 666 6666<br />
                            Celular: 099 252 9250
                        </p>
                    </div>
                    <div className="horarios">
                        <p><strong>Horarios de atención</strong><br />
                            Centro Histórico: Lunes a Sábado de 12:00 a 24:00<br />
                            Domingo de 12:00 a 21:00<br />
                            Itchimbía: Lunes a Sábado de 13:00 a 24:00<br />
                            Domingo de 13:00 a 21:00
                        </p>
                    </div>
                    <div className="redes-sociales">
                        <a href="#"><i className="fab fa-facebook-f"></i></a>
                        <a href="#"><i className="fab fa-twitter"></i></a>
                        <a href="#"><i className="fab fa-google-plus-g"></i></a>
                        <a href="#"><i className="fab fa-youtube"></i></a>
                    </div>
                </div>

                
                <div className="contacto-formulario">
                    <h3><em>Déjanos</em> un mensaje</h3>
                    <p>¿Tienes algo en mente para decirnos? No dudes en ponerte en contacto con nosotros a través de nuestro formulario de contacto.</p>

                    {error && <div className="mensaje-error">{error}</div>}
                    {success && <div className="mensaje-exito">{success}</div>}

                    <form onSubmit={handleSubmit} noValidate>
                        <input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            placeholder="Nombre y Apellido"
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Tu email"
                            required
                        />
                        <input
                            type="tel"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                            placeholder="Teléfono"
                        />
                        <select
                            name="local"
                            value={formData.local}
                            onChange={handleChange}
                            required
                        >
                            <option value="" disabled>Seleccione el local a visitar</option>
                            <option value="NORTE">San isidro del Inca</option>
                            <option value="NORTE">Nayón</option>
                        </select>
                        <textarea
                            name="mensaje"
                            value={formData.mensaje}
                            onChange={handleChange}
                            placeholder="Mensaje"
                            rows={5}
                            required
                        />
                        <button type="submit">ENVIAR MENSAJE</button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Contacto;
