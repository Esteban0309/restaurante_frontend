import { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken } from '../services/auth';
import type { Entrada } from '../type/index';
import './Admin.css';

interface BebidasResponse {
    success: boolean;
    message: string;
    data: {
        items: Entrada[];
        meta: any;
    };
}

interface CrearBebidaResponse {
    success: boolean;
    data: Entrada;
    message?: string;
}

export default function BebidasAdmin() {
    const [Bebidas, setBebidas] = useState<Entrada[]>([]);
    const [editingBebida, setEditingBebida] = useState<Entrada | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [creatingBebida, setCreatingBebida] = useState<Entrada | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);


    useEffect(() => {
        axios.get<BebidasResponse>('https://restaurante-api.desarrollo-software.xyz/bebidas', {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        }).then(res => {
            setBebidas(res.data.data.items);
        });
    }, []);

    const handleDelete = async (id: number) => {
        const confirm = window.confirm('¿Estás seguro de que deseas eliminar esta bebida?');
        if (!confirm) return;

        try {
            await axios.delete(`https://restaurante-api.desarrollo-software.xyz/bebidas/${id}`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            setBebidas(prev => prev.filter(e => e.id !== id));
        } catch (error) {
            alert('Error al eliminar la Bebida');
        }
    };

    // Abrir modal con la Bebida a editar
    const handleEdit = (Bebida: Entrada) => {
        setEditingBebida(Bebida);
        setCreatingBebida(null);
        setIsEditing(true);
        setModalOpen(true);
    };

    // Abrir modal para crear una nueva Bebida
    const handleCreate = () => {
        setCreatingBebida({
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

        if (editingBebida) {
            setEditingBebida(prev => ({ ...prev!, [name]: val }));
        } else if (creatingBebida) {
            setCreatingBebida(prev => ({ ...prev!, [name]: val }));
        }
    };

    // Guardar cambios (actualizar)
    const handleSave = async () => {
        if (!editingBebida) return;

        // Extraemos id y campos que no queremos mandar
        const { id, porciones, profile, precio, ...rest } = editingBebida;

        // Construimos payload, asegurando que precio es un número
        const payload = {
            ...rest,
            precio: Number(precio),
        };
        try {
            await axios.put(
                `https://restaurante-api.desarrollo-software.xyz/bebidas/${id}`,
                payload, // aquí MANDAMOS solo payload sin id, porciones ni profile
                {
                    headers: { Authorization: `Bearer ${getToken()}` },
                }
            );

            setBebidas(prev =>
                prev.map(e => (e.id === id ? editingBebida : e))
            );
            setModalOpen(false);
            setEditingBebida(null);
        } catch (error) {
            if (
                typeof error === 'object' &&
                error !== null &&
                'response' in error &&
                typeof (error as any).response === 'object'
            ) {
                const errResponse = (error as any).response;
                console.error('Error al actualizar Bebida:', errResponse.data);

                alert(
                    'Error al actualizar Bebida:\n' +
                    JSON.stringify(errResponse.data?.message ?? errResponse.data, null, 2)
                );
            } else {
                console.error('Error inesperado:', error);
                alert('Error inesperado al actualizar Bebida.');
            }
        }
    };

    // Guardar nueva Bebida (crear)
    const handleSaveCreate = async () => {
        if (!creatingBebida) return;

        // Construir el payload limpiamente
        const payload = {
            nombre: creatingBebida.nombre,
            precio: Number(creatingBebida.precio),
            tipo: creatingBebida.tipo,
            descripcion: creatingBebida.descripcion || '',
            disponibilidad: creatingBebida.disponibilidad ?? false,
        };

        try {
            const res = await axios.post<CrearBebidaResponse>(
                'https://restaurante-api.desarrollo-software.xyz/bebidas',
                payload,
                {
                    headers: { Authorization: `Bearer ${getToken()}` },
                }
            );

            // Añadir la nueva Bebida a la lista
            setBebidas(prev => [...prev, res.data.data]);
            setModalOpen(false);
            setCreatingBebida(null);
        } catch (error) {
            if (!creatingBebida.nombre || creatingBebida.precio <= 0) {
                alert("Completa los campos requeridos.");
                return;
            }
        }
    };


    return (
        <>
            <div className="header-imagen-container">
                <img className="imagen-header" src="/logos/crud.jpg" alt="Encabezado menú" />
                <h1 className="titulo-superpuesto">Bebidas</h1>
            </div>

            <div className="entradas-admin-container">
                <button className="entradas-btn-crear" onClick={handleCreate}>
                    + Nueva Bebida
                </button>

                <div className="entradas-grid">
                    {Bebidas.map(Bebida => (
                        <div key={Bebida.id} className="entrada-card">
                            <h3>{Bebida.nombre}</h3>
                            <p>
                                <strong>Precio:</strong> {Bebida.precio ?? '-'}
                            </p>
                            <p>
                                <strong>Tipo:</strong> {Bebida.tipo}
                            </p>
                            <p>{Bebida.descripcion}</p>
                            <p>
                                <strong>Porciones:</strong> {Bebida.porciones ?? '-'}
                            </p>
                            <p>
                                <strong>Disponible:</strong> {Bebida.disponibilidad ? 'Sí' : 'No'}
                            </p>
                            <div className="card-actions">
                                <button className="edit-btn" onClick={() => handleEdit(Bebida)}>
                                    Editar
                                </button>
                                <button className="delete-btn" onClick={() => handleDelete(Bebida.id)}>
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal para editar o crear */}
            {modalOpen && (editingBebida || creatingBebida) && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>{isCreating ? 'Crear Bebida' : 'Editar Bebida'}</h3>

                        <div className="modal-grid">
                            <div>
                                <label>Nombre:</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={isCreating ? creatingBebida?.nombre : editingBebida?.nombre}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div>
                                <label>Precio:</label>
                                <input
                                    type="number"
                                    name="precio"
                                    value={isEditing ? editingBebida!.precio : creatingBebida!.precio}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div>
                                <label>Tipo:</label>
                                <input
                                    type="text"
                                    name="tipo"
                                    value={isEditing ? editingBebida!.tipo : creatingBebida!.tipo}
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
                                                ? editingBebida!.disponibilidad ?? false
                                                : creatingBebida!.disponibilidad ?? false
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
                                    value={isEditing ? editingBebida!.descripcion ?? '' : creatingBebida!.descripcion ?? ''}
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
                                setCreatingBebida(null);
                                setEditingBebida(null);
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
