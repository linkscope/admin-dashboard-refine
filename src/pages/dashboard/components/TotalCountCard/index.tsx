import { memo, useMemo } from 'react'
import { Card, Skeleton } from 'antd'
import { TextField } from '@refinedev/antd'
import { Area } from '@ant-design/plots'
import type { AreaConfig } from '@ant-design/plots'

import { variants } from './Icon'

export interface Props {
	resource: 'companies' | 'contacts' | 'deals'
	isLoading: boolean
	totalCount: number
}

const TotalCountCard = memo(({ resource, isLoading, totalCount }: Props) => {
	const { primaryColor, secondaryColor, icon, title } = useMemo(() => variants[resource], [resource])

	const areaConfig = useMemo<AreaConfig>(
		() => ({
			data: variants[resource].data,
			xField: 'index',
			yField: 'value',
			appendPadding: [1, 0, 0, 0],
			padding: 0,
			syncViewPadding: true,
			autoFit: true,
			tooltip: false,
			animation: true,
			xAxis: false,
			yAxis: {
				tickCount: 12,
				label: {
					style: {
						stroke: 'transparent',
					},
				},
				grid: {
					line: {
						style: {
							stroke: 'transparent',
						},
					},
				},
			},
			smooth: true,
			line: {
				color: primaryColor,
			},
			areaStyle: () => ({
				fill: `l(270) 0:(#fff) 0.2${secondaryColor} 1:${primaryColor}`,
			}),
		}),
		[resource, primaryColor, secondaryColor],
	)

	return (
		<Card className="h-24 p-0" styles={{ body: { padding: '0.5rem 0.5rem 0.5rem 0.75rem' } }} size="small">
			<div className="flex items-center gap-2 whitespace-nowrap">
				{icon}
				<TextField className="text-base ml-2" value={title} />
			</div>
			<div className="flex justify-between">
				<TextField
					className="text-4xl flex-1 whitespace-nowrap shrink-0 text-start ml-12 tabular-nums"
					strong
					value={isLoading ? <Skeleton.Button className="mt-2 w-18" /> : totalCount}
				/>
				<Area {...areaConfig} className="w[70%]" />
			</div>
		</Card>
	)
})

export default TotalCountCard
