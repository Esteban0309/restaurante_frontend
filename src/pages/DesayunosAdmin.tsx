import { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken } from '../services/auth';
import type { Entrada } from '../type/index';
import './admin.css';

interface DesayunossResponse {
    success: boolean;
    message: string;
    data: {
        items: Entrada[];
        meta: any;
    };
}

interface CrearDesayunosResponse {
    success: boolean;
    data: Entrada;
    message?: string;
}

const tiposDesayunos = [
    'sopas',
    'ceviches',
    'mariscos',
    'empanadas'
];


export default function DesayunossAdmin() {
    const [desayunos, setDesayunoss] = useState<Entrada[]>([]);
    const [editingDesayunos, setEditingDesayunos] = useState<Entrada | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [creatingDesayunos, setCreatingDesayunos] = useState<Entrada | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);


    useEffect(() => {
        axios.get<DesayunossResponse>('https://restaurante-api.desarrollo-software.xyz/desayunos', {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        }).then(res => {
            setDesayunoss(res.data.data.items);
        });
    }, []);

    const handleDelete = async (id: number) => {
        const confirm = window.confirm('¿Estás seguro de que deseas eliminar esta desayunos?');
        if (!confirm) return;

        try {
            await axios.delete(`https://restaurante-api.desarrollo-software.xyz/desayunos/${id}`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            setDesayunoss(prev => prev.filter(e => e.id !== id));
        } catch (error) {
            alert('Error al eliminar la desayunos');
        }
    };

    // Abrir modal con la desayunos a editar
    const handleEdit = (desayunos: Entrada) => {
        setEditingDesayunos(desayunos);
        setCreatingDesayunos(null);
        setIsEditing(true);
        setModalOpen(true);
    };

    // Abrir modal para crear una nueva desayunos
    const handleCreate = () => {
        setCreatingDesayunos({
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

        if (editingDesayunos) {
            setEditingDesayunos(prev => ({ ...prev!, [name]: val }));
        } else if (creatingDesayunos) {
            setCreatingDesayunos(prev => ({ ...prev!, [name]: val }));
        }
    };

    // Guardar cambios (actualizar)
    const handleSave = async () => {
        if (!editingDesayunos) return;

        // Extraemos id y campos que no queremos mandar
        const { id, porciones, profile, ...payload } = editingDesayunos;

        try {
            await axios.put(
                `https://restaurante-api.desarrollo-software.xyz/desayunos/${id}`,
                payload, // aquí MANDAMOS solo payload sin id, porciones ni profile
                {
                    headers: { Authorization: `Bearer ${getToken()}` },
                }
            );

            setDesayunoss(prev =>
                prev.map(e => (e.id === id ? editingDesayunos : e))
            );
            setModalOpen(false);
            setEditingDesayunos(null);
        } catch (error) {
            alert('Error al actualizar la desayunos');
        }
    };

    // Guardar nueva desayunos (crear)
    const handleSaveCreate = async () => {
        if (!creatingDesayunos) return;

        // Construir el payload limpiamente
        const payload = {
            nombre: creatingDesayunos.nombre,
            precio: Number(creatingDesayunos.precio),
            tipo: creatingDesayunos.tipo,
            descripcion: creatingDesayunos.descripcion || '',
            disponibilidad: creatingDesayunos.disponibilidad ?? false,
        };

        try {
            const res = await axios.post<CrearDesayunosResponse>(
                'https://restaurante-api.desarrollo-software.xyz/desayunos',
                payload,
                {
                    headers: { Authorization: `Bearer ${getToken()}` },
                }
            );

            // Añadir la nueva desayunos a la lista
            setDesayunoss(prev => [...prev, res.data.data]);
            setModalOpen(false);
            setCreatingDesayunos(null);
        } catch (error) {
            if (error && typeof error === 'object' && 'response' in error) {
                const err = error as any;
                console.error('Error al crear desayunos:', err.response?.data);
                alert(
                    'Error al crear desayunos:\n' +
                    JSON.stringify(err.response?.data?.message ?? err.response?.data, null, 2)
                );
            } else {
                console.error(error);
                alert('Error desconocido al crear desayunos');
            }
        }
    };


    return (
        <>
            <div className="header-imagen-container">
                <img className="imagen-header" src="/logos/crud.jpg" alt="Encabezado menú" />
                <h1 className="titulo-superpuesto">Desayunoss</h1>
            </div>

            <div className="entradas-admin-container">
                <button className="entradas-btn-crear" onClick={handleCreate}>
                    + Nueva Desayunos
                </button>

                <div className="entradas-grid">
                    {desayunos.map(desayunos => (
                        <div key={desayunos.id} className="entrada-card">
                            <h3>{desayunos.nombre}</h3>
                            <p>
                                <strong>Precio:</strong> {desayunos.precio ?? '-'}
                            </p>
                            <p>
                                <strong>Tipo:</strong> {desayunos.tipo}
                            </p>
                            <p>{desayunos.descripcion}</p>
                            <p>
                                <strong>Porciones:</strong> {desayunos.porciones ?? '-'}
                            </p>
                            <p>
                                <strong>Disponible:</strong> {desayunos.disponibilidad ? 'Sí' : 'No'}
                            </p>
                            <div className="card-actions">
                                <button className="edit-btn" onClick={() => handleEdit(desayunos)}>
                                    Editar
                                </button>
                                <button className="delete-btn" onClick={() => handleDelete(desayunos.id)}>
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal para editar o crear */}
            {modalOpen && (editingDesayunos || creatingDesayunos) && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>{isCreating ? 'Crear Desayunos' : 'Editar Desayunos'}</h3>

                        <div className="modal-grid">
                            <div>
                                <label>Nombre:</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={isCreating ? creatingDesayunos?.nombre : editingDesayunos?.nombre}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div>
                                <label>Precio:</label>
                                <input
                                    type="number"
                                    name="precio"
                                    value={isEditing
                                        ? editingDesayunos?.precio ?? 0
                                        : creatingDesayunos?.precio ?? 0}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div>
                                <label>Tipo:</label>
                                <select
                                    name="tipo"
                                    value={isEditing ? editingDesayunos!.tipo : creatingDesayunos!.tipo}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Seleccionar tipo</option>
                                    {tiposDesayunos.map(tipo => (
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
                                                ? editingDesayunos!.disponibilidad ?? false
                                                : creatingDesayunos!.disponibilidad ?? false
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
                                    value={isEditing ? editingDesayunos!.descripcion ?? '' : creatingDesayunos!.descripcion ?? ''}
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
                                setCreatingDesayunos(null);
                                setEditingDesayunos(null);
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
