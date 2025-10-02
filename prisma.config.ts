// prisma.config.ts
import { defineConfig } from '@prisma/config';

export default defineConfig({
    // trava o caminho do schema que queremos no build da Vercel
    schema: 'prisma/schema.prisma',
});
