import { createAdminClient } from '../src/lib/supabase/admin'
import prisma from '../src/lib/prisma'

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD
  const name = process.env.ADMIN_NAME

  if (!email || !password || !name) {
    console.error(
      'Missing required environment variables: ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME'
    )
    process.exit(1)
  }

  console.log('Starting admin seed...')
  console.log(`Admin email: ${email}`)

  const supabase = createAdminClient()

  console.log('Creating Supabase auth user...')

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (error) {
    const alreadyExists =
      error.message.toLowerCase().includes('already') ||
      error.message.toLowerCase().includes('duplicate') ||
      error.status === 422

    if (alreadyExists) {
      console.log(`Admin user already exists for ${email}. Skipping seed.`)
      process.exit(0)
    }

    console.error('Failed to create auth user:', error.message)
    process.exit(1)
  }

  const authUserId = data.user.id
  console.log(`Auth user created with id: ${authUserId}`)

  console.log('Creating Profile record in database...')

  try {
    await prisma.profile.create({
      data: {
        authUserId,
        name,
        email,
        role: 'admin',
      },
    })
  } catch (profileError) {
    const message =
      profileError instanceof Error ? profileError.message : String(profileError)

    if (message.toLowerCase().includes('unique')) {
      console.log(`Profile already exists for ${email}. Skipping seed.`)
      process.exit(0)
    }

    console.error('Failed to create profile:', message)
    process.exit(1)
  }

  console.log(`Admin seed completed successfully for ${email}.`)
}

seedAdmin()
  .catch((err) => {
    console.error('Unexpected error during seed:', err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
