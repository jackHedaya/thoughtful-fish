import { SvgIconTypeMap } from '@material-ui/core'
import { OverridableComponent } from '@material-ui/core/OverridableComponent'
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined'
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined'
import ShowChartOutlinedIcon from '@material-ui/icons/ShowChartOutlined'
import Router, { useRouter } from 'next/router'

export default function Navbar() {
  return (
    <div className="nav">
      <NavItem Icon={HomeOutlinedIcon} to="/home" />
      <NavItem Icon={ShowChartOutlinedIcon} to="/chart" />
      <NavItem Icon={SearchOutlinedIcon} to="/option-hacker" />
    </div>
  )
}

function NavItem(props: {
  Icon: OverridableComponent<SvgIconTypeMap<unknown, 'svg'>>
  to: string
}) {
  const { Icon, to } = props

  const router = useRouter()

  const isSelected = router.asPath === to

  return (
    <div className={`item ${isSelected ? 'selected' : ''}`} onClick={() => Router.push(to)}>
      <Icon className="icon" />
    </div>
  )
}
