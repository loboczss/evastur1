This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

## Configurando o banco de dados (Prisma + Vercel)

1. Para desenvolvimento local basta copiar o arquivo `.env.example` para `.env` (ou exportar as variáveis), garantir que o PostgreSQL esteja rodando (`postgresql://evastur:evastur@localhost:5432/evastur`) e executar `npx prisma migrate dev --schema=prisma/schema.prisma` seguido de `npm run db:seed`.
2. Em produção, crie um banco de dados online (ex.: [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)).
3. No painel da Vercel, copie os valores de `POSTGRES_PRISMA_URL` e `POSTGRES_URL_NON_POOLING` e defina-os nas variáveis do projeto:
   - `DATABASE_URL` → cole o valor de `POSTGRES_PRISMA_URL` (string com pooling). É usada pelo app em produção.
   - `DIRECT_URL` → cole o valor de `POSTGRES_URL_NON_POOLING` (string direta). É usada para migrações/seed.
4. Opcional: ajuste `ADMIN_EMAIL` e `ADMIN_PASSWORD` para controlar o usuário criado pelo seed.
5. Execute as migrações com `npx prisma migrate deploy` (produção) ou `npx prisma migrate dev` (dev).

Depois disso, você já pode rodar o servidor de desenvolvimento localmente apontando para o banco configurado.

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
