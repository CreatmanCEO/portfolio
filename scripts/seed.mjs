async function main() {
  const { seedDatabase } = await import('../src/db/seed.ts')
  await seedDatabase()
}

main().catch(console.error)
