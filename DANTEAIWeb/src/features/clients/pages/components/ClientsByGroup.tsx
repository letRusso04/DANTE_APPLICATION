import React, { useEffect, useState, type ChangeEvent } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaSearch, FaPlus, FaUpload } from "react-icons/fa";

import { API_AVATAR } from "../../../../services/routes/routesAPI";
import { useCompanyStore } from "../../../../stores/companyStore";
import { useClientStore } from "../../../../stores/clientStore";

const colors = {
  fondo: "#0D0D11",
  panel: "#1A1A1F",
  texto: "#E8E8E8",
  secundario: "#AAA",
  acento: "#6B2233",
  header: "#1F1F23",
  borde: "#2C2C34",
};

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(2px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background-color: ${colors.panel};
  padding: 2.5rem;
  border-radius: 1.2rem;
  width: 95%;
  max-width: 560px;
  animation: fadeIn 0.3s ease-out;
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.97);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const ModalTitle = styled.h2`
  color: ${colors.texto};
  font-size: 1.35rem;
  font-weight: 700;
  margin: 0;
  text-align: center;
`;

const FormGrid = styled.div`
  display: grid;
  gap: 1.2rem;

  @media (min-width: 600px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 599px) {
    grid-template-columns: 1fr;
  }
`;

const FullInput = styled.div`
  grid-column: span 2;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    color: ${colors.secundario};
    font-weight: 600;
    font-size: 0.95rem;
  }
`;

const HalfInput = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    color: ${colors.secundario};
    font-weight: 600;
    font-size: 0.95rem;
  }
`;

const ImageBlock = styled(FullInput)`
  align-items: flex-start;
`;

const UploadWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const UploadLabel = styled.label`
  color: ${colors.acento};
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  gap: 0.5rem;
  align-items: center;
  font-size: 0.95rem;

  &:hover {
    text-decoration: underline;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const ImagePreview = styled.div<{ src?: string }>`
  width: 100px;
  height: 100px;
  border-radius: 0.6rem;
  background-color: #1c1c1c;
  background-image: ${({ src }) => (src ? `url(${src})` : "none")};
  background-size: cover;
  background-position: center;
  border: 1px solid ${colors.borde};
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const CancelButton = styled.button`
  background: transparent;
  color: ${colors.secundario};
  border: none;
  padding: 0.7rem 1rem;
  font-weight: 600;
  cursor: pointer;
`;

const SaveButton = styled.button`
  background-color: ${colors.acento};
  color: white;
  border: none;
  padding: 0.7rem 1.4rem;
  border-radius: 0.6rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background-color: #8e2a42;
  }
`;
const Layout = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${colors.fondo};
  font-family: "Inter", sans-serif;
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
  justify-content: space-between;
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
  padding: 2rem 3rem;
  flex: 1;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background-color: ${colors.panel};
  padding: 0.6rem 1rem;
  border-radius: 0.7rem;
  margin-bottom: 1.8rem;
`;

const SearchInput = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  color: ${colors.texto};
  font-size: 1rem;
  margin-left: 0.6rem;
  &:focus {
    outline: none;
  }
`;

const ClientsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.5rem;
`;

const ClientCard = styled.div`
  background-color: ${colors.panel};
  padding: 1.2rem;
  border-radius: 0.8rem;
  display: flex;
  gap: 1rem;
  align-items: center;
  color: ${colors.texto};
  cursor: pointer;
  transition: 300ms;
  &:hover{

    transform: translateY(-10px);
  }
`;

const Avatar = styled.div<{ src?: string }>`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: #222;
  background-image: ${({ src }) => (src ? `url(${src})` : "none")};
  background-size: cover;
  background-position: center;
`;

const Info = styled.div`
  flex: 1;
`;

const Name = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
`;

const Email = styled.p`
  font-size: 0.9rem;
  color: ${colors.secundario};
  margin: 0.2rem 0 0;
`;

const AddButton = styled.button`
  background-color: ${colors.acento};
  border: none;
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 0.7rem;
  font-size: 0.95rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;

  &:hover {
    background-color: #8e2a42;
  }
`;

const Input = styled.input`
  background-color: ${colors.fondo};
  border: 1px solid ${colors.borde};
  color: ${colors.texto};
  padding: 0.75rem 1rem;
  border-radius: 0.6rem;
  width: 100%;
  &:focus {
    outline: none;
    border-color: ${colors.acento};
  }
`;

const TextArea = styled.textarea`
  background-color: ${colors.fondo};
  border: 1px solid ${colors.borde};
  color: ${colors.texto};
  padding: 0.75rem 1rem;
  border-radius: 0.6rem;
  resize: vertical;
  &:focus {
    outline: none;
    border-color: ${colors.acento};
  }
`;

const Select = styled.select`
  background-color: ${colors.fondo};
  border: 1px solid ${colors.borde};
  color: ${colors.texto};
  padding: 0.75rem 1rem;
  border-radius: 0.6rem;
  width: 100%;
  font-size: 1rem;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg fill='%236B2233' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7 10l5 5 5-5H7z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1rem;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${colors.acento};
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 1rem;
  align-items: end;
`;

const PrefixSelect = styled.select`
  background-color: ${colors.fondo};
  border: 1px solid ${colors.borde};
  color: ${colors.texto};
  padding: 0.75rem 1rem;
  border-radius: 0.6rem;
  font-size: 1rem;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg fill='%236B2233' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7 10l5 5 5-5H7z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.8rem center;
  background-size: 1rem;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${colors.acento};
  }
`;

const ClientsByGroup: React.FC = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { company } = useCompanyStore();
  const { clients, fetchClients, addClient } = useClientStore();

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    prefix: "+58",
    phone: "",
    address: "",
    document_type: "DNI",
    document_number: "",
    avatar: null as File | null,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (company?.id_company) {
      fetchClients();
    }
  }, [company]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((f) => ({ ...f, avatar: file }));
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setError("");

    if (!form.name.trim() || !form.email.trim()) {
      setError("Nombre y correo son obligatorios.");
      return;
    }

    try {
      await addClient(
        {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: `${form.prefix}${form.phone}`.trim(),
          address: form.address.trim(),
          document_type: form.document_type,
          document_number: form.document_number,
          category_id: groupId,
        },
        form.avatar ?? undefined 
      );

      setModalOpen(false);
      setPreview(null);
      setForm({
        name: "",
        email: "",
        prefix: "+58",
        phone: "",
        address: "",
        document_type: "DNI",
        document_number: "",
        avatar: null,
      });
    } catch (err) {
      setError("Error al guardar el cliente.");
    }
  };

  const filtered = clients.filter(
    (c) =>
      c.category_id === groupId &&
      (c.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.email?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Layout>
      <Header>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <BackButton onClick={() => navigate("/cliente/grupo")}>
            <FaArrowLeft />
          </BackButton>
          Clientes del grupo
        </div>
        <AddButton onClick={() => setModalOpen(true)}>
          <FaPlus />
          Añadir cliente
        </AddButton>
      </Header>

      <Content>
        <SearchBar>
          <FaSearch color={colors.secundario} />
          <SearchInput
            type="text"
            placeholder="Buscar cliente por nombre o correo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </SearchBar>

        <ClientsGrid>
          {filtered.map((client) => (
            <ClientCard key={client.id} onClick={() => navigate(`/cliente/${client.id}`)}>
              <Avatar
                src={client.avatar ? `${API_AVATAR}${client.avatar}` : undefined}
              />
              <Info>
                <Name>{client.name}</Name>
                <Email>{client.email}</Email>
              </Info>
            </ClientCard>
          ))}
        </ClientsGrid>
      </Content>

      {modalOpen && (
        <ModalOverlay>
          <ModalContainer>
            <ModalTitle>Registrar nuevo cliente</ModalTitle>

            {error && (
              <p style={{ color: "tomato", textAlign: "center", margin: 0 }}>
                {error}
              </p>
            )}

            <FormGrid>
              <FullInput>
                <label>Nombre completo</label>
                <Input
                  name="name"
                  placeholder="Nombre"
                  value={form.name}
                  onChange={handleChange}
                />
              </FullInput>

              <FullInput>
                <label>Correo electrónico</label>
                <Input
                  name="email"
                  placeholder="Correo"
                  value={form.email}
                  onChange={handleChange}
                />
              </FullInput>

              <FullInput>
                <FormRow>
                  <PrefixSelect
                    name="prefix"
                    value={form.prefix}
                    onChange={handleChange}
                  >
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+52">🇲🇽 +52</option>
                    <option value="+54">🇦🇷 +54</option>
                    <option value="+57">🇨🇴 +57</option>
                    <option value="+58">🇻🇪 +58</option>
                    <option value="+56">🇨🇱 +56</option>
                    <option value="+51">🇵🇪 +51</option>
                    <option value="+55">🇧🇷 +55</option>
                    <option value="+53">🇨🇺 +53</option>
                    <option value="+502">🇬🇹 +502</option>
                  </PrefixSelect>

                  <Input
                    name="phone"
                    type="tel"
                    placeholder="Número de teléfono"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </FormRow>
              </FullInput>

              <FullInput>
                <FormRow>
                  <HalfInput>
                    <label>Tipo de documento</label>
                    <Select
                      name="document_type"
                      value={form.document_type}
                      onChange={handleChange}
                    >
                      <option value="DNI">DNI</option>
                      <option value="RIF">RIF</option>
                      <option value="Pasaporte">Pasaporte</option>
                    </Select>
                  </HalfInput>

                  <HalfInput>
                    <label>Número de documento</label>
                    <Input
                      name="document_number"
                      placeholder="Número"
                      value={form.document_number}
                      onChange={handleChange}
                    />
                  </HalfInput>
                </FormRow>
              </FullInput>

              <FullInput>
                <label>Dirección</label>
                <TextArea
                  name="address"
                  rows={2}
                  placeholder="Dirección del cliente"
                  value={form.address}
                  onChange={handleChange}
                />
              </FullInput>

              <ImageBlock>
                <label>Avatar del cliente</label>
                <UploadWrapper>
                  <HiddenFileInput
                    id="upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <UploadLabel htmlFor="upload">
                    <FaUpload /> Subir imagen
                  </UploadLabel>
                  {preview && <ImagePreview src={preview} />}
                </UploadWrapper>
              </ImageBlock>
            </FormGrid>

            <ButtonGroup>
              <CancelButton onClick={() => setModalOpen(false)}>
                Cancelar
              </CancelButton>
              <SaveButton onClick={handleSave}>Guardar</SaveButton>
            </ButtonGroup>
          </ModalContainer>
        </ModalOverlay>
      )}
    </Layout>
  );
};

export default ClientsByGroup;
