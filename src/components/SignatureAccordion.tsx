import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from '@material-ui/core'
import { ReactNode } from 'react'

import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import s from '../styles/components/signature-accordion.module.scss'

type SignatureAccordionProps = {
  expanded?: boolean
  onChange?: (b: boolean) => void
  title: string
  children: ReactNode
}

export default function SignatureAccordion(props: SignatureAccordionProps) {
  return (
    <Accordion
      expanded={props.expanded}
      onChange={props.onChange ? (_, s) => props.onChange(s) : undefined}
      className={s.accordion}
    >
      <AccordionSummary
        className={s.summary}
        expandIcon={
          <ExpandMoreIcon style={{ strokeWidth: 1 }}></ExpandMoreIcon>
        }
      >
        <div className={s.title}>{props.title}</div>
      </AccordionSummary>
      <AccordionDetails>{props.children}</AccordionDetails>
    </Accordion>
  )
}
