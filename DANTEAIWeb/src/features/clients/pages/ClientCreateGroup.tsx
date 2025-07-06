import React, { useState, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaArrowLeft, FaUpload, FaUsers, FaComments } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useCategoryStore } from '../../../stores/categoryStore';
import { useCompanyStore } from '../../../stores/companyStore';

const colors = {
  fondo: '#0E0E11',
  panel: '#1A1A1F',
  texto: '#ECECEC',
  secundario: '#999',
  acento: '#71263D',
  sidebar: '#121217',
  header: '#1F1F23',
  hover: '#8B2E4C',
};

const Layout = styled.div`
  display: flex;
  height: 100vh;
  font-family: 'Poppins', sans-serif;
  background-color: ${colors.fondo};
`;

const Drawer = styled.nav<{ expanded: boolean }>`
  width: ${({ expanded }) => (expanded ? '220px' : '64px')};
  background-color: ${colors.sidebar};
  display: flex;
  flex-direction: column;
  padding: 1.8rem 1rem;
  gap: 1.5rem;
  transition: width 0.3s ease;
`;

const DrawerItem = styled(motion.div)<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0.75rem 1rem;
  border-radius: 0.6rem;
  color: ${({ active }) => (active ? colors.acento : colors.texto)};
  background-color: ${({ active }) => (active ? colors.panel : 'transparent')};
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: ${colors.panel};
    color: ${colors.acento};
  }

  svg {
    font-size: 1.4rem;
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
  padding: 1.4rem 2rem;
  color: ${colors.texto};
  font-weight: 600;
  font-size: 1.3rem;
  display: flex;
  align-items: center;
  gap: 1.2rem;
`;

const BackButton = styled.button`
  background: transparent;
  border: none;
  color: ${colors.acento};
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const Content = styled.section`
  flex: 1;
  padding: 2rem 3rem;
  color: ${colors.texto};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
  max-width: 600px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  width: 100%;
`;

const Label = styled.label`
  font-weight: 600;
  font-size: 1.05rem;
`;

const Input = styled.input`
  padding: 0.85rem 1rem;
  font-size: 1rem;
  border-radius: 0.6rem;
  border: 1px solid ${colors.panel};
  background-color: ${colors.fondo};
  color: ${colors.texto};
  transition: border 0.3s;

  &:focus {
    outline: none;
    border-color: ${colors.acento};
  }
`;

const TextArea = styled.textarea`
  padding: 0.85rem 1rem;
  font-size: 1rem;
  border-radius: 0.6rem;
  border: 1px solid ${colors.panel};
  background-color: ${colors.fondo};
  color: ${colors.texto};
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${colors.acento};
  }
`;

const ImagePreview = styled.div<{ src?: string }>`
  width: 140px;
  height: 140px;
  border-radius: 0.75rem;
  background-color: ${colors.fondo};
  background-image: ${({ src }) => (src ? `url(${src})` : 'none')};
  background-size: cover;
  background-position: center;
  border: 1px solid ${colors.panel};
`;

const UploadLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  color: ${colors.acento};
`;

const HiddenInput = styled.input`
  display: none;
`;

const Button = styled.button`
  background-color: ${colors.acento};
  border: none;
  color: white;
  font-weight: 600;
  padding: 1rem;
  border-radius: 0.75rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${colors.hover};
  }
`;

const Message = styled.p<{ error?: boolean }>`
  color: ${({ error }) => (error ? '#e03e3e' : '#4caf50')};
  font-weight: 600;
  font-size: 0.95rem;
`;

const CreateCategoryGroup: React.FC = () => {
  const [drawerExpanded, setDrawerExpanded] = useState(false);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();
  const { addCategory } = useCategoryStore();
  const { company } = useCompanyStore();

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Formato inválido. Usa JPG, PNG o WEBP.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('Tamaño máximo: 2MB.');
      return;
    }

    setImage(file);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim()) return setError('Nombre obligatorio.');
    if (!company?.id_company) return setError('Sesión inválida.');

    const formData = new FormData();
    formData.append('name', name.trim());
    formData.append('description', desc.trim() || name.trim());
    formData.append('company_id', company.id_company);
    formData.append('typeon', '2');
    if (image) formData.append('image', image);
    try {
      await addCategory(formData as any);
      setSuccess(`Grupo "${name}" creado correctamente.`);
      setName('');
      setDesc('');
      setImage(null);
      setPreview(null);
    } catch {
      setError('Error al crear el grupo.');
    }
  };

  return (
    <Layout>
      <Drawer
        expanded={drawerExpanded}
        onMouseEnter={() => setDrawerExpanded(true)}
        onMouseLeave={() => setDrawerExpanded(false)}
      >
        <DrawerItem onClick={() => navigate('/dashboard')}>
          <FaUsers />
          {drawerExpanded && 'Dashboard'}
        </DrawerItem>
        <DrawerItem onClick={() => navigate('/cliente/grupo')}>
          <FaComments />
          {drawerExpanded && 'Grupos'}
        </DrawerItem>
        <DrawerItem active>
          <FaComments />
          {drawerExpanded && 'Crear Grupo'}
        </DrawerItem>
      </Drawer>

      <Main>
        <Header>
          <BackButton onClick={() => navigate('/cliente/grupo')}>
            <FaArrowLeft />
          </BackButton>
          Crear Grupo de Clientes
        </Header>

        <Content>
          <Form onSubmit={handleSubmit} noValidate>
            <FormGroup>
              <Label htmlFor="name">Nombre del grupo</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: VIP, Mayoristas..."
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="desc">Descripción (opcional)</Label>
              <TextArea
                id="desc"
                rows={3}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Breve descripción del grupo"
              />
            </FormGroup>

            <FormGroup>
              <Label>Imagen del grupo</Label>
              <ImagePreview src={preview || undefined} />
              <HiddenInput
                id="image"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleImageChange}
              />
              <UploadLabel htmlFor="image">
                <FaUpload /> Subir imagen
              </UploadLabel>
            </FormGroup>

            {error && <Message error>{error}</Message>}
            {success && <Message>{success}</Message>}

            <Button type="submit">Crear Grupo</Button>
          </Form>
        </Content>
      </Main>
    </Layout>
  );
};

export default CreateCategoryGroup;
