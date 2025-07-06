import React, { useState, useEffect, type ChangeEvent } from 'react';
import styled from 'styled-components';
import { FaTimes } from 'react-icons/fa';
import { useProductStore } from '../../../stores/productStore';
import { useCategoryStore } from '../../../stores/categoryStore';
import { useCompanyStore } from '../../../stores/companyStore';


const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  overflow: scroll;
      &::-webkit-scrollbar { display: none; }

`;

const ModalWrapper = styled.div`
  background: #1A1A1F;
  border-radius: 12px;
  width: 480px;
  max-width: 95vw;
  padding: 2rem 2.5rem;
  color: #E8E8E8;
  font-family: 'Roboto', sans-serif;
    max-width: 100%;       /* para que no se pase del ancho del viewport */
  max-height: 90vh;      /* para que no exceda el alto de la pantalla */
  overflow-y: auto;      /* scroll interno si contenido es muy alto */
      &::-webkit-scrollbar { display: none; }

`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const Title = styled.h3`
  color: #6B2233;
  font-size: 1.8rem;
  font-weight: 700;
`;

const CloseBtn = styled.button`
  background: transparent;
  border: none;
  color: #6B2233;
  font-size: 1.3rem;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: #8e2a42;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: #ccc;
  margin-bottom: 0.4rem;
`;

const Input = styled.input`
  padding: 0.7rem 1rem;
  border-radius: 8px;
  border: 1.8px solid #444;
  background-color: #262630;
  color: #E8E8E8;
  font-size: 1rem;
  outline-offset: 2px;

  &:focus {
    border-color: #6B2233;
  }
`;

const Textarea = styled.textarea`
  padding: 0.7rem 1rem;
  border-radius: 8px;
  border: 1.8px solid #444;
  background-color: #262630;
  color: #E8E8E8;
  font-size: 1rem;
  min-height: 80px;
  resize: vertical;
  outline-offset: 2px;

  &:focus {
    border-color: #6B2233;
  }
`;

const Select = styled.select`
  padding: 0.7rem 1rem;
  border-radius: 8px;
  border: 1.8px solid #444;
  background-color: #262630;
  color: #E8E8E8;
  font-size: 1rem;
  outline-offset: 2px;
  appearance: none;

  &:focus {
    border-color: #6B2233;
  }
`;

const ImagePreview = styled.img`
  width: 100%;
  max-height: 160px;
  object-fit: contain;
  border-radius: 8px;
  margin-top: 0.7rem;
  border: 1.5px solid #6B2233;
  background-color: #1F1F23;
`;

const SubmitBtn = styled.button`
  background-color: #6B2233;
  color: white;
  padding: 0.75rem 1.3rem;
  border-radius: 10px;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  border: none;
  margin-top: 1.8rem;
  transition: background-color 0.25s ease;

  &:hover {
    background-color: #8e2a42;
  }
`;

const ErrorMsg = styled.div`
  color: #e05252;
  font-weight: 600;
  margin-top: -0.8rem;
  margin-bottom: 0.8rem;
  font-size: 0.9rem;
`;

interface Props {
  onClose: () => void;
}

export default function ProductCreateModal({ onClose }: Props) {
  const { create } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState('');
    const { company } = useCompanyStore();

     if (!company?.id_company) return null; // Evita renderizar el modal hasta que esté lista

    useEffect(() => {
    if (company?.id_company) {
        fetchCategories(company.id_company, '1');
    }
    }, [company?.id_company]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  // Form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !price || !stock || !categoryId) {
      setError('Por favor complete todos los campos obligatorios.');
      return;
    }

    if (isNaN(Number(price)) || Number(price) <= 0) {
      setError('El precio debe ser un número válido mayor a 0.');
      return;
    }

    if (!Number.isInteger(Number(stock)) || Number(stock) < 0) {
      setError('El stock debe ser un número entero mayor o igual a 0.');
      return;
    }
    const formData = new FormData();
    if (company?.id_company) {
    formData.append('company_id', company.id_company);
    } else {
    setError('No se pudo identificar la empresa actual.');
    return;
    }
    // Construir FormData para envío multipart/form-data
    formData.append('name', name.trim());
    formData.append('description', description.trim());
    formData.append('price', price);
    formData.append('stock', stock);
    formData.append('category_id', categoryId);
    if (imageFile) formData.append('image', imageFile);

    const success = await create(formData);
    if (success) {
      onClose();
    } else {
      setError('Error al crear el producto. Intente de nuevo.');
    }
  };

  return (
    <Overlay onClick={onClose}>
      <ModalWrapper onClick={e => e.stopPropagation()}>
        <Header>
          <Title>Crear Producto</Title>
          <CloseBtn onClick={onClose} aria-label="Cerrar modal">
            <FaTimes />
          </CloseBtn>
        </Header>

        <Form onSubmit={handleSubmit}>
          <Label htmlFor="name">Nombre *</Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Ej: Camisa de algodón"
            required
            maxLength={120}
          />

          <Label htmlFor="description">Descripción</Label>
          <Textarea
            id="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Opcional"
            maxLength={500}
          />

          <Label htmlFor="price">Precio *</Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={e => setPrice(e.target.value)}
            placeholder="Ej: 29.99"
            required
          />

          <Label htmlFor="stock">Stock *</Label>
          <Input
            id="stock"
            type="number"
            min="0"
            step="1"
            value={stock}
            onChange={e => setStock(e.target.value)}
            placeholder="Ej: 100"
            required
          />

          <Label htmlFor="category">Categoría *</Label>
          <Select
            id="category"
            value={categoryId}
            onChange={e => setCategoryId(e.target.value)}
            required
          >
            <option value="" disabled>Seleccione una categoría</option>
            {categories.map(cat => (
              <option key={cat.id_category} value={cat.id_category}>
                {cat.name}
              </option>
            ))}
          </Select>

          <Label htmlFor="image">Imagen / Foto</Label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          {imagePreview && <ImagePreview src={imagePreview} alt="Preview imagen" />}

          {error && <ErrorMsg>{error}</ErrorMsg>}

          <SubmitBtn type="submit">Crear producto</SubmitBtn>
        </Form>
      </ModalWrapper>
    </Overlay>
  );
}
