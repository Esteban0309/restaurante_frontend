import { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken } from '../services/auth';
import type { Entrada } from '../type/index';
import './admin.css';

interface EntradasResponse {
    success: boolean;
    message: string;
    data: {
        items: Entrada[];
        meta: any;
    };
}

interface CrearEntradaResponse {
    success: boolean;
    data: Entrada;
    message?: string;
}

const tiposEntrada = [
    'sopas',
    'ceviches',
    'mariscos',
    'empanadas'
];


export default function EntradasAdmin() {
    const [entradas, setEntradas] = useState<Entrada[]>([]);
    const [editingEntrada, setEditingEntrada] = useState<Entrada | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [creatingEntrada, setCreatingEntrada] = useState<Entrada | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);


    useEffect(() => {
        axios.get<EntradasResponse>('https://restaurante-api.desarrollo-software.xyz/entradas', {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        }).then(res => {
            setEntradas(res.data.data.items);
        });
    }, []);

    const handleDelete = async (id: number) => {
        const confirm = window.confirm('¿Estás seguro de que deseas eliminar esta entrada?');
        if (!confirm) return;

        try {
            await axios.delete(`https://restaurante-api.desarrollo-software.xyz/entradas/${id}`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            setEntradas(prev => prev.filter(e => e.id !== id));
        } catch (error) {
            alert('Error al eliminar la entrada');
        }
    };

    // Abrir modal con la entrada a editar
    const handleEdit = (entrada: Entrada) => {
        setEditingEntrada(entrada);
        setCreatingEntrada(null);
        setIsEditing(true);
        setModalOpen(true);
    };

    // Abrir modal para crear una nueva entrada
    const handleCreate = () => {
        setCreatingEntrada({
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

        if (editingEntrada) {
            setEditingEntrada(prev => ({ ...prev!, [name]: val }));
        } else if (creatingEntrada) {
            setCreatingEntrada(prev => ({ ...prev!, [name]: val }));
        }
    };

    // Guardar cambios (actualizar)
    const handleSave = async () => {
        if (!editingEntrada) return;

        // Extraemos id y campos que no queremos mandar
        const { id, porciones, profile, ...payload } = editingEntrada;

        try {
            await axios.put(
                `https://restaurante-api.desarrollo-software.xyz/entradas/${id}`,
                payload, // aquí MANDAMOS solo payload sin id, porciones ni profile
                {
                    headers: { Authorization: `Bearer ${getToken()}` },
                }
            );

            setEntradas(prev =>
                prev.map(e => (e.id === id ? editingEntrada : e))
            );
            setModalOpen(false);
            setEditingEntrada(null);
        } catch (error) {
            alert('Error al actualizar la entrada');
        }
    };

    // Guardar nueva entrada (crear)
    const handleSaveCreate = async () => {
        if (!creatingEntrada) return;

        // Construir el payload limpiamente
        const payload = {
            nombre: creatingEntrada.nombre,
            precio: Number(creatingEntrada.precio),
            tipo: creatingEntrada.tipo,
            descripcion: creatingEntrada.descripcion || '',
            disponibilidad: creatingEntrada.disponibilidad ?? false,
        };

        try {
            const res = await axios.post<CrearEntradaResponse>(
                'https://restaurante-api.desarrollo-software.xyz/entradas',
                payload,
                {
                    headers: { Authorization: `Bearer ${getToken()}` },
                }
            );

            // Añadir la nueva entrada a la lista
            setEntradas(prev => [...prev, res.data.data]);
            setModalOpen(false);
            setCreatingEntrada(null);
        } catch (error) {
            if (error && typeof error === 'object' && 'response' in error) {
                const err = error as any;
                console.error('Error al crear entrada:', err.response?.data);
                alert(
                    'Error al crear entrada:\n' +
                    JSON.stringify(err.response?.data?.message ?? err.response?.data, null, 2)
                );
            } else {
                console.error(error);
                alert('Error desconocido al crear entrada');
            }
        }
    };


    return (
        <>
            <div className="header-imagen-container">
                <img className="imagen-header" src="/logos/crud.jpg" alt="Encabezado menú" />
                <h1 className="titulo-superpuesto">Entradas</h1>
            </div>

            <div className="entradas-admin-container">
                <button className="entradas-btn-crear" onClick={handleCreate}>
                    + Nueva Entrada
                </button>

                <div className="entradas-grid">
                    {entradas.map(entrada => (
                        <div key={entrada.id} className="entrada-card">
                            <h3>{entrada.nombre}</h3>
                            <p>
                                <strong>Precio:</strong> {entrada.precio ?? '-'}
                            </p>
                            <p>
                                <strong>Tipo:</strong> {entrada.tipo}
                            </p>
                            <p>{entrada.descripcion}</p>
                            <p>
                                <strong>Porciones:</strong> {entrada.porciones ?? '-'}
                            </p>
                            <p>
                                <strong>Disponible:</strong> {entrada.disponibilidad ? 'Sí' : 'No'}
                            </p>
                            <div className="card-actions">
                                <button className="edit-btn" onClick={() => handleEdit(entrada)}>
                                    Editar
                                </button>
                                <button className="delete-btn" onClick={() => handleDelete(entrada.id)}>
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal para editar o crear */}
            {modalOpen && (editingEntrada || creatingEntrada) && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>{isCreating ? 'Crear Entrada' : 'Editar Entrada'}</h3>

                        <div className="modal-grid">
                            <div>
                                <label>Nombre:</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={isCreating ? creatingEntrada?.nombre : editingEntrada?.nombre}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div>
                                <label>Precio:</label>
                                <input
                                    type="number"
                                    name="precio"
                                    value={isEditing
                                        ? editingEntrada?.precio ?? 0
                                        : creatingEntrada?.precio ?? 0}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div>
                                <label>Tipo:</label>
                                <select
                                    name="tipo"
                                    value={isEditing ? editingEntrada!.tipo : creatingEntrada!.tipo}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Seleccionar tipo</option>
                                    {tiposEntrada.map(tipo => (
                                        <option key={tipo} value={tipo}>
                                            {tipo}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="disponibilidad"
                                        checked={
                                            isEditing
                                                ? editingEntrada!.disponibilidad ?? false
                                                : creatingEntrada!.disponibilidad ?? false
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
                                    value={isEditing ? editingEntrada!.descripcion ?? '' : creatingEntrada!.descripcion ?? ''}
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
                                setCreatingEntrada(null);
                                setEditingEntrada(null);
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
