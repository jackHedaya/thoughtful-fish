import { Accordion, AccordionDetails, AccordionProps, AccordionSummary } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { CSSProperties } from 'react'

import s from '../styles/components/signature-accordion.module.scss'

type SignatureAccordionProps = AccordionProps & {
  style?: CSSProperties
  title: string
}

export default function SignatureAccordion(props: SignatureAccordionProps) {
  const { title, style, children, ...accordionProps } = props

  return (
    <Accordion expanded={props.expanded} className={s.accordion} {...accordionProps}>
      <AccordionSummary
        className={s.summary}
        expandIcon={<ExpandMoreIcon style={{ strokeWidth: 1 }}></ExpandMoreIcon>}
      >
        <div className={s.title}>{title}</div>
      </AccordionSummary>
      <AccordionDetails style={style}>{children}</AccordionDetails>
    </Accordion>
  )
}
