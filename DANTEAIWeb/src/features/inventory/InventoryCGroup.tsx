import React, { useState } from 'react';
import styled from 'styled-components';
import { FaFolderPlus, FaBoxes, FaPlusCircle, FaPlus, FaLayerGroup, FaHome } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Drawer = styled.div<{ expanded: boolean }>`
  width: ${({ expanded }) => (expanded ? '220px' : '70px')};

  transition: width 0.3s;
  display: flex;
  flex-direction: column;
  padding: 1rem 0.5rem;
`;

const DrawerItem = styled.div<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: ${({active}) => (active ? colors.acento : colors.texto)};
  padding: 0.7rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 0.3rem;
  background-color: ${({active})  => (active ? '#1f1f23' : 'transparent')};

  &:hover {
    background-color: #22222a;

  }

  svg {
    min-width: 20px;
  }
`;

const colors = {
  fondo: '#0D0D11',
  panel: '#1A1A1F',
  texto: '#E8E8E8',
  secundario: '#888',
  acento: '#6B2233',
};

const Layout = styled.div`
  display: flex;
  height: 100vh;
  background-color: ${colors.fondo};
  font-family: 'Inter', sans-serif;
  color: ${colors.texto};
`;

const Container = styled.div`
  flex: 1;
  padding: 3rem;
`;

const Title = styled.h2`
  font-size: 2rem;
  color: ${colors.acento};
  margin-bottom: 2rem;
`;

const Form = styled.form`
  background: ${colors.panel};
  padding: 2.5rem;
  border-radius: 1rem;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
`;

const Label = styled.label`
  font-weight: 600;
  margin-bottom: 0.4rem;
`;

const Input = styled.input`
  padding: 0.9rem 1.2rem;
  background: #2A2A2A;
  border: 1px solid ${colors.secundario};
  border-radius: 0.6rem;
  color: ${colors.texto};
  font-size: 1rem;
  outline: none;

  &:focus {
    border-color: ${colors.acento};
  }
`;

const TextArea = styled.textarea`
  padding: 0.9rem 1.2rem;
  background: #2A2A2A;
  border: 1px solid ${colors.secundario};
  border-radius: 0.6rem;
  color: ${colors.texto};
  font-size: 1rem;
  resize: vertical;

  &:focus {
    border-color: ${colors.acento};
  }
`;

const FileInput = styled.input`
  margin-top: 0.4rem;
  color: ${colors.texto};
`;

const Button = styled.button`
  padding: 1rem;
  background: ${colors.acento};
  border: none;
  border-radius: 0.6rem;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #8e2a42;
  }
`;

const Preview = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin-top: 0.6rem;
  border: 1px solid ${colors.secundario};
`;

const CreateInventoryGroup = () => {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [drawerExpanded, setDrawerExpanded] = useState(true);
  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert('Nombre requerido');
    alert(`Grupo creado: ${name}`);
  };

  return (
    <Layout>
         <Drawer
           expanded={drawerExpanded}
           onMouseEnter={() => setDrawerExpanded(true)}
           onMouseLeave={() => setDrawerExpanded(false)}
         >
           <DrawerItem onClick={() => navigate('/dashboard')} title="Dashboard" active={location.pathname === '/dashboard'}>
             <FaHome />
             {drawerExpanded && 'Dashboard'}
           </DrawerItem>
   
           <DrawerItem onClick={() => navigate('/inventario/grupo')} title="Grupos" active={location.pathname === '/inventario/grupo'}>
             <FaLayerGroup />
             {drawerExpanded && 'Grupos'}
           </DrawerItem>
   
           <DrawerItem onClick={() => navigate('/inventario/grupo/crear')} title="Crear grupo" active={location.pathname === '/inventario/grupo/crear'}>
             <FaPlus />
             {drawerExpanded && 'Crear grupo'}
           </DrawerItem>
         </Drawer>

      <Container>
        <Title>Crear grupo de inventario</Title>
        <Form onSubmit={handleSubmit}>
          <div>
            <Label>Nombre del grupo</Label>
            <Input
              placeholder="Ej: Tecnología"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <Label>Descripción</Label>
            <TextArea
              rows={3}
              placeholder="Ej: Equipos electrónicos, gadgets, computadoras..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>

          <div>
            <Label>Imagen del grupo (opcional)</Label>
            <FileInput type="file" accept="image/*" onChange={handleImageChange} />
            {preview && <Preview src={preview} alt="Vista previa" />}
          </div>

          <Button type="submit">
            <FaFolderPlus /> Crear grupo
          </Button>
        </Form>
      </Container>
    </Layout>
  );
};

export default CreateInventoryGroup;