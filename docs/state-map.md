# Mapa do Estado - Use Dev

---

## 🎯 Os 4 Tipos de Estado

### 1️⃣ **Estado Local** (Component State)

**Definição:** Dados que pertencem a **um único componente** e não precisam ser compartilhados.  
**Gerenciamento:** `useState`, `useReducer`  
**Ciclo de vida:** Nasce e morre com o componente  
**Quem atualiza?** O próprio componente  
**Quem consome?** Apenas o componente (e filhos diretos via props)

### 2️⃣ **Estado Compartilhado** (Shared/Global State)

**Definição:** Dados que **múltiplos componentes distantes** na árvore precisam acessar/modificar.  
**Gerenciamento:** Context API, Redux, Zustand, Jotai  
**Ciclo de vida:** Persiste enquanto a aplicação está montada (pode ser persistido em localStorage)  
**Quem atualiza?** Qualquer componente com acesso ao contexto/store  
**Quem consome?** Múltiplos componentes em diferentes níveis da árvore

### 3️⃣ **Estado Remoto** (Server State)

**Definição:** Dados que **vivem no servidor** e são sincronizados com o cliente.  
**Gerenciamento:** React Query, SWR, RTK Query, Apollo Client  
**Ciclo de vida:** Cache controlado por bibliotecas especializadas  
**Quem atualiza?** Servidor (via API calls)  
**Quem consome?** Componentes que fazem fetching (com cache compartilhado)  
**Características especiais:** Loading, error, refetch, stale data, cache invalidation

### 4️⃣ **Estado de URL** (URL State)

**Definição:** Dados que devem ser **compartilháveis via link** e refletir a navegação.  
**Gerenciamento:** React Router (searchParams, params), Next.js (useSearchParams)  
**Ciclo de vida:** Sincronizado com a barra de endereços do navegador  
**Quem atualiza?** Componentes que alteram query strings ou params  
**Quem consome?** Componentes que leem da URL  
**Características especiais:** Bookmarkable, sharable, sincronizado com botões voltar/avançar

---

## 🗺️ Mapa Completo dos Estados da Loja Use Dev

| #   | Nome do Estado         | Tipo                     | Ferramenta Atual           | Ferramenta Ideal           | Onde vive                        | Quem atualiza                 | Quem consome                          | Precisa de link? |
| --- | ---------------------- | ------------------------ | -------------------------- | -------------------------- | -------------------------------- | ----------------------------- | ------------------------------------- | ---------------- |
| 1   | `query` (busca header) | Local                    | `useState`                 | `useState` ✅              | `Header`                         | Input do usuário              | Apenas `Header`                       | ❌               |
| 2   | `newsletterEmail`      | Local                    | `useState`                 | `useState` ✅              | `Newsletter`                     | Input do usuário              | Apenas `Newsletter`                   | ❌               |
| 3   | `cartItems`            | Compartilhado            | `Context` + `localStorage` | `Zustand` ou `Context` ✅  | `CartContext`                    | `addToCart`, `removeFromCart` | `Header`, `CartPage`, `ProductDetail` | ❌               |
| 4   | `cartCount`            | Compartilhado (derivado) | `Context`                  | Derivado de `cartItems` ✅ | `CartContext`                    | Automático                    | `Header`                              | ❌               |
| 5   | `categories`           | Remoto                   | `useState` + `axios`       | `React Query` ou `SWR`     | `HomePage`                       | API `/categories`             | `Categories`                          | ❌               |
| 6   | `products`             | Remoto                   | `useState` + `axios`       | `React Query` ou `SWR`     | `HomePage`, `ProductDetailsPage` | API `/products`               | `ProductList`, `ProductDetail`        | ❌               |
| 7   | `isLoadingProducts`    | Remoto (derivado)        | `useState`                 | Gerenciado por React Query | Vários                           | API call                      | `StatusHandler`                       | ❌               |
| 8   | `productsError`        | Remoto (derivado)        | `useState`                 | Gerenciado por React Query | Vários                           | API catch                     | `StatusHandler`                       | ❌               |
| 9   | `productId` (detalhe)  | URL                      | `useParams` ✅             | `useParams`                | URL `/produto/:id`               | Navegação                     | `ProductDetailsPage`                  | ✅               |

---

## 🧭 Guia de Decisão: "Onde esse estado mora?"

Use este fluxograma mental ao adicionar um novo estado:

```
┌─────────────────────────────────────────────┐
│ Precisa ser compartilhado via link/URL?     │
│ (Ex: filtros, ordenação, paginação, ID)     │
└─────────────┬───────────────────────────────┘
              │
        SIM ──┴──> 🔗 Estado de URL
              │      (useParams, useSearchParams)
              │
             NÃO
              │
              ▼
┌─────────────────────────────────────────────┐
│ Os dados vêm do servidor? (API)             │
│ (Ex: produtos, reviews, estoque)            │
└─────────────┬───────────────────────────────┘
              │
        SIM ──┴──> ☁️ Estado Remoto
              │      (React Query, SWR, axios + cache)
              │
             NÃO
              │
              ▼
┌─────────────────────────────────────────────┐
│ Múltiplos componentes distantes precisam    │
│ ler/modificar? (Ex: carrinho, wishlist)     │
└─────────────┬───────────────────────────────┘
              │
        SIM ──┴──> 🌐 Estado Compartilhado
              │      (Context, Zustand, Redux)
              │
             NÃO
              │
              ▼
         🏠 Estado Local
            (useState, useReducer)
```

---
