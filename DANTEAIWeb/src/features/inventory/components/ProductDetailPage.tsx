import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import {
  FaEdit,
  FaBox,
  FaDollarSign,
  FaBoxes,
  FaTrashAlt,
  FaCheck,
  FaTimes,
  FaHome,
  FaLayerGroup,
  FaPlus,
} from 'react-icons/fa';
import { API_AVATAR } from '../../../services/routes/routesAPI';
import { useProductStore } from '../../../stores/productStore';

const fadeIn = keyframes`
  from {opacity: 0;}
  to {opacity: 1;}
`;

const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  background: #121214;  /* fondo oscuro más neutro */
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #e1e1e6;
  animation: ${fadeIn} 0.6s ease forwards;
`;

const Drawer = styled.div<{ expanded: boolean }>`
  width: ${({ expanded }) => (expanded ? '220px' : '70px')};
  background-color: #1f1f23;  /* gris oscuro */
  transition: width 0.3s;
  display: flex;
  flex-direction: column;
  padding: 1rem 0.5rem;
  border-right: 1px solid #2c2c31;
  user-select: none;
`;

const DrawerItem = styled.div<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: ${({ active }) => (active ? '#4ade80' : '#a1a1aa')};
  background-color: ${({ active }) => (active ? '#262626' : 'transparent')};
  padding: 0.75rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 0.4rem;
  font-weight: 600;
  font-size: 1rem;
  transition: background-color 0.2s ease, color 0.2s ease;

  &:hover {
    background-color: #333336;
    color: #4ade80;
  }

  svg {
    min-width: 20px;
    font-size: 1.2rem;
  }
`;

const Content = styled.main`
  flex: 1;
  padding: 3rem 3.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 2.6rem;
  color: #4ade80;  /* verde profesional */
  font-weight: 700;
  letter-spacing: 0.04em;
  margin-bottom: 2rem;
  text-align: center;
`;

const ProductImage = styled.img`
  width: 400px;
  max-height: 420px;
  object-fit: contain;
  border-radius: 12px;
  border: 2px solid #4ade80;
  margin-bottom: 2.5rem;
  user-select: none;
`;

const DetailCard = styled.div`
  background: #1e1e22;  /* gris muy oscuro */
  border-radius: 12px;
  padding: 2rem 2.5rem;
  width: 100%;
  max-width: 720px;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  user-select: none;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.15rem;
  color: #c4c4c8;

  svg {
    color: #86efac;  /* verde suave */
    font-size: 1.5rem;
    flex-shrink: 0;
    user-select: none;
  }

  span {
    font-weight: 600;
    flex-shrink: 0;
    user-select: none;
    min-width: 110px;
  }

  p {
    flex-grow: 1;
    user-select: text;
    margin: 0;
    line-height: 1.4;
    color: #e1e1e6;
  }
`;

const StockControl = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Input = styled.input`
  width: 100px;
  padding: 0.5rem 1rem;
  font-size: 1.1rem;
  border-radius: 8px;
  border: 1.5px solid #4ade80;
  background: #2c2c30;
  color: #e1e1e6;
  font-weight: 600;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #22c55e;
    outline: none;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button<{ danger?: boolean }>`
  background: ${({ danger }) => (danger ? '#b91c1c' : '#22c55e')};
  color: white;
  border: none;
  border-radius: 10px;
  padding: 0.6rem 1.6rem;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s ease;
  user-select: none;

  &:hover {
    background: ${({ danger }) => (danger ? '#ef4444' : '#4ade80')};
  }

  &:active {
    transform: scale(0.98);
  }

  svg {
    font-size: 1.2rem;
  }
`;

const Message = styled.div`
  margin-top: 1rem;
  font-size: 1rem;
  color: #f87171;
  font-weight: 600;
  text-align: center;
  user-select: none;
`;

export default function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { getById, update, remove } = useProductStore();

  const [product, setProduct] = useState<any>(null);
  const [editingStock, setEditingStock] = useState(false);
  const [newStock, setNewStock] = useState('');
  const [error, setError] = useState('');
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [drawerExpanded, setDrawerExpanded] = useState(false);

  useEffect(() => {
  
    if (productId) {
      getById(productId).then(setProduct);
    }
  }, [productId, getById]);

  const handleStockUpdate = async () => {
    setError('');
    if (newStock === '') {
      setError('El stock no puede estar vacío');
      return;
    }
    if (!Number.isInteger(Number(newStock)) || Number(Number(newStock)) < 0) {
      setError('El stock debe ser un número entero mayor o igual a 0');
      return;
    }
    const formData = new FormData();
    formData.append('stock', newStock);

    const success = await update(productId!, formData);
    if (success) {
      setProduct({ ...product, stock: Number(newStock) });
      setEditingStock(false);
    } else {
      setError('Error al actualizar stock. Intente de nuevo.');
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        '¿Seguro que deseas eliminar este producto? Esta acción no se puede deshacer.'
      )
    )
      return;
    setLoadingDelete(true);
    const success = await remove(productId!);
    setLoadingDelete(false);

    if (success) {
      navigate('/inventario/grupo');
    } else {
      setError('Error al eliminar producto. Intente más tarde.');
    }
  };

  if (!product) return <Container>Cargando producto...</Container>;

  return (
    <Container>
      <Drawer
        expanded={drawerExpanded}
        onMouseEnter={() => setDrawerExpanded(true)}
        onMouseLeave={() => setDrawerExpanded(false)}
      >
        <DrawerItem
          onClick={() => navigate('/dashboard')}
          active={location.pathname === '/dashboard'}
        >
          <FaHome />
          {drawerExpanded && 'Dashboard'}
        </DrawerItem>

        <DrawerItem
          onClick={() => navigate('/inventario/grupo')}
          active={location.pathname === '/inventario/grupo'}
        >
          <FaLayerGroup />
          {drawerExpanded && 'Grupos'}
        </DrawerItem>

        <DrawerItem
          onClick={() => navigate('/inventario/grupo/crear')}
          active={location.pathname === '/inventario/grupo/crear'}
        >
          <FaPlus />
          {drawerExpanded && 'Crear Categoría'}
        </DrawerItem>
      </Drawer>

      <Content>
        {product.image && (
          <ProductImage src={`${API_AVATAR}${product.image}`} alt={product.name} />
        )}
        <Title>{product.name}</Title>
        <DetailCard>
          <InfoRow>
            <FaDollarSign />
            <span>Precio:</span>
            <p>${product.price?.toFixed(2)}</p>
          </InfoRow>

          <InfoRow>
            <FaBox />
            <span>Descripción:</span>
            <p>{product.description || 'Sin descripción'}</p>
          </InfoRow>

          <InfoRow>
            <FaBoxes />
            <span>Stock:</span>
            <StockControl>
              {editingStock ? (
                <>
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    autoFocus
                  />
                  <Button onClick={handleStockUpdate}>
                    <FaCheck /> Guardar
                  </Button>
                  <Button danger onClick={() => { setEditingStock(false); setError(''); }}>
                    <FaTimes /> Cancelar
                  </Button>
                </>
              ) : (
                <>
                  <p>{product.stock}</p>
                  <Button
                    onClick={() => {
                      setNewStock(product.stock?.toString() || '');
                      setEditingStock(true);
                      setError('');
                    }}
                  >
                    <FaEdit /> Editar
                  </Button>
                </>
              )}
            </StockControl>
          </InfoRow>

          {error && <Message>{error}</Message>}

          <Button
            danger
            onClick={handleDelete}
            disabled={loadingDelete}
            style={{ marginTop: '2rem', alignSelf: 'center', maxWidth: '240px' }}
          >
            <FaTrashAlt />
            {loadingDelete ? 'Eliminando...' : 'Eliminar producto'}
          </Button>
        </DetailCard>
      </Content>
    </Container>
  );
}
