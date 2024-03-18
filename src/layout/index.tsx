import { ThemedLayoutV2, ThemedSiderV2, ThemedTitleV2 } from '@refinedev/antd'
import type { RefineLayoutThemedTitleProps } from '@refinedev/antd'
import Header from './components/Header'
import { memo } from 'react'

const Title = memo((props: RefineLayoutThemedTitleProps) => {
  return <ThemedTitleV2 {...props} text="Refine" />
})

const Layout = ({ children }: React.PropsWithChildren) => {
  return (
    // eslint-disable-next-line react/no-unstable-nested-components
    <ThemedLayoutV2 Header={Header} Title={Title} Sider={() => <ThemedSiderV2 fixed />}>
      {children}
    </ThemedLayoutV2>
  )
}

export default Layout
