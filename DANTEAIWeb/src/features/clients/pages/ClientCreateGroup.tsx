import React, { useState, type ChangeEvent } from 'react';
import styled from 'styled-components';
import { FaArrowLeft, FaComments, FaLifeRing, FaUpload, FaUsers } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const colors = {
  fondo: '#0D0D11',
  panel: '#1A1A1F',
  texto: '#E8E8E8',
  secundario: '#888',
  acento: '#6B2233',
  sidebar: '#111117',
  header: '#1F1F23',
  morado: '#6A0DAD',
  vinotinto: '#8B1E3F',
};

const Layout = styled.div`
  display: flex;
  height: 100vh;
  font-family: 'Montserrat', sans-serif;
  background-color: ${colors.fondo};
`;

const Drawer = styled.nav<{ expanded: boolean }>`
  width: ${({ expanded }) => (expanded ? '220px' : '64px')};
  background-color: ${colors.sidebar};
  display: flex;
  flex-direction: column;
  padding: 1.8rem 1rem;
  gap: 1.5rem;
  transition: width 0.25s ease;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.6);
  user-select: none;
`;

const DrawerItem = styled.div<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0.75rem 1rem;
  border-radius: 0.6rem;
  color: ${({ active }) => (active ? colors.acento : colors.texto)};
  background-color: ${({ active }) => (active ? colors.panel : 'transparent')};
  transition: background-color 0.25s, color 0.25s;

  &:hover {
    background-color: ${colors.panel};
    color: ${colors.acento};
  }

  svg {
    font-size: 1.5rem;
    min-width: 24px;
  }
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  background-color: ${colors.header};
  padding: 1.2rem 2rem;
  color: ${colors.texto};
  font-weight: 600;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 1.2rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  user-select: none;
`;

const BackButton = styled.button`
  background: transparent;
  border: none;
  color: ${colors.acento};
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;

  &:hover {
    color: #8e2a42;
  }
`;

const Content = styled.section`
  flex: 1;
  padding: 2rem 3rem;
  overflow-y: auto;
  color: ${colors.texto};
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
  background: ${colors.panel};
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 8px 16px rgba(107, 34, 51, 0.25);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 12px 22px rgba(107, 34, 51, 0.45);
  }
`;

const Label = styled.label`
  font-weight: 700;
  font-size: 1.05rem;
  margin-bottom: 0.5rem;
  user-select: none;
`;

const Input = styled.input`
  padding: 0.85rem 1.2rem;
  font-size: 1.05rem;
  border-radius: 0.75rem;
  border: none;
  background-color: ${colors.fondo};
  color: ${colors.texto};
  box-shadow: inset 2px 2px 6px #000000cc;
  transition: box-shadow 0.3s ease;

  &:focus {
    outline: none;
    box-shadow: 0 0 10px ${colors.acento};
  }
`;

const Button = styled.button<{ disabled?: boolean }>`
  background-color: ${({ disabled }) => (disabled ? '#5a1a28' : colors.acento)};
  border: none;
  color: white;
  font-weight: 700;
  padding: 1rem 1.2rem;
  border-radius: 0.85rem;
  font-size: 1.15rem;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ disabled }) => (disabled ? '#5a1a28' : '#8e2a42')};
  }
`;

const Message = styled.p<{ error?: boolean }>`
  color: ${({ error }) => (error ? '#e03e3e' : '#4caf50')};
  font-weight: 600;
  font-size: 1rem;
  margin-top: -1rem;
  user-select: none;
`;

const ImageUploader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

const ImagePreview = styled.div`
  width: 140px;
  height: 140px;
  border-radius: 0.75rem;
  background-color: ${colors.fondo};
  box-shadow: inset 0 0 8px #000000bb;
  background-size: cover;
  background-position: center;
  user-select: none;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const UploadButton = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  color: ${colors.acento};
  padding: 0.4rem 0.8rem;
  border-radius: 0.7rem;
  background-color: ${colors.panel};
  box-shadow: 0 2px 8px rgba(107, 34, 51, 0.3);
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #8e2a42;
    color: white;
  }

  svg {
    font-size: 1.2rem;
  }
`;

const CreateGroup: React.FC = () => {
  const [drawerExpanded, setDrawerExpanded] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError('');
    setSuccess('');
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!validTypes.includes(file.type)) {
      setError('Formato no válido. Solo JPG, PNG o WEBP permitidos.');
      setImageFile(null);
      setImagePreview(null);
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('El tamaño máximo permitido es 2MB.');
      setImageFile(null);
      setImagePreview(null);
      return;
    }

    setImageFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!groupName.trim()) {
      setError('El nombre del grupo es obligatorio.');
      return;
    }
    // Aquí va la lógica para subir imagen y guardar grupo, simulamos éxito:
    setSuccess(`Grupo "${groupName}" creado exitosamente.`);
    setGroupName('');
    setImageFile(null);
    setImagePreview(null);
  };

  return (
    <Layout>
   <Drawer
  expanded={drawerExpanded}
  onMouseEnter={() => setDrawerExpanded(true)}
  onMouseLeave={() => setDrawerExpanded(false)}
>
  <DrawerItem onClick={() => navigate('/dashboard')} title="Dashboard Principal" active={false}>
    <FaUsers />
    {drawerExpanded && 'Dashboard'}
  </DrawerItem>

  <DrawerItem onClick={() => navigate('/cliente/grupo')} title="Grupos de Clientes" active={location.pathname === '/cliente/grupo'}>
    {/* Icono de grupo personalizado o de librería */}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={drawerExpanded ? colors.acento : colors.texto}
      viewBox="0 0 24 24"
      width="24"
      height="24"
      style={{ minWidth: 24 }}
    >
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2 0-6 1-6 3v2h14v-2c0-2-4-3-6-3z" />
    </svg>
    {drawerExpanded && 'Grupos'}
  </DrawerItem>

  <DrawerItem onClick={() => navigate('/cliente/grupo/crear')} title="Crear nuevo grupo" active={location.pathname === '/cliente/grupo/crear'}>
    <FaComments />
    {drawerExpanded && 'Crear grupo'}
  </DrawerItem>
</Drawer>

      <Main>
        <Header>
          <BackButton onClick={() => navigate('/clients/groups')} title="Volver a grupos">
            <FaArrowLeft />
          </BackButton>
          Crear Nuevo Grupo
        </Header>

        <Content>
          <Form onSubmit={handleSubmit} noValidate>
            <div>
              <Label htmlFor="groupName">Nombre del grupo</Label>
              <Input
                id="groupName"
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Ejemplo: Corporativos, VIP, Retail..."
                autoFocus
              />
            </div>

            <ImageUploader>
              <Label htmlFor="imageUpload">Imagen del grupo (opcional)</Label>
              {imagePreview ? (
                <ImagePreview style={{ backgroundImage: `url(${imagePreview})` }} />
              ) : (
                <ImagePreview>
                  <p style={{ color: colors.secundario, textAlign: 'center', paddingTop: '50px', fontSize: '0.9rem' }}>
                    Vista previa
                  </p>
                </ImagePreview>
              )}

              <HiddenFileInput
                type="file"
                id="imageUpload"
                accept="image/jpeg, image/png, image/webp"
                onChange={handleImageChange}
              />
              <UploadButton htmlFor="imageUpload">
                <FaUpload />
                Subir imagen
              </UploadButton>
            </ImageUploader>

            {error && <Message error>{error}</Message>}
            {success && <Message>{success}</Message>}

            <Button type="submit" disabled={!groupName.trim()}>
              Crear Grupo
            </Button>
          </Form>
        </Content>
      </Main>
    </Layout>
  );
};

export default CreateGroup;
