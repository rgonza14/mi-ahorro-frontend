# 🛒 Mi Ahorro - Frontend

Comparador de precios de las principales cadenas de supermercados destinado a encontrar la compra más conveniente para el usuario.

## ✨ Funcionalidades
- Buscar productos por supermercado (Carrefour / DIA / Vea, etc.)
- Comparar precios por ítem y ranking global
- Detectar “mejor precio” por resultado
- Armado de carrito y resumen de compra con exportación a formato .png
- Lista de faltantes por supermercado

## 🧱 Stack
- React + TypeScript
- Vite
- Mantine UI
- Nanostores (estado global)
- React Query (cache y requests)
- OpenAPI (Swagger) + generación de tipos

## 🔗 Contrato de API

El frontend consume el backend de **Mi Ahorro** mediante un contrato OpenAPI.

A partir de este contrato se generan automáticamente tipos TypeScript para mantener consistencia entre backend y frontend

### Generar tipos
Por defecto el script apunta a: `http://localhost:3000/openapi.json`

Si tu backend corre en otra URL, modificá el script en package.json: `"gen:types": "openapi-typescript <TU_URL>/openapi.json -o src/api/openapi.types.ts"`

Luego ejecutar
```bash
npm run gen:types
```

> Requiere que el backend esté corriendo y exponga el JSON OpenAPI.

## 📦 Requisitos
- Backend de Mi Ahorro en ejecución
- Node.js 18+ (recomendado 20)
- npm / pnpm / yarn

## 🛠️ Instalación

```bash
npm install
cp .env.example .env
```

Editar `.env`:

```env
VITE_API_URL=https://TU-BACKEND
```

## ▶️ Ejecutar en local

```bash
npm run dev
```

## ⚠️ Nota
Los precios y la disponibilidad dependen de cada cadena y pueden variar.  
Mi Ahorro no está afiliado a ninguna cadena de supermercado.
