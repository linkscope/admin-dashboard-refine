import { Refine, Authenticated } from '@refinedev/core'
import type { I18nProvider } from '@refinedev/core'

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
import resources from './resources'

import Layout from './layout'
import {
  Login,
  Dashboard,
  CompaniesShow,
  CompaniesEdit,
  CompaniesList,
  CompaniesCreate,
  TasksList,
  TasksCreate,
  TasksEdit,
} from './pages'

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
              projectId: '7sK9sc-75PrpS-dDdwAH',
            }}
            resources={resources}
          >
            <Routes>
              <Route
                element={
                  <Authenticated
                    key="authenticated"
                    fallback={<CatchAllNavigate to="/login" />}
                    v3LegacyAuthProviderCompatible
                  >
                    <Layout>
                      <Outlet />
                    </Layout>
                  </Authenticated>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="/companies">
                  <Route index element={<CompaniesList />} />
                  <Route path="create" element={<CompaniesCreate />} />
                  <Route path="edit/:id" element={<CompaniesEdit />} />
                  <Route path=":id" element={<CompaniesShow />} />
                </Route>
                <Route path="/tasks">
                  <Route index element={<TasksList />} />
                  <Route path="create" element={<TasksCreate />} />
                  <Route path="edit/:id" element={<TasksEdit />} />
                </Route>
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
        </AntdApp>
      </ColorModeContextProvider>
    </BrowserRouter>
  )
}

export default App
