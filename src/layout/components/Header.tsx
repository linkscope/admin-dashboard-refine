import { useContext, memo, useState, useMemo } from 'react'
import { useGetIdentity } from '@refinedev/core'
import { Popover, Switch, Avatar, Button, Divider, Space, Layout, theme } from 'antd'
import { SettingOutlined } from '@ant-design/icons'
import { TextField } from '@refinedev/antd'

import { ColorModeContext } from '../../contexts/color-mode'
import type { User } from '~/graphql/schema.types'

import AccountSettings from './AccountSettings'

const CurrentUser = memo(() => {
	const { data: user } = useGetIdentity<User>()
	const [isOpen, setIsOpen] = useState(false)

	const content = useMemo(
		() => (
			<div className="flex flex-col">
				<TextField className="py-3 px-5" strong value={user?.name} />
				<Divider className="m-0 p-1" />
				<Space direction="vertical" className="flex">
					<Button
						className="text-left"
						icon={<SettingOutlined />}
						type="text"
						block
						onClick={() => setIsOpen(true)}
					>
						账户设置
					</Button>
					<div />
				</Space>
			</div>
		),
		[user?.name],
	)

	return (
		<>
			<Popover
				placement="bottomRight"
				trigger="click"
				overlayInnerStyle={{ padding: 0 }}
				overlayStyle={{ zIndex: 999 }}
				content={content}
			>
				<Avatar
					src={user?.avatarUrl}
					alt={user?.name}
					className="flex items-center border-none cursor-pointer"
					style={{ backgroundColor: '#87d068' }}
				>
					{user?.name}
				</Avatar>
			</Popover>
			<AccountSettings opened={isOpen} setOpened={setIsOpen} userId={user?.id || ''} />
		</>
	)
})

const { useToken } = theme

const Header = memo(() => {
	const { mode, setMode } = useContext(ColorModeContext)
	const { token } = useToken()

	return (
		<Layout.Header
			className="sticky top-0 z-1 flex items-center justify-end"
			style={{ backgroundColor: token.colorBgElevated }}
		>
			<Space>
				<Switch
					checkedChildren="🌛"
					unCheckedChildren="🔆"
					onChange={() => setMode(mode === 'light' ? 'dark' : 'light')}
					defaultChecked={mode === 'dark'}
				/>
				<CurrentUser />
			</Space>
		</Layout.Header>
	)
})

export default Header
