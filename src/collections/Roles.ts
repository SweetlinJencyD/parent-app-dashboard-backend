import type { CollectionConfig } from 'payload'

export const Roles: CollectionConfig = {
  slug: 'roles',

  admin: {
    useAsTitle: 'roleName',
    defaultColumns: ['roleID', 'roleName'],
  },

  access: {
  read: () => true,
  create: () => true,
},

  fields: [
    {
      name: 'roleID',
      type: 'text',
      required: true,
      unique: true,
      label: 'Role ID',
    },
    {
      name: 'roleName',
      type: 'text',
      required: true,
      unique: true,
      label: 'Role Name',
    },
  ],
}