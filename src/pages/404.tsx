import Error from 'next/error'

function CustomError() {
  return (
    <div className="content">
      <Error statusCode={404} />
    </div>
  )
}

export default CustomError
