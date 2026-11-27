import type { CollectionConfig } from 'payload'

const isAdmin = async (req: any): Promise<boolean> => {
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

    return role?.roleName?.trim().toLowerCase() === 'admin'
  } catch {
    return false
  }
}

export const ActivityLogs: CollectionConfig = {
  slug: 'activity-logs',

  admin: {
    useAsTitle: 'action',
    defaultColumns: [
      'user',
      'eventType',
      'module',
      'action',
      'eventAt',
      'status',
    ],
  },

  access: {
    read: async ({ req }) => {
      if (!req.user) return false

      if (await isAdmin(req)) return true

      const permissionResult = await req.payload.find({
        collection: 'user-permissions',
        where: {
          user: {
            equals: req.user.id,
          },
        },
        limit: 1,
        depth: 0,
        overrideAccess: true,
      })

      const assignedUsers = permissionResult.docs[0]?.viewLogUsers

      if (!Array.isArray(assignedUsers) || assignedUsers.length === 0) {
        return false
      }

      const assignedUserIds = assignedUsers
        .map((item: any) =>
          typeof item === 'object' && item !== null ? item.id : item,
        )
        .filter(Boolean)

      if (assignedUserIds.length === 0) return false

      return {
        user: {
          in: assignedUserIds,
        },
      }
    },

    create: ({ req }) => Boolean(req.user),
    update: () => false,
    delete: () => false,
  },

  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'User',
      index: true,
    },
    {
      name: 'sessionID',
      type: 'text',
      required: true,
      label: 'Session ID',
      index: true,
    },
    {
      name: 'eventType',
      type: 'select',
      required: true,
      label: 'Event Type',
      options: [
        { label: 'Login', value: 'login' },
        { label: 'Logout', value: 'logout' },
        { label: 'Menu Started', value: 'menu-start' },
        { label: 'Menu Ended', value: 'menu-end' },
        { label: 'Activity Started', value: 'activity-start' },
        { label: 'Activity Ended', value: 'activity-end' },
      ],
    },
    {
      name: 'action',
      type: 'text',
      required: true,
      label: 'Action',
    },
    {
      name: 'module',
      type: 'text',
      label: 'Module',
    },
    {
      name: 'activityKey',
      type: 'text',
      label: 'Activity Key',
    },
    {
      name: 'activityName',
      type: 'text',
      label: 'Activity Name',
    },
    {
      name: 'eventAt',
      type: 'date',
      required: true,
      label: 'Event Date & Time',
    },
    {
      name: 'startedAt',
      type: 'date',
      label: 'Started At',
    },
    {
      name: 'endedAt',
      type: 'date',
      label: 'Ended At',
    },
    {
      name: 'durationSeconds',
      type: 'number',
      label: 'Duration (Seconds)',
      min: 0,
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      defaultValue: 'success',
      options: [
        { label: 'Success', value: 'success' },
        { label: 'Failed', value: 'failed' },
        { label: 'Pending', value: 'pending' },
      ],
    },
    {
      name: 'ipAddress',
      type: 'text',
      label: 'IP Address',
    },
    {
      name: 'device',
      type: 'text',
      label: 'Device',
    },
    {
      name: 'location',
      type: 'text',
      label: 'Location',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
    },
  ],

  hooks: {
    beforeChange: [
      ({ data, req, operation }) => {
        if (operation === 'create' && req.user) {
          data.user = req.user.id
        }

        return data
      },
    ],
  },
}
