import React, { useState } from 'react';
import './Nosotros.css'; // Asegúrate de tener los estilos que te pasé antes

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

        // ✅ Validar número de teléfono de 10 dígitos
        if (!/^\d{10}$/.test(telefono)) {
            setError('El número de teléfono debe tener exactamente 10 dígitos.');
            setSuccess(null);
            return;
        }

        // Envío exitoso (aquí iría tu lógica para enviar al backend)
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
            {/* Header */}
            <div className="header-imagen-container">
                <img
                    className="imagen-header"
                    src="/logos/header_contacto-1.jpg"
                    alt="Contacto"
                />
                <h1 className="titulo-superpuesto">CONTACTO</h1>
            </div>

            <div className="contacto-container">
                {/* Información */}
                <div className="contacto-info">
                    <h3><em>Mántente en</em> contacto</h3>
                    <div className="direccion">
                        <p><strong>CENTRO HISTÓRICO</strong><br />
                            Mejía Oe4-45 y García Moreno<br />
                            Telf.: (+593 2) 295 1401 / (+593 2) 295 6132<br />
                            Celular: 099 845 0888
                        </p>
                        <p><strong>ITCHIMBÍA</strong><br />
                            Manuel Samaniego N8-169 y Anteparra<br />
                            Telf.: (+593 2) 316 1450 / (+593 2) 295 5892<br />
                            Celular: 098 386 3791
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

                {/* Formulario */}
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
                            <option value="centro">Centro Histórico</option>
                            <option value="itchimbia">Itchimbía</option>
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
