import { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken } from '../services/auth';
import type { Entrada } from '../type/index';
import './admin.css';

interface PostresResponse {
    success: boolean;
    message: string;
    data: {
        items: Entrada[];
        meta: any;
    };
}

interface CrearPostreResponse {
    success: boolean;
    data: Entrada;
    message?: string;
}

export default function PostresAdmin() {
    const [Postres, setPostres] = useState<Entrada[]>([]);
    const [editingPostre, setEditingPostre] = useState<Entrada | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [creatingPostre, setCreatingPostre] = useState<Entrada | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);


    useEffect(() => {
        axios.get<PostresResponse>('https://restaurante-api.desarrollo-software.xyz/postres', {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        }).then(res => {
            setPostres(res.data.data.items);
        });
    }, []);

    const handleDelete = async (id: number) => {
        const confirm = window.confirm('¿Estás seguro de que deseas eliminar esta Postre?');
        if (!confirm) return;

        try {
            await axios.delete(`https://restaurante-api.desarrollo-software.xyz/postres/${id}`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            setPostres(prev => prev.filter(e => e.id !== id));
        } catch (error) {
            alert('Error al eliminar la Postre');
        }
    };

    // Abrir modal con la Postre a editar
    const handleEdit = (Postre: Entrada) => {
        setEditingPostre(Postre);
        setCreatingPostre(null);
        setIsEditing(true);
        setModalOpen(true);
    };

    // Abrir modal para crear una nueva Postre
    const handleCreate = () => {
        setCreatingPostre({
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

        if (editingPostre) {
            setEditingPostre(prev => ({ ...prev!, [name]: val }));
        } else if (creatingPostre) {
            setCreatingPostre(prev => ({ ...prev!, [name]: val }));
        }
    };

    // Guardar cambios (actualizar)
    const handleSave = async () => {
        if (!editingPostre) return;

        // Extraemos id y campos que no queremos mandar
        const { id, porciones, profile, precio, ...rest } = editingPostre;

        // Construimos payload, asegurando que precio es un número
        const payload = {
            ...rest,
            precio: Number(precio),
        };
        try {
            await axios.put(
                `https://restaurante-api.desarrollo-software.xyz/postres/${id}`,
                payload, // aquí MANDAMOS solo payload sin id, porciones ni profile
                {
                    headers: { Authorization: `Bearer ${getToken()}` },
                }
            );

            setPostres(prev =>
                prev.map(e => (e.id === id ? editingPostre : e))
            );
            setModalOpen(false);
            setEditingPostre(null);
        } catch (error) {
            if (
                typeof error === 'object' &&
                error !== null &&
                'response' in error &&
                typeof (error as any).response === 'object'
            ) {
                const errResponse = (error as any).response;
                console.error('Error al actualizar Postre:', errResponse.data);

                alert(
                    'Error al actualizar Postre:\n' +
                    JSON.stringify(errResponse.data?.message ?? errResponse.data, null, 2)
                );
            } else {
                console.error('Error inesperado:', error);
                alert('Error inesperado al actualizar Postre.');
            }
        }
    };

    // Guardar nueva Postre (crear)
    const handleSaveCreate = async () => {
        if (!creatingPostre) return;

        // Construir el payload limpiamente
        const payload = {
            nombre: creatingPostre.nombre,
            precio: Number(creatingPostre.precio),
            tipo: creatingPostre.tipo,
            descripcion: creatingPostre.descripcion || '',
            disponibilidad: creatingPostre.disponibilidad ?? false,
        };

        try {
            const res = await axios.post<CrearPostreResponse>(
                'https://restaurante-api.desarrollo-software.xyz/postres',
                payload,
                {
                    headers: { Authorization: `Bearer ${getToken()}` },
                }
            );

            // Añadir la nueva Postre a la lista
            setPostres(prev => [...prev, res.data.data]);
            setModalOpen(false);
            setCreatingPostre(null);
        } catch (error) {
            if (!creatingPostre.nombre || creatingPostre.precio <= 0) {
                alert("Completa los campos requeridos.");
                return;
            }
        }
    };


    return (
        <>
            <div className="header-imagen-container">
                <img className="imagen-header" src="/logos/crud.jpg" alt="Encabezado menú" />
                <h1 className="titulo-superpuesto">Postres</h1>
            </div>

            <div className="entradas-admin-container">
                <button className="entradas-btn-crear" onClick={handleCreate}>
                    + Nuevo Postre
                </button>

                <div className="entradas-grid">
                    {Postres.map(Postre => (
                        <div key={Postre.id} className="entrada-card">
                            <h3>{Postre.nombre}</h3>
                            <p>
                                <strong>Precio:</strong> {Postre.precio ?? '-'}
                            </p>
                            <p>
                                <strong>Tipo:</strong> {Postre.tipo}
                            </p>
                            <p>{Postre.descripcion}</p>
                            <p>
                                <strong>Porciones:</strong> {Postre.porciones ?? '-'}
                            </p>
                            <p>
                                <strong>Disponible:</strong> {Postre.disponibilidad ? 'Sí' : 'No'}
                            </p>
                            <div className="card-actions">
                                <button className="edit-btn" onClick={() => handleEdit(Postre)}>
                                    Editar
                                </button>
                                <button className="delete-btn" onClick={() => handleDelete(Postre.id)}>
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal para editar o crear */}
            {modalOpen && (editingPostre || creatingPostre) && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>{isCreating ? 'Crear Postre' : 'Editar Postre'}</h3>

                        <div className="modal-grid">
                            <div>
                                <label>Nombre:</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={isCreating ? creatingPostre?.nombre : editingPostre?.nombre}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div>
                                <label>Precio:</label>
                                <input
                                    type="number"
                                    name="precio"
                                    value={isEditing ? editingPostre!.precio : creatingPostre!.precio}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div>
                                <label>Tipo:</label>
                                <input
                                    type="text"
                                    name="tipo"
                                    value={isEditing ? editingPostre!.tipo : creatingPostre!.tipo}
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
                                                ? editingPostre!.disponibilidad ?? false
                                                : creatingPostre!.disponibilidad ?? false
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
                                    value={isEditing ? editingPostre!.descripcion ?? '' : creatingPostre!.descripcion ?? ''}
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
                                setCreatingPostre(null);
                                setEditingPostre(null);
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
