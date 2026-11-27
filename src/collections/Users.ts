
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',

  admin: {
    useAsTitle: 'username',
    defaultColumns: ['userID', 'username', 'userrole'],
  },

  auth: true,

  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },

  fields: [
    {
      name: 'userID',
      type: 'text',
      required: true,
      unique: true,
      label: 'User ID',
    },
    {
      name: 'username',
      type: 'text',
      required: true,
      label: 'User Name',
    },
    {
      name: 'userrole',
      type: 'relationship',
      relationTo: 'roles',
      required: true,
      label: 'User Role',
    },
  ],
}
