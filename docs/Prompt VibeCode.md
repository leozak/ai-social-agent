```markdown
# INSTRUÇÃO DE DESENVOLVIMENTO - FRONTEND COMPLETO

## CONTEXTO DO PROJETO

Você está desenvolvendo o frontend de uma aplicação chamada **SocialAI Agent** - uma plataforma
que utiliza inteligência artificial para criar posts otimizados para redes sociais. A aplicação
analisa conteúdos da internet, entrevista o usuário para entender seu posicionamento, e gera
posts, respostas e comentários para aumentar engajamento.

---

## STACK TECNOLÓGICO OBRIGATÓRIO

| Categoria    | Tecnologia                | Versão | Justificativa                       |
| ------------ | ------------------------- | ------ | ----------------------------------- |
| Build Tool   | **Vite**                  | 5+     | Build rápido, HMR excelente         |
| Framework    | **React**                 | 18+    | Componentização, ecossistema        |
| Linguagem    | **TypeScript**            | 5.3+   | Type safety                         |
| Estilização  | **Tailwind CSS**          | 3.4+   | Utility-first, design system custom |
| Roteamento   | **React Router**          | 6+     | SPA navigation                      |
| Estado       | **Zustand**               | 4.5+   | Leve, persistência fácil            |
| Server State | **TanStack Query**        | 5+     | Cache inteligente                   |
| Streaming    | **Vercel AI SDK**         | 3+     | SSE pronto para agentes             |
| Formulários  | **React Hook Form + Zod** | latest | Validação type-safe                 |
| Animações    | **Framer Motion**         | 11+    | Transições fluidas                  |
| Ícones       | **Lucide React**          | latest | Consistente, leve                   |
| Autenticação | **Clerk**                 | latest | Auth completa, React SDK            |

---

## ESTRUTURA DE PASTAS OBRIGATÓRIA
```

apps/web/
├── public/ # Assets estáticos
│ ├── fonts/
│ └── images/
│ ├── empty-states/ # Ilustrações para estados vazios
│ ├── platform-icons/ # Logos de redes sociais
│ └── avatars/ # Defaults
│
├── src/
│ ├── main.tsx # Entry point
│ ├── App.tsx # Root component
│ ├── routes.tsx # React Router config
│ ├── index.css # Tailwind imports + CSS variables
│ ├── vite-env.d.ts # Types do Vite
│ │
│ ├── components/ # TODOS os componentes React
│ │ ├── primitives/ # 🧱 COMPONENTES BASE (do zero)
│ │ │ ├── Button/
│ │ │ │ ├── Button.tsx
│ │ │ │ ├── Button.types.ts
│ │ │ │ ├── Button.variants.ts
│ │ │ │ └── index.ts
│ │ │ ├── Card/
│ │ │ │ ├── Card.tsx
│ │ │ │ ├── CardHeader.tsx
│ │ │ │ ├── CardBody.tsx
│ │ │ │ ├── CardFooter.tsx
│ │ │ │ └── index.ts
│ │ │ ├── Input/
│ │ │ │ ├── Input.tsx
│ │ │ │ ├── Input.types.ts
│ │ │ │ └── index.ts
│ │ │ ├── Textarea/
│ │ │ │ ├── Textarea.tsx
│ │ │ │ └── index.ts
│ │ │ ├── Select/
│ │ │ │ ├── Select.tsx
│ │ │ │ ├── Select.types.ts
│ │ │ │ └── index.ts
│ │ │ ├── Badge/
│ │ │ │ ├── Badge.tsx
│ │ │ │ ├── Badge.variants.ts
│ │ │ │ └── index.ts
│ │ │ ├── Avatar/
│ │ │ │ ├── Avatar.tsx
│ │ │ │ └── index.ts
│ │ │ ├── Tabs/
│ │ │ │ ├── Tabs.tsx
│ │ │ │ ├── Tabs.types.ts
│ │ │ │ └── index.ts
│ │ │ ├── Dialog/
│ │ │ │ ├── Dialog.tsx
│ │ │ │ ├── DialogHeader.tsx
│ │ │ │ ├── DialogBody.tsx
│ │ │ │ ├── DialogFooter.tsx
│ │ │ │ └── index.ts
│ │ │ ├── Dropdown/
│ │ │ │ ├── Dropdown.tsx
│ │ │ │ ├── Dropdown.types.ts
│ │ │ │ └── index.ts
│ │ │ ├── Tooltip/
│ │ │ │ ├── Tooltip.tsx
│ │ │ │ └── index.ts
│ │ │ ├── Skeleton/
│ │ │ │ ├── Skeleton.tsx
│ │ │ │ └── index.ts
│ │ │ ├── Progress/
│ │ │ │ ├── Progress.tsx
│ │ │ │ └── index.ts
│ │ │ ├── Slider/
│ │ │ │ ├── Slider.tsx
│ │ │ │ └── index.ts
│ │ │ ├── Switch/
│ │ │ │ ├── Switch.tsx
│ │ │ │ └── index.ts
│ │ │ ├── Calendar/
│ │ │ │ ├── Calendar.tsx
│ │ │ │ └── index.ts
│ │ │ ├── Popover/
│ │ │ │ ├── Popover.tsx
│ │ │ │ └── index.ts
│ │ │ ├── ScrollArea/
│ │ │ │ ├── ScrollArea.tsx
│ │ │ │ └── index.ts
│ │ │ ├── Separator/
│ │ │ │ ├── Separator.tsx
│ │ │ │ └── index.ts
│ │ │ ├── Sheet/
│ │ │ │ ├── Sheet.tsx
│ │ │ │ └── index.ts
│ │ │ ├── Toast/
│ │ │ │ ├── Toast.tsx
│ │ │ │ ├── ToastProvider.tsx
│ │ │ │ ├── useToast.ts
│ │ │ │ └── index.ts
│ │ │ ├── Command/
│ │ │ │ ├── Command.tsx
│ │ │ │ └── index.ts
│ │ │ └── index.ts # Barrel export
│ │ │
│ │ ├── layout/ # 🧩 COMPONENTES DE LAYOUT
│ │ │ ├── Sidebar/
│ │ │ │ ├── Sidebar.tsx
│ │ │ │ ├── SidebarItem.tsx
│ │ │ │ ├── SidebarGroup.tsx
│ │ │ │ └── index.ts
│ │ │ ├── TopBar/
│ │ │ │ ├── TopBar.tsx
│ │ │ │ └── index.ts
│ │ │ ├── MobileNav/
│ │ │ │ ├── MobileNav.tsx
│ │ │ │ └── index.ts
│ │ │ ├── AppShell/
│ │ │ │ ├── AppShell.tsx
│ │ │ │ └── index.ts
│ │ │ └── index.ts
│ │ │
│ │ ├── interview/ # 🎯 FLUXO DE ENTREVISTA
│ │ │ ├── InterviewContainer/
│ │ │ │ ├── InterviewContainer.tsx
│ │ │ │ └── index.ts
│ │ │ ├── ChatMessage/
│ │ │ │ ├── ChatMessage.tsx
│ │ │ │ ├── ChatMessage.types.ts
│ │ │ │ └── index.ts
│ │ │ ├── ChatInput/
│ │ │ │ ├── ChatInput.tsx
│ │ │ │ └── index.ts
│ │ │ ├── ProgressIndicator/
│ │ │ │ ├── ProgressIndicator.tsx
│ │ │ │ └── index.ts
│ │ │ ├── TopicChip/
│ │ │ │ ├── TopicChip.tsx
│ │ │ │ └── index.ts
│ │ │ ├── ProfilePreview/
│ │ │ │ ├── ProfilePreview.tsx
│ │ │ │ └── index.ts
│ │ │ ├── CompletionCelebration/
│ │ │ │ ├── CompletionCelebration.tsx
│ │ │ │ └── index.ts
│ │ │ └── index.ts
│ │ │
│ │ ├── content/ # 🎯 INPUT DE CONTEÚDO
│ │ │ ├── UrlInput/
│ │ │ │ ├── UrlInput.tsx
│ │ │ │ └── index.ts
│ │ │ ├── UrlList/
│ │ │ │ ├── UrlList.tsx
│ │ │ │ └── index.ts
│ │ │ ├── DragDropZone/
│ │ │ │ ├── DragDropZone.tsx
│ │ │ │ └── index.ts
│ │ │ ├── ContentPreview/
│ │ │ │ ├── ContentPreview.tsx
│ │ │ │ └── index.ts
│ │ │ ├── SourceTabs/
│ │ │ │ ├── SourceTabs.tsx
│ │ │ │ └── index.ts
│ │ │ └── index.ts
│ │ │
│ │ ├── posts/ # 🎯 GERAÇÃO E EDIÇÃO DE POSTS
│ │ │ ├── PostCard/
│ │ │ │ ├── PostCard.tsx
│ │ │ │ └── index.ts
│ │ │ ├── PostGrid/
│ │ │ │ ├── PostGrid.tsx
│ │ │ │ └── index.ts
│ │ │ ├── PostEditor/
│ │ │ │ ├── PostEditor.tsx
│ │ │ │ └── index.ts
│ │ │ ├── PostActions/
│ │ │ │ ├── PostActions.tsx
│ │ │ │ └── index.ts
│ │ │ ├── ThreadBuilder/
│ │ │ │ ├── ThreadBuilder.tsx
│ │ │ │ └── index.ts
│ │ │ ├── MediaAttachment/
│ │ │ │ ├── MediaAttachment.tsx
│ │ │ │ └── index.ts
│ │ │ ├── EngagementPreview/
│ │ │ │ ├── EngagementPreview.tsx
│ │ │ │ └── index.ts
│ │ │ ├── VariantSelector/
│ │ │ │ ├── VariantSelector.tsx
│ │ │ │ └── index.ts
│ │ │ └── index.ts
│ │ │
│ │ ├── analytics/ # 📊 MÉTRICAS
│ │ │ ├── EngagementChart/
│ │ │ ├── MetricCard/
│ │ │ └── index.ts
│ │ │
│ │ └── common/ # 🔧 UTILITÁRIOS VISUAIS
│ │ ├── StreamingText/
│ │ ├── LoadingState/
│ │ ├── ErrorBoundary/
│ │ ├── EmptyState/
│ │ ├── ConfirmationDialog/
│ │ ├── PlatformBadge/
│ │ └── index.ts
│ │
│ ├── hooks/ # Custom React hooks
│ │ ├── useAgentStream.ts # 🎯 CORE: Streaming SSE do agente
│ │ ├── useInterview.ts
│ │ ├── useUserProfile.ts
│ │ ├── useContentSources.ts
│ │ ├── useGeneratedPosts.ts
│ │ ├── usePlatformConnection.ts
│ │ ├── useScheduledPosts.ts
│ │ ├── useToast.ts # Integração com Toast system
│ │ └── index.ts
│ │
│ ├── stores/ # Zustand stores
│ │ ├── user-profile.ts
│ │ ├── interview-session.ts
│ │ ├── content-sources.ts
│ │ ├── post-editor.ts
│ │ ├── ui-preferences.ts
│ │ ├── agent-status.ts
│ │ └── index.ts
│ │
│ ├── lib/ # Utilitários e configuração
│ │ ├── api-client.ts
│ │ ├── streaming-parser.ts
│ │ ├── platform-config.ts
│ │ ├── validators.ts
│ │ ├── constants.ts
│ │ ├── utils.ts # cn(), formatDate, etc.
│ │ └── index.ts
│ │
│ ├── types/ # TypeScript definitions
│ │ ├── api.ts
│ │ ├── agent.ts
│ │ ├── user-profile.ts
│ │ ├── content.ts
│ │ ├── post.ts
│ │ ├── platform.ts
│ │ ├── components.ts # Props compartilhadas
│ │ └── index.ts
│ │
│ └── pages/ # 🗺️ PÁGINAS (React Router)
│ ├── Auth/
│ │ ├── LoginPage.tsx
│ │ ├── RegisterPage.tsx
│ │ └── index.ts
│ ├── Dashboard/
│ │ ├── DashboardPage.tsx
│ │ └── index.ts
│ ├── Interview/
│ │ ├── InterviewPage.tsx # Full-focus, sem sidebar
│ │ └── index.ts
│ ├── Content/
│ │ ├── ContentPage.tsx
│ │ └── index.ts
│ ├── Posts/
│ │ ├── PostsListPage.tsx
│ │ ├── PostEditPage.tsx
│ │ └── index.ts
│ ├── Schedule/
│ │ └── SchedulePage.tsx
│ ├── Analytics/
│ │ └── AnalyticsPage.tsx
│ ├── Settings/
│ │ └── SettingsPage.tsx
│ └── index.ts
│
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── package.json
└── README.md

````

---

## CONFIGURAÇÃO DO VITE

### vite.config.ts

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc'; // SWC para build mais rápido
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@stores': resolve(__dirname, 'src/stores'),
      '@lib': resolve(__dirname, 'src/lib'),
      '@types': resolve(__dirname, 'src/types'),
      '@pages': resolve(__dirname, 'src/pages'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000', // Seu backend FastAPI
        changeOrigin: true,
      },
    },
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-state': ['zustand', '@tanstack/react-query'],
          'vendor-ui': ['framer-motion', 'lucide-react'],
          'vendor-form': ['react-hook-form', 'zod', '@hookform/resolvers'],
        },
      },
    },
  },
});
````

### tsconfig.json (paths)

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@hooks/*": ["src/hooks/*"],
      "@stores/*": ["src/stores/*"],
      "@lib/*": ["src/lib/*"],
      "@types/*": ["src/types/*"],
      "@pages/*": ["src/pages/*"]
    }
  }
}
```

---

## COMPONENTES PRIMITIVOS (Implementação Detalhada)

Cada componente deve seguir este padrão:

```typescript
// Componente estrutura: [Nome].tsx, [Nome].types.ts, [Nome].variants.ts, index.ts
// Props: interface clara, extends de HTMLAttributes quando aplicável
// Ref: forwardRef para integração com forms e acessibilidade
// Acessibilidade: aria-*, roles, keyboard navigation
// Variantes: centralizadas em arquivo separado
```

### Exemplo: Button

**Button.types.ts**

```typescript
import { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  asChild?: boolean; // Para composição com Link
}
```

**Button.variants.ts**

```typescript
import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  // Base styles
  "inline-flex items-center justify-center rounded-lg font-medium transition-colors " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
    "disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-primary-600 text-white hover:bg-primary-700 " +
          "focus-visible:ring-primary-500",
        secondary:
          "bg-secondary-100 text-secondary-900 hover:bg-secondary-200 " +
          "focus-visible:ring-secondary-500",
        outline:
          "border border-gray-300 bg-transparent hover:bg-gray-50 " +
          "text-gray-700 focus-visible:ring-gray-500",
        ghost: "hover:bg-gray-100 text-gray-700 focus-visible:ring-gray-500",
        danger:
          "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  },
);
```

**Button.tsx**

```typescript
import { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot'; // Ou implementação própria
import { buttonVariants } from './Button.variants';
import { ButtonProps } from './Button.types';
import { cn } from '@lib/utils';

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant,
    size,
    fullWidth,
    isLoading,
    loadingText,
    leftIcon,
    rightIcon,
    asChild = false,
    children,
    disabled,
    ...props
  }, ref) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <Spinner className="mr-2 h-4 w-4 animate-spin" />
            {loadingText || children}
          </>
        ) : (
          <>
            {leftIcon && <span className="mr-2">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="ml-2">{rightIcon}</span>}
          </>
        )}
      </Comp>
    );
  }
);

Button.displayName = 'Button';
```

**index.ts**

```typescript
export { Button } from "./Button";
export type { ButtonProps, ButtonVariant, ButtonSize } from "./Button.types";
```

---

## ROTEAMENTO COM REACT ROUTER

### src/routes.tsx

```typescript
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/react-router'; // ou @clerk/clerk-react

// Pages
import { LoginPage, RegisterPage } from '@pages/Auth';
import { DashboardPage } from '@pages/Dashboard';
import { InterviewPage } from '@pages/Interview';
import { ContentPage } from '@pages/Content';
import { PostsListPage, PostEditPage } from '@pages/Posts';
import { SchedulePage } from '@pages/Schedule';
import { AnalyticsPage } from '@pages/Analytics';
import { SettingsPage } from '@pages/Settings';

// Layouts
import { AppShell } from '@components/layout';

// Guards
import { RequireProfile } from '@components/auth';

const router = createBrowserRouter([
  // Rotas públicas
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },

  // Rotas protegidas (requer auth)
  {
    element: (
      <SignedIn>
        <AppShell />
      </SignedIn>
    ),
    children: [
      {
        path: '/',
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },
      {
        path: '/content',
        element: <ContentPage />,
      },
      {
        path: '/posts',
        element: <PostsListPage />,
      },
      {
        path: '/posts/new',
        element: <PostEditPage />,
      },
      {
        path: '/posts/:id',
        element: <PostEditPage />,
      },
      {
        path: '/schedule',
        element: <SchedulePage />,
      },
      {
        path: '/analytics',
        element: <AnalyticsPage />,
      },
      {
        path: '/settings',
        element: <SettingsPage />,
      },
    ],
  },

  // Entrevista: rota especial, sem layout padrão
  {
    path: '/interview',
    element: (
      <SignedIn>
        <InterviewPage />
      </SignedIn>
    ),
  },

  // Fallback
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

export { router };
```

### src/App.tsx

```typescript
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClerkProvider } from '@clerk/clerk-react';
import { router } from './routes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 2,
    },
  },
});

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function App() {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ClerkProvider>
  );
}

export default App;
```

---

## ESTILOS E DESIGN SYSTEM

### src/index.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* CSS Variables - Design System */
:root {
  /* Primary: Indigo */
  --primary-50: #eef2ff;
  --primary-100: #e0e7ff;
  --primary-200: #c7d2fe;
  --primary-300: #a5b4fc;
  --primary-400: #818cf8;
  --primary-500: #6366f1;
  --primary-600: #4f46e5;
  --primary-700: #4338ca;
  --primary-800: #3730a3;
  --primary-900: #312e81;

  /* Gray scale */
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-400: #9ca3af;
  --gray-500: #6b7280;
  --gray-600: #4b5563;
  --gray-700: #374151;
  --gray-800: #1f2937;
  --gray-900: #111827;

  /* Semantic colors */
  --success-50: #f0fdf4;
  --success-500: #22c55e;
  --success-600: #16a34a;

  --warning-50: #fffbeb;
  --warning-500: #f59e0b;
  --warning-600: #d97706;

  --error-50: #fef2f2;
  --error-500: #ef4444;
  --error-600: #dc2626;

  /* Agent states */
  --agent-idle: var(--gray-400);
  --agent-listening: var(--success-500);
  --agent-thinking: var(--warning-500);
  --agent-streaming: var(--primary-500);
  --agent-waiting: #ec4899;

  /* Spacing scale */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;
  --space-24: 6rem;

  /* Typography */
  --font-sans: "Inter", system-ui, -apple-system, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;

  /* Radius */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);

  /* Animations */
  --duration-fast: 150ms;
  --duration-base: 250ms;
  --duration-slow: 350ms;
}

/* Base styles */
@layer base {
  * {
    @apply border-gray-200;
  }

  body {
    @apply font-sans antialiased text-gray-900 bg-gray-50;
    font-family: var(--font-sans);
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    @apply font-semibold tracking-tight;
  }
}

/* Utilities */
@layer utilities {
  .text-balance {
    text-wrap: balance;
  }

  .animate-in {
    animation: animate-in 0.3s ease-out;
  }

  .animate-out {
    animation: animate-out 0.2s ease-in;
  }

  @keyframes animate-in {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes animate-out {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(-10px);
    }
  }
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  @apply bg-gray-100 rounded-full;
}

::-webkit-scrollbar-thumb {
  @apply bg-gray-300 rounded-full;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400;
}

/* Focus visible */
:focus-visible {
  @apply outline-none ring-2 ring-offset-2 ring-primary-500;
}
```

### tailwind.config.ts

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "var(--primary-50)",
          100: "var(--primary-100)",
          200: "var(--primary-200)",
          300: "var(--primary-300)",
          400: "var(--primary-400)",
          500: "var(--primary-500)",
          600: "var(--primary-600)",
          700: "var(--primary-700)",
          800: "var(--primary-800)",
          900: "var(--primary-900)",
        },
        agent: {
          idle: "var(--agent-idle)",
          listening: "var(--agent-listening)",
          thinking: "var(--agent-thinking)",
          streaming: "var(--agent-streaming)",
          waiting: "var(--agent-waiting)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-slow": "bounce 2s infinite",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"), // Para animações de fade/slide
  ],
};

export default config;
```

---

## IMPLEMENTAÇÃO DO STREAMING SSE

### hooks/useAgentStream.ts

```typescript
import { useState, useCallback, useRef, useEffect } from "react";
import { StreamEvent, AgentState } from "@types/agent";

interface UseAgentStreamReturn {
  events: StreamEvent[];
  isConnected: boolean;
  isStreaming: boolean;
  currentNode: string | null;
  error: Error | null;
  startStream: (initialState: Partial<AgentState>) => void;
  sendInput: (input: string) => void; // Para human-in-the-loop
  stop: () => void;
  reset: () => void;
}

export function useAgentStream(): UseAgentStreamReturn {
  const [events, setEvents] = useState<StreamEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentNode, setCurrentNode] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const sessionIdRef = useRef<string | null>(null);

  const startStream = useCallback(async (initialState: Partial<AgentState>) => {
    // Reset state
    setEvents([]);
    setError(null);
    setIsStreaming(true);

    // Cancel previous if exists
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch("/api/agent/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionIdRef.current, // null = new session
          initial_state: initialState,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      setIsConnected(true);

      // SSE parsing
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Process complete events (separated by \n\n)
        const parts = buffer.split("\n\n");
        buffer = parts.pop() || ""; // Keep incomplete part

        for (const part of parts) {
          const lines = part.split("\n");
          const event: Partial<StreamEvent> = {};

          for (const line of lines) {
            if (line.startsWith("event: ")) {
              event.type = line.slice(7) as StreamEvent["type"];
            } else if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));
                Object.assign(event, data);
              } catch (e) {
                console.error("Failed to parse SSE data:", line);
              }
            }
          }

          if (event.type) {
            const fullEvent = event as StreamEvent;
            setEvents((prev) => [...prev, fullEvent]);

            // Update derived state
            if (fullEvent.node) setCurrentNode(fullEvent.node);
            if (fullEvent.session_id)
              sessionIdRef.current = fullEvent.session_id;

            // Handle completion
            if (fullEvent.type === "complete" || fullEvent.type === "error") {
              setIsStreaming(false);
            }

            // Handle interruption (human-in-the-loop)
            if (fullEvent.requires_input) {
              setIsStreaming(false); // Pause until input
            }
          }
        }
      }

      setIsConnected(false);
      setIsStreaming(false);
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        setError(err);
        setIsStreaming(false);
      }
    }
  }, []);

  const sendInput = useCallback(async (input: string) => {
    if (!sessionIdRef.current) return;

    setIsStreaming(true);

    try {
      const response = await fetch("/api/agent/input", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionIdRef.current,
          input,
        }),
      });

      if (!response.ok) throw new Error("Failed to send input");

      // Resume streaming
      const reader = response.body?.getReader();
      // ... same parsing logic as startStream
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
      setIsStreaming(false);
    }
  }, []);

  const stop = useCallback(() => {
    abortControllerRef.current?.abort();
    setIsStreaming(false);
    setIsConnected(false);
  }, []);

  const reset = useCallback(() => {
    stop();
    sessionIdRef.current = null;
    setEvents([]);
    setCurrentNode(null);
    setError(null);
  }, [stop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => abortControllerRef.current?.abort();
  }, []);

  return {
    events,
    isConnected,
    isStreaming,
    currentNode,
    error,
    startStream,
    sendInput,
    stop,
    reset,
  };
}
```

---

## CHECKLIST DE ENTREGA FINAL

- [ ] Vite configurado com React SWC e path aliases
- [ ] React Router 6+ com lazy loading de páginas
- [ ] Clerk auth integrado (login, signup, proteção de rotas)
- [ ] **20+ componentes primitivos** construídos do zero (Button, Card, Input, etc.)
- [ ] Design system consistente com CSS variables
- [ ] **Página /interview completa** com streaming funcional
- [ ] **Página /content** com input de URL e preview
- [ ] **Página /posts** com editor e simulação de X
- [ ] Hook `useAgentStream` com reconexão, cancelamento, human-in-the-loop
- [ ] Zustand stores com persistência selecionada
- [ ] TanStack Query para server state
- [ ] Sistema de Toast para notificações
- [ ] Responsivo (mobile-first): 375px, 768px, 1024px, 1280px+
- [ ] Dark mode support (via class strategy do Tailwind)
- [ ] Acessibilidade: focus visible, aria-labels, roles, keyboard nav
- [ ] Loading states e empty states em todas as páginas
- [ ] Error boundaries e fallback UI
- [ ] README com instruções de setup

---

Execute com qualidade de produção. Cada componente primitivo deve ser reutilizável,
acessível e visualmente consistente. O código deve parecer escrito por uma equipe
experiente, não gerado rapidamente.

```

```
