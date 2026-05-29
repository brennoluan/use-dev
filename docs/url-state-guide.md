# Estado de URL como Fonte de Verdade

## 🎯 O Problema: Memória Local vs Compartilhamento

### ❌ Cenário Problemático

```tsx
// ❌ Filtros em useState (não compartilhável)
function ProductList() {
  const [franchise, setFranchise] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [page, setPage] = useState(1);

  // Usuário aplica filtros: Star Wars + ordenar por preço + página 2
  // URL permanece: /products

  // PROBLEMAS:
  // 1. ❌ Não pode compartilhar via WhatsApp
  // 2. ❌ Botão voltar reseta tudo
  // 3. ❌ Refresh perde os filtros
  // 4. ❌ Cada aba é uma sessão isolada
  // 5. ❌ Não pode salvar nos favoritos
  // 6. ❌ Google não indexa variações
}
```

**Consequências:**

- 😞 **UX ruim**: "Como compartilho essa busca?"
- 📱 **Marketing impossível**: Link de campanha não funciona
- 🔍 **SEO perdido**: Google não vê filtros
- 📊 **Analytics ofuscado**: Não rastreia filtros populares

---

## ✅ A Solução: URL como Única Fonte de Verdade

### Princípio Fundamental

> **"A URL deve representar completamente o estado visual da página"**

Se dois usuários abrem a mesma URL, devem ver **exatamente** a mesma coisa.

```
URL: /products?franchise=star-wars&sort=price_desc&page=2

↓ Deve resultar em ↓

Tela mostrando:
✓ Produtos da franquia Star Wars
✓ Ordenados por preço (maior → menor)
✓ Página 2 da listagem
```

---

## 🎯 Casos de Uso Reais

### 1️⃣ Compartilhamento via WhatsApp

```
// Marketing envia no grupo:
"Olha essas camisetas da Marvel em promoção!"
https://usedev.com/products?franchise=marvel&category=camisetas&priceMax=50

// Cliente abre e vê EXATAMENTE os produtos filtrados
```

### 2️⃣ Link de Email Marketing

```html
<!-- Email promocional -->
<a href="/products?franchise=star-wars&discount=true&sort=newest">
  ⭐ Novidades Star Wars com desconto!
</a>

<!-- Cliente clica e vê os produtos corretos automaticamente -->
```

### 3️⃣ Navegação com Botão Voltar

```
1. Usuario em /products
2. Aplica filtro Marvel → URL: /products?franchise=marvel
3. Aplica ordenação → URL: /products?franchise=marvel&sort=price_asc
4. Clica em produto → URL: /product/123
5. [← Voltar] → URL: /products?franchise=marvel&sort=price_asc
   ✅ Filtros restaurados automaticamente!
```

### 4️⃣ Favoritos do Navegador

```
Usuario salva bookmark:
"Camisetas Marvel até R$50"
URL: /products?franchise=marvel&category=camisetas&priceMax=50

Mês depois: abre bookmark → mesma busca! ✅
```

### 5️⃣ Google Analytics

```
// Google rastreia URLs populares:
/products?franchise=marvel          → 2.500 visitas
/products?franchise=star-wars       → 1.800 visitas
/products?franchise=dc              →   950 visitas

// Insight: Marvel é a franquia mais buscada! 📊
```

---

## 🧩 Modelagem de Query Params

### Tipos de Parâmetros

| Tipo               | Exemplo                          | Formato         | Uso                |
| ------------------ | -------------------------------- | --------------- | ------------------ |
| **String simples** | `?franchise=marvel`              | `key=value`     | Filtro único       |
| **Número**         | `?page=2`                        | `key=number`    | Paginação          |
| **Boolean**        | `?discount=true`                 | `key=boolean`   | Flags on/off       |
| **Range**          | `?priceMin=50&priceMax=200`      | `key1=n&key2=n` | Intervalo          |
| **Array**          | `?franchise=marvel&franchise=dc` | `key=v1&key=v2` | Múltiplos valores  |
| **Array (alt)**    | `?franchises=marvel,dc`          | `key=v1,v2`     | Múltiplos (string) |

---

### Exemplo Completo da Loja Use Dev

```
URL: /products?franchise=marvel&franchise=star-wars&category=camisetas&priceMin=50&priceMax=200&sort=price_asc&page=2&q=darth

Significa:
┌─────────────────────────────────────────────────┐
│ Buscar produtos que:                            │
│                                                 │
│ • Texto contém "darth"                          │
│ • Franquia é Marvel OU Star Wars               │
│ • Categoria é camisetas                         │
│ • Preço entre R$50 e R$200                      │
│ • Ordenados por preço crescente                 │
│ • Mostrando página 2                            │
└─────────────────────────────────────────────────┘
```

---

## 🔧 Implementação com React Router

### Hook Customizado: `useProductSearchParams`

```typescript
// src/hooks/useProductSearchParams.ts
import { useSearchParams } from "react-router-dom";

/**
 * 🔗 Hook para gerenciar filtros de produtos na URL
 *
 * Este hook é a "fonte de verdade" para todos os filtros.
 * A UI apenas REFLETE o que está na URL.
 *
 * Exemplos:
 * - /products?franchise=marvel → { franchises: ['marvel'] }
 * - /products?page=2 → { page: 2 }
 * - /products → { page: 1, sort: 'relevance' } (defaults)
 */
export function useProductSearchParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  // ════════════════════════════════════════════════
  // LEITURA: URL → State
  // ════════════════════════════════════════════════

  /**
   * 📖 Extrai franchises da URL
   * Suporta múltiplos valores: ?franchise=marvel&franchise=dc
   */
  const franchises = searchParams.getAll("franchise");

  /**
   * 📖 Extrai categoria (único valor)
   */
  const category = searchParams.get("category") || "";

  /**
   * 📖 Extrai range de preço
   */
  const priceMin = Number(searchParams.get("priceMin")) || 0;
  const priceMax = Number(searchParams.get("priceMax")) || 1000;

  /**
   * 📖 Extrai ordenação (default: relevance)
   */
  const sort = searchParams.get("sort") || "relevance";

  /**
   * 📖 Extrai página atual (default: 1)
   */
  const page = Number(searchParams.get("page")) || 1;

  /**
   * 📖 Extrai query de busca textual
   */
  const searchQuery = searchParams.get("q") || "";

  // ════════════════════════════════════════════════
  // ESCRITA: State → URL
  // ════════════════════════════════════════════════

  /**
   * ✏️ Atualizar filtros na URL
   *
   * Esta é a ÚNICA forma de mudar filtros.
   * Não use useState para filtros!
   */
  const updateFilters = (updates: {
    franchise?: string | string[] | null;
    category?: string | null;
    priceMin?: number | null;
    priceMax?: number | null;
    sort?: string | null;
    page?: number | null;
    q?: string | null;
  }) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);

      // Aplicar cada update
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "" || value === undefined) {
          // Remover parâmetro se nulo/vazio
          params.delete(key);
        } else if (Array.isArray(value)) {
          // Array: remover existentes e adicionar novos
          params.delete(key);
          value.forEach((v) => params.append(key, v));
        } else {
          // Valor único: set direto
          params.set(key, String(value));
        }
      });

      // IMPORTANTE: Resetar página ao mudar filtro
      // (exceto se o update já inclui page)
      if (!("page" in updates)) {
        params.set("page", "1");
      }

      return params;
    });
  };

  // ════════════════════════════════════════════════
  // HELPERS: Ações específicas
  // ════════════════════════════════════════════════

  const toggleFranchise = (franchise: string) => {
    const current = franchises;
    const newValue = current.includes(franchise)
      ? current.filter((f) => f !== franchise) // Remove
      : [...current, franchise]; // Adiciona

    updateFilters({
      franchise: newValue.length > 0 ? newValue : null,
    });
  };

  const setCategory = (category: string | null) => {
    updateFilters({ category });
  };

  const setPriceRange = (min: number, max: number) => {
    updateFilters({
      priceMin: min > 0 ? min : null,
      priceMax: max < 1000 ? max : null,
    });
  };

  const setSort = (sort: string) => {
    updateFilters({ sort });
  };

  const setPage = (page: number) => {
    updateFilters({ page });
  };

  const setSearchQuery = (q: string) => {
    updateFilters({ q: q || null });
  };

  const clearFilters = () => {
    setSearchParams({}); // URL: /products (limpa)
  };

  // ════════════════════════════════════════════════
  // RETURN: API pública do hook
  // ════════════════════════════════════════════════

  return {
    // State atual (lido da URL)
    franchises,
    category,
    priceMin,
    priceMax,
    sort,
    page,
    searchQuery,

    // Ações (escrevem na URL)
    toggleFranchise,
    setCategory,
    setPriceRange,
    setSort,
    setPage,
    setSearchQuery,
    clearFilters,
    updateFilters, // API genérica
  };
}
```

---

## 🎨 Usar no Componente

```tsx
// src/components/ProductFilters/index.tsx
import { useProductSearchParams } from "../../hooks/useProductSearchParams";

function ProductFilters() {
  const {
    franchises, // ['marvel', 'star-wars']
    sort, // 'price_asc'
    page, // 2
    toggleFranchise,
    setSort,
    setPage,
  } = useProductSearchParams();

  // ✅ UI apenas REFLETE a URL (não tem estado próprio)

  return (
    <div>
      {/* Checkbox Marvel */}
      <input
        type="checkbox"
        checked={franchises.includes("marvel")}
        onChange={() => toggleFranchise("marvel")}
      />

      {/* Select de ordenação */}
      <select value={sort} onChange={(e) => setSort(e.target.value)}>
        <option value="relevance">Relevância</option>
        <option value="price_asc">Menor preço</option>
        <option value="price_desc">Maior preço</option>
      </select>

      {/* Paginação */}
      <button onClick={() => setPage(page + 1)}>Próxima página</button>
    </div>
  );
}
```

**Comportamento:**

- ✅ Marcar checkbox → URL: `/products?franchise=marvel`
- ✅ Ordenar por preço → URL: `/products?franchise=marvel&sort=price_asc&page=1`
- ✅ Próxima página → URL: `/products?franchise=marvel&sort=price_asc&page=2`
- ✅ Voltar no navegador → Restaura estado anterior automaticamente!

---

## 🔄 Integração com TanStack Query

```tsx
// src/hooks/useProducts.ts
import { useQuery } from "@tanstack/react-query";
import { useProductSearchParams } from "./useProductSearchParams";

function useProducts() {
  // 🔗 Lê filtros da URL
  const { franchises, category, priceMin, priceMax, sort, page } =
    useProductSearchParams();

  // ☁️ Query com cache baseado nos filtros
  return useQuery({
    queryKey: [
      "products",
      { franchises, category, priceMin, priceMax, sort, page },
    ],
    queryFn: () =>
      fetchProducts({ franchises, category, priceMin, priceMax, sort, page }),
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
}
```

**Magia:**

- ✅ Mesma URL = mesmo cache
- ✅ Mudar filtro = nova query key = novo fetch
- ✅ Voltar no navegador = URL restaura = cache reutilizado!

**Fluxo completo:**

```
1. Usuário marca "Marvel"
   └→ toggleFranchise('marvel')
      └→ URL: /products?franchise=marvel
         └→ useProductSearchParams detecta mudança
            └→ Query key: ['products', { franchises: ['marvel'], ... }]
               └→ TanStack Query: cache miss → fetch
                  └→ API: GET /products?franchise=marvel
                     └→ Dados retornam → UI atualiza

2. Usuário clica em produto
   └→ Navega para /product/123

3. Usuário clica [← Voltar]
   └→ URL: /products?franchise=marvel (restaurada)
      └→ Query key: ['products', { franchises: ['marvel'], ... }]
         └→ TanStack Query: cache hit! ✅ Instantâneo
            └→ UI atualiza sem fetch
```

---

## 🎯 Regras de Ouro

### ✅ O que colocar na URL

```tsx
// ✅ Filtros de busca
?franchise=marvel&category=camisetas

// ✅ Ordenação
?sort=price_asc

// ✅ Paginação
?page=2

// ✅ Query de busca
?q=darth+vader

// ✅ IDs de recursos
/product/:id

// ✅ Ranges
?priceMin=50&priceMax=200

// ✅ Flags booleanos
?discount=true&inStock=true
```

### ❌ O que NÃO colocar na URL

```tsx
// ❌ Estado de modals
?modalOpen=true  // ❌ Refresh abre modal (inesperado)

// ❌ Hover/focus
?hoveredProduct=123  // ❌ Não faz sentido

// ❌ Dados temporários de formulário
?emailDraft=user@example.com  // ❌ Sensível

// ❌ Tokens/credenciais
?token=abc123  // ❌ INSEGURO!

// ❌ Cor selecionada (se efêmero)
?selectedColor=red  // ❌ Resetar ao recarregar pode ser OK
```

---

## 📊 Comparação: useState vs URL

| Aspecto            | useState            | URL (useSearchParams)    |
| ------------------ | ------------------- | ------------------------ |
| **Compartilhável** | ❌ Não              | ✅ Sim (via link)        |
| **Botão voltar**   | ❌ Não funciona     | ✅ Funciona nativamente  |
| **Refresh**        | ❌ Perde estado     | ✅ Mantém estado         |
| **Favoritos**      | ❌ Não salva        | ✅ Salva automaticamente |
| **SEO**            | ❌ Google não vê    | ✅ Google indexa         |
| **Analytics**      | ❌ Difícil rastrear | ✅ Automático            |
| **Deep linking**   | ❌ Impossível       | ✅ Nativo                |
| **Complexidade**   | 🟢 Simples          | 🟡 Moderada              |
| **Serialização**   | 🟢 Qualquer tipo    | 🟡 Apenas strings        |

---

## 💡 Dicas de Implementação

### 1️⃣ Sempre resetar página ao mudar filtro

```typescript
const updateFilters = (updates) => {
  // ...
  if (!("page" in updates)) {
    params.set("page", "1"); // ← CRÍTICO!
  }
};
```

### 2️⃣ Normalizar valores booleanos

```typescript
const discount = searchParams.get("discount") === "true";
// URL: ?discount=true → true
// URL: ?discount=false → false
// URL: (sem param) → false
```

### 3️⃣ Validar limites de range

```typescript
const priceMin = Math.max(0, Number(searchParams.get("priceMin")) || 0);
const priceMax = Math.min(10000, Number(searchParams.get("priceMax")) || 10000);
```

### 4️⃣ Limpar valores default

```typescript
// Não poluir URL com defaults
if (sort === "relevance") {
  params.delete("sort"); // /products (limpo)
} else {
  params.set("sort", sort); // /products?sort=price_asc
}
```

---

## 📚 Recursos

- [React Router - useSearchParams](https://reactrouter.com/en/main/hooks/use-search-params)
- [URLSearchParams MDN](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)
- [Deep Linking Best Practices](https://www.nngroup.com/articles/deep-linking/)

---
