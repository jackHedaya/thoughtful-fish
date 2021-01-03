import Router, { useRouter } from 'next/router'

import { OverridableComponent } from '@material-ui/core/OverridableComponent'
import { SvgIconTypeMap } from '@material-ui/core'
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined'
import ShowChartOutlinedIcon from '@material-ui/icons/ShowChartOutlined'
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined'

import '../styles/navbar.module.scss'

export default function Navbar() {
  return (
    <div className="nav">
      <NavItem Icon={HomeOutlinedIcon} to="home" />
      <NavItem Icon={ShowChartOutlinedIcon} to="chart" />
      <NavItem Icon={SearchOutlinedIcon} to="option-hacker" />
    </div>
  )
}

function NavItem(props: {
  Icon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>>
  to: string
}) {
  const { Icon, to } = props

  const router = useRouter()

  const isSelected = router.asPath === to

  return (
    <div
      className={`item ${isSelected ? 'selected' : ''}`}
      onClick={() => Router.push(to)}
    >
      <Icon className="icon" />
    </div>
  )
}
