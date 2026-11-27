import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Roles } from './collections/Roles'
import { Applications } from './collections/Applications'
import { Permissions } from './collections/Permissions'
import { UserPermissions } from './collections/UserPermissions'
import { ActivityLogs } from './collections/ActivityLogs'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  cors: [
  'http://localhost:3000',
  'http://localhost:5173',
],

csrf: [
  'http://localhost:3000',
  'http://localhost:5173',
],

  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },

  collections: [Users, Media, Roles, Applications, Permissions, UserPermissions, ActivityLogs],

  editor: lexicalEditor(),

  secret: process.env.PAYLOAD_SECRET || '',

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),

  
onInit: async (payload) => {
  const defaultPermissions = [
    {
      menuKey: 'dashboard',
      menuName: 'Dashboard',
      activities: [
        { activityKey: 'cards', activityName: 'Cards' },
        { activityKey: 'application-overview', activityName: 'Application Overview' },
        { activityKey: 'user-roles-distribution', activityName: 'User Roles Distribution' },
        { activityKey: 'recent-logs', activityName: 'Recent Logs' },
        { activityKey: 'quick-actions', activityName: 'Quick Actions' },
      ],
    },
    {
      menuKey: 'user-management',
      menuName: 'User Management',
      activities: [
        { activityKey: 'user-details', activityName: 'User Details' },
        { activityKey: 'user-create', activityName: 'User Create Page' },
        { activityKey: 'roles', activityName: 'Roles' },
        { activityKey: 'roles-create', activityName: 'Roles Create Page' },
      ],
    },
    {
      menuKey: 'applications',
      menuName: 'Applications',
      activities: [
        { activityKey: 'apps', activityName: 'Apps' },
        { activityKey: 'app-create', activityName: 'Create Page' },
      ],
    },
    {
      menuKey: 'log-master',
      menuName: 'Log Master',
      activities: [
        { activityKey: 'log-activity', activityName: 'Log Activity' },
      ],
    },
  ]

  for (const permission of defaultPermissions) {
    const existing = await payload.find({
      collection: 'permissions',
      where: {
        menuKey: {
          equals: permission.menuKey,
        },
      },
      limit: 1,
    })

    if (existing.docs.length === 0) {
      await payload.create({
        collection: 'permissions',
        data: permission,
      })
    } else {
      await payload.update({
        collection: 'permissions',
        id: existing.docs[0].id,
        data: permission,
      })
    }
  }
},

sharp,
plugins: [],
})