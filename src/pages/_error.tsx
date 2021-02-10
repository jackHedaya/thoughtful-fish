import Error, { ErrorProps } from 'next/error'
import React from 'react'

type CustomErrorProps = { statusCode: number }
function CustomError({ statusCode }: CustomErrorProps) {
  return (
    <div className="content">
      <E statusCode={statusCode} />
    </div>
  )
}

/**
 * This class is needed to prevent the error page from taking 100vh instead of 100%
 */
class E extends Error {
  constructor(props: ErrorProps) {
    super(props)
  }

  render() {
    const Component = super.render()

    return React.cloneElement(Component, {
      ...Component.props,
      style: { ...Component.props.style, height: '100%' },
    })
  }
}

CustomError.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default CustomError
