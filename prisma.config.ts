// prisma.config.ts
import { defineConfig } from '@prisma/config';

export default defineConfig({
  // trava o caminho do schema que queremos no build da Vercel
  schema: 'prisma/schema.prisma',

  // substitui o antigo "package.json#prisma.seed"
  seed: {
    provider: 'ts',
    run: 'ts-node --compiler-options {"module":"commonjs"} prisma/seed.ts',
  },
});
