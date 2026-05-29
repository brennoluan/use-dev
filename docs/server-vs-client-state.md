# Separando Server State de Client State

## 🎯 O Problema Fundamental

Muitos desenvolvedores tratam **dados da API** da mesma forma que **estado da interface**, colocando tudo em Context ou Redux. Isso cria problemas graves de:

- ❌ Cache duplicado e desatualizado
- ❌ Refetch manual e complexo
- ❌ Re-renders desnecessários
- ❌ Lógica de sincronização espalhada

---

## 🧬 As Duas Naturezas do Estado

### ☁️ Server State (Estado do Servidor)

**Definição:** Dados que **pertencem ao servidor** e são temporariamente "emprestados" ao cliente.

**Características:**

- 📡 **Fonte da verdade**: Backend (você não controla)
- ⏰ **Stale (desatualizado)**: Pode mudar a qualquer momento no servidor
- 🔄 **Precisa refetch**: Sincronização constante
- 💾 **Cache temporário**: Dados ficam obsoletos
- 🌐 **Compartilhado**: Múltiplos usuários veem o mesmo dado
- ⚡ **Assíncrono**: Loading, error, success states

**Exemplos na loja Use Dev:**

```
✓ Lista de produtos (GET /products)
✓ Detalhes do produto (GET /products/:id)
✓ Categorias (GET /categories)
```

---

### 🖥️ Client State (Estado do Cliente)

**Definição:** Dados que **pertencem ao cliente** e controlam a interface/experiência.

**Características:**

- 🎨 **Fonte da verdade**: Frontend (você controla)
- ⏱️ **Sempre fresh**: Você decide quando muda
- 🚫 **Não precisa refetch**: Não há servidor pra sincronizar
- 🗑️ **Efêmero**: Reseta ao recarregar (ou persiste em localStorage)
- 👤 **Específico do usuário**: Cada sessão é independente
- ⚡ **Síncrono**: Muda instantaneamente

**Exemplos na loja Use Dev:**

```
✓ Carrinho de compras (local ou sincronizado)
✓ Wishlist/favoritos (IDs salvos)
✓ Tema dark/light
✓ Sidebar aberto/fechado
✓ Modal de zoom de imagem
✓ Filtros aplicados (se não estiverem na URL)
✓ Input de busca (valor temporário)
```

---

## 🚨 O Anti-Pattern: Tudo no Context

### ❌ Código Problemático

```tsx
// ❌ NÃO FAÇA ISSO - Misturando tudo no Context
const AppContext = createContext({
  // Server State (deveria ser React Query)
  products: [],
  isLoadingProducts: false,
  productsError: null,
  fetchProducts: () => {},

  // Client State (OK no Context, mas misturado)
  cartItems: [],
  theme: "light",
  isSidebarOpen: false,
});

function ProductsPage() {
  const { products, isLoadingProducts, fetchProducts } = useContext(AppContext);

  useEffect(() => {
    fetchProducts(); // Manual, sem cache
  }, []);

  // PROBLEMAS:
  // 1. ❌ Sem cache: sair e voltar = fetch novamente
  // 2. ❌ Sem stale time: não sabe quando revalidar
  // 3. ❌ Refetch manual: você precisa chamar fetchProducts()
  // 4. ❌ Re-render global: mudar theme re-renderiza produtos
  // 5. ❌ Duplicação: múltiplas tabs fazem fetches independentes
  // 6. ❌ Race conditions: requests concorrentes podem conflitar
  // 7. ❌ Sem retry: falha = você trata manualmente
  // 8. ❌ Sem deduplication: 5 componentes = 5 fetches simultâneos
}
```

**Por que isso é ruim?**

| Problema                     | Consequência                                 |
| ---------------------------- | -------------------------------------------- |
| **Cache manual**             | Você precisa implementar lógica de expiração |
| **Stale data**               | Usuário vê dados desatualizados sem saber    |
| **Loading global**           | Toda a UI trava durante fetch                |
| **Error handling espalhado** | Cada componente trata erro diferente         |
| **Race conditions**          | Request antigo pode sobrescrever novo        |
| **Memory leaks**             | Fetches não cancelados ao desmontar          |

---

## ✅ A Solução: Separação de Responsabilidades

### 📦 Arquitetura Correta

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  APLICAÇÃO REACT                                │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │                                           │ │
│  │  ☁️ SERVER STATE                          │ │
│  │  (TanStack Query / SWR)                   │ │
│  │                                           │ │
│  │  • products (cache 5min)                  │ │
│  │  • stock (cache 30s)                      │ │
│  │  • reviews (cache 10min)                  │ │
│  │  • categories (cache 1h)                  │ │
│  │                                           │ │
│  │  Gerencia: cache, refetch, invalidação   │ │
│  │                                           │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │                                           │ │
│  │  🖥️ CLIENT STATE                          │ │
│  │  (Context / Zustand / Local)              │ │
│  │                                           │ │
│  │  • cartItems (Context + localStorage)    │ │
│  │  • wishlist (Context)                     │ │
│  │  • theme (Context + localStorage)         │ │
│  │  • modalOpen (useState)                   │ │
│  │                                           │ │
│  │  Gerencia: UI, preferências, interações  │ │
│  │                                           │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 🔄 Propriedades do Server State

### 1️⃣ Staleness (Obsolescência)

```tsx
// TanStack Query gerencia automaticamente
const { data: products } = useQuery({
  queryKey: ["products"],
  queryFn: fetchProducts,
  staleTime: 5 * 60 * 1000, // 5 minutos
});

// Comportamento:
// t=0s:   Fetch inicial → data fresh
// t=30s:  Usuário navega → usa cache (fresh)
// t=5min: Data fica stale (mas ainda mostra)
// t=5min: Próximo mount → refetch em background
```

**Conceitos:**

- **Fresh**: Dado é considerado atual (não precisa refetch)
- **Stale**: Dado pode estar desatualizado (refetch em background)
- **Inactive**: Ninguém está usando (será removido após cacheTime)

---

### 2️⃣ Cache Time vs Stale Time

```tsx
useQuery({
  queryKey: ["products"],
  queryFn: fetchProducts,
  staleTime: 5 * 60 * 1000, // Considera fresh por 5 min
  cacheTime: 10 * 60 * 1000, // Mantém em cache por 10 min
});
```

| Tempo   | staleTime | cacheTime | Comportamento                  |
| ------- | --------- | --------- | ------------------------------ |
| 0-5min  | Fresh     | Cached    | Usa cache sem refetch          |
| 5-10min | Stale     | Cached    | Usa cache + refetch background |
| 10min+  | -         | Removed   | Fetch completo                 |

---

### 3️⃣ Refetch Automático

```tsx
const { data, refetch } = useQuery({
  queryKey: ["stock", productId],
  queryFn: () => fetchStock(productId),
  refetchOnWindowFocus: true, // Volta pra aba → refetch
  refetchOnReconnect: true, // Reconecta internet → refetch
  refetchInterval: 30 * 1000, // Refetch a cada 30s (polling)
});
```

**Casos de uso:**

- **Window focus**: Usuário volta à aba (pode ter mudado no servidor)
- **Reconnect**: Internet voltou (sincronizar dados)
- **Interval**: Dados mudam frequentemente (ex: estoque, preços)

---

### 4️⃣ Invalidação de Cache

```tsx
// Ao adicionar review, invalida cache de reviews
const mutation = useMutation({
  mutationFn: addReview,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
    // Força refetch automático de todas as queries com essa key
  },
});
```

**Estratégias:**

- **Invalidação total**: `invalidateQueries(['products'])`
- **Invalidação seletiva**: `invalidateQueries(['products', { category: 'shoes' }])`
- **Invalidação em cascata**: Mudar produto → invalida reviews + stock

---

### 5️⃣ Background Refetch

```tsx
// UX suave: mostra dado antigo enquanto atualiza
const { data, isFetching, isLoading } = useQuery({
  queryKey: ["products"],
  queryFn: fetchProducts,
});

// isLoading: true apenas no PRIMEIRO fetch (sem cache)
// isFetching: true sempre que está buscando (mesmo com cache)

// ✅ Usuário vê dados imediatamente (cache)
// ✅ Loading discreto no canto (isFetching)
// ✅ Atualiza silenciosamente quando pronto
```

---

## 🎯 Decisão Rápida: Server ou Client?

```
┌─────────────────────────────────────────┐
│ Esse dado vem de uma API/Backend?       │
└─────────────────────────────────────────┘
         │
         ↓
    ┌────┴────┐
    │   SIM   │ → ☁️ SERVER STATE
    └────┬────┘    • TanStack Query
         │         • SWR
         │         • RTK Query
         │
    ┌────┴────┐
    │   NÃO   │ → 🖥️ CLIENT STATE
    └────┬────┘    • Context API
         │         • Zustand
         │         • useState
```

### Casos Híbridos

**Carrinho Sincronizado:**

```tsx
// ☁️ SERVER STATE: Carrinho no backend
const { data: serverCart } = useQuery({
  queryKey: ["cart"],
  queryFn: fetchCart,
});

// 🖥️ CLIENT STATE: Otimistic updates locais
const [optimisticCart, setOptimisticCart] = useState(serverCart);

// Mutação otimista
const addToCart = useMutation({
  mutationFn: addItemToCart,
  onMutate: async (newItem) => {
    // Atualiza UI imediatamente
    setOptimisticCart((prev) => [...prev, newItem]);
  },
  onError: (err, newItem, context) => {
    // Rollback se falhar
    setOptimisticCart(serverCart);
  },
});
```

---

## 📊 Comparação: useState vs TanStack Query

### Cenário: Buscar lista de produtos

#### ❌ Com useState (manual)

```tsx
function ProductList() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    setIsLoading(true);
    axios
      .get("/api/products")
      .then((res) => {
        if (!cancelled) {
          setProducts(res.data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading) return <Spinner />;
  if (error) return <Error message={error} />;

  return <ProductGrid products={products} />;
}

// PROBLEMAS:
// • 30 linhas de boilerplate
// • Sem cache (sair e voltar = fetch novamente)
// • Sem retry (falhou = fim)
// • Sem refetch em background
// • Race condition manual
// • Cleanup manual
```

#### ✅ Com TanStack Query

```tsx
function ProductList() {
  const {
    data: products,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: () => axios.get("/api/products").then((res) => res.data),
    staleTime: 5 * 60 * 1000,
    retry: 3,
  });

  if (isLoading) return <Spinner />;
  if (error) return <Error message={error.message} />;

  return <ProductGrid products={products} />;
}

// BENEFÍCIOS:
// • 8 linhas de código
// • Cache automático (5 min)
// • Retry automático (3x)
// • Refetch em background
// • Race condition handling automático
// • Cleanup automático
// • DevTools embutido
```

---

## 🎓 Regras de Ouro

### ✅ Use TanStack Query/SWR para:

- ✓ Dados de API (GET requests)
- ✓ Listagens (produtos, categorias, reviews)
- ✓ Detalhes (produto individual, perfil)
- ✓ Dados que mudam no servidor
- ✓ Dados compartilhados entre usuários

### ✅ Use Context/Zustand para:

- ✓ Preferências de UI (tema, idioma)
- ✓ Estado de navegação (sidebar, modal)
- ✓ Dados derivados (filtros aplicados)
- ✓ Carrinhos/wishlists offline
- ✓ Formulários em progresso

### ✅ Use useState para:

- ✓ Estado local de componente
- ✓ Inputs controlados
- ✓ Modals/accordions
- ✓ Hover/focus states

## 📚 Recursos

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [TkDodo Blog - Practical React Query](https://tkdodo.eu/blog/practical-react-query)
- [React Query vs SWR Comparison](https://react-query.tanstack.com/comparison)

---
