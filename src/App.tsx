import { Refine } from '@refinedev/core'
import type { I18nProvider } from '@refinedev/core'
import { DevtoolsPanel, DevtoolsProvider } from '@refinedev/devtools'

import { useNotificationProvider, AuthPage } from '@refinedev/antd'
import '@refinedev/antd/dist/reset.css'

import { App as AntdApp } from 'antd'
import { BrowserRouter } from 'react-router-dom'
import routerBindings, { UnsavedChangesNotifier, DocumentTitleHandler } from '@refinedev/react-router-v6'
import { useTranslation } from 'react-i18next'
import { ColorModeContextProvider } from './contexts/color-mode'

function App() {
  const { t, i18n } = useTranslation()

  const i18nProvider: I18nProvider = {
    translate: (key: string, options?: any) => t(key, options) as string,
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  }

  return (
    <BrowserRouter>
      <ColorModeContextProvider>
        <AntdApp>
          <DevtoolsProvider>
            <Refine
              notificationProvider={useNotificationProvider}
              routerProvider={routerBindings}
              i18nProvider={i18nProvider}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                useNewQueryKeys: true,
              }}
            >
              <AuthPage type="login" registerLink={false} forgotPasswordLink={false} title={<h3>Dashboard Admin</h3>} />

              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
            <DevtoolsPanel />
          </DevtoolsProvider>
        </AntdApp>
      </ColorModeContextProvider>
    </BrowserRouter>
  )
}

export default App
