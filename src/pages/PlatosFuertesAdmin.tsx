import { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken } from '../services/auth';
import type { Entrada } from '../type/index';
import './admin.css';

interface PlatosFuertesResponse {
    success: boolean;
    message: string;
    data: {
        items: Entrada[];
        meta: any;
    };
}

interface CrearPlatoFuerteResponse {
    success: boolean;
    data: Entrada;
    message?: string;
}

export default function PlatosFuertesAdmin() {
    const [PlatosFuertes, setPlatosFuertes] = useState<Entrada[]>([]);
    const [editingPlatoFuerte, setEditingPlatoFuerte] = useState<Entrada | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [creatingPlatoFuerte, setCreatingPlatoFuerte] = useState<Entrada | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);


    useEffect(() => {
        axios.get<PlatosFuertesResponse>('https://restaurante-api.desarrollo-software.xyz/platosfuertes', {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        }).then(res => {
            setPlatosFuertes(res.data.data.items);
        });
    }, []);

    const handleDelete = async (id: number) => {
        const confirm = window.confirm('¿Estás seguro de que deseas eliminar esta PlatoFuerte?');
        if (!confirm) return;

        try {
            await axios.delete(`https://restaurante-api.desarrollo-software.xyz/platosfuertes/${id}`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            setPlatosFuertes(prev => prev.filter(e => e.id !== id));
        } catch (error) {
            alert('Error al eliminar la PlatoFuerte');
        }
    };

    // Abrir modal con la PlatoFuerte a editar
    const handleEdit = (PlatoFuerte: Entrada) => {
        setEditingPlatoFuerte(PlatoFuerte);
        setCreatingPlatoFuerte(null);
        setIsEditing(true);
        setModalOpen(true);
    };

    // Abrir modal para crear una nueva PlatoFuerte
    const handleCreate = () => {
        setCreatingPlatoFuerte({
            id: 0, // o undefined si lo permite
            nombre: '',
            precio: 0,
            precioCopa: null,
            precioBotella: null,
            tipo: '',
            descripcion: '',
            porciones: null,
            disponibilidad: false,
            profile: null,
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

        if (editingPlatoFuerte) {
            setEditingPlatoFuerte(prev => ({ ...prev!, [name]: val }));
        } else if (creatingPlatoFuerte) {
            setCreatingPlatoFuerte(prev => ({ ...prev!, [name]: val }));
        }
    };

    // Guardar cambios (actualizar)
    const handleSave = async () => {
        if (!editingPlatoFuerte) return;

        // Extraemos id y campos que no queremos mandar
        const { id, porciones, profile, precio, ...rest } = editingPlatoFuerte;

        // Construimos payload, asegurando que precio es un número
        const payload = {
            ...rest,
            precio: Number(precio),
        };
        try {
            await axios.put(
                `https://restaurante-api.desarrollo-software.xyz/platosfuertes/${id}`,
                payload, // aquí MANDAMOS solo payload sin id, porciones ni profile
                {
                    headers: { Authorization: `Bearer ${getToken()}` },
                }
            );

            setPlatosFuertes(prev =>
                prev.map(e => (e.id === id ? editingPlatoFuerte : e))
            );
            setModalOpen(false);
            setEditingPlatoFuerte(null);
        } catch (error) {
            if (
                typeof error === 'object' &&
                error !== null &&
                'response' in error &&
                typeof (error as any).response === 'object'
            ) {
                const errResponse = (error as any).response;
                console.error('Error al actualizar PlatoFuerte:', errResponse.data);

                alert(
                    'Error al actualizar PlatoFuerte:\n' +
                    JSON.stringify(errResponse.data?.message ?? errResponse.data, null, 2)
                );
            } else {
                console.error('Error inesperado:', error);
                alert('Error inesperado al actualizar PlatoFuerte.');
            }
        }
    };

    // Guardar nueva PlatoFuerte (crear)
    const handleSaveCreate = async () => {
        if (!creatingPlatoFuerte) return;

        // Construir el payload limpiamente
        const payload = {
            nombre: creatingPlatoFuerte.nombre,
            precio: Number(creatingPlatoFuerte.precio),
            tipo: creatingPlatoFuerte.tipo,
            descripcion: creatingPlatoFuerte.descripcion || '',
            disponibilidad: creatingPlatoFuerte.disponibilidad ?? false,
        };

        try {
            const res = await axios.post<CrearPlatoFuerteResponse>(
                'https://restaurante-api.desarrollo-software.xyz/platosfuertes',
                payload,
                {
                    headers: { Authorization: `Bearer ${getToken()}` },
                }
            );

            // Añadir la nueva PlatoFuerte a la lista
            setPlatosFuertes(prev => [...prev, res.data.data]);
            setModalOpen(false);
            setCreatingPlatoFuerte(null);
        } catch (error) {
            if (!creatingPlatoFuerte.nombre || creatingPlatoFuerte.precio <= 0) {
                alert("Completa los campos requeridos.");
                return;
            }
        }
    };


    return (
        <>
            <div className="header-imagen-container">
                <img className="imagen-header" src="/logos/crud.jpg" alt="Encabezado menú" />
                <h1 className="titulo-superpuesto">Platos Fuertes</h1>
            </div>

            <div className="entradas-admin-container">
                <button className="entradas-btn-crear" onClick={handleCreate}>
                    + Nuevo PlatoFuerte
                </button>

                <div className="entradas-grid">
                    {PlatosFuertes.map(PlatoFuerte => (
                        <div key={PlatoFuerte.id} className="entrada-card">
                            <h3>{PlatoFuerte.nombre}</h3>
                            <p>
                                <strong>Precio:</strong> {PlatoFuerte.precio ?? '-'}
                            </p>
                            <p>
                                <strong>Tipo:</strong> {PlatoFuerte.tipo}
                            </p>
                            <p>{PlatoFuerte.descripcion}</p>
                            <p>
                                <strong>Porciones:</strong> {PlatoFuerte.porciones ?? '-'}
                            </p>
                            <p>
                                <strong>Disponible:</strong> {PlatoFuerte.disponibilidad ? 'Sí' : 'No'}
                            </p>
                            <div className="card-actions">
                                <button className="edit-btn" onClick={() => handleEdit(PlatoFuerte)}>
                                    Editar
                                </button>
                                <button className="delete-btn" onClick={() => handleDelete(PlatoFuerte.id)}>
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal para editar o crear */}
            {modalOpen && (editingPlatoFuerte || creatingPlatoFuerte) && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>{isCreating ? 'Crear Plato Fuerte' : 'Editar Plato Fuerte'}</h3>

                        <div className="modal-grid">
                            <div>
                                <label>Nombre:</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={isCreating ? creatingPlatoFuerte?.nombre : editingPlatoFuerte?.nombre}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div>
                                <label>Precio:</label>
                                <input
                                    type="number"
                                    name="precio"
                                    value={isEditing ? editingPlatoFuerte!.precio : creatingPlatoFuerte!.precio}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div>
                                <label>Tipo:</label>
                                <input
                                    type="text"
                                    name="tipo"
                                    value={isEditing ? editingPlatoFuerte!.tipo : creatingPlatoFuerte!.tipo}
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
                                                ? editingPlatoFuerte!.disponibilidad ?? false
                                                : creatingPlatoFuerte!.disponibilidad ?? false
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
                                    value={isEditing ? editingPlatoFuerte!.descripcion ?? '' : creatingPlatoFuerte!.descripcion ?? ''}
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
                                setCreatingPlatoFuerte(null);
                                setEditingPlatoFuerte(null);
                                setIsCreating(false);
                            }}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )
            }
        </>
    );
}
