import React, { useState } from "react";
import styled from "styled-components";
import {
  FaFolderPlus,
  FaHome,
  FaLayerGroup,
  FaPlus,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { createCategory } from "../../services/categoryServices";
import { useCompanyStore } from "../../stores/companyStore";
import { useCategoryStore } from "../../stores/categoryStore";

const colors = {
  fondo: "#0D0D11",
  panel: "#1A1A1F",
  texto: "#E8E8E8",
  secundario: "#888",
  acento: "#6B2233",
  inputBg: "#262630",
  inputBorder: "#444",
  inputFocusBorder: "#8e2a42",
};

const Layout = styled.div`
  display: flex;
  height: 100vh;
  background-color: ${colors.fondo};
  font-family: "Inter", sans-serif;
  color: ${colors.texto};
`;

const Drawer = styled.div<{ expanded: boolean }>`
  width: ${({ expanded }) => (expanded ? "220px" : "70px")};
  transition: width 0.3s;
  display: flex;
  flex-direction: column;
  padding: 1rem 0.5rem;
  background-color: ${colors.panel};
  box-shadow: 2px 0 6px rgba(0, 0, 0, 0.8);
`;

const DrawerItem = styled.div<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: ${({ active }) => (active ? colors.acento : colors.texto)};
  padding: 0.8rem 1rem;
  border-radius: 10px;
  cursor: pointer;
  margin-bottom: 0.5rem;
  background-color: ${({ active }) => (active ? "#291824" : "transparent")};
  font-weight: 600;
  font-size: 1.05rem;
  user-select: none;

  &:hover {
    background-color: #3a2234;
  }

  svg {
    min-width: 22px;
    min-height: 22px;
  }
`;

const Container = styled.div`
  flex: 1;
  padding: 3rem 4rem;
  overflow-y: auto;
  background: linear-gradient(135deg, #191919 0%, #1a1a1f 100%);
`;

const Title = styled.h2`
  font-size: 2.5rem;
  color: ${colors.acento};
  margin-bottom: 2.5rem;
  letter-spacing: 1px;
  text-shadow: 1px 1px 6px rgba(107, 34, 51, 0.8);
`;

const Form = styled.form`
  background: #24242a;
  padding: 3rem 3.5rem;
  border-radius: 1.2rem;
  max-width: 650px;
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.7);
  border: 1px solid #3a2234;
`;

const Label = styled.label`
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: ${colors.acento};
  font-size: 1.1rem;
  letter-spacing: 0.03em;
`;

const Input = styled.input`
  padding: 1rem 1.2rem;
  background: ${colors.inputBg};
  border: 1.8px solid ${colors.inputBorder};
  border-radius: 0.8rem;
  color: ${colors.texto};
  font-size: 1.1rem;
  transition: border-color 0.3s ease;
  font-family: "Inter", sans-serif;
  width: 100%;
  &:focus {
    border-color: ${colors.inputFocusBorder};
    outline: none;
    box-shadow: 0 0 8px ${colors.inputFocusBorder};
  }
`;

const TextArea = styled.textarea`
  padding: 1rem 1.2rem;
  background: ${colors.inputBg};
  border: 1.8px solid ${colors.inputBorder};
  border-radius: 0.8rem;
  color: ${colors.texto};
  font-size: 1.1rem;
  resize: vertical;
  font-family: "Inter", sans-serif;
  width: 100%;
  &:focus {
    border-color: ${colors.inputFocusBorder};
    outline: none;
    box-shadow: 0 0 8px ${colors.inputFocusBorder};
  }
`;

const FileInput = styled.input`
  margin-top: 0.5rem;
  color: ${colors.texto};
  font-size: 1rem;
`;

const Button = styled.button`
  padding: 1.2rem 0;
  background: ${colors.acento};
  border: none;
  border-radius: 1rem;
  color: white;
  font-weight: 700;
  font-size: 1.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  cursor: pointer;
  transition: background 0.3s ease;
  letter-spacing: 0.03em;

  &:hover {
    background: #8e2a42;
  }

  svg {
    min-width: 22px;
    min-height: 22px;
  }
`;

const Preview = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: 0.8rem;
  margin-top: 0.7rem;
  border: 1.2px solid ${colors.inputBorder};
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.7);
`;

const CreateInventoryGroup = () => {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [categoryType, setCategoryType] = useState("");
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
  const { company } = useCompanyStore();
  const {addCategory } = useCategoryStore();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!name.trim()) return alert("Nombre requerido");
  if (!categoryType.trim()) return alert("Tipo de categoría requerido");

  if (!company?.id_company) {
    return alert("Sesión inválida. Vuelve a iniciar sesión.");
  }
  const formData = new FormData();
  formData.append("name", name);
  formData.append("description", desc || categoryType);
  formData.append("company_id", company.id_company);
  if (image) {
    formData.append("image", image);
  }
  formData.append("typeon", '1');
  await addCategory(formData);
};
  return (
    <Layout>
      <Drawer
        expanded={drawerExpanded}
        onMouseEnter={() => setDrawerExpanded(true)}
        onMouseLeave={() => setDrawerExpanded(false)}
      >
        <DrawerItem
          onClick={() => navigate("/dashboard")}
          title="Dashboard"
          active={location.pathname === "/dashboard"}
        >
          <FaHome />
          {drawerExpanded && "Dashboard"}
        </DrawerItem>

        <DrawerItem
          onClick={() => navigate("/inventario/grupo")}
          title="Grupos"
          active={location.pathname === "/inventario/grupo"}
        >
          <FaLayerGroup />
          {drawerExpanded && "Grupos"}
        </DrawerItem>

        <DrawerItem
          onClick={() => navigate("/inventario/grupo/crear")}
          title="Crear Categoria"
          active={location.pathname === "/inventario/grupo/crear"}
        >
          <FaPlus />
          {drawerExpanded && "Crear Categoria"}
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
              spellCheck={false}
            />
          </div>

          <div>
            <Label>Tipo de categoría</Label>
            <Input
              placeholder="Ej: Hardware, Software, Servicios..."
              value={categoryType}
              onChange={(e) => setCategoryType(e.target.value)}
              spellCheck={false}
            />
          </div>

          <div>
            <Label>Descripción</Label>
            <TextArea
              rows={4}
              placeholder="Ej: Equipos electrónicos, gadgets, computadoras..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              spellCheck={false}
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
