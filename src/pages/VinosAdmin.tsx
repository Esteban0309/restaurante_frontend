import { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken } from '../services/auth';
import type { Vino } from '../type/index';
import './admin.css';


interface CrearVinoResponse {
    success: boolean;
    data: Vino;
    message?: string;
}

export default function VinosAdmin() {
    const [Vinos, setVinos] = useState<Vino[]>([]);
    const [editingVino, setEditingVino] = useState<Vino | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [creatingVino, setCreatingVino] = useState<Vino | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        axios.get<Vino[]>('https://restaurante-api.desarrollo-software.xyz/vinos', {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        })
            .then(res => {
                console.log('RESPUESTA Vinos:', res.data);
                setVinos(res.data); // ← Aquí sí llega como array
            })
            .catch(error => {
                console.error('Error al cargar vinos:', error);
                setVinos([]);
            });
    }, []);


    const handleDelete = async (id: number) => {
        const confirm = window.confirm('¿Estás seguro de que deseas eliminar este vino?');
        if (!confirm) return;

        try {
            await axios.delete(`https://restaurante-api.desarrollo-software.xyz/vinos/${id}`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            setVinos(prev => prev.filter(e => e.id !== id));
        } catch (error) {
            alert('Error al eliminar el vino');
        }
    };

    const handleEdit = (Vino: Vino) => {
        setEditingVino(Vino);
        setCreatingVino(null);
        setIsEditing(true);
        setModalOpen(true);
    };

    const handleCreate = () => {
        setCreatingVino({
            id: 0,
            nombre: '',
            precioCopa: null,
            precioBotella: null,
            tipo: '',
            descripcion: '',
            porciones: null,
            disponibilidad: false,
            profile: null,
            _id: '',
            __v: 0
        });
        setIsCreating(true);
        setModalOpen(true);
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
        const val = type === 'checkbox' ? checked : value;

        if (editingVino) {
            setEditingVino(prev => ({ ...prev!, [name]: val }));
        } else if (creatingVino) {
            setCreatingVino(prev => ({ ...prev!, [name]: val }));
        }
    };

    const handleSave = async () => {
        if (!editingVino) return;

        const { id, _id, __v, porciones, profile, ...rest } = editingVino;

        const payload = {
            ...rest,
            precioCopa: editingVino.precioCopa !== null ? Number(editingVino.precioCopa) : null,
            precioBotella: editingVino.precioBotella !== null ? Number(editingVino.precioBotella) : null,
        };

        console.log('Payload que envío:', payload);
        try {
            await axios.put(
                `https://restaurante-api.desarrollo-software.xyz/vinos/${id}`,
                payload,
                {
                    headers: { Authorization: `Bearer ${getToken()}` },
                }
            );

            setVinos(prev => prev.map(e => (e.id === id ? editingVino : e)));
            setModalOpen(false);
            setEditingVino(null);
        } catch(error: any) {
            // axios guarda info del error en error.response
            if (error.response) {
                // El servidor respondió con un status fuera del rango 2xx
                console.error('Error Status:', error.response.status);
                console.error('Error Headers:', error.response.headers);
                console.error('Error Data:', error.response.data);
                alert(`Error del servidor: ${error.response.data.message || JSON.stringify(error.response.data)}`);
            } else if (error.request) {
                // La petición fue hecha pero no hubo respuesta
                console.error('No hubo respuesta del servidor:', error.request);
                alert('No hubo respuesta del servidor.');
            } else {
                // Otro tipo de error
                console.error('Error inesperado:', error.message);
                alert(`Error inesperado: ${error.message}`);
            }
        }
    };

    const handleSaveCreate = async () => {
        if (!creatingVino) return;

        if (
            !creatingVino.nombre ||
            creatingVino.precioCopa === null ||
            creatingVino.precioBotella === null ||
            Number(creatingVino.precioCopa) <= 0 ||
            Number(creatingVino.precioBotella) <= 0
        ) {
            alert("Completa los campos de nombre y precios con valores válidos.");
            return;
        }

        const payload = {
            nombre: creatingVino.nombre,
            precioCopa: Number(creatingVino.precioCopa),
            precioBotella: Number(creatingVino.precioBotella),
            tipo: creatingVino.tipo,
            descripcion: creatingVino.descripcion || '',
            disponibilidad: creatingVino.disponibilidad ?? false,
        };

        try {
            const res = await axios.post<CrearVinoResponse>(
                'https://restaurante-api.desarrollo-software.xyz/vinos',
                payload,
                {
                    headers: { Authorization: `Bearer ${getToken()}` },
                }
            );

            setVinos(prev => [...prev, res.data.data]);
            setModalOpen(false);
            setCreatingVino(null);
        } catch (error) {
            console.error('Error al crear vino:', error);
            alert('Error al crear vino.');
        }
    };

    return (
        <>
            <div className="header-imagen-container">
                <img className="imagen-header" src="/logos/crud.jpg" alt="Encabezado menú" />
                <h1 className="titulo-superpuesto">Vinos</h1>
            </div>

            <div className="entradas-admin-container">
                <button className="entradas-btn-crear" onClick={handleCreate}>
                    + Nuevo Vino
                </button>

                <div className="entradas-grid">
                    {Array.isArray(Vinos) && Vinos.map(Vino => (
                        <div key={Vino.id} className="entrada-card">
                            <h3>{Vino.nombre}</h3>
                            <p><strong>Precio Copa:</strong> {Vino.precioCopa ?? '-'}</p>
                            <p><strong>Precio Botella:</strong> {Vino.precioBotella ?? '-'}</p>
                            <p><strong>Tipo:</strong> {Vino.tipo}</p>
                            <p>{Vino.descripcion}</p>
                            <p><strong>Porciones:</strong> {Vino.porciones ?? '-'}</p>
                            <p><strong>Disponible:</strong> {Vino.disponibilidad ? 'Sí' : 'No'}</p>
                            <div className="card-actions">
                                <button className="edit-btn" onClick={() => handleEdit(Vino)}>Editar</button>
                                <button className="delete-btn" onClick={() => handleDelete(Vino.id)}>Eliminar</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {modalOpen && (editingVino || creatingVino) && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>{isCreating ? 'Crear Vino' : 'Editar Vino'}</h3>

                        <div className="modal-grid">
                            <div>
                                <label>Nombre:</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={isCreating ? creatingVino?.nombre : editingVino?.nombre}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div>
                                <label>Precio Copa:</label>
                                <input
                                    type="number"
                                    name="precioCopa"
                                    value={isEditing ? editingVino!.precioCopa ?? '' : creatingVino!.precioCopa ?? ''}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div>
                                <label>Precio Botella:</label>
                                <input
                                    type="number"
                                    name="precioBotella"
                                    value={isEditing ? editingVino!.precioBotella ?? '' : creatingVino!.precioBotella ?? ''}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div>
                                <label>Tipo:</label>
                                <input
                                    type="text"
                                    name="tipo"
                                    value={isEditing ? editingVino!.tipo : creatingVino!.tipo}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div>
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="disponibilidad"
                                        checked={
                                            isEditing
                                                ? editingVino!.disponibilidad ?? false
                                                : creatingVino!.disponibilidad ?? false
                                        }
                                        onChange={handleInputChange}
                                    />
                                    Disponible
                                </label>
                            </div>

                            <div style={{ gridColumn: '1 / -1' }}>
                                <label>Descripción:</label>
                                <textarea
                                    name="descripcion"
                                    value={isEditing ? editingVino!.descripcion ?? '' : creatingVino!.descripcion ?? ''}
                                    onChange={handleInputChange}
                                    rows={4}
                                />
                            </div>
                        </div>

                        <div className="modal-buttons">
                            {isCreating ? (
                                <button onClick={handleSaveCreate}>Guardar</button>
                            ) : (
                                <button onClick={handleSave}>Guardar</button>
                            )}
                            <button onClick={() => {
                                setModalOpen(false);
                                setCreatingVino(null);
                                setEditingVino(null);
                                setIsCreating(false);
                            }}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
