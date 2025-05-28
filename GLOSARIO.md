# Glosario de Términos Técnicos

## 1. tRPC
Framework para crear APIs type-safe en TypeScript. Usado en `widgetAuthRouter` para crear endpoints seguros como `verifyWidgetCredentials`.

## 2. Prisma
ORM para interactuar con bases de datos. Define modelos en `schema.prisma` como `ChatWidgetToken` para almacenar tokens de autenticación.

## 3. Zod
Librería para validación de datos. Usado en `widgetAuthRouter` para validar inputs, por ejemplo `z.string()` para validar el formato de tokens.

## 4. CORS (Cross-Origin Resource Sharing)
Mecanismo de seguridad implementado en `widgetAuthRouter` para restringir el acceso solo a dominios permitidos.

## 5. Next.js Config
Configuración en `next.config.js` y `src/env.js` para:
- Manejar variables de entorno (ej: `process.env.NEXT_PUBLIC_*`)
- Habilitar modo desarrollo (`SKIP_ENV_VALIDATION`)
- Validar esquemas de variables con Zod

## 6. Flujos Clave
### Generación de Tokens
- **Backend:** `widgetAuthRouter` usa `nanoid` para crear tokens en `createWidgetToken`
- **Frontend:** El componente `AdminPage` consume el endpoint y muestra el código de integración

### Autenticación
- El componente `ChatWidget` verifica el token usando `widgetAuthRouter` antes de renderizar

---

## Ejemplo de Uso de Zod
```typescript
// En widgetAuthRouter.ts
input: z.object({
    token: z.string(), // Valida que el token sea string
    allowedDomain: z.string().url() // Valida que el dominio sea una URL válida
})
```
