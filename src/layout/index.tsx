import { ThemedLayoutV2, ThemedSiderV2, ThemedTitleV2 } from '@refinedev/antd'
import type { RefineLayoutThemedTitleProps, RefineLayoutSiderProps } from '@refinedev/antd'
import Header from './components/Header'

const Title = (props: RefineLayoutThemedTitleProps) => {
  return <ThemedTitleV2 {...props} text="Refine" />
}

const Sider = (props: RefineLayoutSiderProps) => {
  return <ThemedSiderV2 {...props} fixed />
}

const Layout = ({ children }: React.PropsWithChildren) => {
  return (
    // eslint-disable-next-line react/no-unstable-nested-components
    <ThemedLayoutV2 Header={Header} Title={Title} Sider={Sider}>
      {children}
    </ThemedLayoutV2>
  )
}

export default Layout
