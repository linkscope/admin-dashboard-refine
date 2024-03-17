import { Refine, WelcomePage, Authenticated } from '@refinedev/core'
import type { I18nProvider } from '@refinedev/core'
import { DevtoolsPanel, DevtoolsProvider } from '@refinedev/devtools'

import { useNotificationProvider } from '@refinedev/antd'
import '@refinedev/antd/dist/reset.css'

import { App as AntdApp } from 'antd'
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom'
import routerProvider, {
  UnsavedChangesNotifier,
  DocumentTitleHandler,
  CatchAllNavigate,
  NavigateToResource,
} from '@refinedev/react-router-v6'
import { useTranslation } from 'react-i18next'
import { ColorModeContextProvider } from './contexts/color-mode'

import { dataProvider, liveProvider, authProvider } from './providers'

import { Login } from './pages/login/login'

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
              dataProvider={dataProvider}
              liveProvider={liveProvider}
              authProvider={authProvider}
              notificationProvider={useNotificationProvider}
              routerProvider={routerProvider}
              i18nProvider={i18nProvider}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                useNewQueryKeys: true,
                liveMode: 'auto',
              }}
            >
              <Routes>
                <Route
                  element={
                    <Authenticated key="authenticated" fallback={<CatchAllNavigate to="/login" />}>
                      <Outlet />
                    </Authenticated>
                  }
                >
                  <Route index element={<WelcomePage />} />
                </Route>
                <Route
                  element={
                    <Authenticated key="unauthenticated" fallback={<Outlet />}>
                      <NavigateToResource />
                    </Authenticated>
                  }
                >
                  <Route path="/login" element={<Login />} />
                </Route>
              </Routes>

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
