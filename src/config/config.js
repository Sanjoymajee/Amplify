const z = require('zod')

const envSchema = z.object({
  DATABASE: z.string().nonempty(),
  DATABASE_LOCAL: z.string().nonempty(),
  CLIENT_ID: z.string().nonempty(),
  CLIENT_SECRET: z.string().nonempty(),
  SESSION_SECRET: z.string().nonempty(),
  SESSION_NAME: z.string().nonempty(),
  PORT: z.string().nonempty(),
})

module.exports = envSchema.parse(process.env)
