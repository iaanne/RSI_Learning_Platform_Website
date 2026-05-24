// prisma.config.ts
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: "postgresql://postgres:MakeDataBase7*@100.118.25.127:5432/RSI_Learning_Platform?schema=public"
  },
});