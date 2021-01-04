import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from '@material-ui/core'
import { ReactNode, useState } from 'react'

import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'

import s from '../styles/components/signature-accordion.module.scss'

type SignatureAccordionProps = {
  expanded?: boolean
  onChange?: (b: boolean) => void
  title: string
  children: ReactNode
}

export default function SignatureAccordion(props: SignatureAccordionProps) {
  return props.expanded === undefined && props.onChange === undefined
    ? UnmanagedAccordion(props)
    : ManagedAccordion(props)
}

function UnmanagedAccordion(props: SignatureAccordionProps) {
  let [expanded, setExpanded] = useState(true)

  return (
    <AccordionBase
      {...props}
      expanded={expanded}
      onChange={(b) => setExpanded(b)}
    />
  )
}

function ManagedAccordion(props: SignatureAccordionProps) {
  return <AccordionBase {...props} />
}

function AccordionBase(props: SignatureAccordionProps) {
  const ExpandIcon = props.expanded ? ExpandLessIcon : ExpandMoreIcon

  return (
    <Accordion
      expanded={props.expanded}
      onChange={props.onChange ? (_, s) => props.onChange(s) : undefined}
      className={s.accordion}
    >
      <AccordionSummary className={s.summary} expandIcon={<ExpandMoreIcon style={{ strokeWidth: 1 }}></ExpandMoreIcon>}>
        <div className={s.title}>{props.title}</div>
      </AccordionSummary>
      <AccordionDetails>{props.children}</AccordionDetails>
    </Accordion>
  )
}
