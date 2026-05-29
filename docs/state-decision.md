# Fluxo de Decisão para Escolha de Abordagem de Estado

## 🎯 Objetivo

Este documento apresenta um **fluxo de decisão repetível** para escolher a abordagem correta de gerenciamento de estado, evitando retrabalho e migrações dolorosas.

---

## 🌳 Árvore de Decisão (Fluxograma)

```mermaid
flowchart TD
    Start([Implementação de um novo Estado]) --> Q1{Vem do<br/>servidor?<br/>API/Backend}

    Q1 -->|SIM| Remote[☁️ ESTADO REMOTO<br/>React Query / SWR<br/>RTK Query / Apollo]

    Q1 -->|NÃO| Q2{Precisa de<br/>deep-link?<br/>Compartilhar via URL}

    Q2 -->|SIM| URL[🔗 ESTADO DE URL<br/>useParams<br/>useSearchParams]

    Q2 -->|NÃO| Q3{Múltiplos componentes<br/>distantes precisam<br/>acessar/modificar?}

    Q3 -->|SIM| Q4{Precisa de<br/>sincronização<br/>com backend?}

    Q4 -->|SIM| Hybrid[☁️ + 🌐 HÍBRIDO<br/>React Query + Context<br/>ou Optimistic Updates]

    Q4 -->|NÃO| Shared[🌐 ESTADO COMPARTILHADO<br/>Context API<br/>Zustand / Redux]

    Q3 -->|NÃO| Q5{Precisa persistir<br/>localmente?<br/>localStorage/sessionStorage}

    Q5 -->|SIM| LocalPersist[🏠 + 💾 LOCAL + PERSIST<br/>useState + useEffect<br/>ou custom hook]

    Q5 -->|NÃO| Local[🏠 ESTADO LOCAL<br/>useState<br/>useReducer]

    Remote --> Examples1[Exemplos:<br/>• Lista de produtos<br/>• Reviews de produtos<br/>• Estoque por variante<br/>• Dados do usuário]

    URL --> Examples2[Exemplos:<br/>• ID do produto<br/>• Filtros de categoria<br/>• Ordenação/paginação<br/>• Query de busca]

    Hybrid --> Examples3[Exemplos:<br/>• Carrinho sincronizado<br/>• Wishlist online<br/>• Preferências do usuário<br/>• Carrinho de compras]

    Shared --> Examples4[Exemplos:<br/>• Carrinho offline<br/>• Wishlist local<br/>• Tema dark/light<br/>• Menu aberto/fechado]

    LocalPersist --> Examples5[Exemplos:<br/>• Última aba visitada<br/>• Campos de formulário<br/>• Configurações UI<br/>• Tour concluído]

    Local --> Examples6[Exemplos:<br/>• Input de busca<br/>• Modal aberto/fechado<br/>• Cor selecionada<br/>• Zoom de imagem]

    %% Cores com melhor contraste
    style Remote fill:#1976d2,stroke:#0d47a1,stroke-width:3px,color:#fff
    style URL fill:#f57c00,stroke:#e65100,stroke-width:3px,color:#fff
    style Hybrid fill:#7b1fa2,stroke:#4a148c,stroke-width:3px,color:#fff
    style Shared fill:#388e3c,stroke:#1b5e20,stroke-width:3px,color:#fff
    style LocalPersist fill:#c2185b,stroke:#880e4f,stroke-width:3px,color:#fff
    style Local fill:#616161,stroke:#212121,stroke-width:3px,color:#fff

    style Q1 fill:#ef5350,stroke:#c62828,stroke-width:2px,color:#fff
    style Q2 fill:#ef5350,stroke:#c62828,stroke-width:2px,color:#fff
    style Q3 fill:#ef5350,stroke:#c62828,stroke-width:2px,color:#fff
    style Q4 fill:#ef5350,stroke:#c62828,stroke-width:2px,color:#fff
    style Q5 fill:#ef5350,stroke:#c62828,stroke-width:2px,color:#fff

    style Examples1 fill:#0d47a1,stroke:#01579b,stroke-width:3px,color:#fff
    style Examples2 fill:#e65100,stroke:#bf360c,stroke-width:3px,color:#fff
    style Examples3 fill:#4a148c,stroke:#311b92,stroke-width:3px,color:#fff
    style Examples4 fill:#1b5e20,stroke:#0d3d0f,stroke-width:3px,color:#fff
    style Examples5 fill:#880e4f,stroke:#560027,stroke-width:3px,color:#fff
    style Examples6 fill:#424242,stroke:#212121,stroke-width:3px,color:#fff

    style Start fill:#ffd54f,stroke:#f57f17,stroke-width:3px,color:#000
```

---

# 🏭 Caso Real: Filtro por Franquia

### ❌ Abordagem problemática (Retrabalho)

**Iteração 1 - Início ingênuo:**

```tsx
// ❌ Implementado com useState
function ProductList() {
  const [franchise, setFranchise] = useState<string | null>(null);

  return (
    <div>
      <select value={franchise} onChange={(e) => setFranchise(e.target.value)}>
        <option value="">Todas</option>
        <option value="marvel">Marvel</option>
        <option value="dc">DC Comics</option>
      </select>

      <Products franchise={franchise} />
    </div>
  );
}

// PROBLEMA: Ao recarregar a página, perde o filtro
// PROBLEMA: Não pode compartilhar link filtrado
```

**Iteração 2 - Migrando para URL (retrabalho doloroso):**

```tsx
// 😓 Reescrevendo tudo
function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const franchise = searchParams.get("franchise");

  const handleChange = (value: string) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      if (value) {
        params.set("franchise", value);
      } else {
        params.delete("franchise");
      }
      return params;
    });
  };

  // Teve que refatorar todo o código!
  // Teve que testar novamente!
  // Teve que atualizar documentação!
}
```

---
