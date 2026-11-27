import type { CollectionConfig } from 'payload'

export const Applications: CollectionConfig = {
  slug: 'applications',

  access: {
  read: () => true,
  create: () => true,
  update: () => true,
  delete: () => true,
},

  admin: {
    useAsTitle: 'applicationName',
    defaultColumns: [
      'applicationId',
      'applicationName',
      'applicationVersion',
      'applicationIcon',
      'applicationLink',
    ],
  },

  fields: [
    {
      name: 'applicationId',
      type: 'text',
      label: 'Application ID',
      required: true,
      unique: true,
    },
    {
      name: 'applicationName',
      type: 'text',
      label: 'Application Name',
      required: true,
    },
    {
      name: 'applicationVersion',
      type: 'text',
      label: 'Application Version',
      required: true,
    },
    {
      name: 'applicationIcon',
      type: 'select',
      label: 'Application Icon',
      required: true,
      defaultValue: 'LayoutGrid',
      options: [
        { label: 'Shopping Cart', value: 'ShoppingCart' },
        { label: 'Map Pin', value: 'MapPin' },
        { label: 'Analytics', value: 'Chart' },
        { label: 'Grid', value: 'LayoutGrid' },
      ],
    },
    {
      name: 'applicationLink',
      type: 'text',
      label: 'Application Link',
      required: true,
    },
    {
      name: 'applicationImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Application Image',
    },
  ],
}