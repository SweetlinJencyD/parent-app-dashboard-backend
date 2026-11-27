
import type { CollectionConfig } from 'payload'

export const Permissions: CollectionConfig = {
  slug: 'permissions',

  access: {
  read: () => true,
  create: () => true,
  update: () => true,
  delete: () => true,
  unlock: () => true,
  },

  admin: {
    useAsTitle: 'menuName',
    defaultColumns: ['menuKey', 'menuName'],
  },

  fields: [
    {
      name: 'menuKey',
      type: 'text',
      required: true,
      unique: true,
      label: 'Menu Key',
    },
    {
      name: 'menuName',
      type: 'text',
      required: true,
      label: 'Menu Name',
    },
    {
      name: 'activities',
      type: 'array',
      label: 'Menu Activities',
      fields: [
        {
          name: 'activityKey',
          type: 'text',
          required: true,
          label: 'Activity Key',
        },
        {
          name: 'activityName',
          type: 'text',
          required: true,
          label: 'Activity Name',
        },
      ],
    },
  ],
}
