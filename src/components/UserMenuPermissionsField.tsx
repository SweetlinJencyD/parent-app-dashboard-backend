
'use client'

import { useEffect, useState } from 'react'
import { useField } from '@payloadcms/ui'

type Activity = {
  activityKey: string
  activityName: string
}

type PermissionRecord = {
  id: string | number
  menuKey: string
  menuName: string
  activities?: Activity[]
}

type ActivityPermission = {
  activityKey: string
  activityName: string
  enabled: boolean
}

type MenuPermission = {
  menuId: string | number
  menuKey: string
  menuName: string
  menuEnabled: boolean
  activities: ActivityPermission[]
}

export const UserMenuPermissionsField = ({ path }: { path: string }) => {
  const { value, setValue } = useField({ path })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const menuPermissions = Array.isArray(value)
    ? (value as MenuPermission[])
    : []

  useEffect(() => {
    const loadPermissions = async () => {
      try {
        const response = await fetch('/api/permissions?limit=100&depth=0')

        if (!response.ok) {
          throw new Error('Unable to load permissions')
        }

        const result = await response.json()
        const saved = Array.isArray(value) ? (value as MenuPermission[]) : []

        const updated: MenuPermission[] = (
          result.docs as PermissionRecord[]
        ).map((menu) => {
          const existing = saved.find(
            (item) =>
              String(item.menuId) === String(menu.id) ||
              item.menuKey === menu.menuKey,
          )

          const activities = (menu.activities || []).map((activity) => {
            const oldActivity = existing?.activities?.find(
              (item) => item.activityKey === activity.activityKey,
            )

            return {
              activityKey: activity.activityKey,
              activityName: activity.activityName,
              enabled: oldActivity?.enabled ?? false,
            }
          })

          return {
            menuId: menu.id,
            menuKey: menu.menuKey,
            menuName: menu.menuName,
            menuEnabled:
              activities.length > 0 &&
              activities.every((activity) => activity.enabled),
            activities,
          }
        })

        setValue(updated)
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Something went wrong',
        )
      } finally {
        setLoading(false)
      }
    }

    loadPermissions()
  }, [path])

  const toggleMenu = (menuIndex: number, checked: boolean) => {
    const updated = menuPermissions.map((menu, index) => {
      if (index !== menuIndex) return menu

      return {
        ...menu,
        menuEnabled: checked,
        activities: menu.activities.map((activity) => ({
          ...activity,
          enabled: checked,
        })),
      }
    })

    setValue(updated)
  }

  const toggleActivity = (
    menuIndex: number,
    activityIndex: number,
    checked: boolean,
  ) => {
    const updated = menuPermissions.map((menu, index) => {
      if (index !== menuIndex) return menu

      const activities = menu.activities.map((activity, childIndex) =>
        childIndex === activityIndex
          ? { ...activity, enabled: checked }
          : activity,
      )

      return {
        ...menu,
        activities,
        menuEnabled:
          activities.length > 0 &&
          activities.every((activity) => activity.enabled),
      }
    })

    setValue(updated)
  }

  if (loading) {
    return <p>Loading menu permissions...</p>
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {menuPermissions.map((menu, menuIndex) => (
        <div
          key={menu.menuKey}
          style={{
            border: '1px solid #d5dbe5',
            borderRadius: '8px',
            padding: '16px',
          }}
        >
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontWeight: 600,
              color: '#071438',
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={menu.menuEnabled}
              onChange={(event) =>
                toggleMenu(menuIndex, event.target.checked)
              }
            />
            {menu.menuName}
          </label>

          <div
            style={{
              marginTop: '14px',
              marginLeft: '28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {menu.activities.map((activity, activityIndex) => (
              <label
                key={activity.activityKey}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={activity.enabled}
                  onChange={(event) =>
                    toggleActivity(
                      menuIndex,
                      activityIndex,
                      event.target.checked,
                    )
                  }
                />
                {activity.activityName}
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
