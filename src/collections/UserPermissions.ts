
import type { CollectionConfig } from 'payload'

const isAdmin = async (req: any) => {
  if (!req.user) return false

  const userRole = req.user.userrole
  const roleId =
    typeof userRole === 'object' ? userRole?.id : userRole

  if (!roleId) return false

  try {
    const role = await req.payload.findByID({
      collection: 'roles',
      id: roleId,
      depth: 0,
      overrideAccess: true,
    })

    return role?.roleName?.toLowerCase() === 'admin'
  } catch {
    return false
  }
}

export const UserPermissions: CollectionConfig = {
  slug: 'user-permissions',

  admin: {
    useAsTitle: 'id',
    defaultColumns: ['user', 'updatedAt'],
  },

  access: {
    read: async ({ req }) => {
      if (!req.user) return false

      if (await isAdmin(req)) return true

      return {
        user: {
          equals: req.user.id,
        },
      }
    },

    create: async ({ req }) => isAdmin(req),
    update: async ({ req }) => isAdmin(req),
    delete: async ({ req }) => isAdmin(req),
  },

  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      unique: true,
      label: 'Select User',
    },
    {
      name: 'menuPermissions',
      type: 'json',
      label: 'Menu & Activity Permissions',
      defaultValue: [],
      admin: {
        components: {
          Field: '/components/UserMenuPermissionsField#UserMenuPermissionsField',
        },
      },
    },
    {
      name: 'viewLogUsers',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      label: 'Users Whose Logs Can Be Viewed',
      admin: {
        description:
          'Select which users this user is allowed to view in Log Activity.',
      },
    },
  ],
}
