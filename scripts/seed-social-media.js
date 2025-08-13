const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const socialMediaSettings = [
  {
    platform: 'facebook',
    url: 'https://facebook.com/sfdbd',
    isActive: true,
    sortOrder: 1
  },
  {
    platform: 'instagram', 
    url: 'https://instagram.com/sfdbd',
    isActive: true,
    sortOrder: 2
  },
  {
    platform: 'twitter',
    url: 'https://twitter.com/sfdbd',
    isActive: true,
    sortOrder: 3
  },
  {
    platform: 'email',
    url: 'info@sfdbd.com',
    isActive: true,
    sortOrder: 4
  }
]

async function seedSocialMediaSettings() {
  console.log('Seeding social media settings...')

  try {
    for (const setting of socialMediaSettings) {
      const existingSetting = await prisma.socialMediaSetting.findUnique({
        where: { platform: setting.platform }
      })

      if (existingSetting) {
        await prisma.socialMediaSetting.update({
          where: { platform: setting.platform },
          data: setting
        })
        console.log(`Updated ${setting.platform} setting`)
      } else {
        await prisma.socialMediaSetting.create({
          data: setting
        })
        console.log(`Created ${setting.platform} setting`)
      }
    }

    // Check total count
    const totalSettings = await prisma.socialMediaSetting.count()
    console.log(`Total social media settings in database: ${totalSettings}`)

    // List all settings
    const allSettings = await prisma.socialMediaSetting.findMany({
      orderBy: { sortOrder: 'asc' }
    })
    console.log('All settings:', allSettings.map(s => ({ platform: s.platform, url: s.url, active: s.isActive })))

    console.log('Social media settings seeding completed!')
  } catch (error) {
    console.error('Error seeding social media settings:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedSocialMediaSettings()
