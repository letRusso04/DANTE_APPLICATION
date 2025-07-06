import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  FaPlus,
  FaHome,
  FaLayerGroup,
  FaSearch,
  FaDollarSign,
  FaBoxes,
} from "react-icons/fa";
import { useProductStore } from "../../../stores/productStore";
import { useCategoryStore } from "../../../stores/categoryStore"; // para cargar categorías
import { API_AVATAR } from "../../../services/routes/routesAPI";
import ProductCreateModal from "./CreateProduct";

const colors = {
  fondo: "#0D0D11",
  panel: "#1A1A1F",
  texto: "#E8E8E8",
  acento: "#6B2233",
  borde: "#2D2D2D",
  inputBg: "#262630",
  inputBorder: "#444",
  inputFocusBorder: "#8e2a42",
};

const Card = styled.div`
  background: ${colors.panel};
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
  display: flex;
  flex-direction: column;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);

  &:hover {
    transform: translateY(-8px);
  }

  img {
    width: 100%;
    height: 190px;
    object-fit: cover;
    border-bottom: 3px solid #2e8b57; /* verde oscuro */
  }
  & > div {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
`;

const ProductName = styled.h4`
  padding: 5px;
  color: #e6f2e6; /* blanco verdoso suave */
  font-weight: 700;
  font-size: 1.5rem;
  margin-bottom: 0.8rem;
  letter-spacing: 0.04em;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
`;

const Description = styled.p`
  padding: 5px;

  font-size: 1rem;
  color: #a3bfa3; /* verde claro */
  margin-bottom: 1.3rem;
  flex-grow: 1;
  line-height: 1.3;
`;

const PriceTag = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  background: #3cb371; /* MediumSeaGreen */
  color: white;
  font-weight: 700;
  font-size: 1.15rem;

  user-select: none;
  svg {
    font-size: 1.8rem;
    margin-bottom: 2px;
  }
`;

const StockInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 0.6rem;
  color: #2f855a; /* verde oscuro */
  font-weight: 600;
  font-size: 1.1rem;
  background: #d1e7d1; /* verde muy claro */
  padding: 0.5rem 1rem;
  user-select: none;
  svg {
    font-size: 1.4rem;
    color: #276749; /* verde oscuro más fuerte */
  }
`;

const Layout = styled.div`
  display: flex;
  height: 100vh;
  background: ${colors.fondo};
  font-family: "Roboto", "Helvetica Neue", Helvetica, Arial, sans-serif;
`;

const Drawer = styled.div<{ expanded: boolean }>`
  width: ${({ expanded }) => (expanded ? "220px" : "70px")};
  background-color: ${colors.panel};
  transition: width 0.3s;
  display: flex;
  flex-direction: column;
  padding: 1rem 0.5rem;
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

const Content = styled.div`
  flex: 1;
  padding: 2.5rem;
  color: ${colors.texto};
  overflow-y: auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  color: ${colors.acento};
  font-size: 2rem;
`;

const AddBtn = styled.button`
  background: ${colors.acento};
  color: white;
  padding: 0.7rem 1.2rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: background 0.3s ease;

  &:hover {
    background: #8e2a42;
  }
`;

const SearchContainer = styled.div`
  margin-top: 1rem;
  background: ${colors.inputBg};
  padding: 0.5rem 1rem;
  border-radius: 10px;
  border: 1.8px solid ${colors.inputBorder};
  display: flex;
  align-items: center;
  max-width: 400px;

  &:focus-within {
    border-color: ${colors.inputFocusBorder};
    box-shadow: 0 0 8px ${colors.inputFocusBorder};
  }

  svg {
    color: #888;
    margin-right: 0.7rem;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  color: ${colors.texto};
  font-size: 1rem;
  outline: none;

  &::placeholder {
    color: #666;
  }
`;

const Grid = styled.div`
  display: grid;
  margin-top: 2rem;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.5rem;
`;

export default function ProductsByCategory() {
  const navigate = useNavigate();
  const location = useLocation();
  const { categoryId } = useParams<{ categoryId: string }>();
  const { products, fetchProductsByCategory, create } = useProductStore();

  const [drawerExpanded, setDrawerExpanded] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: categoryId || "",
    image: null as File | null,
  });

  useEffect(() => {
    if (categoryId) fetchProductsByCategory(categoryId);
  }, [categoryId, fetchProductsByCategory]);

  // Filtrar productos por búsqueda
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // Manejar cambios del formulario
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "image") {
      const target = e.target as HTMLInputElement;
      const files = target.files;
      if (files && files.length > 0) {
        setFormData({ ...formData, image: files[0] });
      }
      return;
    }

    if (name === "price" || name === "stock") {
      let validValue = value;

      if (name === "price") {
        if (/^\d*\.?\d*$/.test(value)) {
          validValue = value;
        } else return;
      } else if (name === "stock") {
        if (/^\d*$/.test(value)) {
          validValue = value;
        } else return;
      }

      setFormData({ ...formData, [name]: validValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validar aquí si quieres...

    // Preparar FormData para enviar
    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("stock", formData.stock);
    data.append("category_id", formData.categoryId);
    if (formData.image) data.append("image", formData.image);

    const success = await create(data);

    if (success) {
      setModalOpen(false);
      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
        categoryId: categoryId || "",
        image: null,
      });
      if (categoryId) fetchProductsByCategory(categoryId);
    } else {
      alert("Error al crear el producto");
    }
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
          active={location.pathname === "/dashboard"}
        >
          <FaHome />
          {drawerExpanded && "Dashboard"}
        </DrawerItem>

        <DrawerItem
          onClick={() => navigate("/inventario/grupo")}
          active={location.pathname === "/inventario/grupo"}
        >
          <FaLayerGroup />
          {drawerExpanded && "Grupos"}
        </DrawerItem>

        <DrawerItem
          onClick={() => navigate("/inventario/grupo/crear")}
          active={location.pathname === "/inventario/grupo/crear"}
        >
          <FaPlus />
          {drawerExpanded && "Crear Categoria"}
        </DrawerItem>
      </Drawer>

      <Content>
        <Header>
          <Title>Productos</Title>
          <AddBtn onClick={() => setModalOpen(true)}>
            <FaPlus /> Añadir producto
          </AddBtn>
        </Header>

        <SearchContainer>
          <FaSearch />
          <SearchInput
            placeholder="Buscar producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </SearchContainer>
        <Grid>
          {filteredProducts.length === 0 ? (
            <p
              style={{
                gridColumn: "1 / -1",
                color: "#bbb",
                textAlign: "center",
                fontSize: 30,
              }}
            >
              No hay productos para esta categoría.
            </p>
          ) : (
            filteredProducts.map((prod) => (
              <Card
                key={prod.id_product}
                onClick={() => navigate(`/producto/${prod.id_product}`)}
              >
                {prod.image && (
                  <img src={`${API_AVATAR}${prod.image}`} alt={prod.name} />
                )}
                <div>
                  <ProductName>{prod.name}</ProductName>
                  <Description>{prod.description}</Description>

                  <PriceTag>
                    <FaDollarSign />
                    {prod.price.toFixed(2)}
                  </PriceTag>

                  <StockInfo>
                    <FaBoxes />
                    {prod.stock} disponibles
                  </StockInfo>
                </div>
              </Card>
            ))
          )}
        </Grid>

        {/* Modal Crear Producto */}
        {modalOpen && (
          <ProductCreateModal onClose={() => setModalOpen(false)} />
        )}
      </Content>
    </Layout>
  );
}
