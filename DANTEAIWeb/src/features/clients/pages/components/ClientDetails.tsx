import React, { useEffect, useState, type ChangeEvent } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaEdit, FaTrash, FaUpload } from "react-icons/fa";

import { API_AVATAR } from "../../../../services/routes/routesAPI";
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

// --- Estilos (puedes reutilizar los que ya tienes) ---

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
  color: ${colors.texto};
`;

const Avatar = styled.div<{ src?: string }>`
margin-top: 50px;
  width: 160px;
  height: 160px;
  border-radius: 1rem;
  background-color: #222;
  background-image: ${({ src }) => (src ? `url(${src})` : "none")};
  background-size: cover;
  background-position: center;
  margin-bottom: 1.5rem;
`;

const InfoBlock = styled.div`
  margin-bottom: 1.2rem;
  width: 250px;
`;

const Label = styled.span`
  font-weight: 600;
  font-size: 20px;
  color: ${colors.secundario};
`;

const Text = styled.p`
  margin: 0.3rem 0 0;
  font-size: 1rem;
    font-size: 20px;
    font-weight: bold;
  color: rgba(240,240,240,0.8);
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button<{ danger?: boolean }>`
  padding: 0.7rem 1.4rem;
  font-weight: 600;
  border-radius: 0.6rem;
  border: none;
  cursor: pointer;
  color: white;
  background-color: ${({ danger }) => (danger ? "#b83333" : colors.acento)};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ danger }) => (danger ? "#8a2525" : "#8e2a42")};
  }
`;

// Reutilizamos Inputs para edición
const Input = styled.input`
  background-color: ${colors.fondo};
  border: 1px solid ${colors.borde};
  color: ${colors.texto};
  padding: 0.75rem 1rem;
  border-radius: 0.6rem;
  width: 100%;
  margin-top: 0.3rem;
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
  margin-top: 0.3rem;
  width: 100%;
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
  margin-top: 0.3rem;
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

const ImagePreview = styled.div<{ src?: string }>`
  width: 120px;
  height: 120px;
  border-radius: 0.6rem;
  background-color: #1c1c1c;
  background-image: ${({ src }) => (src ? `url(${src})` : "none")};
  background-size: cover;
  background-position: center;
  border: 1px solid ${colors.borde};
  margin-top: 0.6rem;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const UploadLabel = styled.label`
  color: ${colors.acento};
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  gap: 0.5rem;
  align-items: center;
  font-size: 0.95rem;
  margin-top: 0.5rem;

  &:hover {
    text-decoration: underline;
  }
`;

/* Contenedor del modal o contenido principal para hacerlo más ancho */
const ContentContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  flex-direction: column;
  background-color: ${colors.panel};
  width: 100vw; /* ocupa el 90% del ancho de la ventana */
  height: 90vh;
  overflow: scroll;
  &::-webkit-scrollbar { display: none; }
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
`;
// ---------------------------------------

const ClientDetails: React.FC = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const { clients, fetchClients, updateClient, deleteClient } =
    useClientStore();

  const [client, setClient] = useState<(typeof clients)[0] | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

  // Form state for editing
  const [form, setForm] = useState({
    name: "",
    email: "",
    prefix: "+58",
    phone: "",
    address: "",
    document_type: "DNI",
    document_number: "",
    avatar: null as File | null,
    avatar_url: "", // for current avatar URL
  });

  useEffect(() => {
    if (!clients.length) {
      fetchClients();
    } else {
      const c = clients.find((cl) => cl.id === clientId) ?? null;
      setClient(c);
      if (c) {
        setForm({
          name: c.name ?? "",
          email: c.email ?? "",
          prefix: c.phone?.startsWith("+")
            ? c.phone.slice(
                0,
                c.phone.indexOf(c.phone.replace(/^\+\d+/, "") || "")
              )
            : "+58",
          phone: c.phone?.replace(/^\+\d+/, "") ?? "",
          address: c.address ?? "",
          document_type: c.document_type ?? "DNI",
          document_number: c.document_number ?? "",
          avatar: null,
          avatar_url: c.avatar ?? "",
        });
      }
      setLoading(false);
    }
  }, [clients, clientId, fetchClients]);

  // Mejorar extracción prefix y phone:
  useEffect(() => {
    if (client?.phone) {
      // Extraer prefijo y teléfono sin prefijo (asumiendo '+' al inicio y números)
      const match = client.phone.match(/^(\+\d{1,4})(.*)$/);
      if (match) {
        setForm((f) => ({ ...f, prefix: match[1], phone: match[2] }));
      }
    }
  }, [client]);

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
    if (!client) return;

    try {
      await updateClient(
        client.id,
        {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: `${form.prefix}${form.phone}`.trim(),
          address: form.address.trim(),
          document_type: form.document_type,
          document_number: form.document_number,
        },
        form.avatar ?? undefined
      );
      setEditing(false);
      setPreview(null);
    } catch (err) {
      setError("Error al actualizar el cliente.");
    }
  };

  const handleDelete = async () => {
    if (!client) return;
    if (!window.confirm("¿Está seguro que desea eliminar este cliente?"))
      return;

    try {
      await deleteClient(client.id);
      navigate(-1);
    } catch {
      setError("Error al eliminar el cliente.");
    }
  };

  if (loading) {
    return (
      <Layout>
        <Content>Cargando cliente...</Content>
      </Layout>
    );
  }

  if (!client) {
    return (
      <Layout>
        <Content>No se encontró el cliente.</Content>
      </Layout>
    );
  }
  return (
    <Layout>
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </BackButton>
        Detalle del cliente
        {!editing && (
          <ButtonGroup>
            <Button onClick={() => setEditing(true)}>
              <FaEdit /> Editar
            </Button>
            <Button danger onClick={handleDelete}>
              <FaTrash /> Eliminar
            </Button>
          </ButtonGroup>
        )}
      </Header>

      <ContentContainer>
        <Avatar
          src={
            preview ||
            (form.avatar_url ? `${API_AVATAR}${form.avatar_url}` : undefined)
          }
        />

        {!editing ? (
          <>
            <InfoBlock>
              <Label>Nombre completo:</Label>
              <Text>{client.name}</Text>
            </InfoBlock>
            <InfoBlock>
              <Label>Correo electrónico:</Label>
              <Text>{client.email}</Text>
            </InfoBlock>
            <InfoBlock>
              <Label>Teléfono:</Label>
              <Text>{client.phone || "-"}</Text>
            </InfoBlock>
            <InfoBlock>
              <Label>Dirección:</Label>
              <Text>{client.address || "-"}</Text>
            </InfoBlock>
            <InfoBlock>
              <Label>Tipo de documento:</Label>
              <Text>{client.document_type || "-"}</Text>
            </InfoBlock>
            <InfoBlock>
              <Label>Número de documento:</Label>
              <Text>{client.document_number || "-"}</Text>
            </InfoBlock>
          </>
        ) : (
          <>
            <InfoBlock>
              <Label>Nombre completo</Label>
              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Nombre"
              />
            </InfoBlock>
            <InfoBlock>
              <Label>Correo electrónico</Label>
              <Input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Correo"
              />
            </InfoBlock>
            <InfoBlock>
              <Label>Prefijo y teléfono</Label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <Select
                  name="prefix"
                  value={form.prefix}
                  onChange={handleChange}
                  style={{ width: "100px" }}
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
                </Select>
                <Input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Número de teléfono"
                />
              </div>
            </InfoBlock>
            <InfoBlock>
              <Label>Dirección</Label>
              <TextArea
                name="address"
                rows={3}
                value={form.address}
                onChange={handleChange}
                placeholder="Dirección del cliente"
              />
            </InfoBlock>
            <InfoBlock>
              <Label>Tipo de documento</Label>
              <Select
                name="document_type"
                value={form.document_type}
                onChange={handleChange}
              >
                <option value="DNI">DNI</option>
                <option value="RIF">RIF</option>
                <option value="Pasaporte">Pasaporte</option>
              </Select>
            </InfoBlock>
            <InfoBlock>
              <Label>Número de documento</Label>
              <Input
                name="document_number"
                value={form.document_number}
                onChange={handleChange}
                placeholder="Número de documento"
              />
            </InfoBlock>

            <InfoBlock>
              <Label>Avatar</Label>
              <div>
                <HiddenFileInput
                  id="upload-avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <UploadLabel htmlFor="upload-avatar">
                  <FaUpload /> Cambiar imagen
                </UploadLabel>
                {(preview || form.avatar_url) && (
                  <ImagePreview
                    src={preview || `${API_AVATAR}${form.avatar_url}`}
                  />
                )}
              </div>
            </InfoBlock>

            {error && (
              <p style={{ color: "tomato", marginTop: "0.5rem" }}>{error}</p>
            )}

            <ButtonGroup>
              <Button onClick={() => setEditing(false)} danger={false}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>Guardar</Button>
            </ButtonGroup>
          </>
        )}
      </ContentContainer>
    </Layout>
  );
};

export default ClientDetails;
